SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

CREATE OR REPLACE TABLE Employees (
  employeeID INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(45) NOT NULL,
  lastName VARCHAR(45) NOT NULL,
  phoneNum VARCHAR(10) UNIQUE NOT NULL,
  hourlyWage INT 5,2) NOT NULL,
  workEmail VARCHAR(45) UNIQUE
);

INSERT INTO Employees (employeeID, firstName, lastName, phoneNum, hourlyWage, workEmail) VALUES
(1, 'Ashley', 'Quarford', '123456789', 15.5, 'ashley.quarford@gmail.com'),
(2, 'Tyler', 'Gebel', '987654321', 14.75, 'tyler.gebel@gmail.com'),
(3, 'Michael', 'Johnson', '456789123', 16.25, 'michael.johnson@gmail.com');

CREATE OR REPLACE TABLE Habitat_enclosures (
  habitatID INT AUTO_INCREMENT PRIMARY KEY,
  monthlyUpkeep INT NOT NULL,
  capacity INT NOT NULL,
  description VARCHAR(100)
);

INSERT INTO Habitat_enclosures (habitatID, monthlyUpkeep, capacity, description) VALUES
(1, 5000, 10, 'Treetop Habitat'),
(2, 4000, 6, 'Arctic Habitat'),
(3, 3000, 20, 'Farm Habitat');

CREATE OR REPLACE TABLE Species (
  speciesID INT AUTO_INCREMENT PRIMARY KEY,
  speciesName VARCHAR(45) NOT NULL,
  description VARCHAR(100)
);

INSERT INTO Species (speciesID, speciesName, description) VALUES
(1, 'Ringed Seal', 'Eats fish; active during day'),
(2, 'Squirrel Monkey', 'Eats fruit and grains'),
(3, 'Pygmy Goat', 'Eats grains');


CREATE OR REPLACE TABLE Animals (
  animalID INT AUTO_INCREMENT PRIMARY KEY,
  animalName VARCHAR(45) NOT NULL,
  description VARCHAR(100),
  speciesID INT NOT NULL,
  habitatID INT NOT NULL,
  FOREIGN KEY (speciesID) REFERENCES Species(speciesID),
  FOREIGN KEY (habitatID) REFERENCES Habitat_enclosures(habitatID)
  ON DELETE CASCADE);

INSERT INTO Animals (animalID, animalName, description, speciesID, habitatID) VALUES
(1, 'Alberto', 'Male Ringed Seal', 1, 2),
(2, 'Peaches', 'Female Squirrel Monkey', 2, 1),
(3, 'Leonardo', 'Male Pygmy Goat', 3, 3);



CREATE OR REPLACE TABLE Admissions (
  admissionID INT AUTO_INCREMENT PRIMARY KEY,
  admissionTotal INT(6) NOT NULL,
  ticketPrice INT NOT NULL,
  description VARCHAR(100)
);

INSERT INTO Admissions (admissionID, admissionTotal, ticketPrice, description) VALUES
(1, 500, 30, 'General Admission'),
(2, 250, 15, 'Children under 12 Admission'),
(3, 350, 20, 'Senior Citizen Discount Admission');

CREATE OR REPLACE TABLE Budgets (
  budgetID INT AUTO_INCREMENT PRIMARY KEY,
  budgetAmount INT NOT NULL,
  employeeID INT NOT NULL,
  habitatID INT NOT NULL,
  admissionID INT NOT NULL,
  FOREIGN KEY (employeeID) REFERENCES Employees(employeeID),
  FOREIGN KEY (habitatID) REFERENCES Habitat_enclosures(habitatID),
  FOREIGN KEY (admissionID) REFERENCES Admissions(admissionID)
  ON DELETE CASCADE
);

INSERT INTO Budgets (budgetID, budgetAmount, employeeID, habitatID, admissionID) VALUES
(1, 10000, 1, 1, 1),
(2, 15000, 2, 2, 2),
(3, 20000, 3, 3, 3);

CREATE OR REPLACE TABLE Food_and_Supplies (
  itemID INT AUTO_INCREMENT PRIMARY KEY,
  itemName VARCHAR(45) NOT NULL,
  Quantity INT(6) NOT NULL,
  price DECIMAL(6, 2) NOT NULL
);

INSERT INTO Food_and_Supplies (itemID, itemName, Quantity, price) 
VALUES
(1, 'Hay', 100, 10.5),
(2, 'Fish', 200, 8.75),
(3, 'Apples', 50, 5.25);

CREATE OR REPLACE TABLE Food_and_supplies_per_animal (
  animalItemListID INT AUTO_INCREMENT PRIMARY KEY,
  animalID INT NOT NULL,
  itemID INT NOT NULL,
  FOREIGN KEY (animalID) REFERENCES Animals(animalID),
  FOREIGN KEY (itemID) REFERENCES Food_and_Supplies(itemID)
  ON DELETE CASCADE
);

INSERT INTO Food_and_supplies_per_animal (animalID, itemID) VALUES
(1, 1),
(1, 2),
(2, 3);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;



-- Budgets Page
----------------
SELECT * FROM Budgets WHERE budgetAmount = budgetAmount;

