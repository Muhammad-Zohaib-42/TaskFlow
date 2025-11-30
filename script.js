const openOverlayBtn = document.querySelector(".add-task-btn");
const closeOverlayBtn = document.querySelector(".close-overlay");
const overlay = document.querySelector(".overlay");
const form = document.querySelector("form");
const taskTitleInput = document.querySelector("#task-title-input");
const taskDescriptionInput = document.querySelector("#task-description-input");
const submitBtn = document.querySelector(".submit-btn");
const todoContainer = document.querySelector("#todo-container");
const inprogressContainer = document.querySelector("#inprogress-container");
const doneContainer = document.querySelector("#done-container");
const todoEmptyPlaceholder = document.querySelector(".todo-empty-placeholder");
const inprogressEmptyPlaceholder = document.querySelector(
  ".inprogress-empty-placeholder"
);
const doneEmptyPlaceholder = document.querySelector(".done-empty-placeholder");
const main = document.querySelector("main");
const exampleCard = document.querySelector(".example-card");
const containers = document.querySelectorAll(".container");
const newCountElement = document.querySelector(".new-count");
const inprogressCountElement = document.querySelector(".inprogress-count");
const doneCountElement = document.querySelector(".done-count");

let tasksData = JSON.parse(localStorage.getItem("tasksData")) || [];
let hold = false;
let cardWidth = null;
let selectedCard = null;
let selectedCardId = null;
let selectedCardTitle = null;
let selectedCardDescription = null;
let selectedContainer = null;
let editTaskId = null;

openOverlayBtn.addEventListener("click", () => {
  overlay.classList.add("show");
  taskTitleInput.focus();
});

closeOverlayBtn.addEventListener("click", () => {
  overlay.classList.remove("show");
});

function handleCountElements() {
  newCountElement.innerText = tasksData.filter(
    (taskData) => taskData.new
  ).length;
  inprogressCountElement.innerText = tasksData.filter(
    (taskData) => taskData.inprogress
  ).length;
  doneCountElement.innerText = tasksData.filter(
    (taskData) => taskData.done
  ).length;
}
handleCountElements();

function manageEmptyStates() {
  const newTasks = tasksData.filter((taskData) => taskData.new);
  const inprogressTasks = tasksData.filter((taskData) => taskData.inprogress);
  const doneTasks = tasksData.filter((taskData) => taskData.done);

  if (newTasks.length) {
    todoEmptyPlaceholder.classList.add("hide");
  } else {
    todoEmptyPlaceholder.classList.remove("hide");
  }

  if (inprogressTasks.length) {
    inprogressEmptyPlaceholder.classList.add("hide");
  } else {
    inprogressEmptyPlaceholder.classList.remove("hide");
  }

  if (doneTasks.length) {
    doneEmptyPlaceholder.classList.add("hide");
  } else {
    doneEmptyPlaceholder.classList.remove("hide");
  }
}
manageEmptyStates();

function renderTasks() {
  todoContainer.innerHTML = "";
  inprogressContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  tasksData.forEach((taskData) => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = taskData.id;
    card.innerHTML = `
            <h2>${taskData.title}</h2>
            <p>${taskData.description}</p>
            <div class="card-btn-wrapper" id=${taskData.id}>
              <button class="edit-btn" title="edit task">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a1a1a6"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 20h9"></path>
                  <path
                    d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                  ></path>
                </svg>
              </button>
              <button class="delete-btn" title="delete task">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6l-1 14H6L5 6"></path>
                  <path d="M10 11v6"></path>
                  <path d="M14 11v6"></path>
                </svg>
              </button>
            </div>
        `;

    if (taskData.new) {
      todoContainer.appendChild(card);
    } else if (taskData.inprogress) {
      inprogressContainer.appendChild(card);
    } else if (taskData.done) {
      doneContainer.appendChild(card);
    }
  });

  manageEmptyStates();
  handleCountElements();
  localStorage.setItem("tasksData", JSON.stringify(tasksData));
}
renderTasks();

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function handleFormSubmit() {
  if (editTaskId) {
    tasksData.forEach((taskData) => {
      if (taskData.id == editTaskId) {
        taskData.title = taskTitleInput.value;
        taskData.description = taskDescriptionInput.value;
      }
    });
    editTaskId = null;
    submitBtn.innerText = "Add Task";
  } else {
    const task = {
      id: generateUUID(),
      title: taskTitleInput.value.trim(),
      description: taskDescriptionInput.value.trim(),
      new: true,
      inprogress: false,
      done: false,
    };
    tasksData.push(task);
  }

  renderTasks();
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";
  overlay.classList.remove("show");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleFormSubmit();
});

