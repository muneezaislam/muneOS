const windows={};

document
.querySelectorAll(".app-window")
.forEach(win=>{

windows[
win.id.replace("window-","")
]=win;

});

const taskButtons=
document.getElementById("taskButtons");

const startMenu=
document.getElementById("startMenu");

const startButton=
document.getElementById("startButton");

const shutdownButton=
document.getElementById("shutdownButton");

const shutdownScreen=
document.getElementById("shutdownScreen");

const shutdownProgressBar=
document.getElementById(
"shutdownProgressBar"
);

const shutdownMessage=
document.getElementById(
"shutdownMessage"
);

let zIndex=20;


/* OPEN WINDOW */

function openWindow(name){

const win=windows[name];

if(!win)return;

win.classList.remove("hidden");

zIndex++;

win.style.zIndex=zIndex;

startMenu.classList.add("hidden");

refreshTasks();

if(name==="browser"){
initialiseBrowser();
}

}


/* CLOSE WINDOW */

function closeWindow(win){

if(!win)return;

win.classList.add("hidden");

refreshTasks();

}


/* MINIMISE WINDOW */

function minimizeWindow(win){

if(!win)return;

win.classList.add("hidden");

refreshTasks();

}


/* TASKBAR */

function refreshTasks(){

taskButtons.innerHTML="";

Object.entries(windows)
.forEach(([name,win])=>{

if(!win.classList.contains("hidden")){

const button=
document.createElement("button");

button.className=
"task-button";

button.textContent=
win.dataset.title;

button.onclick=()=>{
openWindow(name);
};

taskButtons.appendChild(
button
);

}

});

}


/* WINDOW CONTROLS */

document.addEventListener(
"click",
event=>{

const opener=
event.target.closest(
"[data-window]"
);

if(opener){

openWindow(
opener.dataset.window
);

return;

}

const close=
event.target.closest(".close");

if(close){

closeWindow(
close.closest(".app-window")
);

return;

}

const minimize=
event.target.closest(
".minimize"
);

if(minimize){

minimizeWindow(
minimize.closest(".app-window")
);

}

}
);


/* WINDOW FOCUS */

document
.querySelectorAll(".app-window")
.forEach(win=>{

win.addEventListener(
"mousedown",
()=>{

zIndex++;

win.style.zIndex=zIndex;

}
);

});


/* START MENU */

startButton.addEventListener(
"click",
event=>{

event.stopPropagation();

startMenu.classList.toggle(
"hidden"
);

}
);

document.addEventListener(
"click",
event=>{

if(
!event.target.closest("#startMenu")&&
!event.target.closest("#startButton")
){

startMenu.classList.add(
"hidden"
);

}

}
);


/* CLOCK */

function updateClock(){

document.getElementById(
"clock"
).textContent=
new Date().toLocaleTimeString(
[],
{
hour:"numeric",
minute:"2-digit"
}
);

}

updateClock();

setInterval(
updateClock,
30000
);


/* SHUTDOWN */

shutdownButton.addEventListener(
"click",
()=>{
startShutdown();
}
);

function startShutdown(){

startMenu.classList.add(
"hidden"
);

shutdownScreen.classList.remove(
"hidden"
);

shutdownProgressBar.style.width=
"0%";

shutdownMessage.textContent=
"Shutting down...";

let progress=0;

const shutdownTimer=
setInterval(
()=>{

progress+=5;

shutdownProgressBar.style.width=
progress+"%";

if(progress>=100){

clearInterval(
shutdownTimer
);

shutdownMessage.textContent=
"It is now safe to close this window.";

setTimeout(
()=>{

shutdownScreen.style.background=
"#050407";

shutdownScreen.innerHTML=`

<div class="shutdown-box">

<div class="shutdown-logo">
MUNE<span>OS</span>
</div>

<div class="shutdown-message">
♡ Goodbye ♡
</div>

<div class="shutdown-small">
It is now safe to close this window.
</div>

</div>

`;

},
500
);

}

},
100
);

}


