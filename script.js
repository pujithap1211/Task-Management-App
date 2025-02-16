var tasks = [];

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("desc");
const dueDateInput = document.getElementById("due_date");
const priorityInput = document.getElementById("priority");
const update_button = document.getElementById("update_btn");
update_button.style.display = "none";

const submit_button = document.getElementById("submit_btn");
submit_button.addEventListener("click", fun);

function fun(event) {
    event.preventDefault();
    let id = Date.now();
    let title = titleInput.value;
    let description = descriptionInput.value;
    let dueDate = dueDateInput.value;
    let priority = priorityInput.value;
    console.log(priority, "hello");
    if (!title || !description || !dueDate || !priority) {
        alert("Please fill out all the fields");
        return;
    }
    let newTask = new Task(id, title, description, dueDate, priority, "pending");
    addTask(newTask);
    displayTasks(newTask, "pending");
    clear_contents();
}
class Task {
    constructor(id, title, description, dueDate, priority, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.addEventListener("DOMContentLoaded", function() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
})

function addTask(task) {
    tasks.push(task);
    saveTasks();
}

function displayTasks(task, section) {
    let myDiv = document.createElement("div");
    let Title = document.createElement("div");
    let Description = document.createElement("div");
    let DueDate = document.createElement("div");
    let Priority = document.createElement("div");

    Title.innerHTML = `<strong> Title:</strong> ${task.title}`;
    Description.innerHTML = `<strong> Description:</strong> ${task.description}`;
    DueDate.innerHTML = `<strong> DueDate:</strong> ${task.dueDate}`;
    Priority.innerHTML = `<strong> Priority:</strong> ${task.priority}`;

    myDiv.appendChild(Title);
    myDiv.appendChild(Description);
    myDiv.appendChild(DueDate);
    myDiv.appendChild(Priority);
    if (section === "pending") {
        const edit_btn = document.createElement("button");
        styleButton(edit_btn, "yellow", "Edit");
        myDiv.appendChild(edit_btn);
        edit_btn.addEventListener("click", function(event) { editTask(task, task.id, event) });

        const delete_btn = document.createElement("button");
        styleButton(delete_btn, "red", "Delete");
        myDiv.appendChild(delete_btn);
        delete_btn.addEventListener("click", function() { deleteTask(task.id, myDiv) });

        const completed_btn = document.createElement("button");
        styleButton(completed_btn, "green", "Mark as Completed");
        myDiv.appendChild(completed_btn);
        completed_btn.addEventListener("click", function() { completedTask(task.id, myDiv) });
    }

    styleDiv(myDiv);
    if (section === "pending") {
        document.getElementById("display_tasks").appendChild(myDiv);
    } else {
        document.getElementById("completed").appendChild(myDiv);
    }
}

function styleButton(button, color, text) {
    if (color === "yellow") {
        button.style.color = "black";
    } else {
        button.style.color = "white";
    }
    button.style.backgroundColor = color;
    button.textContent = text;
    button.style.cursor = "pointer";
    button.style.padding = "5px";
    button.style.margin = "2px";
    button.style.fontWeight = "bold";
    button.style.borderRadius = "7px";
    button.style.border = `1px solid ${color}`;

}

function clear_contents() {
    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("due_date").value = "";
    document.getElementById("priority").value = "";
}

function styleDiv(task) {
    task.style.border = "1px solid grey";
    task.style.borderRadius = "6px";
    task.style.backgroundColor = "rgba(250, 243, 243, 0.932)";
    task.style.padding = "5px";
    task.style.fontSize = "18px";
}

function deleteTask(id, myDiv) {
    tasks = tasks.filter(function(item) {
        return item.id !== id;
    });
    document.getElementById("display_tasks").removeChild(myDiv);
    saveTasks();
}

function completedTask(id, myDiv) {
    tasks.forEach(item => {
        if (item.id === id) {
            item.status = "completed";
        }
    })
    const buttons = myDiv.querySelectorAll("button");
    buttons.forEach(button => {
        myDiv.removeChild(button);
    })
    document.getElementById("completed").appendChild(myDiv);
    saveTasks();
    // document.getElementById("display_tasks").removeChild(myDiv);
}

function editTask(task, id, event) {
    document.getElementById("submit_btn").style.display = "none";
    document.getElementById("update_btn").style.display = "block";

    titleInput.value = task.title;
    descriptionInput.value = task.description;
    dueDateInput.value = task.dueDate;
    priorityInput.value = task.priority;

    const updateEventHandler = (event) => {
        event.preventDefault();

        tasks = tasks.map(item => {
            if (item.id === id) {
                item.title = titleInput.value;
                item.description = descriptionInput.value;
                item.dueDate = dueDateInput.value;
                item.priority = priorityInput.value;
            }
            return item;
        });

        renderTasks();
        saveTasks();

        document.getElementById("submit_btn").style.display = "block";
        document.getElementById("update_btn").style.display = "none";
        clear_contents();

        update_button.removeEventListener("click", updateEventHandler);
    };

    update_button.addEventListener("click", updateEventHandler);
}

function renderTasks() {

    const taskContainer = document.getElementById("display_tasks");
    taskContainer.innerHTML = "";

    const taskContainer2 = document.getElementById("completed");
    taskContainer2.innerHTML = "";

    tasks.forEach(task => {
        displayTasks(task, task.status);
    })
}

const priorityFilter = document.getElementById("priorityFilter");
const dateFilter = document.getElementById("dateFilter");
const statusFilter = document.getElementById("statusFilter");

priorityFilter.addEventListener("change", filtersChange);
dateFilter.addEventListener("change", filtersChange);
statusFilter.addEventListener("change", filtersChange);


function filtersChange() {
    const priority = priorityFilter.value;
    const date = dateFilter.value;
    const status = statusFilter.value;
    console.log(priority);
    console.log(tasks);

    console.log(date, "date");
    const filteredTasks = check(tasks, "pending");
    const completedTasks = check(tasks, "completed");

    console.log("Filtered tasks", filteredTasks);
    console.log("Completed tasks", completedTasks);
    renderFilteredTasks(filteredTasks, "pending");
    renderFilteredTasks(completedTasks, "completed");
}

function check(tasks, section) {
    const priority = priorityFilter.value;
    const date = dateFilter.value;
    const status = statusFilter.value;

    const repTasks = tasks.filter(task => {
        var priorityMatch = false;
        var statusMatch = false;
        var dateMatch = false;
        if (task.status === section) {
            if (task.priority === priority || priority === "all") {
                priorityMatch = true;
            }
            if (task.status === status || status === "all") {
                statusMatch = true;
            }
            if (date === "all" || checkDate(task.dueDate, date)) {
                dateMatch = true;
            }
            return priorityMatch && statusMatch && dateMatch;
        }
    })
    return repTasks;
}

function checkDate(dueDate, dateValue) {
    const today = new Date();
    const task_due_date = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    task_due_date.setHours(0, 0, 0, 0);

    if (dateValue === "today") {
        if ((today.getFullYear() === task_due_date.getFullYear()) && (today.getMonth() === task_due_date.getMonth()) && (today.getDate() === task_due_date.getDate())) {
            return true;
        }
    }
    if (dateValue === "next7Days") {
        const next_date = new Date();
        next_date.setDate(next_date.getDate() + 7);

        console.log("today date", today);
        console.log(next_date, "next 7 days date");
        console.log(task_due_date, "task due date");

        if (task_due_date >= today && task_due_date <= next_date) {
            console.log("you are there");
            return true;
        }
    }
}

function renderFilteredTasks(newTasks, section) {
    let taskContainer;
    if (section === "pending") {
        taskContainer = document.getElementById("display_tasks");
        taskContainer.innerHTML = "";

        newTasks.forEach(task => displayTasks(task, section));
    } else {
        taskContainer = document.getElementById("completed");
        taskContainer.innerHTML = "";

        newTasks.forEach(task => displayTasks(task, section));
    }
}