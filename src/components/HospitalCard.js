"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  DialogContentText,
  Alert,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Divider,
  IconButton
} from "@mui/material";
import { useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { HospitalService } from "../services/hospitalService";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import BedIcon from "@mui/icons-material/Bed";
import DirectionsIcon from "@mui/icons-material/Directions";
import InfoIcon from "@mui/icons-material/Info";
import "./HospitalCard.css";

const HospitalCard = ({ hospital }) => {
  const [view, setView] = useState("default");
  const [patientName, setPatientName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [bedType, setBedType] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });  

  const handleBookBed = () => {
    setOpenDialog(true);
  };

  const handleSubmitBooking = () => {
    sendBookingNotification(hospital, patientName, contactNumber, email, bedType);
    setBookingStatus("success");
    setOpenDialog(false);
    setOpenSnackbar(true); 
    setPatientName("");
setContactNumber("");
setEmail("");
setBedType("");

  };
  

  const sendBookingNotification = (hospital, name, contact, email, bedType) => {
    const bookingData = {
      hospitalName: hospital.name,
      hospitalContact: hospital.contact,
      hospitalEmail: hospital.email,
      patientName: name,
      contactNumber: contact,
      email,
      bedType
    };

    console.log("Booking Data:", bookingData);

    const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    existingBookings.push(bookingData);
    localStorage.setItem("bookings", JSON.stringify(existingBookings));

    alert("Booking submitted successfully!");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNavigate = () => {
    setView("navigate");
  };

  const handleTransportSelect = (transport) => {
    const distance = hospital.distance.toFixed(2);
    navigate(`/map/${hospital.id}?transport=${transport}&distance=${distance}`);
  };

  const renderDefaultView = () => (
    <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
      <Tooltip title={!hospital.hasAnyFreeBeds ? "No beds available" : "Book a bed"}>
        <span>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBookBed}
            disabled={Object.values(hospital.beds).reduce((a, b) => a + b, 0) === 0}
            startIcon={<BedIcon />}
            sx={{ flex: 1, mr: 1 }}
          >
            Book Bed
          </Button>
        </span>
      </Tooltip>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleNavigate}
        startIcon={<DirectionsIcon />}
        sx={{ flex: 1 }}
      >
        Navigate
      </Button>
    </CardActions>
  );

  const renderNavigateView = () => (
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Select Transport
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Tooltip title="Fastest route by car">
          <Chip
            label="Car"
            onClick={() => handleTransportSelect("car")}
            color="primary"
            sx={{ m: 0.5 }}
          />
        </Tooltip>
        <Tooltip title="Eco-friendly bicycle route">
          <Chip
            label="Bicycle"
            onClick={() => handleTransportSelect("bicycle")}
            color="primary"
            sx={{ m: 0.5 }}
          />
        </Tooltip>
        <Tooltip title="Walking route">
          <Chip
            label="Foot"
            onClick={() => handleTransportSelect("foot")}
            color="primary"
            sx={{ m: 0.5 }}
          />
        </Tooltip>
      </Box>
      <Button variant="text" onClick={() => setView("default")} sx={{ mt: 2 }}>
        Back
      </Button>
    </CardContent>
  );

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              boxShadow: 6
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" component="h2" noWrap>
                {hospital.name}
              </Typography>
              <Tooltip title="Hospital Information">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOnIcon sx={{ color: "text.secondary", mr: 1 }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {hospital.address}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              color="primary"
              sx={{ mb: 2, display: "flex", alignItems: "center" }}
            >
              <LocationOnIcon sx={{ mr: 0.5 }} />
              {hospital.distance.toFixed(1)} km away
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Facilities:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {hospital.facilities.map((facility) => (
                  <Chip
                    key={facility}
                    label={facility}
                    size="small"
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Available Beds:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {Object.entries(hospital.beds).map(([type, count]) => (
                  <Chip
                    key={type}
                    label={`${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}`}
                    color={count > 0 ? "success" : "default"}
                    size="small"
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          </CardContent>

          {view === "default" && renderDefaultView()}
          {view === "navigate" && renderNavigateView()}
        </Card>
      </motion.div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Book a Bed</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide the patient's details and select a bed type.
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            label="Patient Name"
            fullWidth
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Contact Number"
            fullWidth
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email Address"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Select Bed Type:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {Object.entries(hospital.beds).map(([type, count]) => (
              <Tooltip key={type} title={count === 0 ? "No beds available" : `${count} beds available`}>
                <span>
                  <Chip
                    label={`${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}`}
                    color={bedType === type ? "secondary" : count > 0 ? "primary" : "default"}
                    onClick={() => count > 0 && setBedType(type)}
                    disabled={count === 0}
                    sx={{ m: 0.5 }}
                  />
                </span>
              </Tooltip>
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitBooking} color="primary" disabled={!bedType}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
  open={openSnackbar}
  autoHideDuration={4000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
>
  <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
    Bed has been booked successfully!
  </Alert>
</Snackbar>

    </>
  );
};

export default HospitalCard;
