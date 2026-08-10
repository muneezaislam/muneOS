const windows = {};

document.querySelectorAll(".app-window").forEach(win => {
const name = win.id.replace("window-", "");
windows[name] = win;
});

const taskButtons = document.getElementById("taskButtons");
const startMenu = document.getElementById("startMenu");
let zIndex = 20;

function openWindow(name) {
const win = windows[name];
if (!win) return;

win.classList.remove("hidden");
zIndex++;
win.style.zIndex = zIndex;
startMenu.classList.add("hidden");
refreshTasks();
}

function closeWindow(win) {
if (!win) return;
win.classList.add("hidden");
refreshTasks();
}

function minimizeWindow(win) {
if (!win) return;
win.classList.add("hidden");
refreshTasks();
}

function refreshTasks() {
taskButtons.innerHTML = "";

Object.entries(windows).forEach(([name, win]) => {
if (!win.classList.contains("hidden")) {
const button = document.createElement("button");
button.className = "task-button";
button.textContent = win.dataset.title;

button.onclick = () => {
openWindow(name);
};

taskButtons.appendChild(button);
}
});
}

document.addEventListener("click", event => {
const target = event.target.closest("[data-window]");

if (target) {
openWindow(target.dataset.window);
}

const closeButton = event.target.closest(".close");

if (closeButton) {
closeWindow(closeButton.closest(".app-window"));
}

const minimizeButton = event.target.closest(".minimize");

if (minimizeButton) {
minimizeWindow(minimizeButton.closest(".app-window"));
}
});

document.querySelectorAll(".app-window").forEach(win => {
win.addEventListener("mousedown", () => {
zIndex++;
win.style.zIndex = zIndex;
});
});

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", event => {
event.stopPropagation();
startMenu.classList.toggle("hidden");
});

document.addEventListener("click", event => {
if (!event.target.closest("#startMenu") && !event.target.closest("#startButton")) {
startMenu.classList.add("hidden");
}
});


/* ================================
   MUNENET SEARCH
================================ */

const pages = [
{
title: "Cybersecurity",
description: "My cybersecurity learning journey, projects and notes.",
category: "cybersecurity"
},
{
title: "Books",
description: "Fantasy, romance and the books currently living in my brain.",
category: "books"
},
{
title: "Projects",
description: "Coding projects, experiments and things I'm building.",
category: "projects"
},
{
title: "About Mune",
description: "A little introduction to the person behind this computer.",
category: "about"
}
];

function searchMuneNet(query) {
query = query.trim();

if (!query) return;

const browserContent = document.getElementById("browserContent");
const searchTerm = query.toLowerCase();

const matches = pages.filter(page => {
return (
page.title.toLowerCase().includes(searchTerm) ||
page.description.toLowerCase().includes(searchTerm) ||
page.category.toLowerCase().includes(searchTerm)
);
});

if (matches.length > 0) {
browserContent.innerHTML = `
<div style="padding:25px">
<div class="logo" style="font-size:26px">MUNE<span>NET</span></div>
<p>Search results for: <b>${escapeHTML(query)}</b></p>

${matches.map(page => `
<div class="result">
<h2>${page.title}</h2>
<p>${page.description}</p>
<a href="#" onclick="return false">open page →</a>
</div>
`).join("")}

</div>
`;
} else {
browserContent.innerHTML = `
<div style="padding:25px">
<div class="logo" style="font-size:26px">MUNE<span>NET</span></div>

<div class="result">
<h2>404 — nothing found ♡</h2>
<p>Sorry! MuneNet couldn't find anything matching your search.</p>
<p>
Try searching for:
<br><br>
cybersecurity · books · projects · about
</p>
</div>

</div>
`;
}
}


/* ================================
   ESCAPE SEARCH INPUT
================================ */

function escapeHTML(str) {
return str.replace(/[&<>"']/g, char => ({
"&": "&amp;",
"<": "&lt;",
">": "&gt;",
'"': "&quot;",
"'": "&#039;"
}[char]));
}


/* ================================
   SEARCH BUTTON
================================ */

const searchButton = document.getElementById("searchButton");

searchButton.onclick = () => {
const searchInput = document.getElementById("searchInput");
searchMuneNet(searchInput.value);
};


/* ================================
   SEARCH WITH ENTER
================================ */

document.getElementById("searchInput").addEventListener("keydown", event => {
if (event.key === "Enter") {
searchMuneNet(event.target.value);
}
});


/* ================================
   HOMEPAGE SEARCH
================================ */

const homeSearchButton = document.getElementById("homeSearchButton");

homeSearchButton.onclick = () => {
const homeSearch = document.getElementById("homeSearch");
searchMuneNet(homeSearch.value);
};


document.getElementById("homeSearch").addEventListener("keydown", event => {
if (event.key === "Enter") {
searchMuneNet(event.target.value);
}
});


/* ================================
   QUICK SEARCH LINKS
================================ */

document.querySelectorAll(".fake-links a").forEach(link => {
link.addEventListener("click", event => {
event.preventDefault();
searchMuneNet(link.dataset.query);
});
});


/* ================================
   CLOCK
================================ */

function updateClock() {
const clock = document.getElementById("clock");
const now = new Date();

clock.textContent = now.toLocaleTimeString([], {
hour: "numeric",
minute: "2-digit"
});
}

updateClock();

setInterval(updateClock, 30000);


/* ================================
   START SYSTEM
================================ */

refreshTasks();

console.log("%c♡ Welcome to MUNE OS ♡", "color:#c96f9d; font-size:18px;");