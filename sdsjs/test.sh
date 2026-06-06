#!/bin/bash
# Ensures node is on PATH via nvm before running tests, for environments where
# .bashrc is not sourced (e.g. Claude Code's Bash tool, CI without login shell).
[ -s /usr/share/nvm/init-nvm.sh ] && . /usr/share/nvm/init-nvm.sh
if [ $# -gt 0 ]; then
  exec npx jest "$@"
else
  exec npm test
fi
