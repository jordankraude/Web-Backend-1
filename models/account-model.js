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


async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}


async function getAccountById(account_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.account i
      WHERE i.account_id = $1`,
      [account_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getAccountById error " + error)
  }
}

async function updatePassword(account_password, account_id){
  try {
    const sql =
    "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
  const data = await pool.query(sql, [
    account_password,
    account_id
  ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

async function updateAccountInfo(account_firstname, account_lastname, account_email, account_id){
  try {
    const sql =
    "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
  const data = await pool.query(sql, [
    account_firstname,
    account_lastname,
    account_email,
    account_id
  ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


module.exports = {registerAccount, checkExistingEmail, checkExisitingAccount, getAccountByEmail, getAccountById, updateAccountInfo, updatePassword}