/* INITIAL TASKBAR */

refreshTasks();
function makeWindowDraggable(win){
const titlebar=win.querySelector(".titlebar");

if(!titlebar)return;

let isDragging=false;
let offsetX=0;
let offsetY=0;

titlebar.addEventListener("mousedown",event=>{

if(event.target.closest(".window-controls"))return;

isDragging=true;

const rect=win.getBoundingClientRect();

offsetX=event.clientX-rect.left;
offsetY=event.clientY-rect.top;

zIndex++;
win.style.zIndex=zIndex;

titlebar.style.cursor="grabbing";

event.preventDefault();

});

document.addEventListener("mousemove",event=>{

if(!isDragging)return;

const desktop=document.querySelector(".desktop");

const desktopRect=desktop.getBoundingClientRect();

let newLeft=
event.clientX-desktopRect.left-offsetX;

let newTop=
event.clientY-desktopRect.top-offsetY;

const maxLeft=
desktopRect.width-win.offsetWidth;

const maxTop=
desktopRect.height-win.offsetHeight;

newLeft=Math.max(
0,
Math.min(newLeft,maxLeft)
);

newTop=Math.max(
0,
Math.min(newTop,maxTop)
);

win.style.left=newLeft+"px";
win.style.top=newTop+"px";

});

document.addEventListener("mouseup",()=>{

if(!isDragging)return;

isDragging=false;

titlebar.style.cursor="grab";

});

titlebar.style.cursor="grab";
}

document.querySelectorAll(".app-window").forEach(win=>{
makeWindowDraggable(win);
});

// notepad stuff
const noteEditor=document.getElementById("noteEditor");
const newNoteButton=document.getElementById("newNoteButton");
const saveNoteButton=document.getElementById("saveNoteButton");
const downloadNoteButton=document.getElementById("downloadNoteButton");
const noteStatus=document.getElementById("noteStatus");
const noteCount=document.getElementById("noteCount");

const NOTE_KEY="muneOS_notepad";

function updateNoteCount(){
if(!noteEditor)return;

const count=noteEditor.value.length;

noteCount.textContent=
`${count} character${count===1?"":"s"}`;
}

function saveNote(){
if(!noteEditor)return;

localStorage.setItem(
NOTE_KEY,
noteEditor.value
);

noteStatus.textContent="Saved ♡";

updateNoteCount();
}

function loadNote(){
if(!noteEditor)return;

const savedNote=
localStorage.getItem(NOTE_KEY);

if(savedNote!==null){
noteEditor.value=savedNote;
noteStatus.textContent="Saved note loaded ♡";
}else{
noteStatus.textContent="Ready ♡";
}

updateNoteCount();
}

function newNote(){
if(!noteEditor)return;

const hasText=
noteEditor.value.trim().length>0;

if(hasText){
const confirmNew=
confirm("Start a new note? Your current note will be replaced.");

if(!confirmNew)return;
}

noteEditor.value="";
localStorage.removeItem(NOTE_KEY);

noteStatus.textContent="New note ♡";

updateNoteCount();

noteEditor.focus();
}

if(noteEditor){

loadNote();

noteEditor.addEventListener("input",()=>{
noteStatus.textContent="Unsaved changes...";
updateNoteCount();
});

}

if(saveNoteButton){
saveNoteButton.addEventListener("click",saveNote);
}

if(newNoteButton){
newNoteButton.addEventListener("click",newNote);
}

if(downloadNoteButton){
downloadNoteButton.addEventListener("click",()=>{
const text=noteEditor.value;

const blob=new Blob(
[text],
{type:"text/plain"}
);

const url=URL.createObjectURL(blob);

const link=document.createElement("a");

link.href=url;
link.download="mune-note.txt";

document.body.appendChild(link);

link.click();

link.remove();

URL.revokeObjectURL(url);
});
}