const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.buildDropDown = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let dropdown = "<select id='classification_id' name='classification_id' required>";
  data.rows.forEach((row) => {
    dropdown += "<option value='" + row.classification_id + "'>" + row.classification_name + "</option>";
  });
  dropdown += "</select><br><br>"; // Add the closing </select> tag
  return dropdown;
}



Util.getManagerNav = async function(req, res, next){

  let data = await invModel.getClassifications()
  let list = "<ul id='managerNav'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "<li>"
  list += '<a href="/inv">' +
  'Admin Tools</a>'
  list += "</li>"
  list += "</ul>"

  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors"></a>'
        grid += '<div class="namePrice">'
        grid += '<hr>'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


          // ${inv_make}
          // ${inv_model}
Util.buildVehicleDisplay = async function(data){
  let display
  let vehicle = data[0]
  if(data.length > 0){
    display = 
    `<div id="vehicle-display">

          <img src=${vehicle.inv_image} alt="${vehicle.inv_color} ${vehicle.inv_make} ${vehicle.inv_model}">
          <div id="vehicle-info">
            <h2>Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</h2>
            <h2>Mileage: ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</h2>
            <h2>Color: ${vehicle.inv_color}</h2>
            <p id="inv_description">${vehicle.inv_description}</p>
          </div>

    </div>`
  } else { 
    display = '<p class="notice">Sorry, Wah Wuh.</p>'
  }
  return display
}

module.exports = Util