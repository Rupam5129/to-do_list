document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todo-input");
    const addBtn = document.getElementById("add-btn");
    const todoList = document.getElementById("todo-list");
    const clearBtn = document.getElementById("clear-btn");
    const dueDateInput = document.getElementById("due-date");
    const prioritySelect = document.getElementById("priority");
    const categorySelect = document.getElementById("category");
    const searchInput = document.getElementById("search");

    // Load tasks from localStorage on page load
    loadTasks();

    // Add a new task
    addBtn.addEventListener("click", () => {
        const taskText = todoInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = prioritySelect.value;
        const category = categorySelect.value;
        if (taskText !== "") {
            addTask(taskText, dueDate, priority, category);
            todoInput.value = "";
            dueDateInput.value = "";
            prioritySelect.value = "Low";
            categorySelect.value = "General";
            saveTasks();
        }
    });

    // Search function
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        document.querySelectorAll(".todo-item").forEach(item => {
            const taskText = item.querySelector(".task-header span").textContent.toLowerCase();
            if (taskText.includes(searchTerm)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });

    // Add task to the list
    function addTask(text, dueDate, priority, category, completed = false) {
        const li = document.createElement("li");
        li.classList.add("todo-item");
        if (completed) li.classList.add("completed");

        const taskHeader = document.createElement("div");
        taskHeader.classList.add("task-header");

        const span = document.createElement("span");
        span.textContent = text;

        const taskPriority = document.createElement("span");
        taskPriority.textContent = priority;
        taskPriority.classList.add("task-priority", priority);

        taskHeader.appendChild(span);
        taskHeader.appendChild(taskPriority);
        li.appendChild(taskHeader);

        const taskDetails = document.createElement("div");
        taskDetails.classList.add("task-details");
        taskDetails.innerHTML = `<strong>Due:</strong> ${dueDate || "N/A"} | <strong>Category:</strong> ${category}`;

        li.appendChild(taskDetails);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "&times;";
        deleteBtn.classList.add("task-delete-btn");
        deleteBtn.addEventListener("click", () => {
            li.remove();
            saveTasks();
        });

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll(".todo-item").forEach(task => {
            tasks.push({
                text: task.querySelector(".task-header span").textContent,
                dueDate: task.querySelector(".task-details").innerHTML.match(/<strong>Due:<\/strong> (.*?) \|/)[1],
                priority: task.querySelector(".task-priority").textContent,
                category: task.querySelector(".task-details").innerHTML.match(/<strong>Category:<\/strong> (.*?)$/)[1],
                completed: task.classList.contains("completed")
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Load tasks from localStorage
    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(task => addTask(task.text, task.dueDate, task.priority, task.category, task.completed));
    }

    // Clear all tasks
    clearBtn.addEventListener("click", () => {
        todoList.innerHTML = "";  // Clears all tasks from the list
        localStorage.removeItem("tasks"); // Remove all tasks from localStorage
    });
});