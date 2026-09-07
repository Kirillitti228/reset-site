const USER_KEY = "reset_user";
const HABITS_KEY = "reset_habits";

let user = JSON.parse(
    localStorage.getItem(USER_KEY)
);

let habits = JSON.parse(
    localStorage.getItem(HABITS_KEY)
) || [];

let deleteHabitId = null;


/* ================= ELEMENTS ================= */

const registerScreen =
    document.getElementById("registerScreen");

const appScreen =
    document.getElementById("appScreen");

const habitScreen =
    document.getElementById("habitScreen");

const emptyState =
    document.getElementById("emptyState");

const habitsSection =
    document.getElementById("habitsSection");

const habitsList =
    document.getElementById("habitsList");

const modal =
    document.getElementById("modal");


/* ================= START ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (user) {

            showApp();

        } else {

            showRegistration();

        }

    }
);


/* ================= REGISTRATION ================= */

document.getElementById(
    "registerBtn"
).addEventListener(
    "click",
    register
);


function register() {

    const name =
        document
            .getElementById("usernameInput")
            .value
            .trim();

    const email =
        document
            .getElementById("emailInput")
            .value
            .trim();

    const password =
        document
            .getElementById("passwordInput")
            .value
            .trim();


    if (!name) {

        alert("Enter your name.");

        return;

    }


    if (!email || !email.includes("@")) {

        alert("Enter a valid email.");

        return;

    }


    if (password.length < 4) {

        alert(
            "Password must contain at least 4 characters."
        );

        return;

    }


    user = {

        name: name,

        email: email

    };


    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
    );


    showApp();

}


/* ================= SCREENS ================= */

function hideAllScreens() {

    registerScreen.classList.add(
        "hidden"
    );

    appScreen.classList.add(
        "hidden"
    );

    habitScreen.classList.add(
        "hidden"
    );

}


function showRegistration() {

    hideAllScreens();

    registerScreen.classList.remove(
        "hidden"
    );

}


function showApp() {

    hideAllScreens();

    appScreen.classList.remove(
        "hidden"
    );


    document.getElementById(
        "userName"
    ).textContent =
        user.name;


    renderHabits();

}


/* ================= LOGOUT ================= */

document.getElementById(
    "logoutBtn"
).addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            USER_KEY
        );

        user = null;

        showRegistration();

    }
);


/* ================= ADD HABIT ================= */

document.getElementById(
    "addHabitBtn"
).addEventListener(
    "click",
    openHabitCreator
);


document.getElementById(
    "addHabitBtn2"
).addEventListener(
    "click",
    openHabitCreator
);


function openHabitCreator() {

    hideAllScreens();

    habitScreen.classList.remove(
        "hidden"
    );


    document.getElementById(
        "habitNameInput"
    ).value = "";


    const now =
        new Date();


    now.setMinutes(
        now.getMinutes() -
        now.getTimezoneOffset()
    );


    document.getElementById(
        "habitDateInput"
    ).value =
        now
            .toISOString()
            .slice(
                0,
                16
            );

}


/* ================= BACK ================= */

document.getElementById(
    "backBtn"
).addEventListener(
    "click",
    showApp
);


/* ================= CREATE HABIT ================= */

document.getElementById(
    "finishHabitBtn"
).addEventListener(
    "click",
    createHabit
);


function createHabit() {

    const name =
        document
            .getElementById(
                "habitNameInput"
            )
            .value
            .trim();


    const date =
        document
            .getElementById(
                "habitDateInput"
            )
            .value;


    if (!name) {

        alert(
            "Enter the habit name."
        );

        return;

    }


    if (!date) {

        alert(
            "Choose the date and time."
        );

        return;

    }


    const startTime =
        new Date(date).getTime();


    if (startTime > Date.now()) {

        alert(
            "The start time cannot be in the future."
        );

        return;

    }


    const newHabit = {

        id:
            Date.now(),

        name:
            name,

        start:
            startTime,

        goal:
            7

    };


    habits.push(
        newHabit
    );


    saveHabits();


    showApp();

}


/* ================= SAVE ================= */

