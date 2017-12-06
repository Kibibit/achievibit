#!/bin/bash

# Exit as soon as the script fails
set -ex

happo_run() {
  echo "Checking out $1"

  git checkout --quiet "$1"

  npm install
  # npm run build

  # Run Happo for the current commit. We use `xvfb-run` so that we can run
  # Happo (which uses Firefox) in a headless display environment.
  xvfb-run -a happo run
}

echo "Running Happo on current PR commit"
happo_run "master"
