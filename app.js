const todos = [];
let errorBox = document.getElementById("errorBox");
let todoTaskForm = document.getElementById("todoTaskForm");
let todoShowBox = document.getElementById("todoShowBox");
let dateInput = document.getElementById("taskDueDate");

let upComingTodoShowList = document.getElementById("upComingTodoShowList");
let isOpen = true;

reloadTodoList(todos);

const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);
dateInput.defaultValue = today;

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

  form.taskName.value = "";
  form.taskDesc.value = "";
  taskDueDate.value = today;
  form.taskPrioritization.value = "";
}

function convertISOToLongDate(ISODateString) {
  const date = new Date(ISODateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function reloadTodoList(todoDatas) {
  if (todoDatas.length === 0) {
    upComingTodoShowList.innerHTML = `
      <div class="todoShowList" id="todoShowList">
        <div class="emptyTodoList">
          <img src="/empty.svg" alt="empty trolley" width="200px" />
          <h4>Empty todoList.</h4>
          <span
            >looks like you haven't added anything to your app. <br />
            Go ahead and add new task.</span
          >
        </div>
      </div>
    `;
  } else {
    upComingTodoShowList.innerHTML = `
    ${todoDatas
      .map((todoDatas, id) => {
        console.log("Console from reloadTodoList: ", todoDatas);
        return `
          <div class="todoList">
            <div class="todoIcon">
              <i class="bx bx-calendar-event"></i>
            </div>
            <div class="todo">
              <p>${todoDatas.taskName}</p>
              <span>${todoDatas.convertedTaskDueDate}</span>
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
}

function addTodo(taskName, taskDescription, taskDueDate, taskPrioritization) {
  let convertedTaskDueDate = convertISOToLongDate(taskDueDate);
  todos.push({
    taskName,
    taskDescription,
    convertedTaskDueDate,
    taskPrioritization,
  });
  console.log(todos);
  reloadTodoList(todos);

  isOpen = false;
  toggleTodoForm();
}

// !  #TODO:
// !  [+] #0: Remove append child fn and use innerHTML like react.
// !  [+] #1: Redirect to todos page when user clicked "addTodo" button
// !  [+] #2: Change the format of dueDate given by the user ie: "2025-06-25" to "25 June 2025"
// !  [-] #3: Filter the dates into today and upcoming
// !  [-] #4: Option to Mark As Done and Delete todo.
// !  [-] #5: Option to search todos
