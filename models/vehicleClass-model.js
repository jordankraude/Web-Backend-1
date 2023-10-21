const pool = require("../database/")

/* ***************************
 *  Get Vehicle data
 * ************************** */

async function getCarByInventoryId(inv_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory i
        WHERE i.inv_id = $1`,
        [inv_id]
      )
      return data.rows
    } catch (error) {
      console.error("getvehiclebyid error " + error)
    }
  }

  module.exports = {getCarByInventoryId}