-- Create new budget
INSERT INTO Budgets (budgetAmount, employeeID, habitatID, admissionsID) VALUES (budget_Amount_Input, employee_ID_input, habitat_ID_input, admissions_ID_input);

-- Edit budget
UPDATE Budgets SET budgetAmount = budget_Amount_Input, employeeID = employee_ID_input, habitatID = habitat_ID_input, admissionsID = admissions_ID_input WHERE budgetID = budget_ID_Input;

-- Delete budget
DELETE FROM Budgets WHERE budgetID = budget_ID_Input;

------------------
-- Admissions Page
------------------
SELECT * FROM Admissions WHERE admissionID = admissionID;

-- Create new admission
INSERT INTO Admissions (admissionTotal, ticketPrice, description) VALUES (admission_Total_Input, ticket_Price_Input, description_Input);

-- Edit admission
UPDATE Admissions SET admissionTotal = admission_Total_Input, ticketPrice = ticket_Price_Input, description = description_Input WHERE admissionID = admission_ID_Input;

-- Delete admission
DELETE FROM Admissions WHERE admissionID = admission_ID_Input;

------------
-- Employees Page
------------
SELECT * FROM Employees WHERE lastName = lastName;

-- Create new Employee
INSERT INTO Employees (firstName, lastName, phoneNum, hourlyWage, workEmail) VALUES (first_name_input, last_name_input, phone_num_input, hourly_wage_input, work_email_input);

-- Edit Employee
UPDATE Employees SET firstName = first_name_input, lastName = last_name_input, phoneNum = phone_num_input, hourlyWage = hourly_wage_input, workEmail = work_email_input WHERE employeeID = employee_ID_input;

-- Delete Employee
DELETE FROM Employees WHERE employeeID = employee_ID_input;


------------
-- Species Page
------------
SELECT * FROM Species WHERE speciesName = speciesName;

-- Create new species
INSERT INTO Species (speciesName, `description`) VALUES (species_name_input, description_input);

-- Edit Species
UPDATE Speceis SET speciesName = species_name_input, `description` = description_input WHERE speciesID = species_ID_input;

-- Delete Species
DELETE FROM Species WHERE speciesID = species_ID_input;

------------
-- Animals Page
------------
-- Search query for 
SELECT * FROM Animals WHERE animalName = animalName;

-- Create new Animal
INSERT INTO Animals (animalName, `description`, speciesID, habitatID) VALUES (animal_name_input, description_input, species_ID_input, habitat_ID_input);

-- Edit Animal
UPDATE Animals SET animalName = animal_name_input, `description` = description_input, speciesID = species_ID_input, habitatID = habitat_ID_input WHERE animalID = animal_ID_input;

-- Delete Animal
DELETE FROM Animals WHERE animalID = animal_ID_input;


-------------------------
-- Habitat Enclosures Page
-------------------------
SELECT * from Habitat_enclosures WHERE habitatID = habitatID;

-- Create new habitat
INSERT INTO Habitat_enclosures (habitatID, monthlyUpkeep, capacity, description) VALUES (habitat_ID_Input, monthly_Upkeep_Input, capacity_Input, description_Input);

-- Edit habitat
UPDATE Habitat_enclosures SET monthlyUpkeep = monthly_Upkeep_Input, capacity = capacity_Input, description = description_Input WHERE habitatID = habitat_ID_Input;

-- Delete habitat
DELETE FROM Habitat_enclosures WHERE habitatID = habitat_ID_Input;


-------------------------
-- Food and Supplies Page
------------------------
SELECT * from Food_and_supplies WHERE itemName = itemName;

-- Create new item
INSERT INTO Food_and_supplies (itemID, itemName, quantity, price) VALUES (item_ID_Input, item_Name_Input, quantity_Input, price_Input);

-- Edit item 
UPDATE Food_and_supplies SET itemName = item_Name_Input, quantity = quantity_Input, price = price_Input WHERE itemID = item_ID_Input;


-- Delete item
DELETE FROM Food_and_supplies WHERE itemID = item_ID_Input;


-----------------------------------
-- Food and Supplies Per Animal page
------------------------------------
SELECT Animals.animalName AS "Animal Name", Food_and_Supplies.itemName AS "Food Name"
FROM Food_and_supplies_per_animal
INNER JOIN Animals ON Food_and_supplies_per_animal.animalID = Animals.animalID
INNER JOIN Food_and_Supplies ON Food_and_Supplies.itemID = Food_and_supplies_per_animal.itemID
GROUP BY (Animals.animalID);

-- Create new item per animal
INSERT INTO Food_and_supplies_per_animal (animalItemListID, itemID, animalID) VALUES (animal_Item_List_ID_Input, item_ID_Input, animal_ID_Input);


-- Edit item per animal
UPDATE Food_and_supplies_per_animal SET itemID = item_ID_Input, animalID = animal_ID_Input WHERE animalItemListID = animal_Item_List_ID_Input;


-- Delete item per animal
DELETE FROM Food_and_supplies_per_animal  WHERE itemID = item_ID_Input AND animalID = animal_ID_Input;
