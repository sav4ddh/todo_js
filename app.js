const todos = JSON.parse(localStorage.getItem("pepcoTodos")) || [];
let todaysTodos = [];
let errorBox = document.getElementById("errorBox");
let todoTaskForm = document.getElementById("todoTaskForm");
let todoShowBox = document.getElementById("todoShowBox");
let dateInput = document.getElementById("taskDueDate");
let upcomingContainer = document.getElementById("upcomingContainer");

const searchInput = document.querySelector("[data-search]");

let upComingTodoShowList = document.getElementById("upComingTodoShowList");
let todaysTodoShowList = document.getElementById("todaysTodoShowList");
let isOpen = false;

const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);
dateInput.defaultValue = today;

reloadTodoList(todos);
showTodaysTodos();

const closeForm = () => {
  todoTaskForm.style.display = "none";
  todoShowBox.style.display = "flex";
  isOpen = false;
};

function toggleTodoForm() {
  if (!isOpen) {
    todoTaskForm.style.display = "block";
    todoShowBox.style.display = "none";
    isOpen = true;
  } else {
    todoTaskForm.style.display = "none";
    todoShowBox.style.display = "flex";
    isOpen = false;
  }
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

searchInput.addEventListener("input", (e) => {
  const inputValue = e.target.value.toLowerCase();

  todos.forEach((todo) => {
    const task = todo.taskName.toLowerCase();
    const dueDate = todo.convertedTaskDueDate.toLowerCase();

    const isVisible = task.includes(inputValue) || dueDate.includes(inputValue);

    if (todo.element) {
      todo.element.classList.toggle("hide", !isVisible);
    }
  });
});

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

        const elementID = `todo-${todo__id}`;

        setTimeout(() => {
          const element = document.getElementById(elementID);
          if (element) todoDatas.element = element;
        }, 0);

        return `
          <div class="todoList" id="${elementID}">
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
              ${
                !todoDatas.isDone
                  ? `<i class='bxr  bx-check-circle' onclick="markAsDoneOrUndone(${todo__id})" ></i>`
                  : `<i class="bxr bxs-check-circle" onclick="markAsDoneOrUndone(${todo__id})"></i>`
              }
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

  localStorage.setItem("pepcoTodos", JSON.stringify(todos, ...todos));

  reloadTodoList(todos);
  showTodaysTodos();

  todoTaskForm.style.display = "none";
  todoShowBox.style.display = "flex";
  isOpen = false;
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
        const elementID = `todo-${todo__id}`;

        setTimeout(() => {
          const element = document.getElementById(elementID);
          if (element) todoDatas.element = element;
        }, 0);

        return `
          <div class="todoList" id="${elementID}">
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
              ${
                !todoDatas.isDone
                  ? `<i class='bxr  bx-check-circle' onclick="TodaysTodosMarkAsDoneOrUndone(${todo__id})" ></i>`
                  : `<i class="bxr bxs-check-circle" onclick="TodaysTodosMarkAsDoneOrUndone(${todo__id})"></i>`
              }
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
  localStorage.setItem("pepcoTodos", JSON.stringify(todos));
}

function markAsDoneOrUndone(todo__id) {
  todos[todo__id].isDone = !todos[todo__id].isDone;
  reloadTodoList(todos);
  localStorage.setItem("pepcoTodos", JSON.stringify(todos));
}

function deleteTodo(todoUniqueID) {
  const todoID = todos.findIndex((todo) => todo.uniqueID === todoUniqueID);
  if (todoID !== -1) {
    todos.splice(todoID, 1);
    reloadTodoList(todos);
    showTodaysTodos();

    localStorage.setItem("pepcoTodos", JSON.stringify(todos));
  } else {
    alert("ID Not Found. Refresh and try again!.");
  }
}
