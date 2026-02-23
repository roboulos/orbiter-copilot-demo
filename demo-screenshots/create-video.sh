#!/bin/bash

# Script to create a demonstration video from screenshots
# with text overlays and smooth transitions

set -e

OUTPUT_DIR="/Users/robertboulos/.openclaw/workspace/projects/orbiter-copilot-demo/demo-screenshots"
cd "$OUTPUT_DIR"

# Create text overlays for each step
echo "Creating annotated frames..."

# Frame 1: Homepage
ffmpeg -y -i 01-homepage.png -vf \
"drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text='Step 1\: Visit the Orbiter Copilot Demo':fontsize=48:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=10:x=(w-text_w)/2:y=50" \
-frames:v 1 annotated-01.png

# Frame 2: Calendar Settings Modal
ffmpeg -y -i 02-calendar-settings-modal.png -vf \
"drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text='Step 2\: Click Calendar Settings Button':fontsize=48:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=10:x=(w-text_w)/2:y=50" \
-frames:v 1 annotated-02.png

# Frame 3: Email Entered
ffmpeg -y -i 03-email-entered.png -vf \
"drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text='Step 3\: Enter Your Email Address':fontsize=48:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=10:x=(w-text_w)/2:y=50" \
-frames:v 1 annotated-03.png

# Frame 4: Calendar Connected
ffmpeg -y -i 04-calendar-connected.png -vf \
"drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text='Step 4\: Click Connect Google Calendar':fontsize=48:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=10:x=(w-text_w)/2:y=50" \
-frames:v 1 annotated-04.png

# Frame 5: Calendar Events
ffmpeg -y -i 05-calendar-events.png -vf \
"drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text='Step 5\: View Your Upcoming Meetings':fontsize=48:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=10:x=(w-text_w)/2:y=50" \
-frames:v 1 annotated-05.png

echo "Creating video with transitions..."

# Create input file list for concatenation
cat > concat-list.txt << EOF
file 'annotated-01.png'
duration 3
file 'annotated-02.png'
duration 3
file 'annotated-03.png'
duration 3
file 'annotated-04.png'
duration 3
file 'annotated-05.png'
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
echo "⏱️  Duration: ~16 seconds (5 steps x 3-4 seconds each)"
echo ""

# Cleanup
rm -f annotated-*.png concat-list.txt

ls -lh ../calendar-connection-demo.mp4
