// ============================================================
// NutriGuide — script.js
//
// BUGS FIXED FROM ORIGINAL:
// 1. showMessage() was written as a block comment `// function showMessage()`
//    — the function was never actually declared, just commented out.
// 2. recommendFood() only worked from JS food object; now also calls backend.
// 3. Login form only showed result in DOM — now also POSTs to UserServlet.
// 4. searchFood() now calls SearchFoodServlet (MySQL) and falls back to
//    local JS data if backend is unavailable (useful for demo without Tomcat).
// ============================================================

// ── Greeting (was commented out in original) ─────────────────────────────────
function showMessage() {
    alert("Welcome to NutriGuide!");
}

// ── Config: set this to your Tomcat URL when running the servlet backend ──────
const BACKEND_URL = "http://localhost:8080/nutriguide";
const USE_BACKEND  = false; // ← set to true when Tomcat is running

// ── Local food database (fallback / standalone mode) ─────────────────────────
const foods = {
    "egg":             { calories: 78,  protein: 6.0,  carbs: 0.6,  fats: 5.0  },
    "banana":          { calories: 89,  protein: 1.1,  carbs: 23.0, fats: 0.3  },
    "paneer":          { calories: 265, protein: 18.0, carbs: 1.2,  fats: 20.0 },
    "oats":            { calories: 389, protein: 17.0, carbs: 66.0, fats: 7.0  },
    "chicken breast":  { calories: 165, protein: 31.0, carbs: 0.0,  fats: 3.6  },
    "apple":           { calories: 52,  protein: 0.3,  carbs: 14.0, fats: 0.2  },
    "soya chunks":     { calories: 345, protein: 52.0, carbs: 33.0, fats: 0.5  },
    "milk":            { calories: 42,  protein: 3.4,  carbs: 5.0,  fats: 1.0  },
    "almonds":         { calories: 579, protein: 21.0, carbs: 22.0, fats: 49.0 },
    "mango":           { calories: 60,  protein: 0.8,  carbs: 15.0, fats: 0.4  },
    "orange":          { calories: 47,  protein: 0.9,  carbs: 11.8, fats: 0.1  },
    "grapes":          { calories: 69,  protein: 0.7,  carbs: 18.1, fats: 0.2  },
    "pineapple":       { calories: 50,  protein: 0.5,  carbs: 13.1, fats: 0.1  },
    "watermelon":      { calories: 30,  protein: 0.6,  carbs: 7.6,  fats: 0.2  },
    "papaya":          { calories: 43,  protein: 0.5,  carbs: 10.8, fats: 0.3  },
    "guava":           { calories: 68,  protein: 2.6,  carbs: 14.3, fats: 1.0  },
    "pomegranate":     { calories: 83,  protein: 1.7,  carbs: 18.7, fats: 1.2  },
    "strawberry":      { calories: 32,  protein: 0.7,  carbs: 7.7,  fats: 0.3  },
    "kiwi":            { calories: 61,  protein: 1.1,  carbs: 14.7, fats: 0.5  },
    "avocado":         { calories: 160, protein: 2.0,  carbs: 8.5,  fats: 14.7 },
    "potato":          { calories: 77,  protein: 2.0,  carbs: 17.5, fats: 0.1  },
    "sweet potato":    { calories: 86,  protein: 1.6,  carbs: 20.1, fats: 0.1  },
    "rice cooked":     { calories: 130, protein: 2.7,  carbs: 28.2, fats: 0.3  },
    "roti":            { calories: 297, protein: 11.0, carbs: 58.0, fats: 3.5  },
    "peanuts":         { calories: 567, protein: 25.8, carbs: 16.1, fats: 49.2 },
    "chickpeas":       { calories: 164, protein: 8.9,  carbs: 27.4, fats: 2.6  },
    "tofu":            { calories: 144, protein: 17.3, carbs: 3.0,  fats: 8.7  },
    "curd":            { calories: 98,  protein: 11.0, carbs: 4.0,  fats: 4.0  }
};

