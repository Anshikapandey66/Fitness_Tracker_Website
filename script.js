// -----------------------------
// DATA
// -----------------------------

let data = JSON.parse(localStorage.getItem("fitTrackData")) || {
    steps: 0,
    calories: 0,
    water: 0,
    workout: 0,
    foodCalories: 0
};

let timerSeconds = 0;
let timerInterval = null;


// -----------------------------
// SAVE DATA
// -----------------------------

function saveData() {
    localStorage.setItem("fitTrackData", JSON.stringify(data));
}


// -----------------------------
// UPDATE DASHBOARD
// -----------------------------

function updateDashboard() {

    document.getElementById("steps").innerText = data.steps;
    document.getElementById("calories").innerText = data.calories;
    document.getElementById("water").innerText = data.water;
    document.getElementById("waterBig").innerText = data.water;
    document.getElementById("workout").innerText = data.workout;
    document.getElementById("foodCalories").innerText =
        data.foodCalories;


    // Fitness score

    let stepScore = Math.min(data.steps / 10000, 1);
    let calorieScore = Math.min(data.calories / 500, 1);
    let waterScore = Math.min(data.water / 8, 1);
    let workoutScore = Math.min(data.workout / 60, 1);

    let score = Math.round(
        ((stepScore +
            calorieScore +
            waterScore +
            workoutScore) / 4) * 100
    );

    document.getElementById("fitnessScore").innerText = score;
    document.getElementById("scorePercent").innerText = score + "%";


    // Nutrition progress

    let foodProgress =
        Math.min((data.foodCalories / 2000) * 100, 100);

    document.getElementById("foodProgress").style.width =
        foodProgress + "%";


    updateGlasses();

    saveData();
}


// -----------------------------
// STEPS
// -----------------------------

function addSteps() {

    data.steps += 500;

    if (data.steps > 10000) {
        data.steps = 10000;
    }

    updateDashboard();
}


// -----------------------------
// CALORIES
// -----------------------------

function addCalories() {

    data.calories += 100;

    if (data.calories > 500) {
        data.calories = 500;
    }

    updateDashboard();
}


// -----------------------------
// WATER
// -----------------------------

function addWater() {

    data.water++;

    if (data.water > 8) {
        data.water = 8;
    }

    updateDashboard();
}


function updateGlasses() {

    const container =
        document.getElementById("glasses");

    container.innerHTML = "";

    for (let i = 1; i <= 8; i++) {

        let glass = document.createElement("span");

        glass.className =
            i <= data.water
                ? "glass filled"
                : "glass";

        glass.innerText = "💧";

        container.appendChild(glass);
    }
}


// -----------------------------
// WORKOUT
// -----------------------------

function addWorkout() {

    data.workout += 10;

    if (data.workout > 60) {
        data.workout = 60;
    }

    updateDashboard();
}


function startWorkout(type) {

    alert(
        type +
        " workout started! 💪\n\nTimer has been started."
    );

    startTimer();

    addWorkout();
}


// -----------------------------
// TIMER
// -----------------------------

function startTimer() {

    if (timerInterval) return;

    timerInterval = setInterval(() => {

        timerSeconds++;

        let minutes =
            Math.floor(timerSeconds / 60);

        let seconds =
            timerSeconds % 60;

        document.getElementById("timer").innerText =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

    }, 1000);
}


function pauseTimer() {

    clearInterval(timerInterval);

    timerInterval = null;
}


function resetTimer() {

    pauseTimer();

    timerSeconds = 0;

    document.getElementById("timer").innerText =
        "00:00";
}


// -----------------------------
// NUTRITION
// -----------------------------

function addFood() {

    let calories = prompt(
        "Enter food calories:"
    );

    calories = Number(calories);

    if (!isNaN(calories) && calories > 0) {

        data.foodCalories += calories;

        updateDashboard();
    }
}


// -----------------------------
// NAVIGATION
// -----------------------------

function showSection(sectionId, button) {

    document.querySelectorAll(".page")
        .forEach(page => {
            page.classList.remove("active-page");
        });

    document.getElementById(sectionId)
        .classList.add("active-page");


    document.querySelectorAll(".nav-btn")
        .forEach(btn => {
            btn.classList.remove("active");
        });

    button.classList.add("active");
}


// -----------------------------
// DARK MODE
// -----------------------------

function toggleTheme() {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );
}


// Restore dark mode

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
}


// -----------------------------
// RESET
// -----------------------------

function resetDay() {

    let confirmReset =
        confirm(
            "Reset all today's fitness data?"
        );

    if (!confirmReset) return;

    data = {
        steps: 0,
        calories: 0,
        water: 0,
        workout: 0,
        foodCalories: 0
    };

    updateDashboard();
}


// -----------------------------
// CHART
// -----------------------------

const ctx =
    document.getElementById("activityChart");

new Chart(ctx, {

    type: "bar",

    data: {

        labels: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ],

        datasets: [
            {
                label: "Workout Minutes",

                data: [
                    35,
                    50,
                    25,
                    60,
                    40,
                    55,
                    42
                ],

                borderRadius: 8
            }
        ]
    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: true
            }
        },

        scales: {

            y: {
                beginAtZero: true
            }
        }
    }
});


// Initial load

updateDashboard();
