CREATE DATABASE IF NOT EXISTS croch_etgallery;
CREATE USER IF NOT EXISTS 'croch_etgallery_user'@'localhost' IDENTIFIED BY 'croch_etgallery_password';
GRANT ALL PRIVILEGES ON croch_etgallery.* TO 'croch_etgallery_user'@'localhost';
FLUSH PRIVILEGES;

