const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const managementValidate = require('../utilities/management-validation')

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

router.get("/new-classification", utilities.handleErrors(invController.buildNewClassification));

router.get("/new-inventory", utilities.handleErrors(invController.buildNewInventory));

router.get("/", utilities.handleErrors(invController.buildManagerView))


router.post(
"/new-classification",
managementValidate.classificationRules(),
managementValidate.checkClassificationData,
utilities.handleErrors(invController.createNewClassification)
)
// Process the login attempt
router.post(
"/new-inventory",
managementValidate.inventoryRules(),
managementValidate.checkInventoryData,
utilities.handleErrors(invController.createNewInventory)
)

module.exports = router;