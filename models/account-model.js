const pool = require("../database/")

async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

  async function checkExisitingAccount(account_email, account_password) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1 AND account_password = $2";
        const { rows } = await pool.query(sql, [account_email, account_password]);

        if (rows.length > 0) {
            return rows[0]; // Return the first matching account
        } else {
            return null; // No matching account found
        }
    } catch (error) {
        return error.message;
    }
}

async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = {registerAccount, checkExistingEmail, checkExisitingAccount}