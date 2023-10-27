const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  const accountName = req.session.accountName
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
    accountName
  })
}

invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getCarByInventoryId(vehicle_id)
  const display = await utilities.buildVehicleDisplay(data)
  const accountName = req.session.accountName
  let nav = await utilities.getNav()
  // to be added to title //
  const vehName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/vehicle", {
    title:  vehName,
    nav,
    display,
    accountName
  })
}


module.exports = invCont