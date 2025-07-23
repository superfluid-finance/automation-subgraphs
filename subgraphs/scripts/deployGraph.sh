#!/usr/bin/env bash
set -euo pipefail
set -x

# Required inputs
NETWORK=""
VERSION_LABEL=""
DEPLOY_DIR=""
DEPLOY_KEY="${DEPLOY_KEY:-}"

print_usage_and_exit() {
  echo "Usage: $0 -n <network> -v <version_label> -d <deploy_dir>"
  echo ""
  echo "  -n, --network         Network name (e.g. optimism-sepolia)"
  echo "  -v, --version-label   Version label (e.g. 1.0.4)"
  echo "  -d, --dir             Subgraph scheduler directory (e.g. vesting-scheduler)"
  echo ""
  echo "Example:"
  echo "  DEPLOY_KEY=xyz ./deploy-subgraph.sh -n optimism-sepolia -v 1.0.4 -d vesting-scheduler"
  exit 1
}

# Parse CLI args
while [[ $# -gt 0 ]]; do
  case "$1" in
    -n|--network)
      NETWORK="$2"
      shift 2
      ;;
    -v|--version-label)
      VERSION_LABEL="$2"
      shift 2
      ;;
    -d|--dir)
      DEPLOY_DIR="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      print_usage_and_exit
      ;;
  esac
done

# Validate inputs
if [[ -z "$NETWORK" || -z "$VERSION_LABEL" || -z "$DEPLOY_DIR" ]]; then
  echo "❌ Missing required argument(s)."
  print_usage_and_exit
fi

# Validate directory
if [[ ! -d "$DEPLOY_DIR" ]]; then
  echo "❌ Directory not found: $DEPLOY_DIR"
  exit 1
fi

# Extract scheduler name from folder (e.g. "vesting-scheduler" → "vesting")
SCHEDULER=$(basename "$DEPLOY_DIR" | sed 's/-scheduler$//')
DEPLOY_TARGET="superfluid-${SCHEDULER}-${NETWORK}"

echo "📦 Scheduler:        $SCHEDULER"
echo "🌐 Network:          $NETWORK"
echo "🎯 Deploy Target:    $DEPLOY_TARGET"
echo "🏷  Version Label:    $VERSION_LABEL"

# Change to working directory
cd "$DEPLOY_DIR"

# Step 1: Install dependencies
pnpm install || { echo "❌ Dependency installation failed"; exit 1; }

# Step 2: Generate YAML
pnpm gen:yaml "$NETWORK" || { echo "❌ Subgraph YAML generation failed"; exit 1; }

# Step 3: Generate code
graph codegen "$NETWORK.subgraph.yaml" || { echo "❌ Codegen failed"; exit 1; }

# Step 4: Rename
mv "$NETWORK.subgraph.yaml" subgraph.yaml

# Step 5: Deploy
graph deploy --studio "$DEPLOY_TARGET" \
  --deploy-key "$DEPLOY_KEY" \
  --version-label "$VERSION_LABEL" || { echo "❌ Deployment failed"; exit 1; }

echo "✅ Deployment complete: $DEPLOY_TARGET@$VERSION_LABEL"

set +x
