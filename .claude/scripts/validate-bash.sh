#!/bin/bash

# Read JSON input from stdin
INPUT=$(cat)

# Extract the command from JSON - correct path
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# If no command found, allow it
if [ -z "$COMMAND" ]; then
  exit 0
fi

# Define forbidden patterns
FORBIDDEN_PATTERNS=(
  "node_modules"
  "frontend/node_modules"
  "\.env"
  "build/"
  "dist/"
  "__pycache__"
  "\.git/"
  "venv/"
  "\.pyc$"
  "\.csv$"
  "\.log$"

  # Next.js/React
  "\.next/"
  "\.turbo/"
  "coverage/"
  "\.eslintcache"
  "\.node-gyp/"
  "\.pnpm-store/"
  "\.yarn/cache/"

  # Node.js
  "\.cache/"
  "tmp/"
  "temp/"
  "\.env\.local"
  "\.env\.production\.local"
  "\.env\.development\.local"

  # Flutter-specific
  "\.dart_tool/"
  "\.flutter-plugins"
  "\.flutter-plugins-dependencies"
  "\.packages$"
  "\.metadata$"
  "pubspec\.lock"
  "ios/Pods/"
  "ios/Podfile\.lock"
  "android/\.gradle/"
  "android/app/build/"
  "android/app/outputs/"
  "android/local\.properties"
  "\.keystore$"
  "\.jks$"
  "key\.properties"
  "google-services\.json"
  "GoogleService-Info\.plist"
  "DerivedData/"
)


# Check if command contains any forbidden patterns
for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "ERROR: Access to '$pattern' is blocked by security policy" >&2
    exit 2  # Exit code 2 = blocking error
  fi
done

# Command is clean, allow it
exit 0