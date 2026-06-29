#!/usr/bin/env python3
"""
Synthesized score for the ShifaMind launch film (56s cut, 30fps).

Minimal dark-tech sound design, generated from scratch (royalty-free by
construction): a sub drone bed, a soft 100bpm pulse, boundary impacts on
each segment start, risers into the Reveal and Benchmark beats, a UI click
on the Demo's Predict press, ticks as concepts fill, and a resolve chime
on the final code. Everything decays to silence before the last frame.

Segment starts (s): hook 0 / stakes 3.5 / gap 9.5 / reveal 14 / glassbox 18.5
/ architecture 24 / demo 30.5 / benchmark 40.5 / deployment 47 / closing 51.5
/ end 56. Demo-internal events (segment start 30.5s, 30fps): click f56,
concepts f118+, code f172.

Usage: python3 remotion/make-audio.py out/score.wav
"""
import sys
import wave

import numpy as np

SR = 48000
DUR = 56.0
N = int(SR * DUR)
t = np.arange(N) / SR

BOUNDARIES = [0.0, 3.5, 9.5, 14.0, 18.5, 24.0, 30.5, 40.5, 47.0, 51.5]
REVEAL, BENCHMARK, CLOSING = 14.0, 40.5, 51.5
DEMO = 30.5
CLICK_T = DEMO + 56 / 30
CONCEPT_TS = [DEMO + (118 + i * 12) / 30 for i in range(3)]
CODE_T = DEMO + 172 / 30

rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)


def add(sig, at, l=1.0, r=1.0):
    i = int(at * SR)
    n = min(len(sig), N - i)
    if n <= 0:
        return
    L[i : i + n] += sig[:n] * l
    R[i : i + n] += sig[:n] * r


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def lowpass(x, freq):
    a = 1.0 - np.exp(-2 * np.pi * freq / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):  # one-pole; fine at these lengths
        acc += a * (x[i] - acc)
        y[i] = acc
    return y


# ---- drone bed: root + fifth, slow breathing, swells on the big beats ----
breath = 0.82 + 0.18 * np.sin(2 * np.pi * 0.07 * t + 1.2)
drone = (
    0.50 * np.sin(2 * np.pi * 55.0 * t)
    + 0.28 * np.sin(2 * np.pi * 82.41 * t + 0.5)
    + 0.16 * np.sin(2 * np.pi * 110.0 * t + 1.1)
    + 0.10 * np.sin(2 * np.pi * 55.4 * t)  # slow beat-frequency shimmer
) * breath
level = np.interp(
    t,
    [0, 1.5, REVEAL - 0.1, REVEAL + 1.2, 30, BENCHMARK - 0.1, BENCHMARK + 1.2, 50, 53.5, 55.6, DUR],
    [0, 0.5, 0.55, 0.78, 0.6, 0.62, 0.8, 0.62, 0.5, 0.0, 0.0],
)
add(drone * level * 0.30, 0)

# ---- air: filtered noise pad, decorrelated stereo ----
airL = lowpass(rng.standard_normal(N), 500) * level * 0.045
airR = lowpass(rng.standard_normal(N), 500) * level * 0.045
L += airL
R += airR

# ---- pulse: soft kick at 100bpm, accent every 4th ----
beat = 0.6
kick_n = int(0.30 * SR)
kt = np.arange(kick_n) / SR
kick_pitch = 95 * np.exp(-kt / 0.045) + 42
kick = np.sin(2 * np.pi * np.cumsum(kick_pitch) / SR) * env_exp(kick_n, 0.10)
b = 3.5
i = 0
while b < CLOSING:
    amp = 0.16 if i % 4 == 0 else 0.09
    if DEMO <= b < 47.0:
        amp *= 1.25  # lean in under demo + benchmark
    add(kick * amp, b)
    b += beat
    i += 1

# ---- boundary impacts ----
boom_n = int(1.1 * SR)
bt = np.arange(boom_n) / SR
boom = np.sin(2 * np.pi * (50 * np.exp(-bt / 0.09) + 36) * bt) * env_exp(boom_n, 0.32)
thud = lowpass(rng.standard_normal(int(0.08 * SR)), 1800) * env_exp(int(0.08 * SR), 0.02)
for s in BOUNDARIES[1:]:
    big = 1.55 if s in (REVEAL, BENCHMARK) else 1.0
    add(boom * 0.30 * big, s)
    add(thud * 0.10 * big, s)

# ---- risers into reveal + benchmark ----
def riser(start, end):
    n = int((end - start) * SR)
    x = rng.standard_normal(n)
    f = np.linspace(250, 2600, n)
    a = 1.0 - np.exp(-2 * np.pi * f / SR)
    y = np.empty(n)
    acc = 0.0
    for j in range(n):
        acc += a[j] * (x[j] - acc)
        y[j] = acc
    swell = np.linspace(0, 1, n) ** 2.2
    add(y * swell * 0.14, start, l=0.9, r=1.1)

riser(REVEAL - 1.8, REVEAL)
riser(BENCHMARK - 1.8, BENCHMARK)

# ---- demo UI: click, concept ticks, code chime ----
def ping(freq, dur, amp, at, pan=0.0):
    n = int(dur * SR)
    pt = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * pt) * env_exp(n, dur / 4) * amp
    add(s, at, l=1 - max(pan, 0) * 0.6, r=1 + min(pan, 0) * 0.6)

click_n = int(0.04 * SR)
click = lowpass(rng.standard_normal(click_n), 3500) * env_exp(click_n, 0.008)
add(click * 0.35, CLICK_T)
ping(620, 0.12, 0.12, CLICK_T + 0.01)
for k, ct in enumerate(CONCEPT_TS):
    ping(1100 + k * 140, 0.22, 0.085, ct, pan=0.3)
ping(440, 0.9, 0.14, CODE_T)
ping(659.25, 1.1, 0.12, CODE_T + 0.12)

# ---- closing resolve ----
res_n = int(4.0 * SR)
rt = np.arange(res_n) / SR
resolve = (
    np.sin(2 * np.pi * 110 * rt) * 0.5
    + np.sin(2 * np.pi * 164.81 * rt) * 0.35
    + np.sin(2 * np.pi * 220 * rt) * 0.2
) * np.minimum(rt / 0.8, 1) * np.exp(-np.maximum(rt - 1.2, 0) / 1.1)
add(resolve * 0.16, CLOSING + 0.2)

# ---- master: fade out, soft clip, normalize ----
master_fade = np.interp(t, [0, 0.4, 55.2, 55.9, DUR], [0, 1, 1, 0, 0])
L *= master_fade
R *= master_fade
mix = np.stack([L, R], axis=1)
mix = np.tanh(mix * 1.4) / 1.4
mix *= 0.70 / max(np.max(np.abs(mix)), 1e-9)

out = sys.argv[1] if len(sys.argv) > 1 else "out/score.wav"
pcm = (mix * 32767).astype(np.int16)
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"Wrote {out} ({DUR}s @ {SR}Hz)")
