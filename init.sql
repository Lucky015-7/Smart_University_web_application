-- Create the database if it doesn't exist

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'smart_campus_v1')
BEGIN
    CREATE DATABASE smart_campus_v1;
END
GO

-- Switch to the database
USE smart_campus_v1;
GO