main.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  const editBtn = e.target.closest(".edit-btn");

  if (editBtn || deleteBtn) {
    e.stopPropagation();
  }

  if (deleteBtn) {
    const deleteCardId = deleteBtn.parentElement.id;
    tasksData = tasksData.filter((taskData) => taskData.id !== deleteCardId);
    renderTasks();
  }

  if (editBtn) {
    editTaskId = editBtn.parentElement.id;
    overlay.classList.add("show");
    taskTitleInput.focus();
    taskTitleInput.value =
      editBtn.parentElement.previousElementSibling.previousElementSibling.innerText;
    taskDescriptionInput.value =
      editBtn.parentElement.previousElementSibling.innerText;
    submitBtn.innerText = "Save Task";
  }
});

main.addEventListener("pointerdown", (e) => {
   if (e.target.closest(".edit-btn, .delete-btn")) return;
  main.setPointerCapture(e.pointerId);
  selectedCard = e.target.closest(".card");
  selectedContainer = e.target.closest(".container");
  if (selectedCard) {
    selectedCardId = selectedCard.id;
    hold = true;
    main.style.cursor = "grabbing";
    cardWidth = selectedCard.getBoundingClientRect().width;
    selectedCardTitle = selectedCard.querySelector("h2").innerText;
    selectedCardDescription = selectedCard.querySelector("p").innerText;
    exampleCard.querySelector("h2").innerText = selectedCardTitle;
    exampleCard.querySelector("p").innerText = selectedCardDescription;
  }
});

main.addEventListener("pointermove", (e) => {
  if (hold) {
    exampleCard.classList.add("show");
    exampleCard.style.width = cardWidth + "px";
    exampleCard.style.left = e.x - cardWidth / 2 + "px";
    exampleCard.style.top =
      e.y - exampleCard.getBoundingClientRect().height + "px";
  }
});

main.addEventListener("pointerup", (e) => {
   if (e.target.closest(".edit-btn, .delete-btn")) return;
  hold = false;
  main.style.cursor = "auto";

  let newContainer = null;
  const pointerX = e.clientX;
  const pointerY = e.clientY;

  containers.forEach((container) => {
    const rect = container.getBoundingClientRect();
    if (
      pointerX >= rect.left &&
      pointerX <= rect.right &&
      pointerY >= rect.top &&
      pointerY <= rect.bottom
    ) {
      newContainer = container;
    }
  });

  if (!newContainer) {
    exampleCard.classList.remove("show");
    return;
  }

  // If container is same as original, do nothing
  if (selectedContainer.id !== newContainer.id) {
    const index = tasksData.findIndex((t) => t.id == selectedCardId);
    tasksData[index].new = false;
    tasksData[index].inprogress = false;
    tasksData[index].done = false;
    tasksData[index][newContainer.id] = true;
    renderTasks();

    if (newContainer.id === "done") {
      selectedCard.classList.add("done-card");
    }
  }

  exampleCard.classList.remove("show");
  newContainer.style.scale = 1;
  newContainer.style.borderColor = "transparent";
});

document.addEventListener("pointermove", (e) => {
  if (!hold) return;

  const pointerX = e.clientX;
  const pointerY = e.clientY;

  containers.forEach((container) => {
    const rect = container.getBoundingClientRect();

    const inside =
      pointerX >= rect.left &&
      pointerX <= rect.right &&
      pointerY >= rect.top &&
      pointerY <= rect.bottom;

    if (inside && container !== selectedContainer) {
      container.style.scale = 1.01;
      container.style.borderColor = "white";
    } else {
      container.style.scale = 1;
      container.style.borderColor = "transparent";
    }
  });
});
