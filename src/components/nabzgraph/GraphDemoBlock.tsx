import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, ArrowUpRight, RotateCcw, Sparkles, Workflow } from 'lucide-react';
import {
  ACTION_HALF,
  CANVAS,
  EDGE_META,
  EDGE_ORDER,
  SCENARIOS,
  TIER_META,
  VARIABLE_R,
  edgeGeometry,
  layoutScenario,
  minutesFrom,
  nodeHalfHeight,
  CONCEPT_R,
  type ActionNode,
  type ConceptNode,
  type EdgeType,
  type GraphEdge,
  type GraphNode,
  type Modality,
  type Orientation,
  type Scenario,
  type VariableNode,
} from '../../data/nabzgraphScenarios';

/**
 * Interactive NabzGraph demo. Prerendered, illustrative patient graphs (see
 * nabzgraphScenarios.ts): concept, action and variable nodes joined by typed
 * relations (response, policy, association, mechanistic). Pick a patient,
 * build the graph, then select any node to see the events behind it.
 */

type DemoState = 'idle' | 'building' | 'results';

const BUILD_DURATION_MS = 2400;
const EASE = [0.22, 1, 0.36, 1] as const;
/** Keeps dragged nodes inside the canvas. */
const DRAG_PAD = 48;
/** Timeline resolution (buckets across the record). */
const BUCKETS = 12;
/**
 * Canvas text sizes, in viewBox units. Landscape renders ~600px wide on
 * desktop (scale ~0.79) and portrait ~320px on a phone (scale ~0.78), so
 * labels land near 11px and tags near 9px on both.
 */
const TYPE: Record<Orientation, { label: number; tag: number; header: number }> = {
  landscape: { label: 14, tag: 11, header: 11 },
  portrait: { label: 14.5, tag: 12.5, header: 12 },
};
/** Transparent hit circle on every node, so small nodes stay easy to tap. */
const HIT_R = 28;

/** Portrait canvas below Tailwind's sm breakpoint (40rem). */
function useOrientation(): Orientation {
  // Landscape on the server and first render; phones switch after mount.
  // The container's aspect classes are already right before then.
  const [orientation, setOrientation] = useState<Orientation>('landscape');
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639.98px)');
    const update = () => setOrientation(mq.matches ? 'portrait' : 'landscape');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return orientation;
}

// ─────────────────────────────────────────────────────── Root component

