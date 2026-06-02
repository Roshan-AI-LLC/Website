import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, ArrowUpRight, RotateCcw, Sparkles, Workflow } from 'lucide-react';
import {
  CANVAS,
  EDGE_META,
  SCENARIOS,
  TIER_META,
  type ConceptNode,
  type EdgeType,
  type GraphEdge,
  type Modality,
  type Scenario,
  type Tier,
} from '../../data/nabzgraphScenarios';

type DemoState = 'idle' | 'building' | 'results';

const BUILD_DURATION_MS = 2400;
const EASE = [0.22, 1, 0.36, 1] as const;

/** SVG circle radius per persistence tier. */
const NODE_R: Record<Tier, number> = { PERSISTENT: 24, EPISODIC: 18, TRANSIENT: 13 };

/**
 * Verlet force simulation — organic layout without external dependencies.
 * Seed is derived from node ids so the layout is deterministic per scenario.
 */
function runForceLayout(nodes: ConceptNode[], edges: GraphEdge[]): ConceptNode[] {
  const W = CANVAS.w;
  const H = CANVAS.h;
  const count = nodes.length;

  let seed = 0;
  nodes.forEach((n) => {
    for (let i = 0; i < n.id.length; i++) seed = (seed * 31 + n.id.charCodeAt(i)) | 0;
  });
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0x100000000;
  };

  // Start in a circle with per-node jitter
  const pos = new Map<string, { x: number; y: number; vx: number; vy: number }>();
  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / count + rng() * 0.4;
    const rad = Math.min(W, H) * 0.27;
    pos.set(node.id, {
      x: W / 2 + rad * Math.cos(angle) + (rng() - 0.5) * 50,
      y: H / 2 + rad * Math.sin(angle) + (rng() - 0.5) * 50,
      vx: 0,
      vy: 0,
    });
  });

  const springs = edges.map((e) => [e.source, e.target] as [string, string]);
  const REPULSION = 7500;
  const SPRING_K = 0.055;
  const SPRING_LEN = 145;
  const CENTER_K = 0.013;
  const DAMPING = 0.82;
  const PAD = 62;

  for (let iter = 0; iter < 300; iter++) {
    const f = new Map<string, { fx: number; fy: number }>();
    nodes.forEach((n) => f.set(n.id, { fx: 0, fy: 0 }));

    // Repulsion between every pair
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = pos.get(nodes[i].id)!;
        const b = pos.get(nodes[j].id)!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d2 = dx * dx + dy * dy + 0.01;
        const d = Math.sqrt(d2);
        const force = REPULSION / d2;
        const fx = (dx / d) * force;
        const fy = (dy / d) * force;
        f.get(nodes[i].id)!.fx -= fx;
        f.get(nodes[i].id)!.fy -= fy;
        f.get(nodes[j].id)!.fx += fx;
        f.get(nodes[j].id)!.fy += fy;
      }
    }

    // Spring attraction for edges
    springs.forEach(([sid, tid]) => {
      const a = pos.get(sid);
      const b = pos.get(tid);
      if (!a || !b) return;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const stretch = (d - SPRING_LEN) * SPRING_K;
      const fx = (dx / d) * stretch;
      const fy = (dy / d) * stretch;
      f.get(sid)!.fx += fx;
      f.get(sid)!.fy += fy;
      f.get(tid)!.fx -= fx;
      f.get(tid)!.fy -= fy;
    });

    // Weak pull to canvas center
    nodes.forEach((node) => {
      const p = pos.get(node.id)!;
      f.get(node.id)!.fx += (W / 2 - p.x) * CENTER_K;
      f.get(node.id)!.fy += (H / 2 - p.y) * CENTER_K;
    });

    // Integrate + clamp
    nodes.forEach((node) => {
      const p = pos.get(node.id)!;
      const fi = f.get(node.id)!;
      p.vx = (p.vx + fi.fx) * DAMPING;
      p.vy = (p.vy + fi.fy) * DAMPING;
      p.x = Math.max(PAD, Math.min(W - PAD, p.x + p.vx));
      p.y = Math.max(PAD, Math.min(H - PAD, p.y + p.vy));
    });
  }

  return nodes.map((node) => ({ ...node, x: pos.get(node.id)!.x, y: pos.get(node.id)!.y }));
}

// ─────────────────────────────────────────────────────── Root component

