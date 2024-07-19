document.getElementById("add-task").addEventListener("click", addTask);

let tasks = [];
let currentTaskIndex = -1;
let timer;
let timeLeft = 0;
let isPaused = false;
let pausedTimeLeft = 0;

function addTask() {
  const taskInputs = document.querySelectorAll("#task-inputs input");
  const taskName = taskInputs[0].value;
  const taskDuration = taskInputs[1].value;

  if (taskName && taskDuration) {
    const task = { name: taskName, duration: taskDuration, completed: false };
    tasks.push(task);
    taskInputs[0].value = "";
    taskInputs[1].value = "";
    displayTasks();
  }
}

function displayTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.className = `task-item${task.completed ? " completed" : ""}`;
    taskItem.draggable = true;
    taskItem.setAttribute("data-index", index);
    taskItem.innerHTML = `
            <div class="drag-handle">⋮⋮</div>
            <span ondblclick="editTask(${index})">${task.name}</span>
            <span ondblclick="editTask(${index}, 'duration')">${task.duration} minutes</span>

            <div class="task-controls">
                <button onclick="startTask(${index})">Start</button>
                <button id="pause-resume-button-${index}" style="display: none;" onclick="pauseResumeTask(${index})">Pause</button>
                
                <button onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
    taskItem.addEventListener("dragstart", handleDragStart);
    taskItem.addEventListener("dragover", handleDragOver);
    taskItem.addEventListener("drop", handleDrop);
    taskList.appendChild(taskItem);
  });
}

function startTask(index) {
  if (currentTaskIndex >= 0) {
    tasks[currentTaskIndex].completed = false;
    document.getElementById(`pause-resume-button-${currentTaskIndex}`).style.display = "none";
  }

  currentTaskIndex = index;
  const currentTask = tasks[currentTaskIndex];
  const duration = currentTask.duration * 60;
  document.getElementById("notification").innerText = "";
  document.getElementById("timer-display").innerText = `${currentTask.name}: ${currentTask.duration} minutes`;

  clearInterval(timer);
  timeLeft = duration;
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      notifyNextTask();
    } else {
      timeLeft--;
      document.getElementById("timer-display").innerText = `${currentTask.name}: ${Math.floor(timeLeft / 60)}:${String(
        timeLeft % 60
      ).padStart(2, "0")}`;
    }
  }, 1000);

  document.getElementById(`pause-resume-button-${index}`).style.display = "inline-block";
}

function notifyNextTask() {
  tasks[currentTaskIndex].completed = true;
  showNotification(`Time's up! Your next task is ${tasks[currentTaskIndex].name}.`);
  displayTasks();

  setTimeout(() => {
    playSound();
  }, 3000);

  document.getElementById(
    "notification"
  ).innerText = `Time's up! You've completed the ${tasks[currentTaskIndex].name} task.`;
  currentTaskIndex = -1;
  document.getElementById("timer-display").innerText = "";
}

function deleteTask(index) {
  if (index === currentTaskIndex) {
    clearInterval(timer);
    document.getElementById("timer-display").innerText = "";
    currentTaskIndex = -1;
  }

  tasks.splice(index, 1);
  displayTasks();
}

function editTask(index) {
  const taskItem = document.querySelector(`[data-index='${index}']`);
  const task = tasks[index];
  taskItem.innerHTML = `
      <div class="drag-handle">⋮⋮</div>
      <input type="text" class="edit-task-name" value="${task.name}" />
      <input type="number" class="edit-task-duration" value="${task.duration}" />
      <div class="task-controls">
          <button onclick="saveTask(${index})">Save</button>
      </div>
  `;
  const nameInput = taskItem.querySelector(".edit-task-name");
  const durationInput = taskItem.querySelector(".edit-task-duration");

  nameInput.focus();

  nameInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      saveTask(index);
    }
  });

  durationInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      saveTask(index);
    }
  });

  let blurTimeout;
  nameInput.addEventListener("blur", () => {
    blurTimeout = setTimeout(() => {
      saveTask(index);
    }, 200);
  });
  durationInput.addEventListener("blur", () => {
    blurTimeout = setTimeout(() => {
      saveTask(index);
    }, 200);
  });

  nameInput.addEventListener("focus", () => clearTimeout(blurTimeout));
  durationInput.addEventListener("focus", () => clearTimeout(blurTimeout));
}

function saveTask(index) {
  const taskItem = document.querySelector(`[data-index='${index}']`);
  const nameInput = taskItem.querySelector(".edit-task-name");
  const durationInput = taskItem.querySelector(".edit-task-duration");

  if (nameInput && durationInput) {
    tasks[index].name = nameInput.value;
    tasks[index].duration = durationInput.value;
    displayTasks();
  }
}

document.body.addEventListener("click", function (e) {
  if (e.target && e.target.id == "start-tasks" && currentTaskIndex > 0) {
    startTask(currentTaskIndex);
  }
});
function playSound() {
  const alertSound = document.getElementById("alert-sound");
  alertSound.play().catch((error) => {
    console.error("Error playing sound:", error);
  });
}

function showNotification(message) {
  if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
}

function handleDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.index);
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const draggedIndex = e.dataTransfer.getData("text/plain");
  const targetIndex = e.target.closest(".task-item").dataset.index;

  if (draggedIndex !== targetIndex) {
    const draggedTask = tasks.splice(draggedIndex, 1)[0];
    tasks.splice(targetIndex, 0, draggedTask);
    displayTasks();
  }
}

function toggleMode() {
  const body = document.body;
  const toggleButton = document.getElementById("toggle-mode");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    toggleButton.src = "icons/sun-icon.png";
  } else {
    toggleButton.src = "icons/moon-icon.png";
  }
}

function pauseResumeTask(index) {
  const pauseResumeButton = document.getElementById(`pause-resume-button-${index}`);

  if (!isPaused) {
    clearInterval(timer);
    pausedTimeLeft = timeLeft;
    isPaused = true;
    pauseResumeButton.innerText = "Resume";
  } else {
    isPaused = false;
    pauseResumeButton.innerText = "Pause";

    timer = setInterval(() => {
      if (pausedTimeLeft <= 0) {
        clearInterval(timer);
        notifyNextTask();
      } else {
        pausedTimeLeft--;
        updateTimerDisplay(pausedTimeLeft);
      }
    }, 1000);
  }
}

function updateTimerDisplay(timeLeft) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const currentTask = tasks[currentTaskIndex];
  if (currentTask) {
    document.getElementById("timer-display").innerText = `${currentTask.name}: ${minutes}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  } else {
    document.getElementById("timer-display").innerText = "";
  }
}
