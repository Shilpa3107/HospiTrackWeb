export class Hospital {
  constructor(id, name, address, location, beds, facilities, contact, type = "General", landmark = "", adminId = null) {
    this.id = id
    this.name = name
    this.address = address
    this.location = location
    this.beds = beds
    this.facilities = facilities
    this.contact = contact
    this.type = type
    this.landmark = landmark
    this.adminId = adminId
  }

  getTotalAvailableBeds() {
    return Object.values(this.beds).reduce((total, count) => total + count, 0)
  }

  hasFacility(facility) {
    return this.facilities.includes(facility)
  }

  getDistance(userLat, userLng) {
    if (!this.location) return Number.POSITIVE_INFINITY

    const R = 6371 // Radius of the earth in km
    const dLat = this.deg2rad(userLat - this.location.latitude)
    const dLon = this.deg2rad(userLng - this.location.longitude)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(this.location.latitude)) *
        Math.cos(this.deg2rad(userLat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }
}
