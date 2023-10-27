const express = require("express")
const router = new express.Router() 
const managerController = require("../controllers/managementController")
const utilities = require("../utilities/")
const managementValidate = require('../utilities/management-validation')

router.get("/", utilities.handleErrors(managerController.buildManagerView))

router.get("/new-classification", utilities.handleErrors(managerController.buildNewClassification));

router.get("/new-inventory", utilities.handleErrors(managerController.buildNewInventory));

// router.get("/profile", res.render("./account/profile", {

// }))

router.post(
    "/new-classification",
    managementValidate.classificationRules(),
    managementValidate.checkClassificationData,
    utilities.handleErrors(managerController.createNewClassification)
  )
// Process the login attempt
router.post(
  "/new-inventory",
  managementValidate.inventoryRules(),
  managementValidate.checkInventoryData,
  utilities.handleErrors(managerController.createNewInventory)
)

module.exports = router;