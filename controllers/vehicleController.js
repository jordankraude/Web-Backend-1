const vehModel = require("../models/vehicleClass-model")
const utilities = require("../utilities/")

const vehCont = {}

vehCont.buildByVehicleId = async function (req, res, next) {
    const vehicle_id = req.params.vehicleId
    const data = await vehModel.getCarByInventoryId(vehicle_id)
    const display = await utilities.buildVehicleDisplay(data)
    let nav = await utilities.getNav()
    // to be added to title //
    const vehName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
    res.render("./inventory/vehicle", {
      title:  vehName,
      nav,
      display,
    })
  }
  
  
  module.exports = vehCont