# NOVED Labels Mobile App

This directory contains the React Native mobile application for NOVED Labels.

## Setup Instructions

1. Install React Native CLI and dependencies
   ```bash
   npm install -g react-native-cli
   ```

2. Initialize a new React Native project
   ```bash
   npx react-native init NOVEDLabelsApp
   ```

3. Install essential dependencies
   ```bash
   cd NOVEDLabelsApp
   npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context
   npm install @react-native-async-storage/async-storage @supabase/supabase-js
   npm install react-native-dotenv
   ```

## Key Features

- Mobile label creation and management
- Barcode scanning for easy package lookup
- Offline support for creating labels without internet
- Push notifications for shipping updates
- Secure authentication with Supabase
- QR code generation and scanning

## API Integration

The mobile app will connect to the same Supabase backend as the web application. The shared API layer ensures consistency between platforms.

## Development Roadmap

1. Phase 1: Core Authentication and Label Creation
   - User login/signup
   - Basic label creation
   - View shipping history

2. Phase 2: Enhanced Features
   - Offline support
   - Barcode scanning
   - Push notifications

3. Phase 3: Advanced Features
   - Camera integration for package photos
   - Real-time tracking
   - In-app payments

## Design Guidelines

The mobile app follows the same design system as the web application, with adaptations for mobile interfaces. Key UI components include:

- Dark mode support
- Native iOS and Android components
- Consistent color scheme with web app
- Optimized for one-handed operation

## Contribution Guidelines

- Follow the React Native style guide
- Write unit tests for all components
- Ensure proper error handling for offline scenarios
- Document any environment-specific setup requirements 