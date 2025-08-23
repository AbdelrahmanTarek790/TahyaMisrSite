#!/bin/bash

echo "Testing Flutter mobile app compilation..."

echo "1. Checking if Flutter is available..."
if command -v flutter &> /dev/null; then
    echo "✓ Flutter is available"
    flutter --version
else
    echo "✗ Flutter is not installed. Please install Flutter first."
    echo "Install Flutter from: https://flutter.dev/docs/get-started/install"
    exit 1
fi

echo ""
echo "2. Getting Flutter dependencies..."
flutter pub get

echo ""
echo "3. Generating localization files..."
flutter gen-l10n

echo ""
echo "4. Running code analysis..."
flutter analyze

echo ""
echo "5. Checking for formatting issues..."
flutter format --set-exit-if-changed --line-length 120 lib/

echo ""
echo "6. Building the app (dry run)..."
flutter build apk --dry-run

echo ""
echo "Testing completed! Check above for any errors."