// ── Nutrition Search ──────────────────────────────────────────────────────────
async function searchFood() {
    const input  = document.getElementById("foodName");
    const result = document.getElementById("nutritionResult");
    const food   = input.value.trim().toLowerCase();

    if (!food) {
        result.innerHTML = "<p style='color:red'>Please enter a food name.</p>";
        return;
    }

    result.innerHTML = "<p>Searching…</p>";

    if (USE_BACKEND) {
        try {
            const res  = await fetch(`${BACKEND_URL}/SearchFoodServlet?food=${encodeURIComponent(food)}`);
            const data = await res.json();
            if (data.error) {
                result.innerHTML = `<h3>❌ ${data.error}</h3>`;
            } else {
                renderNutritionResult(result, data.food_name, data);
            }
            return;
        } catch (err) {
            console.warn("Backend unavailable, using local data:", err);
        }
    }

    // Fallback: local JS object
    if (foods[food]) {
        renderNutritionResult(result, food, foods[food]);
    } else {
        result.innerHTML = `<h3>❌ Food not found</h3>
            <p>Try: egg, banana, paneer, oats, chicken breast, apple, milk…</p>`;
    }
}

function renderNutritionResult(el, name, data) {
    el.innerHTML = `
        <h3>📋 ${name.toUpperCase()}</h3>
        <table style="width:100%;border-collapse:collapse;margin-top:10px">
            <tr><td><strong>Calories</strong></td><td>${data.calories} kcal</td></tr>
            <tr><td><strong>Protein</strong></td><td>${data.protein} g</td></tr>
            <tr><td><strong>Carbohydrates</strong></td><td>${data.carbs} g</td></tr>
            <tr><td><strong>Fats</strong></td><td>${data.fats} g</td></tr>
        </table>
    `;
}

// ── Food Recommendation ───────────────────────────────────────────────────────
async function recommendFood() {
    const protein  = Number(document.getElementById("proteinInput").value);
    const calories = Number(document.getElementById("calorieInput").value);
    const result   = document.getElementById("recommendationResult");

    if (isNaN(protein) || protein < 0) {
        result.innerHTML = "<p style='color:red'>Enter a valid protein amount.</p>";
        return;
    }
    if (isNaN(calories) || calories <= 0) {
        result.innerHTML = "<p style='color:red'>Enter a valid calorie limit.</p>";
        return;
    }

    result.innerHTML = "<p>Finding recommendations…</p>";

    if (USE_BACKEND) {
        try {
            const res  = await fetch(
                `${BACKEND_URL}/RecommendationServlet?protein=${protein}&calories=${calories}`
            );
            const data = await res.json();
            renderRecommendations(result, data);
            return;
        } catch (err) {
            console.warn("Backend unavailable, using local data:", err);
        }
    }

    // Fallback: local JS
    const matches = Object.entries(foods)
        .filter(([, v]) => v.protein >= protein && v.calories <= calories)
        .map(([name, v]) => ({ food_name: name, protein: v.protein, calories: v.calories }));

    renderRecommendations(result, matches);
}