function saveHabits() {

    localStorage.setItem(
        HABITS_KEY,
        JSON.stringify(habits)
    );

}


/* ================= RENDER ================= */

function renderHabits() {

    if (habits.length === 0) {

        emptyState.classList.remove(
            "hidden"
        );

        habitsSection.classList.add(
            "hidden"
        );

        return;

    }


    emptyState.classList.add(
        "hidden"
    );

    habitsSection.classList.remove(
        "hidden"
    );


    habitsList.innerHTML = "";


    habits.forEach(
        habit => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "habit-item";


            card.innerHTML = `

                <div class="habit-top">

                    <div>

                        <h2 class="habit-name">
                            ${escapeHTML(habit.name)}
                        </h2>

                        <div class="habit-date">
                            Started:
                            ${formatDate(habit.start)}
                        </div>

                    </div>

                    <button
                        class="delete-habit"
                        data-id="${habit.id}"
                    >
                        ×
                    </button>

                </div>


                <div
                    class="habit-timer"
                    id="timer-${habit.id}"
                >
                    00:00:00:00
                </div>


                <div class="timer-labels">

                    <span>DAYS</span>

                    <span>HOURS</span>

                    <span>MINUTES</span>

                    <span>SECONDS</span>

                </div>


                <div class="habit-progress">

                    <div class="progress-top">

                        <span>
                            7 day milestone
                        </span>

                        <span
                            id="percent-${habit.id}"
                        >
                            0%
                        </span>

                    </div>

                    <div class="progress">

                        <div
                            class="progress-bar"
                            id="progress-${habit.id}"
                        ></div>

                    </div>

                </div>

            `;


            habitsList.appendChild(
                card
            );

        }
    );


    document
        .querySelectorAll(
            ".delete-habit"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteHabitId =
                            Number(
                                button.dataset.id
                            );

                        modal.classList.remove(
                            "hidden"
                        );

                    }
                );

            }
        );


    updateTimers();

}


/* ================= TIMER ================= */

function updateTimers() {

    habits.forEach(
        habit => {

            const elapsed =
                Math.max(
                    0,
                    Date.now() -
                    habit.start
                );


            const totalSeconds =
                Math.floor(
                    elapsed / 1000
                );


            const days =
                Math.floor(
                    totalSeconds /
                    86400
                );


            const hours =
                Math.floor(
                    (
                        totalSeconds %
                        86400
                    ) / 3600
                );


            const minutes =
                Math.floor(
                    (
                        totalSeconds %
                        3600
                    ) / 60
                );


            const seconds =
                totalSeconds %
                60;


            const timer =
                document.getElementById(
                    `timer-${habit.id}`
                );


            if (!timer) {
                return;
            }


            timer.textContent =
                `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;


            const goal =
                7 * 86400000;


            const percent =
                Math.min(
                    100,
                    (elapsed / goal) *
                    100
                );


            const progress =
                document.getElementById(
                    `progress-${habit.id}`
                );


            const percentText =
                document.getElementById(
                    `percent-${habit.id}`
                );


            if (progress) {

                progress.style.width =
                    percent + "%";

            }


            if (percentText) {

                percentText.textContent =
                    Math.floor(percent) +
                    "%";

            }

        }
    );

}


function pad(number) {

    return String(
        number
    ).padStart(
        2,
        "0"
    );

}


/* ================= DELETE ================= */

document.getElementById(
    "cancelDelete"
).addEventListener(
    "click",
    () => {

        deleteHabitId =
            null;

        modal.classList.add(
            "hidden"
        );

    }
);


document.getElementById(
    "confirmDelete"
).addEventListener(
    "click",
    () => {

        habits =
            habits.filter(
                habit =>
                    habit.id !==
                    deleteHabitId
            );


        saveHabits();


        deleteHabitId =
            null;


        modal.classList.add(
            "hidden"
        );


        renderHabits();

    }
);


/* ================= HELPERS ================= */

function formatDate(timestamp) {

    return new Date(
        timestamp
    ).toLocaleString(
        "en-GB",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


/* ================= LIVE TIMER ================= */

setInterval(
    updateTimers,
    1000
);