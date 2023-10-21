const express = require("express")
const router = new express.Router() 
const vehController = require("../controllers/vehicleController")
const utilities = require("../utilities/")

router.get("/detail/:vehicleId", utilities.handleErrors(vehController.buildByVehicleId));

module.exports = router;