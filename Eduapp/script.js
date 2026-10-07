// Get elements from HTML
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");

const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const filterInput = document.getElementById("filterInput");


// Load tasks from localStorage
let tasks = JSON.parse(
    localStorage.getItem("eduTrackTasks")
) || [
    {
        id: 1,
        name: "Revise JavaScript Operators",
        subject: "JavaScript",
        completed: false
    },
    {
        id: 2,
        name: "Practice SQL Queries",
        subject: "SQL",
        completed: false
    },
    {
        id: 3,
        name: "Revise DBMS Keys",
        subject: "DBMS",
        completed: true
    }
];


// Save tasks in localStorage
function saveTasks() {

    localStorage.setItem(
        "eduTrackTasks",
        JSON.stringify(tasks)
    );
}


// Display tasks
function displayTasks() {

    const searchText =
        searchInput.value.toLowerCase();

    const filter =
        filterInput.value;


    const filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.name.toLowerCase()
                .includes(searchText) ||
            task.subject.toLowerCase()
                .includes(searchText);


        let matchesFilter = true;

        if (filter === "completed") {
            matchesFilter = task.completed;
        }

        if (filter === "pending") {
            matchesFilter = !task.completed;
        }


        return matchesSearch && matchesFilter;
    });


    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty">
                No tasks found.
            </div>
        `;

        return;
    }


    taskList.innerHTML =
        filteredTasks.map(task => {

            return `
                <div class="task ${
                    task.completed ? "completed" : ""
                }">

                    <div class="task-left">

                        <input
                            type="checkbox"
                            ${
                                task.completed
                                    ? "checked"
                                    : ""
                            }
                            onchange="toggleTask(${task.id})"
                        >

                        <div>
                            <span class="task-name">
                                ${task.name}
                            </span>

                            <span class="task-subject">
                                ${task.subject}
                            </span>
                        </div>

                    </div>


                    <div class="task-actions">

                        <button
                            class="delete-button"
                            onclick="deleteTask(${task.id})"
                        >
                            🗑️
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


// Add new task
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const taskName =
        taskInput.value.trim();


    if (taskName === "") {
        return;
    }


    const newTask = {

        id: Date.now(),

        name: taskName,

        subject: subjectInput.value,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();

    displayTasks();

    updateStats();


    taskForm.reset();

    taskInput.focus();

});


// Complete / uncomplete task
function toggleTask(taskId) {

    const task =
        tasks.find(task => task.id === taskId);


    if (!task) {
        return;
    }


    task.completed =
        !task.completed;


    saveTasks();

    displayTasks();

    updateStats();
}


// Delete task
function deleteTask(taskId) {

    tasks =
        tasks.filter(task => task.id !== taskId);


    saveTasks();

    displayTasks();

    updateStats();
}


// Update dashboard statistics
function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    const progress =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    document.getElementById(
        "totalTasks"
    ).textContent = total;


    document.getElementById(
        "completedTasks"
    ).textContent = completed;


    document.getElementById(
        "pendingTasks"
    ).textContent = pending;


    document.getElementById(
        "progressPercent"
    ).textContent = progress + "%";


    document.getElementById(
        "goalProgress"
    ).textContent = progress + "%";
}


// Search tasks
searchInput.addEventListener(
    "input",
    displayTasks
);


// Filter tasks
filterInput.addEventListener(
    "change",
    displayTasks
);


// Dark mode
const themeButton =
    document.getElementById(
        "themeButton"
    );


themeButton.addEventListener(
    "click",
    function() {

        document.body.classList.toggle("dark");


        const darkMode =
            document.body.classList.contains("dark");


        themeButton.textContent =
            darkMode ? "☀️" : "🌙";


        localStorage.setItem(
            "eduTrackDarkMode",
            darkMode
        );
    }
);


// Load saved theme
function loadTheme() {

    const darkMode =
        localStorage.getItem(
            "eduTrackDarkMode"
        );


    if (darkMode === "true") {

        document.body.classList.add("dark");

        themeButton.textContent = "☀️";
    }
}


// Start application
displayTasks();

updateStats();

loadTheme();