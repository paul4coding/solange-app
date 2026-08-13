-- ============================================================
--  Solange's Hair Braiding — MySQL 8.0 Schema
--  Run once to initialise the database.
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `services` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug`            VARCHAR(100)    NOT NULL UNIQUE,
  `name`            VARCHAR(200)    NOT NULL,
  `category`        VARCHAR(100)    DEFAULT 'braids',
  `description`     TEXT,
  `starting_price`  DECIMAL(10,2)  DEFAULT 0.00,
  `duration`        VARCHAR(100),
  `hair_included`   TINYINT(1)     DEFAULT 0,
  `is_featured`     TINYINT(1)     DEFAULT 0,
  `is_active`       TINYINT(1)     DEFAULT 1,
  `seo_title`       VARCHAR(200),
  `seo_description` TEXT,
  `created_at`      DATETIME       DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug`       (`slug`),
  INDEX `idx_is_active`  (`is_active`),
  INDEX `idx_is_featured`(`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `images` (
  `id`                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `service_slug`         VARCHAR(100),
  `title`                VARCHAR(300),
  `source`               ENUM('pexels','pixabay','unsplash','custom','owner','google','pinterest') DEFAULT 'custom',
  `source_id`            VARCHAR(200),
  `original_url`         TEXT,
  `cloudinary_url`       TEXT,
  `cloudinary_public_id` VARCHAR(300),
  `width`                INT,
  `height`               INT,
  `alt_text`             VARCHAR(500),
  `tags`                 JSON,
  `photographer`         VARCHAR(200),
  `photographer_url`     TEXT,
  `is_featured`          TINYINT(1) DEFAULT 0,
  `is_active`            TINYINT(1) DEFAULT 1,
  `created_at`           DATETIME   DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           DATETIME   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_service_slug`(`service_slug`),
  INDEX `idx_is_active`   (`is_active`),
  INDEX `idx_is_featured` (`is_featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `author_name` VARCHAR(200) NOT NULL,
  `rating`      TINYINT     DEFAULT 5,
  `review_text` TEXT,
  `service_slug`VARCHAR(100),
  `source`      ENUM('google','direct','yelp') DEFAULT 'google',
  `source_url`  TEXT,
  `is_featured` TINYINT(1)  DEFAULT 0,
  `is_active`   TINYINT(1)  DEFAULT 1,
  `review_date` DATE,
  `created_at`  DATETIME    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bookings` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  -- La cliente décrit le style souhaité en texte libre dans `service_name`.
  -- `service_slug` n'est conservé que pour les anciennes réservations.
  `service_slug`   VARCHAR(100) DEFAULT NULL,
  `service_name`   TEXT         NOT NULL,
  `date`           DATE         NOT NULL,
  `time`           VARCHAR(20)  NOT NULL,
  `client_name`    VARCHAR(200) NOT NULL,
  `client_phone`   VARCHAR(50)  NOT NULL,
  `client_email`   VARCHAR(300) NOT NULL,
  `stylist`        VARCHAR(200),
  `notes`          TEXT,
  `deposit_paid`   TINYINT(1)   DEFAULT 0,
  `deposit_amount` DECIMAL(10,2)DEFAULT 30.00,
  `status`         ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `created_at`     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_date`  (`date`),
  INDEX `idx_status`(`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(200) NOT NULL,
  `phone`      VARCHAR(50),
  `email`      VARCHAR(300) NOT NULL,
  `service`    VARCHAR(200),
  `message`    TEXT         NOT NULL,
  `is_read`    TINYINT(1)   DEFAULT 0,
  `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
