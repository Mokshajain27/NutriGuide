# NutriGuide — DBMS Minor Project

A nutrition and fitness web app built with **HTML/CSS/JS** (frontend) + **Java + MySQL** (backend).

---

## Project Structure

```
nutriguide/
├── index.html              ← Home page
├── nutrition.html          ← Food search
├── recommendation.html     ← Food recommendations
├── bmi.html                ← BMI calculator
├── login.html              ← User profile creation
├── style.css               ← All styles
├── script.js               ← All frontend JS
├── nutriguide_setup.sql    ← Database schema + seed data  ← RUN THIS FIRST
├── lib/
│   └── mysql-connector-j-9.7.0.jar
└── src/
    ├── DatabaseConnection.java  ← JDBC connection
    ├── BMI.java                 ← BMI utility
    ├── FoodDAO.java             ← All DB queries
    ├── Main.java                ← Console test runner
    ├── SearchFoodServlet.java   ← GET /SearchFoodServlet?food=egg
    ├── RecommendationServlet.java ← GET /RecommendationServlet?protein=10&calories=200
    └── UserServlet.java         ← POST /UserServlet (save profile)
```

---

## Step 1 — Set Up MySQL Database

```bash
mysql -u root -p < nutriguide_setup.sql
```

This creates the `nutriguide` database with tables: `users`, `food_items`, `diet_plans`  
and inserts 28 sample food items and 15 diet plan entries.

---

## Step 2 — Test Java (Console Mode)

```bash
# From project root:
javac -cp lib/mysql-connector-j-9.7.0.jar src/*.java -d out/
java  -cp out:lib/mysql-connector-j-9.7.0.jar Main
```

On Windows use `;` instead of `:` in the classpath:
```bash
javac -cp lib\mysql-connector-j-9.7.0.jar src\*.java -d out\
java  -cp out;lib\mysql-connector-j-9.7.0.jar Main
```

---

## Step 3 — Run Frontend (No Backend)

Just open `index.html` in your browser.  
The JS food database works without Tomcat — all 28 foods are available.

---

## Step 4 — Deploy Servlets on Apache Tomcat (Full Stack)

1. Install [Apache Tomcat 10+](https://tomcat.apache.org/) (required for `jakarta.servlet`)
2. Create a WAR or copy files into `webapps/nutriguide/`
3. Place compiled `.class` files in `WEB-INF/classes/`
4. Place `mysql-connector-j-9.7.0.jar` in `WEB-INF/lib/`
5. In `script.js`, set `USE_BACKEND = true`
6. Start Tomcat and open: `http://localhost:8080/nutriguide/index.html`

---

## What Each Servlet Does

| Servlet | URL | Method | Purpose |
|---|---|---|---|
| SearchFoodServlet | `/SearchFoodServlet?food=egg` | GET | Returns food nutrition as JSON |
| RecommendationServlet | `/RecommendationServlet?protein=10&calories=300` | GET | Returns matching foods as JSON |
| RecommendationServlet | `/RecommendationServlet?goal=Weight+Loss` | GET | Returns diet plan foods |
| UserServlet | `/UserServlet` | POST | Saves user profile to DB |

---

## Database Tables

### `food_items`
| Column | Type |
|---|---|
| id | INT PK AUTO_INCREMENT |
| food_name | VARCHAR(100) UNIQUE |
| calories | FLOAT |
| protein | FLOAT |
| carbs | FLOAT |
| fats | FLOAT |

### `diet_plans`
| Column | Type |
|---|---|
| id | INT PK AUTO_INCREMENT |
| goal | VARCHAR(50) |
| food_name | VARCHAR(100) |

### `users`
| Column | Type |
|---|---|
| id | INT PK AUTO_INCREMENT |
| name | VARCHAR(100) |
| age | INT |
| contact | VARCHAR(15) |
| email | VARCHAR(100) UNIQUE |
| goal | VARCHAR(50) |
| created_at | TIMESTAMP |
