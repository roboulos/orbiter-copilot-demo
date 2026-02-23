#!/bin/bash

# Script to create a demonstration video from screenshots
# Simple version without text overlays

set -e

OUTPUT_DIR="/Users/robertboulos/.openclaw/workspace/projects/orbiter-copilot-demo/demo-screenshots"
cd "$OUTPUT_DIR"

echo "Creating video from screenshots..."

# Create input file list for concatenation
cat > concat-list.txt << EOF
file '01-homepage.png'
duration 3
file '02-calendar-settings-modal.png'
duration 3
file '03-email-entered.png'
duration 3
file '04-calendar-connected.png'
duration 3
file '05-calendar-events.png'
duration 4
EOF

# Create video from images with smooth frame rate
ffmpeg -y -f concat -safe 0 -i concat-list.txt \
  -vf "fps=30,format=yuv420p,scale=1920:-2" \
  -c:v libx264 -preset medium -crf 23 \
  -movflags +faststart \
  ../calendar-connection-demo.mp4

echo ""
echo "✅ Video created successfully!"
echo "📁 Location: /Users/robertboulos/.openclaw/workspace/projects/orbiter-copilot-demo/calendar-connection-demo.mp4"
echo "⏱️  Duration: ~16 seconds (5 steps)"
echo ""

# Cleanup
rm -f concat-list.txt

ls -lh ../calendar-connection-demo.mp4
