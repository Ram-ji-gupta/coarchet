CREATE DATABASE IF NOT EXISTS woolcraft;
CREATE USER IF NOT EXISTS 'woolcraft_user'@'localhost' IDENTIFIED BY 'woolcraft_password';
GRANT ALL PRIVILEGES ON woolcraft.* TO 'woolcraft_user'@'localhost';
FLUSH PRIVILEGES;
