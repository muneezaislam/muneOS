const windows={};
document.querySelectorAll(".app-window").forEach(win=>{
windows[win.id.replace("window-","")]=win;
});

const taskButtons=document.getElementById("taskButtons");
const startMenu=document.getElementById("startMenu");
const startButton=document.getElementById("startButton");
const shutdownButton=document.getElementById("shutdownButton");
const shutdownScreen=document.getElementById("shutdownScreen");
const shutdownProgressBar=document.getElementById("shutdownProgressBar");
const shutdownMessage=document.getElementById("shutdownMessage");
let zIndex=20;

function openWindow(name){
const win=windows[name];
if(!win)return;
win.classList.remove("hidden");
zIndex++;
win.style.zIndex=zIndex;
if(startMenu)startMenu.classList.add("hidden");
refreshTasks();

if(name==="browser"&&typeof initialiseBrowser==="function"){
initialiseBrowser();
}

if(name==="documents"&&typeof renderDocuments==="function"){
renderDocuments();
}
}

function closeWindow(win){
if(!win)return;
win.classList.add("hidden");
refreshTasks();
}

function minimizeWindow(win){
if(!win)return;
win.classList.add("hidden");
refreshTasks();
}

function refreshTasks(){
if(!taskButtons)return;
taskButtons.innerHTML="";

Object.entries(windows).forEach(([name,win])=>{
if(!win.classList.contains("hidden")){
const button=document.createElement("button");
button.className="task-button";
button.textContent=win.dataset.title||name;
button.addEventListener("click",()=>openWindow(name));
taskButtons.appendChild(button);
}
});
}

document.addEventListener("click",event=>{
const opener=event.target.closest("[data-window]");

if(opener){
openWindow(opener.dataset.window);
return;
}

const closeButton=event.target.closest(".close");

if(closeButton){
closeWindow(closeButton.closest(".app-window"));
return;
}

const minimizeButton=event.target.closest(".minimize");

if(minimizeButton){
minimizeWindow(minimizeButton.closest(".app-window"));
}
});

document.querySelectorAll(".app-window").forEach(win=>{
win.addEventListener("mousedown",()=>{
zIndex++;
win.style.zIndex=zIndex;
});
});

if(startButton){
startButton.addEventListener("click",event=>{
event.stopPropagation();
if(startMenu)startMenu.classList.toggle("hidden");
});
}

document.addEventListener("click",event=>{
if(!event.target.closest("#startMenu")&&!event.target.closest("#startButton")){
if(startMenu)startMenu.classList.add("hidden");
}
});

function updateClock(){
const clock=document.getElementById("clock");
if(!clock)return;

clock.textContent=new Date().toLocaleTimeString([],{
hour:"numeric",
minute:"2-digit"
});
}

updateClock();
setInterval(updateClock,30000);

if(shutdownButton){
shutdownButton.addEventListener("click",startShutdown);
}

function startShutdown(){
if(startMenu)startMenu.classList.add("hidden");
if(!shutdownScreen)return;

shutdownScreen.classList.remove("hidden");

if(shutdownProgressBar){
shutdownProgressBar.style.width="0%";
}

if(shutdownMessage){
shutdownMessage.textContent="Shutting down...";
}

let progress=0;

const timer=setInterval(()=>{
progress+=5;

if(shutdownProgressBar){
shutdownProgressBar.style.width=progress+"%";
}

if(progress>=100){
clearInterval(timer);

if(shutdownMessage){
shutdownMessage.textContent="It is now safe to close this window.";
}
}
},100);
}

function makeWindowDraggable(win){
const titlebar=win.querySelector(".titlebar");
if(!titlebar)return;

let dragging=false;
let offsetX=0;
let offsetY=0;

titlebar.addEventListener("mousedown",event=>{
if(event.target.closest(".window-controls"))return;

dragging=true;

const rect=win.getBoundingClientRect();
offsetX=event.clientX-rect.left;
offsetY=event.clientY-rect.top;

zIndex++;
win.style.zIndex=zIndex;

titlebar.style.cursor="grabbing";
event.preventDefault();
});

document.addEventListener("mousemove",event=>{
if(!dragging)return;

const desktop=document.querySelector(".desktop");
if(!desktop)return;

const rect=desktop.getBoundingClientRect();

let left=event.clientX-rect.left-offsetX;
let top=event.clientY-rect.top-offsetY;

const maxLeft=Math.max(0,rect.width-win.offsetWidth);
const maxTop=Math.max(0,rect.height-win.offsetHeight);

left=Math.max(0,Math.min(left,maxLeft));
top=Math.max(0,Math.min(top,maxTop));

win.style.left=left+"px";
win.style.top=top+"px";
});

document.addEventListener("mouseup",()=>{
if(!dragging)return;
dragging=false;
titlebar.style.cursor="grab";
});

titlebar.style.cursor="grab";
}

document.querySelectorAll(".app-window").forEach(makeWindowDraggable);

refreshTasks();