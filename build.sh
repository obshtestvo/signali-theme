#!/usr/bin/env bash
THEME_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
(cd "$THEME_DIR" && webpack)