export function GraphDemoBlock() {
  const [scenarioId, setScenarioId] = useState<Scenario['id']>('anesthesia');
  const [state, setState] = useState<DemoState>('idle');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  // Edge-type filter: drawn edges and the evidence panel's relation list
  // both follow it.
  const [enabledTypes, setEnabledTypes] = useState<Set<EdgeType>>(() => new Set<EdgeType>(EDGE_ORDER));
  const toggleType = (t: EdgeType) =>
    setEnabledTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

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
      setSelectedNode(scenario.focus);
    }, BUILD_DURATION_MS);
  };

  const handleReset = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setState('idle');
    setSelectedNode(null);
  };

  const node = scenario.nodes.find((n) => n.id === selectedNode) ?? null;

  return (
    <div className="glass relative overflow-hidden rounded-2xl sm:rounded-3xl">
      <TabBar
        scenarios={SCENARIOS}
        activeId={scenarioId}
        onSelect={handleScenarioChange}
        subLabel={scenario.subLabel}
      />

      {/* Phones: until a graph is built, the evidence pane is only a 260px
          placeholder repeating the section's instruction, so it (and the
          divider above it) waits for results. Unchanged from sm up. */}
      <div className="grid gap-0 lg:grid-cols-[1.5fr_1fr]">
        <div
          className={`border-subtle p-3 sm:border-b sm:p-6 lg:border-b-0 lg:border-r ${
            state === 'results' ? 'border-b' : ''
          }`}
        >
          <GraphCanvas
            scenario={scenario}
            state={state}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            onBuild={handleBuild}
            enabledTypes={enabledTypes}
            onToggleType={toggleType}
          />
        </div>
        <div className={state === 'results' ? 'p-4 sm:p-6' : 'hidden p-4 sm:block sm:p-6'}>
          <EvidencePanel scenario={scenario} state={state} node={node} enabledTypes={enabledTypes} />
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
      <div className="flex flex-nowrap items-center gap-1 overflow-x-auto px-3 pt-3 no-scrollbar sm:flex-wrap sm:px-6 sm:pt-4">
        {scenarios.map((s) => {
          const active = s.id === activeId;
          // Phones: min-h-10 keeps each patient tab a 40px tap target.
          return (
            <button
              key={s.id}
              type="button"
              onClick={(e) => {
                onSelect(s.id);
                // Phones: the row scrolls sideways; bring a clipped tab
                // (e.g. "ICU stay" at the right edge) fully into view.
                e.currentTarget.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
              }}
              className="relative min-h-10 shrink-0 rounded-full px-3 py-1.5 text-[0.78rem] font-medium transition-colors sm:min-h-auto sm:px-4 sm:text-[0.84rem]"
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
      <div className="flex items-center gap-2 px-6 pb-2.5 pt-1.5 text-[0.76rem] text-muted sm:px-8 sm:pb-3 sm:pt-2">
        <span className="font-mono uppercase tracking-[0.14em]">patient</span>
        <span aria-hidden>·</span>
        <span>{subLabel}</span>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────── Graph canvas

type Placed = GraphNode & { x: number; y: number };

function GraphCanvas({
  scenario,
  state,
  selectedNode,
  onSelectNode,
  onBuild,
  enabledTypes,
  onToggleType,
}: {
  scenario: Scenario;
  state: DemoState;
  selectedNode: string | null;
  onSelectNode: (id: string) => void;
  onBuild: () => void;
  enabledTypes: Set<EdgeType>;
  onToggleType: (t: EdgeType) => void;
}) {
  const [hoverEdge, setHoverEdge] = useState<string | null>(null);
  const orientation = useOrientation();
  const canvas = CANVAS[orientation];
  const type = TYPE[orientation];

  const layout = useMemo(() => layoutScenario(scenario, orientation), [scenario, orientation]);

  // Mutable positions so nodes can be dragged after layout
  const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number }>>(() => new Map());
  useEffect(() => {
    setNodePositions(new Map(layout.nodes.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }])));
    setHoverEdge(null);
  }, [layout]);

  const nodes = useMemo<Placed[]>(
    () =>
      layout.nodes.map((n) => ({
        ...n,
        x: nodePositions.get(n.id)?.x ?? n.x ?? 0,
        y: nodePositions.get(n.id)?.y ?? n.y ?? 0,
      })),
    [layout, nodePositions],
  );

  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const toSVGCoords = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.w,
      y: ((e.clientY - rect.top) / rect.height) * canvas.h,
    };
  };

  const handleSVGPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragNodeId) return;
    e.preventDefault();
    const { x, y } = toSVGCoords(e);
    setNodePositions((prev) => {
      const next = new Map(prev);
      next.set(dragNodeId, {
        x: Math.max(DRAG_PAD, Math.min(canvas.w - DRAG_PAD, x)),
        y: Math.max(DRAG_PAD + 16, Math.min(canvas.h - DRAG_PAD, y)),
      });
      return next;
    });
  };

  const handleSVGPointerUp = () => setDragNodeId(null);

  const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const visibleEdges = useMemo(
    () => scenario.edges.filter((e) => enabledTypes.has(e.type)),
    [scenario, enabledTypes],
  );

  const building = state === 'building';
  const show = state !== 'idle';
  const interactive = state === 'results';
  const tooltipEdge = interactive && hoverEdge ? visibleEdges.find((e) => e.id === hoverEdge) : undefined;
  const filtered = visibleEdges.length !== scenario.edges.length;

  return (
    <div className="relative">
      {/* One line at every width (whitespace-nowrap; tighter tracking and a
          shorter label on phones), so switching patients never reflows the
          canvas below. Phones: while building, the status replaces the count
          here instead of covering the canvas. */}
      <div className="flex items-center justify-between gap-3 whitespace-nowrap text-[0.72rem] uppercase tracking-[0.08em] text-muted sm:tracking-[0.14em]">
        <span className="inline-flex items-center gap-2 font-mono">
          <Workflow size={12} />
          <span>
            illustrative<span className="hidden sm:inline"> graph</span>
          </span>
        </span>
        <span className={building ? 'hidden sm:inline' : undefined}>
          {scenario.nodes.length} nodes ·{' '}
          {filtered ? `${visibleEdges.length}/${scenario.edges.length}` : scenario.edges.length} edges
        </span>
        {building && (
          <span className="inline-flex items-center gap-1.5 font-semibold text-accent sm:hidden">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
            Testing relations
          </span>
        )}
      </div>

      {/* Aspect classes mirror CANVAS in nabzgraphScenarios.ts (landscape
          760x470, portrait 410x680 on phones), so the box is the right shape
          from the prerendered HTML on. Phones: until a graph is built the
          canvas is an empty placeholder behind the Build button, so it waits
          as a short box (SVG hidden) and opens to the portrait canvas on
          Build, as the evidence pane waits for results. Unchanged from sm. */}
      <div
        className={`relative mt-2 aspect-[760/470] overflow-hidden rounded-2xl border border-subtle sm:mt-3 ${
          state === 'idle' ? 'max-sm:aspect-[410/260]' : 'max-sm:aspect-[410/680]'
        }`}
        style={{
          background: 'radial-gradient(ellipse 110% 80% at 50% 50%, color-mix(in oklab, var(--accent) 6%, transparent), transparent 70%)',
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${canvas.w} ${canvas.h}`}
          className={`absolute inset-0 h-full w-full ${state === 'idle' ? 'max-sm:hidden' : ''}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ cursor: dragNodeId ? 'grabbing' : 'default' }}
          onPointerMove={handleSVGPointerMove}
          onPointerUp={handleSVGPointerUp}
          onPointerLeave={handleSVGPointerUp}
        >
          <defs>
            {/* Subtle dot grid for depth */}
            <pattern id="ng-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="0.7" fill="var(--accent)" fillOpacity="0.1" />
            </pattern>

            {/* Moderate glow: episodic nodes, mechanistic edges */}
            <filter id="ng-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Strong glow: persistent nodes */}
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

            {/* One arrowhead per directed relation type, sized in canvas units
                so thick edges do not get oversized heads. */}
            {EDGE_ORDER.filter((t) => t !== 'ASSOCIATION').map((t) => (
              <marker
                key={t}
                id={`ng-arrow-${t.toLowerCase()}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="9"
                markerHeight="9"
                markerUnits="userSpaceOnUse"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L10 5 L0 10 z" fill={EDGE_META[t].stroke} />
              </marker>
            ))}
          </defs>

          {/* Background dot grid */}
          <rect width={canvas.w} height={canvas.h} fill="url(#ng-dots)" />

          {/* Beat-level band */}
          {layout.band && (
            <rect
              x={layout.band.x}
              y={layout.band.y}
              width={layout.band.width}
              height={layout.band.height}
              rx={18}
              fill="var(--text-muted)"
              fillOpacity={0.06}
              stroke="var(--border-subtle)"
            />
          )}

          {/* Column group headers; on the portrait canvas they run down the
              left edge. */}
          <g>
            {layout.headers.map((h) => (
              <text
                key={h.label}
                x={h.x}
                y={h.y}
                transform={h.vertical ? `rotate(-90 ${h.x} ${h.y})` : undefined}
                dominantBaseline={h.vertical ? 'central' : undefined}
                textAnchor="middle"
                fontSize={type.header}
                fontFamily="monospace"
                fill="var(--text-muted)"
                letterSpacing={1.6}
              >
                {h.label.toUpperCase()}
              </text>
            ))}
          </g>

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
                  dimmed={
                    interactive &&
                    selectedNode !== null &&
                    edge.source !== selectedNode &&
                    edge.target !== selectedNode
                  }
                  onHover={setHoverEdge}
                  interactive={interactive}
                />
              ))}
          </g>

          {/* Node layer */}
          <g>
            {show &&
              nodes.map((n, i) => (
                <NodeShape
                  key={n.id}
                  node={n}
                  selected={selectedNode === n.id}
                  building={building}
                  index={i}
                  interactive={interactive}
                  dragging={dragNodeId === n.id}
                  onSelect={() => onSelectNode(n.id)}
                  onDragStart={() => setDragNodeId(n.id)}
                  labelSize={type.label}
                  tagSize={type.tag}
                />
              ))}
          </g>
        </svg>

        {/* Edge tooltip: HTML overlay, positioned from SVG coords */}
        <AnimatePresence>
          {tooltipEdge && nodeById[tooltipEdge.source] && nodeById[tooltipEdge.target] && (
            <EdgeTooltip
              key={tooltipEdge.id}
              edge={tooltipEdge}
              source={nodeById[tooltipEdge.source]}
              target={nodeById[tooltipEdge.target]}
              canvas={canvas}
            />
          )}
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
                className="btn-primary group relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.92rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
              >
                <Sparkles size={14} strokeWidth={2.2} />
                Build graph
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Building status pill. Phones: shown in the header row above
            instead, so it does not cover the headers and top nodes. */}
        <AnimatePresence>
          {building && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute left-3 top-3 hidden items-center gap-2 rounded-full border border-subtle bg-glass-strong px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur sm:inline-flex"
            >
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
              Testing relations
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Legend enabled={enabledTypes} onToggle={onToggleType} />
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
        <line x1="24" y1="24" x2="70" y2="45" />
        <line x1="24" y1="68" x2="70" y2="45" />
        <line x1="70" y1="45" x2="114" y2="26" />
        <line x1="70" y1="45" x2="114" y2="66" strokeDasharray="3 3" />
      </g>
      <g filter="url(#ghost-glow)">
        <circle cx="24" cy="24" r="8" fill="var(--accent)" fillOpacity="0.6" />
        <circle cx="24" cy="68" r="6" fill="var(--accent)" fillOpacity="0.4" />
        <rect x="61" y="36" width="18" height="18" rx="4" fill="var(--accent)" fillOpacity="0.85" />
        <ellipse cx="114" cy="26" rx="12" ry="7" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
        <ellipse cx="114" cy="66" rx="12" ry="7" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────── Legend

/** Dash pattern at legend scale (the canvas patterns are drawn larger). */
const LEGEND_DASH: Partial<Record<EdgeType, string>> = { POLICY: '4 3', ASSOCIATION: '0.1 4' };

function EdgeSwatch({ type, width = 22 }: { type: EdgeType; width?: number }) {
  const meta = EDGE_META[type];
  return (
    <svg width={width} height="8" aria-hidden className="shrink-0">
      <line
        x1="2"
        y1="4"
        x2={width - 2}
        y2="4"
        stroke={meta.stroke}
        strokeWidth={Math.min(meta.width, 2.6)}
        strokeLinecap="round"
        strokeDasharray={LEGEND_DASH[type]}
      />
    </svg>
  );
}

function Legend({ enabled, onToggle }: { enabled: Set<EdgeType>; onToggle: (t: EdgeType) => void }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.7rem] text-muted sm:mt-3 sm:gap-y-1.5">
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

      {/* Phones: no separator; when the row wraps it is left dangling at a
          line end. */}
      <span aria-hidden className="hidden opacity-40 sm:inline">
        ·
      </span>
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] opacity-70">filter edges</span>

      {EDGE_ORDER.map((type) => {
        const meta = EDGE_META[type];
        const on = enabled.has(type);
        return (
          <button
            key={type}
            type="button"
            onClick={() => onToggle(type)}
            aria-pressed={on}
            title={`${on ? 'Hide' : 'Show'} ${meta.label.toLowerCase()} edges. ${meta.line}`}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 py-0.5 font-mono uppercase tracking-[0.08em] transition sm:min-h-0"
            style={{
              opacity: on ? 1 : 0.4,
              background: on ? 'var(--accent-soft)' : 'transparent',
              color: on ? 'var(--text-secondary)' : 'var(--text-muted)',
            }}
          >
            <EdgeSwatch type={type} />
            {meta.label}
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
  dimmed,
  onHover,
  interactive,
}: {
  edge: GraphEdge;
  source: Placed;
  target: Placed;
  building: boolean;
  index: number;
  hovered: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
  interactive: boolean;
}) {
  const meta = EDGE_META[edge.type];
  const { d } = edgeGeometry(source, target);
  const arrow = edge.directed ? `url(#ng-arrow-${edge.type.toLowerCase()})` : undefined;
  const opacity = hovered ? 1 : dimmed ? meta.opacity * 0.4 : meta.opacity;

  // Dashed and dotted edges fade in: drawing them in with pathLength would
  // replace their dash pattern. Policy edges flow from the patient to the
  // action once the graph is built.
  const dashed = Boolean(meta.dash);
  const flow = edge.type === 'POLICY' && interactive;

  return (
    // Edges show a tooltip on hover but cannot be clicked: a help cursor,
    // not a pointer.
    <g
      onMouseEnter={() => interactive && onHover(edge.id)}
      onMouseLeave={() => interactive && onHover(null)}
      style={{ cursor: interactive ? 'help' : 'default' }}
    >
      {/* Wide hit area */}
      <path d={d} stroke="transparent" strokeWidth={18} fill="none" />

      <motion.path
        d={d}
        stroke={meta.stroke}
        strokeWidth={hovered ? meta.width + 1.2 : meta.width}
        strokeLinecap="round"
        strokeDasharray={meta.dash}
        markerEnd={arrow}
        fill="none"
        filter={meta.glow ? 'url(#ng-glow)' : undefined}
        initial={building ? (dashed ? { opacity: 0 } : { pathLength: 0, opacity: 0 }) : false}
        animate={
          building
            ? dashed
              ? { opacity: meta.opacity }
              : { pathLength: 1, opacity: meta.opacity }
            : flow
              ? { opacity, strokeDashoffset: [0, -20] }
              : { opacity }
        }
        transition={
          building
            ? { duration: 0.7, delay: 0.5 + index * 0.04, ease: EASE }
            : flow
              ? { opacity: { duration: 0.2 }, strokeDashoffset: { duration: 1.1, repeat: Infinity, ease: 'linear' } }
              : { duration: 0.2 }
        }
      />
    </g>
  );
}

function EdgeTooltip({
  edge,
  source,
  target,
  canvas,
}: {
  edge: GraphEdge;
  source: Placed;
  target: Placed;
  canvas: { w: number; h: number };
}) {
  const { mid } = edgeGeometry(source, target);
  // On the narrow portrait canvas a centred tooltip near a side would be
  // clipped; keep its centre away from the edges.
  const narrow = canvas.w < canvas.h;
  const leftPct = (mid.x / canvas.w) * 100;
  const left = narrow ? Math.min(70, Math.max(30, leftPct)) : leftPct;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.15 }}
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-subtle bg-glass-strong px-3 py-2 text-left backdrop-blur"
      style={{ left: `${left}%`, top: `${(mid.y / canvas.h) * 100}%`, boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-center gap-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-accent">
        <EdgeSwatch type={edge.type} width={18} />
        {EDGE_META[edge.type].label}
      </div>
      <div className="mt-0.5 text-[0.78rem] font-medium text-primary">{edge.phrase}</div>
      <div className="mt-1.5 flex gap-3">
        {edge.stat.map((s) => (
          <span key={s.label} className="font-mono text-[0.72rem] text-secondary">
            <span className="text-muted">{s.label}</span> {s.value}
          </span>
        ))}
        <span className="font-mono text-[0.72rem] text-secondary">
          <span className="text-muted">pointers</span> {edge.pointers}
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────── Nodes

/** A background-coloured outline so node text stays legible over edges. */
const TEXT_HALO = {
  stroke: 'var(--bg-base)',
  strokeWidth: 3,
  strokeOpacity: 0.85,
  strokeLinejoin: 'round',
  paintOrder: 'stroke',
} as const;

function NodeShape({
  node,
  selected,
  building,
  index,
  interactive,
  dragging,
  onSelect,
  onDragStart,
  labelSize,
  tagSize,
}: {
  node: Placed;
  selected: boolean;
  building: boolean;
  index: number;
  interactive: boolean;
  dragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  labelSize: number;
  tagSize: number;
}) {
  const h = nodeHalfHeight(node);
  const label = node.label.length > 14 ? node.label.slice(0, 13) + '…' : node.label;
  const faint = node.kind === 'concept' && node.tier === 'TRANSIENT';

  return (
    // The cursor is a class, not part of the motion style, which kept its
    // first-render value. Nodes are clickable (and draggable): a pointer.
    <motion.g
      onPointerDown={interactive ? (e) => { e.stopPropagation(); onDragStart(); } : undefined}
      onClick={interactive && !dragging ? onSelect : undefined}
      className={interactive ? (dragging ? 'cursor-grabbing' : 'cursor-pointer') : undefined}
      style={{ x: node.x, y: node.y }}
      initial={building ? { opacity: 0, scale: 0.2 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: building ? 0.15 + index * 0.07 : 0, ease: EASE }}
    >
      {/* Invisible hit area: small nodes stay a comfortable tap target. */}
      <circle r={HIT_R} fill="transparent" />
      {node.kind === 'concept' && <ConceptGlyph node={node} selected={selected} />}
      {node.kind === 'action' && <ActionGlyph selected={selected} />}
      {node.kind === 'variable' && <VariableGlyph node={node} selected={selected} />}

      {/* Tag above, label below, sized per canvas orientation (TYPE). A
          selected node's tag moves up clear of its selection ring. */}
      <text
        x={0}
        y={-h - (selected ? 11 : 6)}
        textAnchor="middle"
        fontSize={tagSize}
        fontFamily="monospace"
        fill="var(--accent)"
        fillOpacity={0.8}
        letterSpacing={1.2}
        {...TEXT_HALO}
      >
        {node.tag}
      </text>
      <text
        x={0}
        y={h + 18}
        textAnchor="middle"
        fontSize={labelSize}
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
        fill="var(--text-primary)"
        fillOpacity={faint ? 0.65 : 0.9}
        {...TEXT_HALO}
      >
        {label}
      </text>
    </motion.g>
  );
}

function ConceptGlyph({ node, selected }: { node: ConceptNode; selected: boolean }) {
  const r = CONCEPT_R[node.tier];
  const fill =
    node.tier === 'PERSISTENT' ? 'url(#ng-fill-p)' : node.tier === 'EPISODIC' ? 'url(#ng-fill-e)' : 'var(--accent)';
  const glow =
    node.tier === 'PERSISTENT' ? 'url(#ng-glow-bright)' : node.tier === 'EPISODIC' ? 'url(#ng-glow)' : undefined;
  return (
    <>
      {/* Breathing halo for persistent nodes. The initial values matter:
          without them the r keyframes started from undefined and logged an
          "attribute r: Expected length" error on every build. */}
      {node.tier === 'PERSISTENT' && (
        <motion.circle
          cx={0}
          cy={0}
          fill="var(--accent)"
          filter="url(#ng-glow-bright)"
          initial={{ r: r + 4, fillOpacity: selected ? 0.18 : 0.07 }}
          animate={{ r: [r + 4, r + 12, r + 4], fillOpacity: [0.07, 0.14, 0.07] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {selected && (
        <circle cx={0} cy={0} r={r + 5} fill="none" stroke="var(--accent)" strokeWidth={2.2} strokeOpacity={0.9} filter="url(#ng-glow)" />
      )}
      <circle
        cx={0}
        cy={0}
        r={r}
        fill={fill}
        fillOpacity={node.tier === 'TRANSIENT' ? 0.18 : 1}
        stroke="var(--accent)"
        strokeWidth={node.tier === 'TRANSIENT' ? 1.5 : 0.5}
        strokeOpacity={node.tier === 'TRANSIENT' ? 0.65 : 0.3}
        filter={glow}
      />
    </>
  );
}

/** Action: a shaded rounded square, the clinician's control. */
function ActionGlyph({ selected }: { selected: boolean }) {
  const s = ACTION_HALF;
  return (
    <>
      {selected && (
        <rect
          x={-s - 5}
          y={-s - 5}
          width={2 * s + 10}
          height={2 * s + 10}
          rx={11}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.2}
          strokeOpacity={0.9}
          filter="url(#ng-glow)"
        />
      )}
      <rect
        x={-s}
        y={-s}
        width={2 * s}
        height={2 * s}
        rx={7}
        fill="var(--accent)"
        fillOpacity={0.2}
        stroke="var(--accent-strong)"
        strokeWidth={1.6}
      />
      <rect x={-4.5} y={-4.5} width={9} height={9} rx={2.5} fill="var(--accent-strong)" fillOpacity={0.85} />
    </>
  );
}

/** Variable: an outlined ellipse. Beat-level series take the sky tint. */
function VariableGlyph({ node, selected }: { node: VariableNode; selected: boolean }) {
  const { rx, ry } = VARIABLE_R;
  const stroke = node.level === 'beat' ? 'var(--color-iris-500)' : 'var(--accent)';
  return (
    <>
      {selected && (
        <ellipse rx={rx + 5} ry={ry + 5} fill="none" stroke="var(--accent)" strokeWidth={2.2} strokeOpacity={0.9} filter="url(#ng-glow)" />
      )}
      <ellipse rx={rx} ry={ry} fill="var(--bg-base)" fillOpacity={0.85} stroke={stroke} strokeWidth={1.5} />
      <ellipse rx={rx} ry={ry} fill={stroke} fillOpacity={0.08} />
    </>
  );
}

// ─────────────────────────────────────────────────── Evidence panel

function EvidencePanel({
  scenario,
  state,
  node,
  enabledTypes,
}: {
  scenario: Scenario;
  state: DemoState;
  node: GraphNode | null;
  enabledTypes: Set<EdgeType>;
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
        <h3 className="mt-4 font-display text-[1.3rem] font-semibold tracking-[-0.015em]">Evidence</h3>
        <p className="mt-2 max-w-xs text-[0.88rem] text-secondary">
          {state === 'building'
            ? 'Testing each relation against controls…'
            : 'Build the graph, then select any node to see the events behind it.'}
        </p>
      </div>
    );
  }

  if (!node) {
    return (
      <div className="flex h-full min-h-[120px] items-center justify-center text-center text-[0.9rem] text-secondary sm:min-h-[260px]">
        Select a node to see its evidence.
      </div>
    );
  }

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="flex h-full flex-col"
    >
      {node.kind === 'concept' && <ConceptEvidence node={node} />}
      {node.kind === 'action' && <ActionEvidence node={node} clock={scenario.clock} />}
      {node.kind === 'variable' && <VariableEvidence node={node} scenario={scenario} />}
      <RelationList scenario={scenario} nodeId={node.id} enabledTypes={enabledTypes} />
      <p className="mt-4 border-t border-subtle pt-3 text-[0.84rem] font-light leading-relaxed text-secondary">
        {node.note}
      </p>
    </motion.div>
  );
}

function PanelHeader({
  kicker,
  title,
  sub,
  pill,
  muted = false,
}: {
  kicker: string;
  title: string;
  sub: string;
  pill: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-accent">{kicker}</div>
        <h3 className="mt-1 font-mono text-[1.05rem] font-semibold tracking-tight text-primary">{title}</h3>
        <div className="mt-0.5 font-mono text-[0.72rem] text-muted">{sub}</div>
      </div>
      <span
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em]"
        style={{
          background: muted ? 'rgba(120,145,170,0.14)' : 'var(--accent-soft)',
          color: muted ? 'var(--color-violet-500)' : 'var(--accent)',
        }}
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
        {pill}
      </span>
    </div>
  );
}

/** Selectable evidence chips (episodes or action changes). */
function EvidenceChips({
  title,
  unit,
  items,
  active,
  onSelect,
}: {
  title: string;
  /** Shown as written: uppercasing would turn µ into M. */
  unit?: string;
  items: { key: string; t: string; v: string }[];
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="mt-3">
      <div className="text-[0.7rem] uppercase tracking-[0.12em] text-muted">
        {title}
        {unit && <span className="ml-1.5 font-mono normal-case tracking-normal">{unit}</span>}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((it, i) => {
          const sel = i === active;
          // Phones: min-h-10 keeps each chip a 40px tap target.
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onSelect(i)}
              className="inline-flex min-h-10 items-center rounded-lg border px-2 py-1 font-mono text-[0.72rem] transition sm:min-h-0"
              style={{
                borderColor: sel ? 'var(--accent)' : 'var(--border-subtle)',
                background: sel ? 'var(--accent-soft)' : 'transparent',
                color: sel ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              {it.t}
              <span className="ml-1.5 opacity-70">{it.v}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ConceptEvidence({ node }: { node: ConceptNode }) {
  const [active, setActive] = useState(0);
  const span = node.spans[active];
  return (
    <>
      <PanelHeader
        kicker={`${node.tag} · ${node.level === 'beat' ? 'beat concept' : 'concept'}`}
        title={node.label}
        sub={node.snomed ? `${node.rule} · SNOMED ${node.snomed}` : node.rule}
        pill={TIER_META[node.tier].label}
        muted={node.tier === 'TRANSIENT'}
      />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Episodes" value={`${node.episodes}`} />
        <Stat label="30-s windows" value={`${node.windows}`} />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.12em] text-muted">
          <span className="font-mono">signal · episode</span>
          <span className="font-mono text-accent">{span?.t}</span>
        </div>
        <Waveform modality={node.modality} seed={node.id} segment={active} segments={node.spans.length} />
      </div>
      <EvidenceChips
        title="Episodes"
        items={node.spans.map((s, i) => ({ key: `${s.t}-${i}`, t: s.t, v: s.v }))}
        active={active}
        onSelect={setActive}
      />
    </>
  );
}

/** Decimals an action's values need (0 for whole numbers). */
function decimalsFor(node: ActionNode) {
  return [node.start, ...node.changes.map((c) => c.to)].some((v) => !Number.isInteger(v)) ? 1 : 0;
}

function ActionEvidence({ node, clock }: { node: ActionNode; clock: Scenario['clock'] }) {
  const [active, setActive] = useState(0);
  const dp = decimalsFor(node);
  const values = [node.start, ...node.changes.map((c) => c.to)];
  const range = `${Math.min(...values).toFixed(dp)}–${Math.max(...values).toFixed(dp)}`;
  const change = node.changes[active];
  return (
    <>
      <PanelHeader
        kicker={`${node.family === 'drug' ? 'Drug' : 'Ventilator'} · action`}
        title={node.label}
        sub={`${node.setting} · ${node.unit}`}
        pill="Action"
      />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Changes" value={`${node.changes.length}`} />
        <Stat label="Range" value={range} />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.12em] text-muted">
          <span className="font-mono">setting · {clock.hours} h {clock.unit}</span>
          <span className="font-mono text-accent">{change?.t}</span>
        </div>
        <DoseTrack node={node} clock={clock} active={active} />
      </div>
      <EvidenceChips
        title="Actions"
        unit={node.unit}
        items={node.changes.map((c, i) => ({
          key: `${c.t}-${i}`,
          t: c.t,
          v: `${(i === 0 ? node.start : node.changes[i - 1].to).toFixed(dp)} → ${c.to.toFixed(dp)}`,
        }))}
        active={active}
        onSelect={setActive}
      />
    </>
  );
}

function VariableEvidence({ node, scenario }: { node: VariableNode; scenario: Scenario }) {
  const edges = scenario.edges.filter((e) => e.source === node.id || e.target === node.id);
  const pointers = edges.reduce((sum, e) => sum + e.pointers, 0);
  return (
    <>
      <PanelHeader
        kicker={`${node.level === 'beat' ? 'Beat level' : 'Vital'} · variable`}
        title={node.label}
        sub={`${node.name} · ${node.tag}`}
        pill={node.level === 'beat' ? 'Beat' : 'Vital'}
      />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Relations" value={`${edges.length}`} />
        <Stat label="Pointers" value={`${pointers}`} />
      </div>
      <div className="mt-4">
        <div className="text-[0.7rem] uppercase tracking-[0.12em] text-muted">
          <span className="font-mono">signal</span>
        </div>
        <Waveform modality={node.modality} seed={node.id} segment={-1} segments={1} />
      </div>
    </>
  );
}

/**
 * The node's relations, one row per relation (tier edges merged). Rows whose
 * type the edge filter hides stay listed, dimmed and marked hidden.
 */
function RelationList({
  scenario,
  nodeId,
  enabledTypes,
}: {
  scenario: Scenario;
  nodeId: string;
  enabledTypes: Set<EdgeType>;
}) {
  const rows = useMemo(() => {
    const merged = new Map<string, { type: EdgeType; phrase: string; pointers: number }>();
    scenario.edges
      .filter((e) => e.source === nodeId || e.target === nodeId)
      .forEach((e) => {
        const key = `${e.type}:${e.phrase}`;
        const row = merged.get(key);
        if (row) row.pointers += e.pointers;
        else merged.set(key, { type: e.type, phrase: e.phrase, pointers: e.pointers });
      });
    return [...merged.values()].sort((a, b) => EDGE_ORDER.indexOf(a.type) - EDGE_ORDER.indexOf(b.type));
  }, [scenario, nodeId]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.12em] text-muted">
        <span>Relations</span>
        {rows.length > 0 && <span className="font-mono normal-case tracking-normal">pointers</span>}
      </div>
      {rows.length === 0 ? (
        <div className="mt-2 text-[0.8rem] text-muted">None in this graph.</div>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {rows.map((r) => {
            const hidden = !enabledTypes.has(r.type);
            return (
              <li
                key={`${r.type}:${r.phrase}`}
                className={`flex items-center gap-2 text-[0.8rem] transition-opacity ${hidden ? 'opacity-40' : ''}`}
              >
                <EdgeSwatch type={r.type} width={18} />
                <span
                  className="min-w-0 flex-1 truncate text-secondary"
                  title={`${EDGE_META[r.type].label}: ${r.phrase}${hidden ? ' (hidden by the edge filter)' : ''}`}
                >
                  {r.phrase}
                </span>
                {hidden && (
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-muted">hidden</span>
                )}
                <span className="font-mono text-[0.72rem] text-muted">{r.pointers}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
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

// ─────────────────────────────────────────────────── Synthesized signals

function gauss(u: number, mu: number, s: number) {
  return Math.exp(-((u - mu) ** 2) / (2 * s * s));
}

function smoothstep(x: number) {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
}

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** One cycle (beat or breath) of a modality, u in [0, 1). */
function cycleValue(modality: Modality, u: number) {
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
    case 'CO2': {
      // Capnogram: baseline, sharp upstroke, sloped plateau, sharp fall.
      const up = smoothstep((u - 0.08) / 0.07);
      const down = 1 - smoothstep((u - 0.62) / 0.06);
      return up * down * (0.85 + 0.3 * Math.max(0, u - 0.15)) * 1.7 - 0.85;
    }
    default:
      return 0;
  }
}

const CYCLES: Record<Modality, number> = { ECG: 6, ABP: 7, PPG: 7, RESP: 2.5, CO2: 4 };

function Waveform({
  modality,
  seed,
  segment,
  segments,
}: {
  modality: Modality;
  seed: string;
  /** Highlighted segment, or -1 for none. */
  segment: number;
  segments: number;
}) {
  const W = 300;
  const H = 76;
  const path = useMemo(() => {
    const n = 260;
    const rnd = hashString(seed + modality);
    const cycles = CYCLES[modality];
    const mid = H / 2;
    const amp = H * 0.34;
    let dStr = '';
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      const v =
        modality === 'RESP'
          ? 0.8 * Math.sin(2 * Math.PI * cycles * u + (rnd % 7) * 0.3)
          : cycleValue(modality, (u * cycles) % 1) + 0.04 * Math.sin(2 * Math.PI * u * 1.3 + rnd);
      dStr += `${i === 0 ? 'M' : 'L'}${(u * W).toFixed(1)} ${(mid - v * amp).toFixed(1)} `;
    }
    return dStr.trim();
  }, [modality, seed]);

  const segW = W / Math.max(segments, 1);
  const segX = segment * segW;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-subtle bg-glass">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-[76px] w-full">
        {segment >= 0 && (
          <>
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
          </>
        )}
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

/** Value in force at a clock offset (minutes from the record start). */
function valueAt(node: ActionNode, clockStart: string, minute: number) {
  let v = node.start;
  node.changes.forEach((c) => {
    if (minutesFrom(clockStart, c.t) <= minute) v = c.to;
  });
  return v;
}

/** Step plot of an action's setting across the record. */
function DoseTrack({ node, clock, active }: { node: ActionNode; clock: Scenario['clock']; active: number }) {
  const W = 300;
  const H = 76;
  const PAD_Y = 14;
  const total = clock.hours * 60;
  const values = [node.start, ...node.changes.map((c) => c.to)];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const yOf = (v: number) => (max === min ? H / 2 : H - PAD_Y - ((v - min) / (max - min)) * (H - 2 * PAD_Y));
  const xs = node.changes.map((c) => (minutesFrom(clock.start, c.t) / total) * W);
  const d = node.changes.reduce(
    (acc, c, i) => `${acc} H${xs[i].toFixed(1)} V${yOf(c.to).toFixed(1)}`,
    `M0 ${yOf(node.start).toFixed(1)}`,
  ) + ` H${W}`;
  const ax = xs[active];
  const ay = node.changes[active] ? yOf(node.changes[active].to) : H / 2;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-subtle bg-glass">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-[76px] w-full">
        <line x1={0} y1={H - PAD_Y} x2={W} y2={H - PAD_Y} stroke="var(--border-subtle)" strokeWidth={0.6} />
        {xs.map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={PAD_Y - 6}
            x2={x}
            y2={H - PAD_Y + 6}
            stroke="var(--accent)"
            strokeWidth={0.8}
            strokeOpacity={i === active ? 0.6 : 0.18}
            strokeDasharray={i === active ? undefined : '2 3'}
          />
        ))}
        <motion.path
          d={d}
          fill="none"
          stroke="var(--accent-strong)"
          strokeWidth={1.8}
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        {ax !== undefined && <circle cx={ax} cy={ay} r={3.6} fill="var(--accent)" stroke="var(--bg-base)" strokeWidth={1.2} />}
      </svg>
    </div>
  );
}

// ──────────────────────────────────────────────────────────── Timeline

/** Normalized setting per timeline bucket (0 = off). */
function doseLevels(node: ActionNode, clock: Scenario['clock']) {
  const values = [node.start, ...node.changes.map((c) => c.to)];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const bucket = (clock.hours * 60) / BUCKETS;
  return Array.from({ length: BUCKETS }, (_, i) => {
    const v = valueAt(node, clock.start, (i + 0.5) * bucket);
    if (v <= 0) return 0;
    return max === min ? 0.6 : 0.2 + 0.8 * ((v - min) / (max - min));
  });
}

function clockLabel(start: string, minute: number) {
  const [h, m] = start.split(':').map(Number);
  const total = (h * 60 + m + Math.round(minute)) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

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
  const rows = scenario.nodes.filter((n): n is ConceptNode | ActionNode => n.kind !== 'variable');
  const hasActions = rows.some((n) => n.kind === 'action');
  const bucket = (scenario.clock.hours * 60) / BUCKETS;
  // A concept read from two signals (e.g. tachycardia on ECG and on PPG)
  // shows its source too, or its rows would read the same.
  const twoSources = new Set(
    rows
      .filter((n) => rows.some((m) => m.kind === 'concept' && m.label === n.label && m.tag !== n.tag))
      .map((n) => n.id),
  );

  return (
    <div className="border-t border-subtle px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex items-center justify-between text-[0.72rem] uppercase tracking-[0.14em] text-muted">
        <span className="font-mono">timeline · {hasActions ? 'episodes & settings' : 'episodes'}</span>
        <span className="font-mono">
          {scenario.clock.hours}h {scenario.clock.unit}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        {rows.map((n) => {
          const sel = selectedNode === n.id;
          const cells = n.kind === 'concept' ? n.density : doseLevels(n, scenario.clock);
          const tint = n.kind === 'action' ? 'var(--accent-strong)' : 'var(--accent)';
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => onSelectNode(n.id)}
              className="flex w-full items-center gap-3 rounded-lg px-1.5 py-1 text-left transition"
              style={{ background: sel ? 'var(--accent-soft)' : 'transparent' }}
            >
              {/* Wide enough for the longest row ("Tachycardia PPG E") at
                  every width, so concept names are not cut off. */}
              <span
                className="flex w-[8.5rem] shrink-0 items-center gap-1.5 font-mono text-[0.72rem] sm:w-40"
                style={{ color: sel ? 'var(--accent)' : 'var(--text-secondary)' }}
                title={n.kind === 'concept' ? `${n.label} · ${n.tag} · ${TIER_META[n.tier].label}` : n.label}
              >
                <span
                  aria-hidden
                  className={`inline-block h-2 w-2 shrink-0 ${n.kind === 'action' ? 'rounded-[2px]' : 'rounded-full'}`}
                  style={{ background: tint }}
                />
                <span className="truncate">{n.label}</span>
                {n.kind === 'concept' && (
                  <span className="shrink-0 text-muted">
                    {twoSources.has(n.id) ? `${n.tag} ` : ''}
                    {TIER_META[n.tier].short}
                  </span>
                )}
              </span>
              <span className="flex flex-1 gap-[2px]">
                {cells.map((dv, i) => (
                  <span
                    key={i}
                    className="h-4 flex-1 rounded-[2px]"
                    style={{
                      background:
                        dv <= 0
                          ? 'var(--border-subtle)'
                          : `color-mix(in oklab, ${tint} ${Math.round(15 + dv * 85)}%, transparent)`,
                    }}
                    title={clockLabel(scenario.clock.start, i * bucket)}
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
    <div className="flex items-center justify-between gap-3 border-t border-subtle px-4 py-2 sm:px-6 sm:py-4">
      <button
        type="button"
        onClick={onReset}
        disabled={state === 'idle'}
        aria-label="Reset graph"
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-subtle bg-glass px-3 text-[0.8rem] text-secondary transition enabled:hover:border-strong enabled:hover:text-primary disabled:opacity-40 sm:h-9"
      >
        <RotateCcw size={13} />
        Reset
      </button>
      <a
        href="/contact"
        className="btn-primary group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[0.86rem] font-semibold transition will-change-transform hover:-translate-y-0.5"
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
