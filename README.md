#  HospiTrack – Hospital Bed Availability Tracker

**HospiTrack** is a mobile-responsive web application that enables users to find nearby hospitals with available beds and navigate to them using an interactive map.

---

##  Features

- **Location-based Hospital Search**  
  Detects the user's current location and shows nearby hospitals on the map.

- **Real-time Bed Availability**  
  View the availability of general, oxygen, and ICU beds updated in real-time.

- **Hospital Facility Details**  
  Each hospital displays contact info, address, and available facilities.

- **Bed Booking Functionality**  
  Users can fill in details and book beds directly through the app interface.

- **Navigation Support**  
  Provides navigation to selected hospitals using Leaflet with multiple transport modes.

- **Interactive Maps with Leaflet**  
  All location-based functionality is built using the Leaflet library.

---

## Tech Stack

| Technology        | Description                               |
|------------------|-------------------------------------------|
| **React**        | Frontend library for building UI          |
| **Firebase**     | Realtime database for storing hospital data |
| **Leaflet**      | Maps and location tracking                |
| **React Router** | Handles routing between pages             |

---

## 🧑‍💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 14 or higher)
- A [Firebase account](https://firebase.google.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli)

---

###  Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Shilpa3107/HospiTrackWeb.git
   cd HospiTrackWeb
   ```
2. **Install Dependencies**
   ```bash
     npm install
   ```
3. **Set Up Firebase**
   - Go to Firebase Console
   - Create a new Firebase project
   -  Enable Firestore Database
   - Copy your Firebase config and replace it in src/firebase.js:
  ```bash
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
```
4. **Start Development Server**
```bash
npm start
```
Visit the site in your browser at:  ***http://localhost:3000***

###  How to Use
- Open the app in a browser
- Allow location access when prompted
- View hospitals near your current location
- Check available beds (General, ICU, Oxygen)
- Click on a hospital to see detailed info
- Use the Book Bed button to make a reservation
- Use the Navigation option to get directions to the hospital

### Project Structure
```plaintext
HospiTrackWeb/
├── public/
│   └── index.html
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/              # Main page components (Home, HospitalDetails, etc.)
│   ├── scripts/            # Script to seed Firebase
│   ├── firebase.js         # Firebase config
│   ├── App.js              # Main application component
│   └── index.js            # React entry point
└── package.json
```

### License
This project is licensed under the MIT License.
See the LICENSE file for more details.

### Acknowledgments
- Leaflet.js for powerful open-source mapping
- Firebase for real-time database support
- React for the modern component-based frontend

### Future Improvements
- Admin panel for hospital staff to update bed availability
- SMS/Email notifications for booking confirmations
- Filters for hospitals based on services (ICU, Oxygen, Ventilators, etc.)
- Responsive mobile-first design improvements





