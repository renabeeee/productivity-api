# Productivity Timer API

This project is a **JavaScript-based productivity timer** that helps users manage tasks with customizable durations, real-time tracking, and built-in notifications. A special feature of this app is the **notification sound** voiced by *Justin Bieber*, generated using **PlayHT**!

## Features

- **Task Management**: Add, delete, and edit tasks, each with a specific name and duration.
- **Timer Functionality**: Start, pause, and resume tasks, with time tracking displayed in real-time.
- **Drag-and-Drop**: Reorder tasks using drag-and-drop for flexibility in prioritization.
- **Dark Mode Toggle**: Switch between light and dark mode for comfortable viewing.
- **Notifications**: Receive notifications when tasks are completed, with an optional sound notification.

## Code Overview

The core functionality includes the following components:

- **addTask()**: Adds a new task based on user input and displays it in the task list.
- **displayTasks()**: Renders the list of tasks with controls for each.
- **startTask(index)**: Starts the timer for a selected task and shows remaining time.
- **notifyNextTask()**: Notifies users upon task completion and prepares the next task.
- **deleteTask(index)**: Deletes a task and updates the list.
- **editTask(index)** and **saveTask(index)**: Allows editing of task name and duration with save functionality.
- **pauseResumeTask(index)**: Pauses or resumes the current task, retaining the remaining time.
- **playSound()**: Plays an alert sound upon task completion (voiced by *Justin Bieber*).
- **showNotification(message)**: Displays desktop notifications to the user.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/renabeeee/productivity-api.git
    ```
2. Navigate to the project directory:
    ```bash
    cd productivity-api
    ```
3. Open `index.html` in your browser to use the app.

## Usage

1. **Add Tasks**: Enter a task name and duration, then click "Add Task".
2. **Start Timer**: Click "Start" next to any task to begin tracking time.
3. **Pause/Resume Timer**: Use the "Pause" button to pause the timer and "Resume" to continue.
4. **Edit or Delete Tasks**: Double-click a task name or duration to edit, or click "Delete" to remove it.
5. **Toggle Dark Mode**: Click the mode toggle button to switch between light and dark themes.

## Additional Information

- **Voice Notifications**: The app uses *Justin Bieber's voice* for task completion alerts, created for fun with PlayHT's AI voice generator.
- **Drag-and-Drop**: Easily reorder tasks by dragging each task item up or down.
- **Dark Mode**: A customizable option to enhance user experience during nighttime.

## Contributing

Feel free to open issues or pull requests with improvements. This project is open to any suggestions or feature requests!

## License

This project is licensed under the MIT License.
