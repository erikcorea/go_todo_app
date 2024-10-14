"use strict";
const localHostAddress = "http://localhost:9000/todo";
const newTodoInput = document.querySelector("#new-todo input");
const submitButton = document.querySelector("#submit");
let isEditingTask = false;
let editButtonTodoID = "";
async function getTodos() {
    try {
        const response = await fetch(localHostAddress);
        const responseData = await response.json();
        return responseData.data;
    }
    catch (error) {
        console.error("Error:", error);
        return "could not getTodos: " + error;
    }
}
async function createTodo(data) {
    try {
        // send POST request with user input as the req body
        const response = await fetch(localHostAddress, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("success: ", result.message);
    }
    catch (error) {
        console.error("Error:", error);
    }
}
async function deleteTodo(TodoID) {
    try {
        const response = await fetch(`${localHostAddress}/${TodoID}`, {
            method: "DELETE",
        });
        const result = await response.json();
        console.log("success:", result.message);
    }
    catch (error) {
        console.error("error:", error);
    }
}
async function updateTodo(id, data) {
    try {
        const response = await fetch(`${localHostAddress}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("Success:", result);
    }
    catch (error) {
        console.error("Error:", error);
    }
}
async function addTask() {
    const data = { title: newTodoInput.value };
    await createTodo(data);
    displayTodos();
    newTodoInput.value = "";
}
async function editTask() {
    const data = { title: newTodoInput.value, completed: false };
    if (isEditingTask)
        await updateTodo(editButtonTodoID, data);
    displayTodos();
    newTodoInput.value == "";
    isEditingTask = false;
    submitButton.innerHTML = "Add";
}
async function displayTodos() {
    const todoList = await getTodos();
    if (typeof todoList === "string") {
        console.error(todoList);
        return;
    }
    let todoListContainer = document.querySelector("#todos");
    todoListContainer.innerHTML = "";
    if (todoList.length == 0) {
        todoListContainer.innerHTML += `
            <div class="todo">
                <span> You do not have any tasks </span>
            </div>
            `;
    }
    else {
        todoList.forEach((todo) => {
            todoListContainer.innerHTML += `
        <div class="todo">
          <span
            id="todoname"
            style="text-decoration:${todo.completed ? "line-through" : ""}"
            data-iscomplete="${todo.completed}"
            data-id="${todo.id}"
          >
            ${todo.title}
            </span>

            <div class="actions">
                <button data-id=${todo.id} class="edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button data-id=${todo.id} class="delete">
                <i class="far fa-trash-alt"></i>
                </button>
            <div>
            
        </div>
        `;
        });
    }
    deleteTaskButton();
    editTaskTitleButton();
}
displayTodos();
function deleteTaskButton() {
    const deleteTodoButtons = Array.from(document.querySelectorAll(".delete"));
    for (const deleteButton of deleteTodoButtons) {
        deleteButton.onclick = async function () {
            const TodoID = deleteButton.getAttribute("data-id") || "";
            await deleteTodo(TodoID);
            displayTodos();
        };
    }
}
function editTaskTitleButton() {
    var _a, _b;
    const editTodoTitleButtons = Array.from(document.querySelectorAll(".edit"));
    for (const editButton of editTodoTitleButtons) {
        const todoName = (_b = (_a = editButton.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.children[0];
        editButton.onclick = async function () {
            var _a;
            newTodoInput.value = todoName.innerText;
            submitButton.innerHTML = "Edit";
            isEditingTask = true;
            editButtonTodoID = (_a = editButton.getAttribute("data-id")) !== null && _a !== void 0 ? _a : '';
        };
    }
}
submitButton.addEventListener('click', () => isEditingTask ? editTask() : addTask());
//# sourceMappingURL=script.js.map