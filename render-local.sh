#!/bin/bash
# Local render + upload. Called from the Creative editor via localhost proxy.
# Usage: ./render-local.sh '{"segments":[...]}'

set -e
cd /tmp/app-preview-builder

JSON="$1"
INPUTS=""
FILTERS=""
CONCAT=""
IDX=0
SEG_IDX=0

# Parse segments from JSON
for row in $(echo "$JSON" | python3 -c "
import sys,json
segs = json.load(sys.stdin)['segments']
for i,s in enumerate(segs):
    src = s.get('src','')
    dur = s.get('duration',2)
    typ = s.get('type','')
    sid = s.get('id','')
    print(f'{sid}|{src}|{dur}|{typ}')
"); do
    IFS='|' read -r SID SRC DUR TYP <<< "$row"
    if [ "$SID" = "flash" ]; then
        INPUTS="$INPUTS -f lavfi -i color=white:s=886x1920:d=${DUR},format=yuv420p"
        FILTERS="${FILTERS}[${IDX}:v]setpts=PTS-STARTPTS[v${SEG_IDX}]; "
        CONCAT="${CONCAT}[v${SEG_IDX}]"
        IDX=$((IDX+1))
    elif [ -n "$SRC" ]; then
        INPUTS="$INPUTS -i public/${SRC#hooks/}"
        PAD="black"
        [ "$TYP" = "demo" ] && PAD="white"
        FILTERS="${FILTERS}[${IDX}:v]trim=0:${DUR},setpts=PTS-STARTPTS,scale=886:1920,setsar=1[v${SEG_IDX}]; "
        CONCAT="${CONCAT}[v${SEG_IDX}]"
        IDX=$((IDX+1))
    fi
    SEG_IDX=$((SEG_IDX+1))
done

N=$(echo "$CONCAT" | grep -o '\[' | wc -l)
FILTER_COMPLEX="${FILTERS}${CONCAT}concat=n=${N}:v=1:a=0[out]"

echo "Rendering $N segments..."
ffmpeg -y $INPUTS -filter_complex "$FILTER_COMPLEX" -map "[out]" -c:v libx264 -preset ultrafast -crf 23 -r 30 out/creative-final.mp4

echo "Uploading..."
curl -T out/creative-final.mp4 ftp://138.68.62.199/cost-estimator-demo/hooks/creative-ceiling-leak-final.mp4 --user deploy:111345 -s

echo "Done!"
