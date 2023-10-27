const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}




async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory i
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

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

  async function createNewInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
    try {
      const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
      const result = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
  
      // Process the result if needed
  
      return result;
    } catch (error) {
      // Log the error for debugging
      console.error("Error in query:", error);
  
      // Return an error message or re-throw the error as needed
      return error.message;
    }
  }

  async function checkExisitingClassification(classification_id) {
    try {
        const sql = "SELECT * FROM classification WHERE classification_id = $1";
        const classification_id = await pool.query(sql, [classification_id])
        return classification_id.rowCount
      } catch (error) {
        return error.message
      }
  }

  module.exports = {getClassifications, getInventoryByClassificationId, getCarByInventoryId, createNewInventory, checkExisitingClassification}