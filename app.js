const todos = [];
let todaysTodos = [];
let errorBox = document.getElementById("errorBox");
let todoTaskForm = document.getElementById("todoTaskForm");
let todoShowBox = document.getElementById("todoShowBox");
let dateInput = document.getElementById("taskDueDate");
let upcomingContainer = document.getElementById("upcomingContainer");

let upComingTodoShowList = document.getElementById("upComingTodoShowList");
let todaysTodoShowList = document.getElementById("todaysTodoShowList");
let isOpen = true;

const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);
dateInput.defaultValue = today;

reloadTodoList(todos);
showTodaysTodos();

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
  form.taskDueDate.value = today;
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
  const todaysDate = convertISOToLongDate(today);

  if (todoDatas.length === 0) {
    upcomingContainer.style.display = "none";
  } else {
    upcomingTodos = todos.filter((todo) => {
      return todo.convertedTaskDueDate !== todaysDate;
    });

    if (upcomingTodos.length === 0) {
      upcomingContainer.style.display = "none";
    } else {
      upcomingContainer.style.display = "inline-block";
    }

    upComingTodoShowList.innerHTML = `
    ${todoDatas
      .map((todoDatas, todo__id) => {
        if (todoDatas.convertedTaskDueDate == todaysDate) {
          return;
        }

        return `
          <div class="todoList">
            <div class="todoIcon">
              <i class="bx bx-calendar-event"></i>
            </div>
            <div class="todo ${
              todoDatas.isDone ? "isDone" : ""
            } id="todo-${todo__id}">
              <p>${todoDatas.taskName}</p>
              <span>${todoDatas.convertedTaskDueDate}</span>
            </div>
            <div class="opButtons">
              <i class="bx bx-checks" onclick="markAsDoneOrUndone(${todo__id})"></i>
              <i class="bx bx-trash" onclick="deleteTodo(${
                todoDatas.uniqueID
              })"></i>
            </div>
          </div>
        `;
      })
      .join("")}
  `;
  }
}

function generateUniqueID(existingIDs) {
  let newID;
  do {
    newID = Math.floor(100000 + Math.random() * 900000);
  } while (existingIDs.includes(newID));
  return newID;
}

function addTodo(taskName, taskDescription, taskDueDate, taskPrioritization) {
  let convertedTaskDueDate = convertISOToLongDate(taskDueDate);
  let existingIDs = todos.map((todo) => todo.uniqueID);

  todos.push({
    uniqueID: generateUniqueID(existingIDs),
    taskName,
    taskDescription,
    convertedTaskDueDate,
    taskPrioritization,
    isDone: false,
  });
  reloadTodoList(todos);
  showTodaysTodos();

  isOpen = false;
  toggleTodoForm();
}

function showTodaysTodos() {
  const todaysDate = convertISOToLongDate(today);
  todaysTodos = todos.filter((todo) => {
    return todo.convertedTaskDueDate == todaysDate;
  });

  if (todaysTodos.length === 0) {
    todaysTodoShowList.innerHTML = `
      <div class="todoShowList" id="todoShowList">
        <div class="emptyTodoList">
          <img src="/empty.svg" alt="empty trolley" width="200px" />
          <h4>Empty todoList.</h4>
          <span
            >looks like you haven't added anything today. <br />
            Go ahead and add new task.</span
          >
        </div>
      </div>
    `;
  } else {
    todaysTodoShowList.innerHTML = `
    ${todaysTodos
      .map((todoDatas, todo__id) => {
        return `
          <div class="todoList">
            <div class="todoIcon">
              <i class="bx bx-calendar-star isToday"></i>
            </div>
            <div class="todo ${
              todoDatas.isDone ? "isDone" : ""
            } id="todo-${todo__id}">
              <p>${todoDatas.taskName}</p>
              <span>${todoDatas.convertedTaskDueDate}</span>
            </div>
            <div class="opButtons">
              <i class="bx bx-checks" onclick="TodaysTodosMarkAsDoneOrUndone(${todo__id})"></i>
              <i class="bx bx-trash" onclick="deleteTodo(${
                todoDatas.uniqueID
              })"></i>
            </div>
          </div>
        `;
      })
      .join("")}
  `;
  }
}

function TodaysTodosMarkAsDoneOrUndone(todo__id) {
  todaysTodos[todo__id].isDone = !todaysTodos[todo__id].isDone;
  showTodaysTodos();
}

function markAsDoneOrUndone(todo__id) {
  todos[todo__id].isDone = !todos[todo__id].isDone;
  reloadTodoList(todos);
}

function deleteTodo(todoUniqueID) {
  const todoID = todos.findIndex((todo) => todo.uniqueID === todoUniqueID);
  if (todoID !== -1) {
    todos.splice(todoID, 1);
    reloadTodoList(todos);
    showTodaysTodos();
  } else {
    alert("ID Not Found. Refresh and try again!.");
  }
}
