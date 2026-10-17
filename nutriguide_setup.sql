-- ============================================================
-- NutriGuide Database Setup Script
-- Run this FIRST before compiling or running any Java code.
-- Command: mysql -u root -p < nutriguide_setup.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS nutriguide;
USE nutriguide;

-- ── Users Table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(100) NOT NULL,
    age       INT          NOT NULL,
    contact   VARCHAR(15),
    email     VARCHAR(100) UNIQUE NOT NULL,
    goal      VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Food Items Table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS food_items (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    food_name VARCHAR(100) UNIQUE NOT NULL,
    calories  FLOAT NOT NULL,
    protein   FLOAT NOT NULL,
    carbs     FLOAT NOT NULL,
    fats      FLOAT NOT NULL
);

-- ── Diet Plans Table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS diet_plans (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    goal      VARCHAR(50) NOT NULL,
    food_name VARCHAR(100) NOT NULL
);

-- ── Sample Food Data ─────────────────────────────────────────
INSERT IGNORE INTO food_items (food_name, calories, protein, carbs, fats) VALUES
('Egg',            78,  6.0,  0.6,  5.0),
('Banana',         89,  1.1, 23.0,  0.3),
('Paneer',        265, 18.0,  1.2, 20.0),
('Oats',          389, 17.0, 66.0,  7.0),
('Chicken Breast',165, 31.0,  0.0,  3.6),
('Apple',          52,  0.3, 14.0,  0.2),
('Soya Chunks',   345, 52.0, 33.0,  0.5),
('Milk',           42,  3.4,  5.0,  1.0),
('Almonds',       579, 21.0, 22.0, 49.0),
('Mango',          60,  0.8, 15.0,  0.4),
('Orange',         47,  0.9, 11.8,  0.1),
('Grapes',         69,  0.7, 18.1,  0.2),
('Pineapple',      50,  0.5, 13.1,  0.1),
('Watermelon',     30,  0.6,  7.6,  0.2),
('Papaya',         43,  0.5, 10.8,  0.3),
('Guava',          68,  2.6, 14.3,  1.0),
('Pomegranate',    83,  1.7, 18.7,  1.2),
('Strawberry',     32,  0.7,  7.7,  0.3),
('Kiwi',           61,  1.1, 14.7,  0.5),
('Avocado',       160,  2.0,  8.5, 14.7),
('Potato',         77,  2.0, 17.5,  0.1),
('Sweet Potato',   86,  1.6, 20.1,  0.1),
('Rice Cooked',   130,  2.7, 28.2,  0.3),
('Roti',          297, 11.0, 58.0,  3.5),
('Peanuts',       567, 25.8, 16.1, 49.2),
('Chickpeas',     164,  8.9, 27.4,  2.6),
('Tofu',          144, 17.3,  3.0,  8.7),
('Curd',           98, 11.0,  4.0,  4.0);

-- ── Sample Diet Plans ────────────────────────────────────────
INSERT IGNORE INTO diet_plans (goal, food_name) VALUES
('Weight Loss',        'Oats'),
('Weight Loss',        'Apple'),
('Weight Loss',        'Chicken Breast'),
('Weight Loss',        'Watermelon'),
('Weight Loss',        'Egg'),
('Muscle Gain',        'Chicken Breast'),
('Muscle Gain',        'Egg'),
('Muscle Gain',        'Paneer'),
('Muscle Gain',        'Soya Chunks'),
('Muscle Gain',        'Almonds'),
('Weight Maintenance', 'Banana'),
('Weight Maintenance', 'Oats'),
('Weight Maintenance', 'Milk'),
('Weight Maintenance', 'Curd'),
('Weight Maintenance', 'Chickpeas');

-- ── Verify ───────────────────────────────────────────────────
SELECT CONCAT('✅ food_items: ', COUNT(*), ' rows') AS status FROM food_items
UNION ALL
SELECT CONCAT('✅ diet_plans: ', COUNT(*), ' rows') FROM diet_plans;
