

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

CREATE OR REPLACE TABLE Employees (
  employeeID INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(45) NOT NULL,
  lastName VARCHAR(45) NOT NULL,
  phoneNum VARCHAR(10) NOT NULL,
  hourlyWage DECIMAL(5,2) NOT NULL,
  workEmail VARCHAR(45) UNIQUE
);

INSERT INTO Employees (firstName, lastName, phoneNum, hourlyWage, workEmail) VALUES
('Ashley', 'Quarford', '123456789', 15.5, 'ashley.quarford@gmail.com'),
('Tyler', 'Gebel', '987654321', 14.75, 'tyler.gebel@gmail.com'),
('Michael', 'Johnson', '456789123', 16.25, 'michael.johnson@gmail.com');

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



