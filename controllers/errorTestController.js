const utilities = require("../utilities/")
const testController = {}

testController.simulate500Error = function(req, res, next) {
// Simulate a 500 error by accessing an undefined variable
    next({status: 500, message: 'Intentional 500 error caused'})
};
  

module.exports = testController