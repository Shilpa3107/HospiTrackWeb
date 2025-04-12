import { db } from "../firebase"
import { collection, addDoc } from "firebase/firestore"

// Sample hospital data
const hospitals = [
  {
    name: "City General Hospital",
    address: "123 Main Street, City Center",
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    beds: {
      emergency: 5,
      icu: 3,
      delivery: 2,
      general: 10,
      pediatric: 4,
    },
    facilities: ["ICU", "Emergency", "Surgery", "Radiology", "Pediatrics"],
    contact: {
      phone: "555-123-4567",
      email: "info@citygeneral.com",
    },
  },
  {
    name: "Riverside Medical Center",
    address: "456 River Road, Riverside",
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
    },
    beds: {
      emergency: 3,
      icu: 2,
      delivery: 4,
      general: 8,
      pediatric: 3,
    },
    facilities: ["Birth Center", "Dialysis", "Cardiology", "Neurology"],
    contact: {
      phone: "555-987-6543",
      email: "contact@riversidemedical.com",
    },
  },
  {
    name: "Hillside Community Hospital",
    address: "789 Hill Avenue, Hillside",
    location: {
      latitude: 37.7694,
      longitude: -122.4862,
    },
    beds: {
      emergency: 2,
      icu: 1,
      delivery: 1,
      general: 15,
      pediatric: 2,
    },
    facilities: ["Emergency", "Orthopedics", "Physical Therapy", "Geriatrics"],
    contact: {
      phone: "555-456-7890",
      email: "info@hillsidehospital.com",
    },
  },
  {
    name: "Eastside Health Center",
    address: "321 East Boulevard, Eastside",
    location: {
      latitude: 37.7909,
      longitude: -122.4,
    },
    beds: {
      emergency: 4,
      icu: 2,
      delivery: 3,
      general: 12,
      pediatric: 5,
    },
    facilities: ["ICU", "Maternity", "Oncology", "Psychiatry"],
    contact: {
      phone: "555-789-0123",
      email: "contact@eastsidehealth.com",
    },
  },
  {
    name: "North County Medical",
    address: "654 North Road, North County",
    location: {
      latitude: 37.8044,
      longitude: -122.4411,
    },
    beds: {
      emergency: 6,
      icu: 4,
      delivery: 2,
      general: 20,
      pediatric: 6,
    },
    facilities: ["Trauma Center", "Burn Unit", "Cardiology", "Neurosurgery"],
    contact: {
      phone: "555-234-5678",
      email: "info@northcountymed.com",
    },
  },
]

// Function to seed the database
async function seedDatabase() {
  try {
    const hospitalsCollection = collection(db, "hospitals")

    for (const hospital of hospitals) {
      await addDoc(hospitalsCollection, hospital)
      console.log(`Added hospital: ${hospital.name}`)
    }

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

// Run the seeding function
seedDatabase()
