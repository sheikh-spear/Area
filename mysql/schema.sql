CREATE TABLE IF NOT EXISTS users
(
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  registered DATETIME NOT NULL,
  last_login DATETIME
);