function renderRecommendations(el, items) {
    if (!items || items.length === 0) {
        el.innerHTML = "<h3>No matching foods found.</h3><p>Try relaxing the filters.</p>";
        return;
    }
    const rows = items.map(f =>
        `<tr>
            <td style="padding:6px 10px">${capitalize(f.food_name)}</td>
            <td style="padding:6px 10px">${f.protein}g</td>
            <td style="padding:6px 10px">${f.calories} kcal</td>
        </tr>`
    ).join("");
    el.innerHTML = `
        <h3>🥗 Recommended Foods</h3>
        <table style="width:100%;border-collapse:collapse;margin-top:10px">
            <thead>
                <tr style="background:#e8f5e9">
                    <th style="padding:8px;text-align:left">Food</th>
                    <th style="padding:8px;text-align:left">Protein</th>
                    <th style="padding:8px;text-align:left">Calories</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;
}

// ── BMI Calculator ────────────────────────────────────────────────────────────
function calculateBMI() {
    const height = Number(document.getElementById("height").value);
    const weight = Number(document.getElementById("weight").value);
    const result = document.getElementById("bmiResult");

    if (!height || !weight || height <= 0 || weight <= 0) {
        result.innerHTML = "<p style='color:red'>Please enter valid height and weight.</p>";
        return;
    }

    const bmi      = (weight / ((height / 100) ** 2)).toFixed(2);
    const category = getBMICategory(bmi);
    const advice   = getBMIAdvice(category);
    const color    = { "Underweight": "#f59e0b", "Normal Weight": "#10b981",
                       "Overweight": "#f97316", "Obese": "#ef4444" }[category] || "#333";

    result.innerHTML = `
        <h3>📊 Your BMI Result</h3>
        <p><strong>BMI:</strong> <span style="font-size:24px;color:${color}">${bmi}</span></p>
        <p><strong>Category:</strong> <span style="color:${color}">${category}</span></p>
        <p><strong>Advice:</strong> ${advice}</p>
        <div style="margin-top:12px;background:#e5e7eb;border-radius:8px;height:12px;overflow:hidden">
            <div style="height:100%;width:${Math.min(bmi / 40 * 100, 100)}%;
                background:${color};transition:width 0.5s;border-radius:8px"></div>
        </div>
        <p style="font-size:12px;color:#999;margin-top:4px">BMI scale: 0 → 40+</p>
    `;
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25)   return "Normal Weight";
    if (bmi < 30)   return "Overweight";
    return "Obese";
}

function getBMIAdvice(category) {
    const map = {
        "Underweight":   "Increase calorie and protein intake. Consider consulting a nutritionist.",
        "Normal Weight": "Maintain your current healthy lifestyle with balanced meals.",
        "Overweight":    "Increase physical activity and reduce excess calorie intake.",
        "Obese":         "Consult a healthcare professional and follow a structured diet plan."
    };
    return map[category] || "";
}

// ── Login / Profile Form ──────────────────────────────────────────────────────
const userForm = document.getElementById("userForm");
if (userForm) {
    userForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name    = document.getElementById("name").value.trim();
        const age     = document.getElementById("age").value;
        const contact = document.getElementById("contact").value.trim();
        const email   = document.getElementById("email").value.trim();
        const goal    = document.getElementById("goal").value;
        const result  = document.getElementById("profileResult");

        if (!name || !age || !email || !goal) {
            result.innerHTML = "<p style='color:red'>Please fill all required fields.</p>";
            return;
        }

        // Show immediately in DOM
        result.innerHTML = `
            <h3>✅ Profile Saved!</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Age:</strong> ${age}</p>
            <p><strong>Contact:</strong> ${contact}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Goal:</strong> ${goal}</p>
        `;

        // Also try to save to backend
        if (USE_BACKEND) {
            try {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("age", age);
                formData.append("contact", contact);
                formData.append("email", email);
                formData.append("goal", goal);

                const res  = await fetch(`${BACKEND_URL}/UserServlet`, {
                    method: "POST", body: formData
                });
                const data = await res.json();
                if (!data.success) {
                    result.innerHTML += `<p style='color:orange'>⚠️ ${data.message}</p>`;
                }
            } catch (err) {
                result.innerHTML += "<p style='color:orange'>⚠️ Could not save to database.</p>";
            }
        }
    });
}

// ── Hero Search (index.html) ──────────────────────────────────────────────────
const heroSearch = document.querySelector(".hero button");
if (heroSearch) {
    heroSearch.addEventListener("click", function () {
        const val = document.querySelector(".hero input").value.trim();
        if (val) {
            window.location.href = `nutrition.html?food=${encodeURIComponent(val)}`;
        }
    });
}

// On nutrition page, auto-search if ?food= param present
window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const preFood = params.get("food");
    if (preFood && document.getElementById("foodName")) {
        document.getElementById("foodName").value = preFood;
        searchFood();
    }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function capitalize(str) {
    return str.replace(/\b\w/g, c => c.toUpperCase());
}
