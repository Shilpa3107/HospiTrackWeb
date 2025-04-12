"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  CircularProgress, 
  Alert, 
  Grid, 
  Paper,
  Button,
  Menu,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Divider
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import SortIcon from "@mui/icons-material/Sort"
import HospitalCard from "./HospitalCard"
import { HospitalService } from "../services/hospitalService"
import { LocationService } from "../services/locationService"
import "./HospitalList.css"

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [filters, setFilters] = useState({
    bedType: "all",
    distance: "all",
  })
  const [sortBy, setSortBy] = useState("distance")

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true)
        const location = await LocationService.getCurrentPosition()
        const hospitalsData = await HospitalService.getNearbyHospitals(location)
        setHospitals(hospitalsData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHospitals()
  }, [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget)
  }

  const handleSortClose = () => {
    setSortAnchorEl(null)
  }

  const handleFilterChange = (type, value) => {
    setFilters({ ...filters, [type]: value })
    handleFilterClose()
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    handleSortClose()
  }

  const filteredHospitals = hospitals
    .filter((hospital) => {
      const matchesSearch = hospital.name.toLowerCase().includes(searchQuery) ||
        hospital.address.toLowerCase().includes(searchQuery)
      const matchesBedFilter = filters.bedType === "all" || hospital.beds[filters.bedType] > 0
      const matchesDistanceFilter = filters.distance === "all" || 
        (filters.distance === "near" && hospital.distance <= 5) ||
        (filters.distance === "medium" && hospital.distance > 5 && hospital.distance <= 15) ||
        (filters.distance === "far" && hospital.distance > 15)

      return matchesSearch && matchesBedFilter && matchesDistanceFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance
        case "beds":
          return (
            Object.values(b.beds).reduce((sum, count) => sum + count, 0) -
            Object.values(a.beds).reduce((sum, count) => sum + count, 0)
          )
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" component="h1" color="primary">
            Nearby Hospitals
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Sort hospitals">
              <IconButton onClick={handleSortClick}>
                <SortIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter hospitals">
              <IconButton onClick={handleFilterClick}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search hospitals..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "action.active", mr: 1 }} />,
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          {filters.bedType !== "all" && (
            <Chip
              label={`Bed Type: ${filters.bedType}`}
              onDelete={() => handleFilterChange("bedType", "all")}
            />
          )}
          {filters.distance !== "all" && (
            <Chip
              label={`Distance: ${filters.distance}`}
              onDelete={() => handleFilterChange("distance", "all")}
            />
          )}
        </Box>
      </Paper>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={() => handleFilterChange("bedType", "all")}>
          All Bed Types
        </MenuItem>
        {Object.keys(hospitals[0]?.beds || {}).map((type) => (
          <MenuItem key={type} onClick={() => handleFilterChange("bedType", type)}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => handleFilterChange("distance", "all")}>
          All Distances
        </MenuItem>
        <MenuItem onClick={() => handleFilterChange("distance", "near")}>
          Near (≤ 5km)
        </MenuItem>
        <MenuItem onClick={() => handleFilterChange("distance", "medium")}>
          Medium (5-15km)
        </MenuItem>
        <MenuItem onClick={() => handleFilterChange("distance", "far")}>
          Far ({'>'} 15km)
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem onClick={() => handleSortChange("distance")}>
          Sort by Distance
        </MenuItem>
        <MenuItem onClick={() => handleSortChange("beds")}>
          Sort by Available Beds
        </MenuItem>
        <MenuItem onClick={() => handleSortChange("name")}>
          Sort by Name
        </MenuItem>
      </Menu>

      <AnimatePresence>
        {filteredHospitals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Alert severity="info" sx={{ mb: 3 }}>
              No hospitals found matching your criteria.
            </Alert>
          </motion.div>
        ) : (
          <Grid container spacing={3}>
            {filteredHospitals.map((hospital, index) => (
              <Grid item xs={12} sm={6} md={4} key={hospital.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <HospitalCard hospital={hospital} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </AnimatePresence>
    </Container>
  )
}

export default HospitalList
