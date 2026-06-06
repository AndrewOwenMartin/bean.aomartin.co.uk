#!/bin/bash
if [ $# -gt 0 ]; then
  exec npx jest "$@"
else
  exec npm test
fi
