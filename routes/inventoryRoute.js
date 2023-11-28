const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const managementValidate = require('../utilities/management-validation')

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

router.get("/new-classification", utilities.checkAdminAccess, utilities.handleErrors(invController.buildNewClassification));

router.get("/new-inventory", utilities.checkAdminAccess, utilities.handleErrors(invController.buildNewInventory));

router.get("/getInventory/:classification_id", utilities.checkAdminAccess, utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:vehicleId", utilities.checkAdminAccess, utilities.handleErrors(invController.editInventoryView))

router.get("/delete/:vehicleId", utilities.checkAdminAccess, utilities.handleErrors(invController.deleteInventoryView))

router.get("/", utilities.checkLogin, utilities.checkAdminAccess, utilities.handleErrors(invController.buildManagerView))


router.post(
"/new-classification",
managementValidate.classificationRules(),
managementValidate.checkClassificationData,
utilities.checkAdminAccess,
utilities.handleErrors(invController.createNewClassification)
)
// Process the login attempt
router.post(
"/new-inventory",
managementValidate.inventoryRules(),
managementValidate.checkInventoryData,
utilities.checkAdminAccess,
utilities.handleErrors(invController.createNewInventory)
)

router.post(
"/update/", 
managementValidate.inventoryRules(),
managementValidate.checkUpdateData,
utilities.checkAdminAccess,
utilities.handleErrors(invController.updateInventory))

router.post(
"/delete/",
utilities.checkAdminAccess,
utilities.handleErrors(invController.deleteInventory)
)


// router.update(
//     "/edit/:vehicleId",
//     utilities.handleErrors(invController.createNewInventory)
// )

module.exports = router