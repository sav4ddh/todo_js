const todos = [];
let errorBox = document.getElementById("errorBox");
let todoTaskForm = document.getElementById("todoTaskForm");
let todoShowBox = document.getElementById("todoShowBox");
let dateInput = document.getElementById("taskDueDate");

let upComingTodoShowList = document.getElementById("upComingTodoShowList");
let isOpen = true;

const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

function toggleTodoForm() {
  if (isOpen) {
    todoTaskForm.style.display = "block";
    todoShowBox.style.display = "none";
  } else {
    todoTaskForm.style.display = "none";
    todoShowBox.style.display = "flex";
  }
  isOpen = !isOpen;
}

function getTodoFormDetails(form) {
  const taskName = form.taskName.value;
  const taskDescription = form.taskDesc.value;
  const taskDueDate = form.taskDueDate.value;
  const taskPrioritization = form.taskPrioritization.value;

  if (taskName === "" || taskDueDate === "" || taskPrioritization === "") {
    errorBox.style.display = "flex";
    errorBox.innerHTML = `
        <i class="bx bx-alert-triangle"></i>
        <span>Make sure all required fields are filled.</span> `;
    return;
  }

  if (taskName.length > 40) {
    errorBox.style.display = "flex";
    errorBox.innerHTML = `
        <i class="bx bx-alert-triangle"></i>
        <span>The input cannot be more than 40 characters long.</span> `;
    return;
  }

  if (taskName) errorBox.style.display = "none";
  addTodo(taskName, taskDescription, taskDueDate, taskPrioritization);
}

function addTodo(taskName, taskDescription, taskDueDate, taskPrioritization) {
  todos.push({ taskName, taskDescription, taskDueDate, taskPrioritization });
  console.log(todos);
  reloadTodoList();

  isOpen = false;
  toggleTodoForm();
}

function reloadTodoList() {
  upComingTodoShowList.innerHTML = `
  ${todos
    .map((todo, id) => {
      return `
        <div class="todoList">
            <div class="todoIcon">
              <i class="bx bx-calendar-event"></i>
            </div>
            <div class="todo">
              <p>${todo.taskName}</p>
              <span>${todo.taskDueDate}</span>
            </div>
            <div class="opButtons">
              <i class="bx bx-checks"></i>
              <i class="bx bx-trash"></i>
            </div>
        </div>
      `;
    })
    .join("")}
  `;
}

// !  #TODO:
// !  [+] #0: Remove append child fn and use innerHTML like react.
// !  [-] #1: Redirect to todos page when user clicked "addTodo" button
// !  [-] #2: Change the format of dueDate given by the user ie: "2025-06-25" to "25 June 2025"
// !  [-] #3: Filter the dates into today and upcoming
// !  [-] #4: Option to Mark As Done and Delete todo.
// !  [-] #5: Option to search todos.
