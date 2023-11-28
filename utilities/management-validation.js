const utilities = require(".");
const classificationModel = require("../models/classification-model");
const inventoryModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 * Registration Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .isLength({ min: 3 })
      .withMessage("Please provide a valid classification name.")
      .custom(async (classification_name) => {
        // Check if the classification name contains only letters and numbers (no spaces)
        const regex = /^[a-zA-Z0-9]*$/; // Updated regex pattern
        if (!regex.test(classification_name)) {
          throw new Error("Classification name should contain only letters and numbers (no spaces).");
        }
        const classificationExists = await classificationModel.checkExisitingClassification(classification_name);
        if (classificationExists) {
          throw new Error("Classification already exists.");
        }
      },
    ),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getManagerNav();
    res.render("./inventory/new-classification", {
      errors,
      title: "New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

const alphanumericRegex = /^[a-zA-Z0-9]+$/; // Allow letters and numbers
const alphanumericWithSpacesRegex = /^[a-zA-Z0-9 ]+$/; // Allow letters, numbers, and spaces

validate.inventoryRules = () => {
  return [
    body("inv_make")
      .custom((value, { req }) => {
        if (!alphanumericRegex.test(value) || value !== value.trim()) {
          throw new Error("Please provide a car make with only letters and numbers.");
        }
        return true;
      }),

    body("inv_model")
      .custom((value, { req }) => {
        if (!alphanumericRegex.test(value) || value !== value.trim()) {
          throw new Error("Please provide a car model with only letters, numbers, and no spaces at the end.");
        }
        return true;
      }),

    body("inv_description")
      .custom((value, { req }) => {
        if (!alphanumericWithSpacesRegex.test(value) || value !== value.trim()) {
          throw new Error("Please provide a description with only letters, numbers, and spaces, with no spaces at the end.");
        }
        return true;
      }),

      body("inv_image")
      .custom((value, { req }) => {
        if (!value.startsWith("/images/vehicles/") || !/^[a-zA-Z0-9/-]+\.((jpg)|(png)|(jpeg)|(webp))$/.test(value) || /\s/.test(value)) {
          throw new Error("Please provide a valid image path that starts with '/images/vehicles/' and ends with a valid image file extension (jpg, png, jpeg, webp), with no spaces, and allowing dashes.");
        }
        return true;
      }),
    
    body("inv_thumbnail")
      .custom((value, { req }) => {
        if (!value.startsWith("/images/vehicles/") || !/^[a-zA-Z0-9/-]+\.((jpg)|(png)|(jpeg)|(webp))$/.test(value) || /\s/.test(value)) {
          throw new Error("Please provide a valid thumbnail image path that starts with '/images/vehicles/' and ends with a valid image file extension (jpg, png, jpeg, webp), with no spaces, and allowing dashes.");
        }
        return true;
      }),

    body("inv_price")
      .isNumeric({ min: 1 })
      .custom((value, { req }) => {
        if (value !== value.trim()) {
          throw new Error("Please provide a valid car price with no spaces.");
        }
        return true;
      }),

    body("inv_miles")
      .isNumeric({ min: 1 })
      .custom((value, { req }) => {
        if (value !== value.trim()) {
          throw new Error("Please provide a valid car mileage with no spaces.");
        }
        return true;
      }),

    body("inv_color")
      .custom((value, { req }) => {
        if (!alphanumericRegex.test(value) || value !== value.trim()) {
          throw new Error("Please provide a car color with only letters, numbers, and no spaces.");
        }
        return true;
      }),

    body("classification_id")
      .isInt({ min: 1 })
      .withMessage("Please select a valid classification"),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  let errors = [];
  let dropdown = await utilities.buildDropDown(classification_id);
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getManagerNav();
    res.render("./inventory/new-inventory", {
      errors,
      title: "New Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      dropdown,
    });
    return;
  }
  next();
};


validate.checkUpdateData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body;
  let errors = [];
  let dropdown = await utilities.buildDropDown(classification_id);
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getManagerNav();
    res.render("./inventory/edit-inventory", {
      errors,
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      dropdown,
    });
    return;
  }
  next();
};

module.exports = validate;