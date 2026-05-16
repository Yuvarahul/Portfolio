/* =========================================================
FILE: todo.js
CRUD + LOCAL STORAGE + FILTERING
========================================================= */

/* -------------------------
STATE MANAGEMENT
------------------------- */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

/* -------------------------
DOM ELEMENTS
------------------------- */

const todoForm =
    document.getElementById("todoForm");

const taskInput =
    document.getElementById("taskInput");

const taskList =
    document.getElementById("taskList");

const taskCount =
    document.getElementById("taskCount");

const filterButtons =
    document.querySelectorAll(".filter-btn");

/* =========================================================
SAVE TO LOCAL STORAGE
========================================================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

/* =========================================================
RENDER TASKS
========================================================= */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks =
            tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {

        filteredTasks =
            tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li =
            document.createElement("li");

        li.className = "task-item";

        li.dataset.id = task.id;

        li.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    class="toggle-task"
                    ${task.completed ? "checked" : ""}
                />

                <span class="task-text ${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>

            </div>

            <div class="actions">

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>

        `;

        taskList.appendChild(li);
    });

    updateTaskCount();
}

/* =========================================================
UPDATE TASK COUNT
========================================================= */

function updateTaskCount() {

    const activeTasks =
        tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        `${activeTasks} active task(s) remaining`;
}

/* =========================================================
CREATE TASK
========================================================= */

todoForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText =
        taskInput.value.trim();

    if (taskText === "") return;

    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();

    taskInput.value = "";
});

/* =========================================================
EVENT DELEGATION
UPDATE / DELETE / TOGGLE
========================================================= */

taskList.addEventListener("click", function(event) {

    const taskItem =
        event.target.closest(".task-item");

    if (!taskItem) return;

    const taskId =
        Number(taskItem.dataset.id);

    const task =
        tasks.find(task => task.id === taskId);

    /* DELETE */

    if (event.target.classList.contains("delete-btn")) {

        tasks =
            tasks.filter(task => task.id !== taskId);

        saveTasks();

        renderTasks();
    }

    /* EDIT */

    if (event.target.classList.contains("edit-btn")) {

        const updatedText =
            prompt("Edit task:", task.text);

        if (updatedText !== null &&
            updatedText.trim() !== "") {

            task.text =
                updatedText.trim();

            saveTasks();

            renderTasks();
        }
    }
});

/* =========================================================
TOGGLE COMPLETION
========================================================= */

taskList.addEventListener("change", function(event) {

    if (event.target.classList.contains("toggle-task")) {

        const taskItem =
            event.target.closest(".task-item");

        const taskId =
            Number(taskItem.dataset.id);

        const task =
            tasks.find(task => task.id === taskId);

        task.completed =
            event.target.checked;

        saveTasks();

        renderTasks();
    }
});

/* =========================================================
FILTER TASKS
========================================================= */

filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        currentFilter =
            this.dataset.filter;

        renderTasks();
    });
});

/* =========================================================
INITIAL RENDER
========================================================= */

renderTasks();