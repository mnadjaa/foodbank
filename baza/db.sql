CREATE SCHEMA `ozs` ;


CREATE TABLE `ozs`.`users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(45) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username_UNIQUE` (`Username`)  
) ENGINE=InnoDB
DEFAULT CHARACTER SET utf8mb4  
DEFAULT COLLATE utf8mb4_unicode_ci; 

CREATE TABLE `ozs`.`sef` (
  `SID` int(11) NOT NULL AUTO_INCREMENT,
  `Podrucje` varchar(45) NOT NULL DEFAULT 'Nis',
  `Username` varchar(45) NOT NULL,
  `Password` varchar(45) NOT NULL,
  PRIMARY KEY (`SID`),
  FOREIGN KEY (`Username`) REFERENCES `ozs`.`users`(`Username`)
)ENGINE=InnoDB
DEFAULT CHARACTER SET utf8mb4  
DEFAULT COLLATE utf8mb4_unicode_ci; 



CREATE TABLE `ozs`.`donator` (
  `DNTRID` int(11) NOT NULL AUTO_INCREMENT,
  `Naziv` varchar(45) DEFAULT NULL,
  `Telefon` varchar(45) DEFAULT NULL,
  `Mejl` varchar(45) NOT NULL,
  `Adresa` varchar(45) DEFAULT NULL,
  `Username` varchar(45) NOT NULL,
  `Password` varchar(45) NOT NULL,
  PRIMARY KEY (`DNTRID`),
  FOREIGN KEY (`Username`) REFERENCES `ozs`.`users`(`Username`)
)ENGINE=InnoDB
DEFAULT CHARACTER SET utf8mb4  
DEFAULT COLLATE utf8mb4_unicode_ci; 



CREATE TABLE `ozs`.`kuhinja` (
  `KID` int(11) NOT NULL AUTO_INCREMENT,
  `Podrucje` varchar(45) NOT NULL DEFAULT 'Nis',
  `Naziv` varchar(45) DEFAULT NULL,
  `Adresa` varchar(45) DEFAULT NULL,
  `Username` varchar(45) NOT NULL,
  `Password` varchar(45) NOT NULL,
  `SID` int(11) DEFAULT NULL,
  `Stanje` int(11) DEFAULT NULL,
  PRIMARY KEY (`KID`),
  FOREIGN KEY (`Username`) REFERENCES `ozs`.`users`(`Username`)
)ENGINE=InnoDB
DEFAULT CHARACTER SET utf8mb4  
DEFAULT COLLATE utf8mb4_unicode_ci; 


CREATE TABLE `ozs`.`prevoznik` (
  `PID` int(11) NOT NULL AUTO_INCREMENT,
  `Podrucje` varchar(45) NOT NULL DEFAULT 'Nis',
  `Ime` varchar(45) DEFAULT NULL,
  `Prezime` varchar(45) DEFAULT NULL,
  `Telefon` varchar(45) DEFAULT NULL,
  `Mejl` varchar(45) DEFAULT NULL,
  `Vozilo` varchar(45) DEFAULT NULL,
  `SID` int(11) DEFAULT NULL,
  PRIMARY KEY (`PID`)
)ENGINE=InnoDB
DEFAULT CHARACTER SET utf8mb4  
DEFAULT COLLATE utf8mb4_unicode_ci; 

CREATE TABLE `ozs`.`primalacusluga` (
  `PUID` int(11) NOT NULL AUTO_INCREMENT,
  `Ime` varchar(45) DEFAULT NULL,
  `Prezime` varchar(45) DEFAULT NULL,
  `Podrucje` varchar(45) NOT NULL DEFAULT 'Nis',
  `BrojBonova` int(11) DEFAULT NULL,
  `KID` int(11) NOT NULL,
  PRIMARY KEY (`PUID`)
)ENGINE=InnoDB
DEFAULT CHARACTER SET utf8mb4  
DEFAULT COLLATE utf8mb4_unicode_ci; 


CREATE TABLE `ozs`.`donacijahrane` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Izvrsena` varchar(45) NOT NULL DEFAULT 'No',
  `Datum` datetime DEFAULT NULL,
  `Opis` varchar(45) DEFAULT NULL,
  `Podrucje` varchar(45) NOT NULL DEFAULT 'Nis',
  `AdresaPreuzeca` varchar(45) DEFAULT NULL,
  `DNTRID` int(11) DEFAULT NULL,
  `SID` int(11) DEFAULT NULL,
  `PID` int(11) DEFAULT NULL,
  `KID` int(11) DEFAULT NULL,
  `Odbijena` varchar(45) NOT NULL DEFAULT 'No',
  PRIMARY KEY (`ID`)
)ENGINE=InnoDB
DEFAULT CHARACTER SET utf8mb4  
DEFAULT COLLATE utf8mb4_unicode_ci; 

CREATE TABLE `ozs`.`donacijanovcana` (
  `DONNVCID` int(11) NOT NULL AUTO_INCREMENT,
  `Izvrsena` varchar(45) NOT NULL DEFAULT 'No',
  `Datum` datetime DEFAULT NULL,
  `Iznos` int(11) DEFAULT NULL,
  `DNTRID` int(11) DEFAULT NULL,
  `Ime` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`DONNVCID`)
) ENGINE=InnoDB
DEFAULT CHARACTER SET utf8mb4  
DEFAULT COLLATE utf8mb4_unicode_ci; 






