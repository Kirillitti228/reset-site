const USERS_KEY =
    "reset_users";

const CURRENT_USER_KEY =
    "reset_current_user";


let currentUser =
    localStorage.getItem(
        CURRENT_USER_KEY
    );


let habits = [];

let deleteHabitId =
    null;



/* =====================================================
   ELEMENTS
===================================================== */

const authScreen =
    document.getElementById(
        "authScreen"
    );


const appScreen =
    document.getElementById(
        "appScreen"
    );


const habitScreen =
    document.getElementById(
        "habitScreen"
    );


const emptyState =
    document.getElementById(
        "emptyState"
    );


const habitsSection =
    document.getElementById(
        "habitsSection"
    );


const habitsList =
    document.getElementById(
        "habitsList"
    );


const modal =
    document.getElementById(
        "modal"
    );



/* =====================================================
   USERS
===================================================== */

function getUsers() {

    try {

        return JSON.parse(
            localStorage.getItem(
                USERS_KEY
            )
        ) || [];

    } catch {

        return [];

    }

}


function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}



/* =====================================================
   USER HABITS
===================================================== */

function getHabitsKey() {

    return (
        "reset_habits_" +
        currentUser
    );

}


function loadHabits() {

    if (!currentUser) {

        habits = [];

        return;

    }


    try {

        habits =
            JSON.parse(
                localStorage.getItem(
                    getHabitsKey()
                )
            ) || [];

    } catch {

        habits = [];

    }

}


function saveHabits() {

    if (!currentUser) {

        return;

    }


    localStorage.setItem(
        getHabitsKey(),
        JSON.stringify(habits)
    );

}



/* =====================================================
   AUTH TABS
===================================================== */

document
    .getElementById("loginTab")
    .addEventListener(
        "click",
        showLogin
    );


document
    .getElementById("registerTab")
    .addEventListener(
        "click",
        showRegister
    );


function showLogin() {

    document
        .getElementById(
            "loginTab"
        )
        .classList
        .add("active");


    document
        .getElementById(
            "registerTab"
        )
        .classList
        .remove("active");


    document
        .getElementById(
            "loginForm"
        )
        .classList
        .remove("hidden");


    document
        .getElementById(
            "registerForm"
        )
        .classList
        .add("hidden");


    clearMessages();

}


function showRegister() {

    document
        .getElementById(
            "registerTab"
        )
        .classList
        .add("active");


    document
        .getElementById(
            "loginTab"
        )
        .classList
        .remove("active");


    document
        .getElementById(
            "registerForm"
        )
        .classList
        .remove("hidden");


    document
        .getElementById(
            "loginForm"
        )
        .classList
        .add("hidden");


    clearMessages();

}


function clearMessages() {

    document
        .getElementById(
            "loginMessage"
        )
        .textContent = "";


    document
        .getElementById(
            "registerMessage"
        )
        .textContent = "";

}



/* =====================================================
   REGISTER
===================================================== */

document
    .getElementById(
        "registerBtn"
    )
    .addEventListener(
        "click",
        register
    );


function register() {

    const name =
        document
            .getElementById(
                "registerName"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "registerEmail"
            )
            .value
            .trim()
            .toLowerCase();


    const password =
        document
            .getElementById(
                "registerPassword"
            )
            .value;


    const password2 =
        document
            .getElementById(
                "registerPassword2"
            )
            .value;


    const message =
        document
            .getElementById(
                "registerMessage"
            );


    message.textContent = "";



    if (!name) {

        message.textContent =
            "Enter your name.";

        return;

    }



    if (
        !email ||
        !email.includes("@")
    ) {

        message.textContent =
            "Enter a valid email.";

        return;

    }



    if (
        password.length < 4
    ) {

        message.textContent =
            "Password must contain at least 4 characters.";

        return;

    }



    if (
        password !==
        password2
    ) {

        message.textContent =
            "Passwords do not match.";

        return;

    }



    const users =
        getUsers();


    const existingUser =
        users.find(
            user =>
                user.email ===
                email
        );


    if (existingUser) {

        message.textContent =
            "This email is already registered.";

        return;

    }



    const newUser = {

        name:
            name,

        email:
            email,

        password:
            password

    };


    users.push(
        newUser
    );


    saveUsers(
        users
    );


    currentUser =
        email;


    localStorage.setItem(
        CURRENT_USER_KEY,
        currentUser
    );


    loadHabits();


    showApp();

}



/* =====================================================
   LOGIN
===================================================== */

document
    .getElementById(
        "loginBtn"
    )
    .addEventListener(
        "click",
        login
    );


function login() {

    const email =
        document
            .getElementById(
                "loginEmail"
            )
            .value
            .trim()
            .toLowerCase();


    const password =
        document
            .getElementById(
                "loginPassword"
            )
            .value;


    const message =
        document
            .getElementById(
                "loginMessage"
            );


    message.textContent = "";



    if (
        !email ||
        !password
    ) {

        message.textContent =
            "Enter your email and password.";

        return;

    }



    const users =
        getUsers();


    const user =
        users.find(
            item =>
                item.email === email &&
                item.password === password
        );


    if (!user) {

        message.textContent =
            "Wrong email or password.";

        return;

    }



    currentUser =
        user.email;


    localStorage.setItem(
        CURRENT_USER_KEY,
        currentUser
    );


    loadHabits();


    showApp();

}



/* =====================================================
   SCREEN MANAGEMENT
===================================================== */

function hideAllScreens() {

    authScreen
        .classList
        .add("hidden");


    appScreen
        .classList
        .add("hidden");


    habitScreen
        .classList
        .add("hidden");

}


