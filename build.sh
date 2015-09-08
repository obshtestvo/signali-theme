#!/usr/bin/env bash
export PRODUCTION=1
THEME_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
(cd "$THEME_DIR" && webpack)