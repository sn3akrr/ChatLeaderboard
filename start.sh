#!/bin/bash

LOOPS=0

trap ":" SIGINT
while true; do
	if [ ${LOOPS} -gt 0 ]; then
		echo "Restarted $LOOPS times"
	fi
	((LOOPS++))
	sleep 5
	node index.js
done