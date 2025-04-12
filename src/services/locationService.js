export const LocationService = {
  // Get current position
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"))
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          },
          (error) => {
            reject(error)
          },
          { enableHighAccuracy: true },
        )
      }
    })
  },

  // Check if location permission is granted
  async checkLocationPermission() {
    if (!navigator.permissions) {
      // Fallback for browsers that don't support the permissions API
      try {
        const position = await this.getCurrentPosition()
        return position ? "granted" : "denied"
      } catch (error) {
        return "denied"
      }
    }

    try {
      const permission = await navigator.permissions.query({ name: "geolocation" })
      return permission.state
    } catch (error) {
      console.error("Error checking location permission:", error)
      return "denied"
    }
  },
}
