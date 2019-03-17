#!/bin/bash
# wait-for-grid.sh
# Purpose: The selenium grid takes a few seconds to become available
# always wait for the grid before launching the test suite for the UI

set -e
HUB_URL=http://$HUB_HOST:$HUB_PORT/wd/hub/status

## hydrate CMD from Dockerfile with ENV
cmd="$@"
cmd=${cmd/\$UI_TEST_CMD/$UI_TEST_CMD}
echo "Command to RUN -----> $cmd"

## wait for grid
while ! curl -sSL "$HUB_URL" 2>&1 \
        | jq -r '.value.ready' 2>&1 | grep "true" >/dev/null; do
    echo "Waiting for the Grid: $HUB_URL"
    sleep 1
done
>&2 echo "Selenium Grid is up - executing tests"

## execute the CMD from Dockerfile
exec $cmd
