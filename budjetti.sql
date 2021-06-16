-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 22, 2020 at 03:34 PM
-- Server version: 5.7.26
-- PHP Version: 7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `budjetti`
--

-- --------------------------------------------------------

--
-- Table structure for table `aliryhma`
--

DROP TABLE IF EXISTS `aliryhma`;
CREATE TABLE IF NOT EXISTS `aliryhma` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Nimi` varchar(45) NOT NULL,
  `Paaryhma_Id` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_Aliryhma_Paaryhma_Id` (`Paaryhma_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `budjetti`
--

DROP TABLE IF EXISTS `budjetti`;
CREATE TABLE IF NOT EXISTS `budjetti` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Nimi` varchar(45) NOT NULL,
  `Koko` double NOT NULL,
  `Pvm` date NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `hyodyke`
--

DROP TABLE IF EXISTS `hyodyke`;
CREATE TABLE IF NOT EXISTS `hyodyke` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Nimi` varchar(45) NOT NULL,
  `Pvm` date NOT NULL,
  `Ostospaikka` varchar(45) DEFAULT NULL,
  `Kuvaus` varchar(45) DEFAULT NULL,
  `Summa` double NOT NULL,
  `Aliryhma_Id` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_Hyodyke_Aliryhma_Id` (`Aliryhma_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kayttaja`
--

DROP TABLE IF EXISTS `kayttaja`;
CREATE TABLE IF NOT EXISTS `kayttaja` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Nimi` varchar(20) NOT NULL,
  `Salasana` varchar(72) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Nimi` (`Nimi`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kayttajanbudjetit`
--

DROP TABLE IF EXISTS `kayttajanbudjetit`;
CREATE TABLE IF NOT EXISTS `kayttajanbudjetit` (
  `Kayttaja_Id` int(11) NOT NULL,
  `Budjetti_Id` int(11) NOT NULL,
  PRIMARY KEY (`Budjetti_Id`,`Kayttaja_Id`) USING BTREE,
  KEY `fk_Kayttajanbudjetit_Kayttaja_Id` (`Kayttaja_Id`) USING BTREE,
  KEY `fk_Kayttajanbudjetit_Budjetti_Id` (`Budjetti_Id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `paaryhma`
--

DROP TABLE IF EXISTS `paaryhma`;
CREATE TABLE IF NOT EXISTS `paaryhma` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Nimi` varchar(45) NOT NULL,
  `Budjetti_Id` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_Paaryhma_Budjetti_Id` (`Budjetti_Id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `aliryhma`
--
ALTER TABLE `aliryhma`
  ADD CONSTRAINT `fk_aliryhma_Paaryhma_Id` FOREIGN KEY (`Paaryhma_Id`) REFERENCES `paaryhma` (`Id`);

--
-- Constraints for table `hyodyke`
--
ALTER TABLE `hyodyke`
  ADD CONSTRAINT `fk_Hyodyke_Aliryhma_Id` FOREIGN KEY (`Aliryhma_Id`) REFERENCES `aliryhma` (`Id`);

--
-- Constraints for table `kayttajanbudjetit`
--
ALTER TABLE `kayttajanbudjetit`
  ADD CONSTRAINT `fk_Kayttajanbudjetit_Budjetti_Id` FOREIGN KEY (`Budjetti_Id`) REFERENCES `budjetti` (`Id`),
  ADD CONSTRAINT `fk_Kayttajanbudjetit_Kayttaja_Id` FOREIGN KEY (`Kayttaja_Id`) REFERENCES `kayttaja` (`Id`);

--
-- Constraints for table `paaryhma`
--
ALTER TABLE `paaryhma`
  ADD CONSTRAINT `fk_Paaryhma_Budjetti_id` FOREIGN KEY (`Budjetti_Id`) REFERENCES `budjetti` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
