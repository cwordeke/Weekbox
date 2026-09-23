# Weekbox

A small weekly task planner built with plain HTML, CSS, and JavaScript. No dependencies, build step, account, or backend.

Open `index.html` in your browser to use it. For a stable local URL, run `node server.cjs` from this directory and visit http://127.0.0.1:5173.

Click **+ Add task**, type, and press Enter or click away to save. Click a task to edit it. Escape cancels an edit; blank input leaves an existing task unchanged. Check tasks off or use × to delete them. Previous week, Next week, and Today change the displayed week.

Tasks are saved in this browser's localStorage under `weekbox.tasks.v1`. Different browsers and addresses have separate storage. Clearing browser data removes saved tasks.

## Files

- `index.html`: page structure
- `style.css`: layout, colors, responsive rules
- `app.js`: date navigation, task interactions, localStorage

Dates are calculated in local time. The week always begins on Monday. No example tasks are added to your storage.