export function GraphDemoBlock() {
  const [scenarioId, setScenarioId] = useState<Scenario['id']>('sepsis');
  const [state, setState] = useState<DemoState>('idle');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];

  const handleScenarioChange = (id: Scenario['id']) => {
    setScenarioId(id);
    setState('idle');
    setSelectedNode(null);
    if (timerRef.current) window.clearTimeout(timerRef.current);
  };

  const handleBuild = () => {
    setState('building');
    timerRef.current = window.setTimeout(() => {
      setState('results');
      const focus = scenario.nodes.find((n) => n.tier === 'PERSISTENT') ?? scenario.nodes[0];
      setSelectedNode(focus?.id ?? null);
    }, BUILD_DURATION_MS);
  };

  const handleReset = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setState('idle');
    setSelectedNode(null);
  };

  const node = scenario.nodes.find((n) => n.id === selectedNode) ?? null;

  return (
    <div className="glass relative overflow-hidden rounded-3xl">
      <TabBar
        scenarios={SCENARIOS}
        activeId={scenarioId}
        onSelect={handleScenarioChange}
        subLabel={scenario.subLabel}
      />

      <div className="grid gap-0 lg:grid-cols-[1.5fr_1fr]">
        <div className="border-b border-subtle p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <GraphCanvas
            scenario={scenario}
            state={state}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            onBuild={handleBuild}
          />
        </div>
        <div className="p-5 sm:p-6">
          <EvidencePanel scenario={scenario} state={state} node={node} />
        </div>
      </div>

      <TimelineStrip
        scenario={scenario}
        state={state}
        selectedNode={selectedNode}
        onSelectNode={setSelectedNode}
      />

      <Controls state={state} onReset={handleReset} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────── Tabs

function TabBar({
  scenarios,
  activeId,
  onSelect,
  subLabel,
}: {
  scenarios: Scenario[];
  activeId: Scenario['id'];
  onSelect: (id: Scenario['id']) => void;
  subLabel: string;
}) {
  return (
    <div className="border-b border-subtle">
      <div className="flex flex-wrap items-center gap-1 px-4 pt-4 sm:px-6">
        {scenarios.map((s) => {
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className="relative rounded-full px-4 py-1.5 text-[0.84rem] font-medium transition-colors"
              style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              {active && (
                <motion.span
                  layoutId="ng-demo-tab-bg"
                  className="absolute inset-0 -z-0 rounded-full"
                  style={{ background: 'var(--accent-soft)' }}
                  transition={{ duration: 0.35, ease: EASE }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 px-6 pb-3 pt-2 text-[0.76rem] text-muted sm:px-8">
        <span className="font-mono uppercase tracking-[0.14em]">patient</span>
        <span aria-hidden>·</span>
        <span>{subLabel}</span>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────── Graph canvas

function GraphCanvas({
  scenario,
  state,
  selectedNode,
  onSelectNode,
  onBuild,
}: {
  scenario: Scenario;
  state: DemoState;
  selectedNode: string | null;
  onSelectNode: (id: string) => void;
  onBuild: () => void;
}) {
  const [hoverEdge, setHoverEdge] = useState<string | null>(null);
  const [enabledTypes, setEnabledTypes] = useState<Set<EdgeType>>(
    () => new Set<EdgeType>(['TEMPORAL', 'CO_OCCURS', 'GRANGER']),
  );
  const toggleType = (t: EdgeType) =>
    setEnabledTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });

  const nodes = useMemo(() => runForceLayout(scenario.nodes, scenario.edges), [scenario]);
  const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const visibleEdges = useMemo(
    () => scenario.edges.filter((e) => enabledTypes.has(e.type)),
    [scenario, enabledTypes],
  );

  const building = state === 'building';
  const show = state !== 'idle';

  return (
    <div className="relative">
      <div className="flex items-center justify-between text-[0.72rem] uppercase tracking-[0.14em] text-muted">
        <span className="inline-flex items-center gap-2 font-mono">
          <Workflow size={12} />
          <span>knowledge graph</span>
        </span>
        <span>
          {scenario.nodes.length} nodes · {scenario.edges.length} edges
        </span>
      </div>

      <div
        className="relative mt-3 overflow-hidden rounded-2xl border border-subtle"
        style={{
          aspectRatio: `${CANVAS.w} / ${CANVAS.h}`,
          background: 'radial-gradient(ellipse 110% 80% at 50% 50%, color-mix(in oklab, var(--accent) 6%, transparent), transparent 70%)',
        }}
      >
        <svg
          viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Subtle dot grid for depth */}
            <pattern id="ng-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="0.7" fill="var(--accent)" fillOpacity="0.1" />
            </pattern>

            {/* Moderate glow — episodic nodes, GRANGER edges */}
            <filter id="ng-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Strong glow — persistent nodes */}
            <filter id="ng-glow-bright" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radial fill gradients per tier */}
            <radialGradient id="ng-fill-p" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="var(--accent-strong)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.75" />
            </radialGradient>
            <radialGradient id="ng-fill-e" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35" />
            </radialGradient>

            {/* Arrow marker */}
            <marker
              id="ng-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" fill="var(--accent)" />
            </marker>
            <marker
              id="ng-arrow-granger"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" fill="var(--accent-strong)" />
            </marker>
          </defs>

          {/* Background dot grid */}
          <rect width={CANVAS.w} height={CANVAS.h} fill="url(#ng-dots)" />

          {/* Edge layer */}
          <g>
            {show &&
              visibleEdges.map((edge, i) => (
                <EdgePath
                  key={edge.id}
                  edge={edge}
                  source={nodeById[edge.source]}
                  target={nodeById[edge.target]}
                  building={building}
                  index={i}
                  hovered={hoverEdge === edge.id}
                  onHover={setHoverEdge}
                  interactive={state === 'results'}
                />
              ))}
          </g>

          {/* Node layer */}
          <g>
            {show &&
              nodes.map((n, i) => (
                <NodeCircle
                  key={n.id}
                  node={n}
                  selected={selectedNode === n.id}
                  building={building}
                  index={i}
                  interactive={state === 'results'}
                  onSelect={() => onSelectNode(n.id)}
                />
              ))}
          </g>
        </svg>

        {/* Edge tooltip — HTML overlay, positioned from SVG coords */}
        <AnimatePresence>
          {hoverEdge && state === 'results' && (() => {
            const edge = scenario.edges.find((e) => e.id === hoverEdge)!;
            return (
              <EdgeTooltip
                edge={edge}
                source={nodeById[edge.source]}
                target={nodeById[edge.target]}
              />
            );
          })()}
        </AnimatePresence>

        {/* Idle overlay */}
        <AnimatePresence>
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center"
              style={{ background: 'color-mix(in oklab, var(--bg-base) 30%, transparent)' }}
            >
              <GhostGraph />
              <button
                type="button"
                onClick={onBuild}
                className="group relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--color-iris-500) 100%)',
                  boxShadow: 'var(--shadow-glow)',
                  color: 'var(--on-accent)',
                }}
              >
                <Sparkles size={14} strokeWidth={2.2} />
                Build graph
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Building status pill */}
        <AnimatePresence>
          {building && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-subtle bg-glass-strong px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur"
            >
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
              Deriving nodes &amp; edges
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Legend enabled={enabledTypes} onToggle={toggleType} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────── Ghost graph

function GhostGraph() {
  return (
    <svg width="140" height="90" viewBox="0 0 140 90" className="opacity-35">
      <defs>
        <filter id="ghost-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g stroke="var(--accent)" strokeWidth="1.2" opacity="0.45" fill="none">
        <line x1="26" y1="26" x2="70" y2="46" />
        <line x1="114" y1="22" x2="70" y2="46" />
        <line x1="70" y1="46" x2="38" y2="72" />
        <line x1="70" y1="46" x2="104" y2="68" />
        <line x1="38" y1="72" x2="104" y2="68" />
      </g>
      <g filter="url(#ghost-glow)">
        <circle cx="26" cy="26" r="8" fill="var(--accent)" fillOpacity="0.6" />
        <circle cx="114" cy="22" r="6" fill="var(--accent)" fillOpacity="0.45" />
        <circle cx="70" cy="46" r="10" fill="var(--accent)" fillOpacity="0.85" />
        <circle cx="38" cy="72" r="6" fill="var(--accent)" fillOpacity="0.4" />
        <circle cx="104" cy="68" r="7" fill="var(--accent)" fillOpacity="0.5" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────── Legend

const EDGE_LEGEND: {
  type: EdgeType;
  label: string;
  stroke: string;
  width: number;
  dashed: boolean;
}[] = [
  { type: 'TEMPORAL', label: 'Temporal', stroke: 'var(--accent)', width: 1.6, dashed: true },
  { type: 'CO_OCCURS', label: 'Co-occurs', stroke: 'var(--accent)', width: 1.6, dashed: false },
  { type: 'GRANGER', label: 'Granger', stroke: 'var(--accent-strong)', width: 3, dashed: false },
];

function Legend({ enabled, onToggle }: { enabled: Set<EdgeType>; onToggle: (t: EdgeType) => void }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.7rem] text-muted">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'var(--accent)' }} />
        Persistent
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ background: 'color-mix(in oklab, var(--accent) 60%, transparent)' }}
        />
        Episodic
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full border"
          style={{ borderColor: 'var(--border-strong)', background: 'var(--accent-soft)' }}
        />
        Transient
      </span>

      <span aria-hidden className="opacity-40">
        ·
      </span>
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] opacity-70">filter edges</span>

      {EDGE_LEGEND.map((e) => {
        const on = enabled.has(e.type);
        return (
          <button
            key={e.type}
            type="button"
            onClick={() => onToggle(e.type)}
            aria-pressed={on}
            title={on ? `Hide ${e.label} edges` : `Show ${e.label} edges`}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono uppercase tracking-[0.08em] transition"
            style={{
              opacity: on ? 1 : 0.4,
              background: on ? 'var(--accent-soft)' : 'transparent',
              color: on ? 'var(--text-secondary)' : 'var(--text-muted)',
            }}
          >
            <svg width="22" height="8" aria-hidden>
              <line
                x1="0"
                y1="4"
                x2="22"
                y2="4"
                stroke={e.stroke}
                strokeWidth={e.width}
                strokeDasharray={e.dashed ? '3 3' : undefined}
              />
            </svg>
            {e.label}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────── Edges

function EdgePath({
  edge,
  source,
  target,
  building,
  index,
  hovered,
  onHover,
  interactive,
}: {
  edge: GraphEdge;
  source: ConceptNode;
  target: ConceptNode;
  building: boolean;
  index: number;
  hovered: boolean;
  onHover: (id: string | null) => void;
  interactive: boolean;
}) {
  const meta = EDGE_META[edge.type];
  const sx = source.x ?? 0;
  const sy = source.y ?? 0;
  const tx = target.x ?? 0;
  const ty = target.y ?? 0;

  const dx = tx - sx;
  const dy = ty - sy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;

  // Shorten to stop at node edge
  const R_S = NODE_R[source.tier] + 3;
  const R_T = NODE_R[target.tier] + (edge.directed ? 8 : 3);
  const x1 = sx + ux * R_S;
  const y1 = sy + uy * R_S;
  const x2 = tx - ux * R_T;
  const y2 = ty - uy * R_T;

  // Gentle quadratic bezier curve
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const BEND = 22;
  const cpx = mx - uy * BEND;
  const cpy = my + ux * BEND;
  const d = `M ${x1.toFixed(1)},${y1.toFixed(1)} Q ${cpx.toFixed(1)},${cpy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;

  const isGranger = edge.type === 'GRANGER';
  const color = isGranger ? 'var(--accent-strong)' : 'var(--accent)';
  const arrowId = isGranger ? 'url(#ng-arrow-granger)' : 'url(#ng-arrow)';
  const baseOpacity = edge.type === 'TEMPORAL' ? 0.8 : isGranger ? 0.72 : 0.38;

  return (
    <g
      onMouseEnter={() => interactive && onHover(edge.id)}
      onMouseLeave={() => interactive && onHover(null)}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      {/* Wide hit area */}
      <path d={d} stroke="transparent" strokeWidth={18} fill="none" />

      {/* Main edge */}
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={hovered ? meta.width + 1.2 : meta.width}
        strokeLinecap="round"
        strokeDasharray={meta.dashed ? '5 5' : undefined}
        markerEnd={edge.directed ? arrowId : undefined}
        fill="none"
        filter={isGranger ? 'url(#ng-glow)' : undefined}
        style={{ opacity: hovered ? 1 : baseOpacity }}
        initial={building ? { pathLength: 0, opacity: 0 } : false}
        animate={building ? { pathLength: 1, opacity: baseOpacity } : { opacity: hovered ? 1 : baseOpacity }}
        transition={{ duration: 0.7, delay: 0.5 + index * 0.04, ease: EASE }}
      />

      {/* Animated flow on TEMPORAL edges */}
      {meta.dashed && interactive && (
        <motion.path
          d={d}
          stroke={color}
          strokeWidth={meta.width}
          strokeLinecap="round"
          strokeDasharray="5 5"
          fill="none"
          style={{ opacity: 0.85 }}
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </g>
  );
}

function EdgeTooltip({
  edge,
  source,
  target,
}: {
  edge: GraphEdge;
  source: ConceptNode;
  target: ConceptNode;
}) {
  const midX = (((source.x ?? 0) + (target.x ?? 0)) / 2 / CANVAS.w) * 100;
  const midY = (((source.y ?? 0) + (target.y ?? 0)) / 2 / CANVAS.h) * 100;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.15 }}
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-subtle bg-glass-strong px-3 py-2 text-left backdrop-blur"
      style={{ left: `${midX}%`, top: `${midY}%`, boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-center gap-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-accent">
        {EDGE_META[edge.type].label}
      </div>
      <div className="mt-0.5 text-[0.78rem] font-medium text-primary">
        {source.label} <span className="text-muted">{edge.relation}</span> {target.label}
      </div>
      <div className="mt-1.5 flex gap-3">
        {edge.stat.map((s) => (
          <span key={s.label} className="font-mono text-[0.72rem] text-secondary">
            <span className="text-muted">{s.label}</span> {s.value}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────── Nodes

function NodeCircle({
  node,
  selected,
  building,
  index,
  interactive,
  onSelect,
}: {
  node: ConceptNode;
  selected: boolean;
  building: boolean;
  index: number;
  interactive: boolean;
  onSelect: () => void;
}) {
  const cx = node.x ?? 0;
  const cy = node.y ?? 0;
  const r = NODE_R[node.tier];
  const displayLabel = node.label.replace('_ppg', '');

  const fillId =
    node.tier === 'PERSISTENT' ? 'url(#ng-fill-p)' : node.tier === 'EPISODIC' ? 'url(#ng-fill-e)' : undefined;
  const fillOpacity = node.tier === 'TRANSIENT' ? 0.18 : 1;
  const strokeOpacity = node.tier === 'TRANSIENT' ? 0.65 : 0.3;
  const glowFilter = node.tier === 'PERSISTENT' ? 'url(#ng-glow-bright)' : node.tier === 'EPISODIC' ? 'url(#ng-glow)' : undefined;

  return (
    <motion.g
      onClick={interactive ? onSelect : undefined}
      style={{ cursor: interactive ? 'pointer' : 'default', x: cx, y: cy }}
      initial={building ? { opacity: 0, scale: 0.2 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: building ? 0.15 + index * 0.07 : 0, ease: EASE }}
    >
      {/* Breathing halo for persistent nodes */}
      {node.tier === 'PERSISTENT' && (
        <motion.circle
          cx={0}
          cy={0}
          r={r + 6}
          fill="var(--accent)"
          fillOpacity={selected ? 0.18 : 0.07}
          filter="url(#ng-glow-bright)"
          animate={{ r: [r + 4, r + 12, r + 4], fillOpacity: [0.07, 0.14, 0.07] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Selection ring */}
      {selected && (
        <circle
          cx={0}
          cy={0}
          r={r + 5}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.2}
          strokeOpacity={0.9}
          filter="url(#ng-glow)"
        />
      )}

      {/* Main circle */}
      <circle
        cx={0}
        cy={0}
        r={r}
        fill={fillId ?? 'var(--accent)'}
        fillOpacity={fillOpacity}
        stroke="var(--accent)"
        strokeWidth={node.tier === 'TRANSIENT' ? 1.5 : 0.5}
        strokeOpacity={strokeOpacity}
        filter={glowFilter}
      />

      {/* Modality tag above */}
      <text
        x={0}
        y={-r - 6}
        textAnchor="middle"
        fontSize={7.5}
        fontFamily="monospace"
        fill="var(--accent)"
        fillOpacity={0.8}
        letterSpacing={1.2}
      >
        {node.modality}
      </text>

      {/* Concept label below */}
      <text
        x={0}
        y={r + 14}
        textAnchor="middle"
        fontSize={9.5}
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
        fill="var(--text-primary)"
        fillOpacity={node.tier === 'TRANSIENT' ? 0.65 : 0.9}
      >
        {displayLabel.length > 12 ? displayLabel.slice(0, 11) + '…' : displayLabel}
      </text>
    </motion.g>
  );
}

// ─────────────────────────────────────────────────── Evidence panel

function EvidencePanel({
  scenario,
  state,
  node,
}: {
  scenario: Scenario;
  state: DemoState;
  node: ConceptNode | null;
}) {
  if (state !== 'results') {
    return (
      <div className="flex h-full min-h-[260px] flex-col items-center justify-center py-8 text-center">
        <div
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          <Activity size={22} strokeWidth={1.7} />
        </div>
        <h3 className="mt-4 font-display text-[1.3rem] font-semibold tracking-[-0.015em]">
          Signal evidence
        </h3>
        <p className="mt-2 max-w-xs text-[0.88rem] text-secondary">
          {state === 'building'
            ? 'Building the patient-specific graph from the sensor streams…'
            : 'Build the graph, then select any concept node to trace it back to the raw signal windows that activated it.'}
        </p>
      </div>
    );
  }

  if (!node) {
    return (
      <div className="flex h-full min-h-[260px] items-center justify-center text-center text-[0.9rem] text-secondary">
        Select a concept node to inspect its evidence.
      </div>
    );
  }

  return <NodeEvidence key={node.id} node={node} summary={scenario.summary} />;
}

function NodeEvidence({ node, summary }: { node: ConceptNode; summary: string }) {
  const ordered = useMemo(
    () => node.windows.map((w, i) => ({ ...w, i })).sort((a, b) => b.prob - a.prob),
    [node],
  );
  const [windowIdx, setWindowIdx] = useState(ordered[0]?.i ?? 0);
  const tier = TIER_META[node.tier];
  const active = node.windows[windowIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="flex h-full flex-col"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-accent">
            {node.modality} · concept
          </div>
          <h3 className="mt-1 font-mono text-[1.05rem] font-semibold tracking-tight text-primary">
            {node.label}
          </h3>
          <div className="mt-0.5 font-mono text-[0.72rem] text-muted">SNOMED {node.snomed}</div>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em]"
          style={{
            background: node.tier === 'TRANSIENT' ? 'rgba(120,145,170,0.14)' : 'var(--accent-soft)',
            color: node.tier === 'TRANSIENT' ? 'var(--color-violet-500)' : 'var(--accent)',
          }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {tier.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Mean activation" value={node.activation.toFixed(2)} />
        <Stat label="Activating windows" value={`${node.windowCount}`} />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.12em] text-muted">
          <span className="font-mono">signal · 30s window</span>
          <span className="font-mono text-accent">{active?.t}</span>
        </div>
        <Waveform modality={node.modality} seed={node.id} segment={windowIdx} segments={node.windows.length} />
      </div>

      <div className="mt-3">
        <div className="text-[0.7rem] uppercase tracking-[0.12em] text-muted">Activating windows</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {node.windows.map((w, i) => {
            const sel = i === windowIdx;
            return (
              <button
                key={`${w.t}-${i}`}
                type="button"
                onClick={() => setWindowIdx(i)}
                className="rounded-lg border px-2 py-1 font-mono text-[0.72rem] transition"
                style={{
                  borderColor: sel ? 'var(--accent)' : 'var(--border-subtle)',
                  background: sel ? 'var(--accent-soft)' : 'transparent',
                  color: sel ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                {w.t}
                <span className="ml-1.5 opacity-70">{w.prob.toFixed(2)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 border-t border-subtle pt-3 text-[0.84rem] font-light leading-relaxed text-secondary">
        {node.evidence}
      </p>
      <p className="mt-2 text-[0.78rem] font-light leading-relaxed text-muted">{summary}</p>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-subtle bg-glass p-3">
      <div className="font-mono text-[1.15rem] font-semibold tracking-tight text-accent">{value}</div>
      <div className="mt-0.5 text-[0.68rem] uppercase tracking-[0.08em] text-muted">{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────── Synthesized waveform

function gauss(u: number, mu: number, s: number) {
  return Math.exp(-((u - mu) ** 2) / (2 * s * s));
}

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function beatValue(modality: Modality, u: number) {
  switch (modality) {
    case 'ECG':
      return (
        0.1 * gauss(u, 0.1, 0.03) -
        0.16 * gauss(u, 0.17, 0.012) +
        1.0 * gauss(u, 0.2, 0.012) -
        0.26 * gauss(u, 0.23, 0.013) +
        0.22 * gauss(u, 0.42, 0.05)
      );
    case 'ABP':
      return 0.95 * gauss(u, 0.24, 0.13) + 0.35 * gauss(u, 0.56, 0.1);
    case 'PPG':
      return 0.9 * gauss(u, 0.3, 0.16) + 0.28 * gauss(u, 0.64, 0.13);
    default:
      return 0;
  }
}

function Waveform({
  modality,
  seed,
  segment,
  segments,
}: {
  modality: Modality;
  seed: string;
  segment: number;
  segments: number;
}) {
  const W = 300;
  const H = 76;
  const path = useMemo(() => {
    const n = 260;
    const rnd = hashString(seed + modality);
    const beats = modality === 'ECG' ? 6 : modality === 'ABP' || modality === 'PPG' ? 7 : 0;
    const cycles = 2.5;
    const mid = H / 2;
    const amp = H * 0.34;
    let dStr = '';
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      let v: number;
      if (modality === 'RESP') {
        v = 0.8 * Math.sin(2 * Math.PI * cycles * u + (rnd % 7) * 0.3);
      } else {
        const phase = (u * beats) % 1;
        v = beatValue(modality, phase) + 0.04 * Math.sin(2 * Math.PI * u * 1.3 + rnd);
      }
      const x = u * W;
      const y = mid - v * amp;
      dStr += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return dStr.trim();
  }, [modality, seed]);

  const segW = W / Math.max(segments, 1);
  const segX = segment * segW;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-subtle bg-glass">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-[76px] w-full">
        <rect x={segX} y={0} width={segW} height={H} fill="var(--accent-soft)" />
        <line x1={segX} y1={0} x2={segX} y2={H} stroke="var(--accent)" strokeWidth={0.8} strokeOpacity={0.5} />
        <line
          x1={segX + segW}
          y1={0}
          x2={segX + segW}
          y2={H}
          stroke="var(--accent)"
          strokeWidth={0.8}
          strokeOpacity={0.5}
        />
        <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="var(--border-subtle)" strokeWidth={0.6} />
        <motion.path
          d={path}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.6}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </svg>
    </div>
  );
}

// ──────────────────────────────────────────────────────────── Timeline

function TimelineStrip({
  scenario,
  state,
  selectedNode,
  onSelectNode,
}: {
  scenario: Scenario;
  state: DemoState;
  selectedNode: string | null;
  onSelectNode: (id: string) => void;
}) {
  if (state !== 'results') return null;
  const buckets = scenario.nodes[0]?.density.length ?? 12;

  return (
    <div className="border-t border-subtle px-5 py-5 sm:px-6">
      <div className="flex items-center justify-between text-[0.72rem] uppercase tracking-[0.14em] text-muted">
        <span className="font-mono">patient timeline · activation density</span>
        <span className="font-mono">{buckets}h stay</span>
      </div>

      <div className="mt-3 space-y-1.5">
        {scenario.nodes.map((n) => {
          const sel = selectedNode === n.id;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => onSelectNode(n.id)}
              className="flex w-full items-center gap-3 rounded-lg px-1.5 py-1 text-left transition"
              style={{ background: sel ? 'var(--accent-soft)' : 'transparent' }}
            >
              <span
                className="w-28 shrink-0 truncate font-mono text-[0.72rem]"
                style={{ color: sel ? 'var(--accent)' : 'var(--text-secondary)' }}
              >
                {n.label}
              </span>
              <span className="flex flex-1 gap-[2px]">
                {n.density.map((dv, i) => (
                  <span
                    key={i}
                    className="h-4 flex-1 rounded-[2px]"
                    style={{
                      background:
                        dv <= 0
                          ? 'var(--border-subtle)'
                          : `color-mix(in oklab, var(--accent) ${Math.round(15 + dv * 85)}%, transparent)`,
                    }}
                    title={`h${i}: ${dv.toFixed(2)}`}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────── Controls

function Controls({ state, onReset }: { state: DemoState; onReset: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-subtle px-5 py-4 sm:px-6">
      <button
        type="button"
        onClick={onReset}
        disabled={state === 'idle'}
        aria-label="Reset graph"
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-subtle bg-glass px-3 text-[0.8rem] text-secondary transition enabled:hover:border-strong enabled:hover:text-primary disabled:opacity-40"
      >
        <RotateCcw size={13} />
        Reset
      </button>
      <a
        href="/contact"
        className="group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[0.86rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
        style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--color-iris-500) 100%)',
          boxShadow: 'var(--shadow-glow)',
          color: 'var(--on-accent)',
        }}
      >
        Book a demo
        <ArrowUpRight
          size={14}
          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </a>
    </div>
  );
}