function showAuth() {

    hideAllScreens();

    authScreen
        .classList
        .remove("hidden");

}


function showApp() {

    hideAllScreens();


    appScreen
        .classList
        .remove("hidden");


    const users =
        getUsers();


    const user =
        users.find(
            item =>
                item.email ===
                currentUser
        );


    if (user) {

        document
            .getElementById(
                "userName"
            )
            .textContent =
            user.name;

    }


    renderHabits();

}



/* =====================================================
   LOGOUT
===================================================== */

document
    .getElementById(
        "logoutBtn"
    )
    .addEventListener(
        "click",
        logout
    );


function logout() {

    currentUser =
        null;


    localStorage.removeItem(
        CURRENT_USER_KEY
    );


    habits = [];


    showAuth();

}



/* =====================================================
   ADD HABIT
===================================================== */

document
    .getElementById(
        "addHabitBtn"
    )
    .addEventListener(
        "click",
        openHabitCreator
    );


document
    .getElementById(
        "addHabitBtn2"
    )
    .addEventListener(
        "click",
        openHabitCreator
    );


function openHabitCreator() {

    hideAllScreens();


    habitScreen
        .classList
        .remove("hidden");


    document
        .getElementById(
            "habitNameInput"
        )
        .value = "";


    const now =
        new Date();


    now.setMinutes(
        now.getMinutes() -
        now.getTimezoneOffset()
    );


    document
        .getElementById(
            "habitDateInput"
        )
        .value =
        now
            .toISOString()
            .slice(
                0,
                16
            );

}



/* =====================================================
   BACK
===================================================== */

document
    .getElementById(
        "backBtn"
    )
    .addEventListener(
        "click",
        showApp
    );



/* =====================================================
   CREATE HABIT
===================================================== */

document
    .getElementById(
        "finishHabitBtn"
    )
    .addEventListener(
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


    const start =
        new Date(
            date
        ).getTime();


    if (
        Number.isNaN(start)
    ) {

        alert(
            "Invalid date."
        );

        return;

    }


    if (
        start >
        Date.now()
    ) {

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
            start

    };


    habits.push(
        newHabit
    );


    saveHabits();


    showApp();

}



/* =====================================================
   RENDER HABITS
===================================================== */

function renderHabits() {

    if (
        habits.length === 0
    ) {

        emptyState
            .classList
            .remove("hidden");


        habitsSection
            .classList
            .add("hidden");


        return;

    }


    emptyState
        .classList
        .add("hidden");


    habitsSection
        .classList
        .remove("hidden");


    habitsList.innerHTML = "";



    habits.forEach(
        habit => {

            const card =
                document
                    .createElement(
                        "div"
                    );


            card.className =
                "habit-item";


            card.innerHTML = `

                <div class="habit-top">

                    <div>

                        <h2 class="habit-name">

                            ${escapeHTML(
                                habit.name
                            )}

                        </h2>


                        <div class="habit-date">

                            Started:
                            ${formatDate(
                                habit.start
                            )}

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

                    <span>
                        DAYS
                    </span>

                    <span>
                        HOURS
                    </span>

                    <span>
                        MINUTES
                    </span>

                    <span>
                        SECONDS
                    </span>

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


                        modal
                            .classList
                            .remove(
                                "hidden"
                            );

                    }
                );

            }
        );


    updateTimers();

}



/* =====================================================
   TIMER
===================================================== */

function updateTimers() {

    habits.forEach(
        habit => {

            const timer =
                document.getElementById(
                    `timer-${habit.id}`
                );


            if (!timer) {

                return;

            }


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
                    ) /
                    3600
                );


            const minutes =
                Math.floor(
                    (
                        totalSeconds %
                        3600
                    ) /
                    60
                );


            const seconds =
                totalSeconds %
                60;


            timer.textContent =
                `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;



            /* ================= PROGRESS ================= */

            const sevenDays =
                7 *
                24 *
                60 *
                60 *
                1000;


            const percentage =
                Math.min(
                    100,
                    (
                        elapsed /
                        sevenDays
                    ) *
                    100
                );


            const progress =
                document.getElementById(
                    `progress-${habit.id}`
                );


            const percent =
                document.getElementById(
                    `percent-${habit.id}`
                );


            if (progress) {

                progress.style.width =
                    percentage +
                    "%";

            }


            if (percent) {

                percent.textContent =
                    Math.floor(
                        percentage
                    ) +
                    "%";

            }

        }
    );

}



/* =====================================================
   DELETE HABIT
===================================================== */

document
    .getElementById(
        "cancelDelete"
    )
    .addEventListener(
        "click",
        () => {

            deleteHabitId =
                null;


            modal
                .classList
                .add(
                    "hidden"
                );

        }
    );


document
    .getElementById(
        "confirmDelete"
    )
    .addEventListener(
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


            modal
                .classList
                .add(
                    "hidden"
                );


            renderHabits();

        }
    );



/* =====================================================
   HELPERS
===================================================== */

function pad(number) {

    return String(
        number
    ).padStart(
        2,
        "0"
    );

}


function formatDate(
    timestamp
) {

    return new Date(
        timestamp
    ).toLocaleString(
        "en-GB",
        {
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    );

}


function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}



/* =====================================================
   AUTO LOGIN
===================================================== */

if (currentUser) {

    loadHabits();

    showApp();

} else {

    showAuth();

}



/* =====================================================
   LIVE TIMER
===================================================== */

setInterval(
    updateTimers,
    1000
);