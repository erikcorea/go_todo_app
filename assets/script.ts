interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

interface ResponseData{
  message: string;
  data: Todo[];
}

interface CreateTodoResponse {
  message: string;
  dataID: string;
}


const localHostAddress = "http://localhost:9000/todo";
const newTodoInput = document.querySelector(
  "#new-todo input"
) as HTMLInputElement;
const submitButton = document.querySelector("#submit") as HTMLButtonElement;

let isEditingTask = false;
let editButtonTodoID = "";
let isComplete = false;


async function getTodos() {
  try {
    const response = await fetch(localHostAddress);
    const responseData: ResponseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error("Error:", error);
    return "could not getTodos: " + error;
  }
}

async function createTodo(data: { title: string }) {
  try {
    // send POST request with user input as the req body
    const response = await fetch(localHostAddress, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result: CreateTodoResponse = await response.json();
    console.log("success: ", result.message);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteTodo(TodoID: string) {
  try {
    const response = await fetch(`${localHostAddress}/${TodoID}`, {
      method: "DELETE",
    });
    const result = await response.json();
    console.log("success:", result.message);
  } catch(error){
    console.error("error:", error);
  }
}

async function updateTodo(id: string, data: {title: string, completed: boolean}){
  try{
    const response = await fetch(`${localHostAddress}/${id}`,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Success:", result);
  } catch(error){
    console.error("Error:", error);
  }
}

async function addTask() {
  const data = { title: newTodoInput.value };
  await createTodo(data);
  displayTodos();

  newTodoInput.value = "";
}

async function editTask(){
  const data = { title: newTodoInput.value, completed: isComplete };
  if(isEditingTask) await updateTodo(editButtonTodoID, data);
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

  let todoListContainer = document.querySelector("#todos") as HTMLDivElement;
  todoListContainer.innerHTML = "";

  if (todoList.length == 0) {
    todoListContainer.innerHTML += `
            <div class="todo">
                <span> You do not have any tasks </span>
            </div>
            `;
  } else {
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
  toggleTaskCompletion();
}
displayTodos();

function deleteTaskButton(){
  const deleteTodoButtons: HTMLButtonElement[] = Array.from(
    document.querySelectorAll(".delete")
  );

  for(const deleteButton of deleteTodoButtons){
    deleteButton.onclick = async function () {
      const TodoID = deleteButton.getAttribute("data-id") || "";
      await deleteTodo(TodoID);
      displayTodos();
    };
  }
}

function editTaskTitleButton(){
  const editTodoTitleButtons: HTMLButtonElement[] = Array.from(
    document.querySelectorAll(".edit")
  );

  for(const editButton of editTodoTitleButtons){
    const todoName = editButton.parentNode?.parentNode?.children[0] as HTMLSpanElement;

    editButton.onclick = async function () {
      newTodoInput.value = todoName.innerText;
      submitButton.innerHTML = "Edit";
      isEditingTask = true;

      editButtonTodoID = editButton.getAttribute("data-id") ?? '';
    };

    isComplete = JSON.parse(
      todoName.getAttribute("data-iscomplete") as string
    );
  };
}

function toggleTaskCompletion(){
  const editTaskCompleted: HTMLSpanElement[] = Array.from(
    document.querySelectorAll("#todoname")
  );

  for(const task of editTaskCompleted){
    task.onclick = async function() {
      const isTaskDone = JSON.parse(task.getAttribute("data-iscomplete") as string);
      const todoID = task.getAttribute("data-id") ?? '';

      const data = { title: task.innerText, completed: !isTaskDone };
      await updateTodo(todoID, data);
      displayTodos();
    };
  }
}

submitButton.addEventListener('click', () => isEditingTask ? editTask() : addTask())