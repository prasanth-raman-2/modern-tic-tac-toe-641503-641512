#!/bin/bash
cd /tmp/kavia/workspace/code-generation/modern-tic-tac-toe-641503-641512/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

