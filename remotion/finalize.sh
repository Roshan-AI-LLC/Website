#!/bin/bash
# Render both cuts (silent — score them yourself in CapCut).
# Run from the repo root:  bash remotion/finalize.sh
set -e
node remotion/render.mjs Full  out/trace.mp4
node remotion/render.mjs Glass out/glass.mp4
echo "Done -> out/trace.mp4 (TRACE) + out/glass.mp4 (GLASS)"
