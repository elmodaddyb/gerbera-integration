#!/bin/bash
# wait-for-grid.sh

set -e

cmd="$@"

HUB_URL=http://$HUB_HOST:$HUB_PORT/wd/hub/status

while ! curl -sSL "$HUB_URL" 2>&1 \
        | jq -r '.value.ready' 2>&1 | grep "true" >/dev/null; do
    echo "Waiting for the Grid: $HUB_URL"
    sleep 1
done

>&2 echo "Selenium Grid is up - executing tests"
exec $cmd