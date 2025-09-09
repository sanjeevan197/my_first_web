-- Run this in MySQL Workbench to setup the database

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS nadi_pariksha;
USE nadi_pariksha;

-- 2. Create Tables
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analysis_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    vata_percentage INT NOT NULL,
    pitta_percentage INT NOT NULL,
    kapha_percentage INT NOT NULL,
    status VARCHAR(255),
    waveform_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    recommendation TEXT NOT NULL,
    category ENUM('diet', 'lifestyle', 'exercise', 'meditation') DEFAULT 'lifestyle',
    FOREIGN KEY (report_id) REFERENCES analysis_reports(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sensor_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    sensor_type ENUM('vata', 'pitta', 'kapha') NOT NULL,
    raw_data JSON NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Verify Tables
SHOW TABLES;

-- 4. Check Table Structure
DESCRIBE users;
DESCRIBE analysis_reports;

SELECT 'Database setup complete!' as status;