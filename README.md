# Weekbox

A small weekly task planner built with plain HTML, CSS, and JavaScript. No dependencies, build step, account, or backend.

Open `public/index.html` in your browser to use it. For a stable local URL, run `node server.cjs` from this directory and visit http://127.0.0.1:5173. The optional preview server requires Node.js; Vercel serves the static files directly.

Click **+ Add task**, type, and press Enter or click away to save. Click a task to edit it. Escape cancels an edit; blank input leaves an existing task unchanged. Check tasks off or use × to delete them. Previous week, Next week, and Today change the displayed week.

Tasks are saved in this browser's localStorage under `weekbox.tasks.v1`. Different browsers and addresses have separate storage. Clearing browser data removes saved tasks.

## Files

- `public/index.html`: page structure
- `public/style.css`: layout, colors, responsive rules
- `public/app.js`: date navigation, task interactions, localStorage
- `server.cjs`: optional local preview server
- `vercel.json`: static deployment settings

Dates are calculated in local time. The week always begins on Monday. No example tasks are added to your storage.

## Deploy to Vercel

1. Push this commit to your GitHub repository.
2. In Vercel, import `cwordeke/Weekbox` as a new project.
3. Keep the repository root as the Root Directory. The checked-in configuration selects Other as the framework, skips installation and building, and serves only `public/`.
4. Deploy. No environment variables or backend are needed.

See [Vercel's static configuration documentation](https://vercel.com/docs/project-configuration/vercel-json). The local preview server and repository documentation are outside the public output.

Tasks remain local to each browser and origin. Tasks created on localhost will not automatically appear on the Vercel domain; preview URLs and custom domains also have separate storage.

## Quick checks

Run `node --check public/app.js` and `node --check server.cjs`. In the browser, add and edit a task, check it off, refresh to confirm persistence, navigate weeks, and delete the task. Use Enter to save and Escape to cancel an edit.
