#!/bin/bash

echo "Regenerating Flutter localization files..."

# Clean previous generated files
rm -rf lib/gen_l10n

# Generate new localization files
flutter gen-l10n

echo "Localization files regenerated successfully!"
echo "Generated files:"
ls -la lib/gen_l10n/

echo ""
echo "To use this script:"
echo "1. Make sure Flutter is installed and in PATH"
echo "2. Run: chmod +x regenerate_l10n.sh"
echo "3. Run: ./regenerate_l10n.sh"