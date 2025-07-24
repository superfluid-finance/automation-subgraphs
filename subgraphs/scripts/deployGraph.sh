#!/usr/bin/env bash
set -euo pipefail
set -x

# shellcheck disable=SC2207
GRAPH_CLI="npx --package=@graphprotocol/graph-cli@0.78.0 --yes -- graph"

# Required inputs
NETWORK=""
DEPLOY_DIR=""
DEPLOY_KEY="${DEPLOY_KEY:-}"

print_usage_and_exit() {
  echo "Usage: $0 -n <network> -d <deploy_dir>"
  echo ""
  echo "  -n, --network         Network name (e.g. optimism-sepolia)"
  echo "  -d, --dir             Subgraph scheduler directory (e.g. vesting-scheduler)"
  echo ""
  echo "Example:"
  echo "  DEPLOY_KEY=xyz ./deploy-subgraph.sh -n optimism-sepolia -d vesting-scheduler"
  exit 1
}

# Parse CLI args
while [[ $# -gt 0 ]]; do
  case "$1" in
    -n|--network)
      NETWORK="$2"
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
if [[ -z "$NETWORK" || -z "$DEPLOY_DIR" ]]; then
  echo "❌ Missing required argument(s)."
  print_usage_and_exit
fi

# Validate directory
if [[ ! -d "$DEPLOY_DIR" ]]; then
  echo "❌ Directory not found: $DEPLOY_DIR"
  exit 1
fi

# Get version from package.json
if [[ -f "$DEPLOY_DIR/package.json" ]]; then
  VERSION_LABEL=$(jq -r .version "$DEPLOY_DIR/package.json")
  if [[ -z "$VERSION_LABEL" || "$VERSION_LABEL" == "null" ]]; then
    echo "❌ Version not found in $DEPLOY_DIR/package.json"
    exit 1
  fi
else
  echo "❌ package.json not found in $DEPLOY_DIR"
  exit 1
fi

# Extract scheduler name from folder (e.g. "vesting-scheduler" → "vesting")
SCHEDULER=$(basename "$DEPLOY_DIR" | sed 's/-scheduler$//')

# Build deploy target, removing '-mainnet' if present in network
DEPLOY_TARGET="superfluid-${SCHEDULER}-${NETWORK/-mainnet/}"

echo "📦 Scheduler:        $SCHEDULER"
echo "🌐 Network:          $NETWORK"
echo "🎯 Deploy Target:    $DEPLOY_TARGET"
echo "🏷  Version Label:    $VERSION_LABEL"

# Change to working directory
cd "$DEPLOY_DIR"

# Step 1: Install dependencies
pnpm install || { echo "❌ Dependency installation failed"; exit 1; }

# Step 2: Generate YAML
pnpm gen:yaml || { echo "❌ Subgraph YAML generation failed"; exit 1; }

# Step 3: Generate types
pnpm gen:types || { echo "❌ Subgraph Types generation failed"; exit 1; }

# Step 4: Rename
mv "$NETWORK.subgraph.yaml" subgraph.yaml

# Step 5: Deploy
$GRAPH_CLI deploy --studio "$DEPLOY_TARGET" \
  --deploy-key "$DEPLOY_KEY" \
  --version-label "$VERSION_LABEL"

echo "✅ Deployment complete: $DEPLOY_TARGET@$VERSION_LABEL"

rm subgraph.yaml

set +x
