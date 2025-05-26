-- MySQL dump 10.13  Distrib 9.1.0, for macos14 (arm64)
--
-- Host: localhost    Database: taxmitra_db
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Audit_Logs`
--

DROP TABLE IF EXISTS `Audit_Logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Audit_Logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`log_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Consultants`
--

DROP TABLE IF EXISTS `Consultants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Consultants` (
  `consultant_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `license_number` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `experience_years` int DEFAULT NULL,
  PRIMARY KEY (`consultant_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `consultants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Deductions`
--

DROP TABLE IF EXISTS `Deductions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Deductions` (
  `deduction_id` int NOT NULL AUTO_INCREMENT,
  `taxpayer_id` int DEFAULT NULL,
  `section` varchar(255) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text,
  `financial_year` varchar(255) NOT NULL,
  PRIMARY KEY (`deduction_id`),
  KEY `taxpayer_id` (`taxpayer_id`),
  CONSTRAINT `deductions_ibfk_1` FOREIGN KEY (`taxpayer_id`) REFERENCES `Taxpayers` (`taxpayer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `GST_Registrations`
--

DROP TABLE IF EXISTS `GST_Registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GST_Registrations` (
  `gst_id` int NOT NULL AUTO_INCREMENT,
  `taxpayer_id` int DEFAULT NULL,
  `gstin` varchar(255) NOT NULL,
  `registration_date` datetime NOT NULL,
  `business_type` varchar(255) DEFAULT NULL,
  `state_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`gst_id`),
  UNIQUE KEY `gstin` (`gstin`),
  KEY `taxpayer_id` (`taxpayer_id`),
  CONSTRAINT `gst_registrations_ibfk_1` FOREIGN KEY (`taxpayer_id`) REFERENCES `Taxpayers` (`taxpayer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `GST_Returns`
--

DROP TABLE IF EXISTS `GST_Returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GST_Returns` (
  `return_id` int NOT NULL AUTO_INCREMENT,
  `gst_id` int DEFAULT NULL,
  `return_type` varchar(255) NOT NULL,
  `filing_date` datetime DEFAULT NULL,
  `period` varchar(255) NOT NULL,
  `status` enum('draft','filed') NOT NULL,
  `total_tax` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`return_id`),
  KEY `gst_id` (`gst_id`),
  CONSTRAINT `gst_returns_ibfk_1` FOREIGN KEY (`gst_id`) REFERENCES `GST_Registrations` (`gst_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Income_Sources`
--

DROP TABLE IF EXISTS `Income_Sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Income_Sources` (
  `income_id` int NOT NULL AUTO_INCREMENT,
  `taxpayer_id` int DEFAULT NULL,
  `source_type` enum('salary','business','capital_gains','house_property','other') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text,
  `financial_year` varchar(255) NOT NULL,
  PRIMARY KEY (`income_id`),
  KEY `taxpayer_id` (`taxpayer_id`),
  CONSTRAINT `income_sources_ibfk_1` FOREIGN KEY (`taxpayer_id`) REFERENCES `Taxpayers` (`taxpayer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Invoices`
--

DROP TABLE IF EXISTS `Invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Invoices` (
  `invoice_id` int NOT NULL AUTO_INCREMENT,
  `taxpayer_id` int DEFAULT NULL,
  `consultant_id` int DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `issue_date` datetime NOT NULL,
  `status` enum('pending','paid') NOT NULL,
  `description` text,
  PRIMARY KEY (`invoice_id`),
  KEY `taxpayer_id` (`taxpayer_id`),
  KEY `consultant_id` (`consultant_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`taxpayer_id`) REFERENCES `Taxpayers` (`taxpayer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`consultant_id`) REFERENCES `Consultants` (`consultant_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Notifications`
--

DROP TABLE IF EXISTS `Notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `type` enum('filing','payment','consultant') NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Tax_Filings`
--

DROP TABLE IF EXISTS `Tax_Filings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tax_Filings` (
  `filing_id` int NOT NULL AUTO_INCREMENT,
  `taxpayer_id` int DEFAULT NULL,
  `financial_year` varchar(255) NOT NULL,
  `itr_form` varchar(255) NOT NULL,
  `filing_date` datetime DEFAULT NULL,
  `status` enum('draft','filed','verified') NOT NULL,
  `acknowledgment_number` varchar(255) DEFAULT NULL,
  `total_taxable_income` decimal(15,2) DEFAULT NULL,
  `tax_liability` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`filing_id`),
  KEY `taxpayer_id` (`taxpayer_id`),
  CONSTRAINT `tax_filings_ibfk_1` FOREIGN KEY (`taxpayer_id`) REFERENCES `Taxpayers` (`taxpayer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Tax_Profiles`
--

DROP TABLE IF EXISTS `Tax_Profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tax_Profiles` (
  `profile_id` int NOT NULL AUTO_INCREMENT,
  `taxpayer_id` int DEFAULT NULL,
  `residential_status` enum('resident','non-resident','not_ordinarily_resident') NOT NULL,
  `financial_year` varchar(255) NOT NULL,
  `filing_status` enum('individual','HUF','firm','company') NOT NULL,
  `tax_regime` enum('old','new') NOT NULL,
  PRIMARY KEY (`profile_id`),
  KEY `taxpayer_id` (`taxpayer_id`),
  CONSTRAINT `tax_profiles_ibfk_1` FOREIGN KEY (`taxpayer_id`) REFERENCES `Taxpayers` (`taxpayer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Tax_Slabs`
--

DROP TABLE IF EXISTS `Tax_Slabs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tax_Slabs` (
  `slab_id` int NOT NULL AUTO_INCREMENT,
  `financial_year` varchar(255) NOT NULL,
  `regime` enum('old','new') NOT NULL,
  `income_lower` decimal(15,2) NOT NULL,
  `income_upper` decimal(15,2) DEFAULT NULL,
  `tax_rate` decimal(5,2) NOT NULL,
  PRIMARY KEY (`slab_id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Taxpayer_Consultants`
--

DROP TABLE IF EXISTS `Taxpayer_Consultants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Taxpayer_Consultants` (
  `mapping_id` int NOT NULL AUTO_INCREMENT,
  `taxpayer_id` int DEFAULT NULL,
  `consultant_id` int DEFAULT NULL,
  `assigned_date` datetime NOT NULL,
  PRIMARY KEY (`mapping_id`),
  KEY `taxpayer_id` (`taxpayer_id`),
  KEY `consultant_id` (`consultant_id`),
  CONSTRAINT `taxpayer_consultants_ibfk_1` FOREIGN KEY (`taxpayer_id`) REFERENCES `Taxpayers` (`taxpayer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `taxpayer_consultants_ibfk_2` FOREIGN KEY (`consultant_id`) REFERENCES `Consultants` (`consultant_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `taxpayer_summaries`
--

DROP TABLE IF EXISTS `taxpayer_summaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taxpayer_summaries` (
  `summary_id` int NOT NULL AUTO_INCREMENT,
  `taxpayer_id` int DEFAULT NULL,
  `financial_year` varchar(255) NOT NULL,
  `total_income` decimal(15,2) DEFAULT NULL,
  `total_deductions` decimal(15,2) DEFAULT NULL,
  `taxable_income` decimal(15,2) DEFAULT NULL,
  `tax_liability` decimal(15,2) DEFAULT NULL,
  `tds_deducted` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`summary_id`),
  KEY `taxpayer_id` (`taxpayer_id`),
  CONSTRAINT `taxpayer_summaries_ibfk_1` FOREIGN KEY (`taxpayer_id`) REFERENCES `Taxpayers` (`taxpayer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Taxpayers`
--

DROP TABLE IF EXISTS `Taxpayers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Taxpayers` (
  `taxpayer_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `pan` varchar(255) NOT NULL,
  `aadhaar` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `address` text,
  `phone` varchar(255) DEFAULT NULL,
  `date_of_birth` datetime DEFAULT NULL,
  PRIMARY KEY (`taxpayer_id`),
  UNIQUE KEY `pan` (`pan`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `aadhaar` (`aadhaar`),
  CONSTRAINT `taxpayers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('taxpayer','consultant','admin') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-24 17:40:34
