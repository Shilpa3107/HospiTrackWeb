# HospiTrack - Hospital Bed Availability Tracker

A mobile-friendly web application that helps users find nearby hospitals with available beds and navigate to them.

## Features

- Location-based hospital search
- Real-time bed availability tracking
- Facility information for each hospital
- Bed booking functionality
- Navigation with different transport options
- Interactive maps using Leaflet

## Tech Stack

- React for the frontend UI
- Firebase Firestore for the database
- Leaflet for maps and navigation
- React Router for routing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Firebase account
- Firebase CLI

### Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/Shilpa3107/HospiTrackWeb.git
   cd hospitrack
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Set up Firebase:
   - Create a Firebase project in the Firebase Console
   - Enable Firestore database
   - Add your Firebase configuration to `src/firebase.js`

4. Seed the database with sample data:
   \`\`\`
   node src/scripts/seedDatabase.js
   \`\`\`

5. Start the development server:
   \`\`\`
   npm start
   \`\`\`

## Usage

1. Open the application in your browser
2. Grant location access when prompted
3. Browse nearby hospitals with available beds
4. Book a bed or navigate to a hospital

## Deployment

 Build the application:
   \`\`\`
   npm run build
   \`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
