INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE account SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com' AND account_password = 'Iam1ronM@n';
DELETE FROM account

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interior')
WHERE inv_model = 'Hummer' AND inv_make = 'GM';

SELECT inventory.inv_make, inventory.inv_model, classification.classification_name FROM inventory
INNER JOIN classification
ON inventory.classification_id = classification.classification_id;


UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicle/'), inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicle/');

