/* =========================
   MUNE OS FILE EXPLORER
========================= */

const documentsFolder=document.getElementById("documentsFolder");
const documentsFileGrid=document.getElementById("documentsFileGrid");
const explorerGrid=document.getElementById("explorerGrid");
const explorerTitle=document.getElementById("explorerTitle");
const explorerSubtitle=document.getElementById("explorerSubtitle");
const explorerItemCount=document.getElementById("explorerItemCount");
const documentsCount=document.getElementById("documentsCount");

function bringWindowForward(win){
if(!win)return;
win.classList.remove("hidden");
if(typeof zIndex!=="undefined"){
zIndex++;
win.style.zIndex=zIndex;
}
if(typeof refreshTasks==="function")refreshTasks();
}

function openComputer(){
const win=document.getElementById("window-computer");
bringWindowForward(win);
}

function openDocuments(){
renderDocuments();
const win=document.getElementById("window-documents");
bringWindowForward(win);
}

function openExplorerWindow(name){
const win=document.getElementById("window-"+name);
if(win)bringWindowForward(win);
}

function renderDocuments(){
if(!documentsFileGrid)return;

const files=typeof listFiles==="function"?listFiles("Documents"):[];

if(documentsCount){
documentsCount.textContent=`${files.length} item${files.length===1?"":"s"}`;
}

if(!files.length){
documentsFileGrid.innerHTML=`<div class="home-message">No files yet ♡<br>Create a note in MunePad and it will appear here.</div>`;
return;
}

documentsFileGrid.innerHTML=files.map(file=>{
const safeName=escapeFileName(file.name);
return `<div class="document-file-wrap"><button class="file document-file" data-file="${safeName}"><span class="icon-art">📝</span><b>${safeName}</b><small>text document</small></button><button class="document-delete" data-delete="${safeName}" title="Delete file">×</button></div>`;
}).join("");

documentsFileGrid.querySelectorAll(".document-file").forEach(button=>{
button.addEventListener("dblclick",()=>{
openDocumentFile(button.dataset.file);
});
});

documentsFileGrid.querySelectorAll(".document-delete").forEach(button=>{
button.addEventListener("click",event=>{
event.stopPropagation();

const fileName=button.dataset.delete;

const confirmed=confirm(`Delete "${fileName}"?\n\nThis cannot be undone.`);

if(!confirmed)return;

if(typeof deleteFile!=="function"){
alert("MUNE OS filesystem is not loaded.");
return;
}

const deleted=deleteFile("Documents",fileName);

if(!deleted){
alert("MUNE OS could not delete this file.");
return;
}

if(typeof currentNoteFile!=="undefined"&&currentNoteFile===fileName){
currentNoteFile=null;

if(typeof noteEditor!=="undefined"&&noteEditor){
noteEditor.value="";
}

if(typeof updateTitle==="function")updateTitle();
if(typeof updateNoteCount==="function")updateNoteCount();
if(typeof setNoteStatus==="function")setNoteStatus("File deleted ♡");
}

renderDocuments();
});
});
}

function escapeFileName(name){
return String(name).replace(/[&<>"']/g,char=>({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"
}[char]));
}

function openDocumentFile(fileName){
if(typeof openNoteFile!=="function"){
console.error("MunePad has not loaded.");
return;
}

openNoteFile(fileName);

const notepadWindow=document.getElementById("window-notepad");

if(notepadWindow){
bringWindowForward(notepadWindow);
}
}

/* =========================
   MY COMPUTER EXPLORER ITEMS
========================= */

if(explorerGrid){
explorerGrid.querySelectorAll("[data-explorer-window]").forEach(item=>{
item.addEventListener("dblclick",()=>{
const name=item.dataset.explorerWindow;
openExplorerWindow(name);
});
});

explorerGrid.querySelectorAll("[data-explorer-folder]").forEach(item=>{
item.addEventListener("dblclick",()=>{
const folder=item.dataset.explorerFolder;

if(folder==="Documents"){
openDocuments();
}
});
});
}

/* =========================
   SIDEBAR
========================= */

document.querySelectorAll(".explorer-place").forEach(place=>{
place.addEventListener("click",()=>{
const folder=place.dataset.folder;

document.querySelectorAll(".explorer-place").forEach(item=>{
item.classList.remove("active");
});

place.classList.add("active");

if(folder==="computer"||!folder){
openComputer();
return;
}

if(folder==="Documents"){
openDocuments();
return;
}

if(folder==="Music"){
openExplorerWindow("music");
return;
}

if(folder==="Games"){
openExplorerWindow("games");
return;
}
});
});

/* =========================
   DOCUMENTS SIDEBAR
========================= */

const documentsComputer=document.getElementById("documentsComputer");

if(documentsComputer){
documentsComputer.addEventListener("click",()=>{
openComputer();
});
}

/* =========================
   DOCUMENTS FOLDER
========================= */

if(documentsFolder){
documentsFolder.addEventListener("click",event=>{
event.stopPropagation();
openDocuments();
});
}

/* =========================
   BACK / UP BUTTONS
========================= */

const explorerBack=document.getElementById("explorerBack");
const explorerForward=document.getElementById("explorerForward");
const explorerUp=document.getElementById("explorerUp");
const documentsBack=document.getElementById("documentsBack");
const documentsUp=document.getElementById("documentsUp");

if(explorerBack){
explorerBack.addEventListener("click",()=>{
openComputer();
});
}

if(explorerForward){
explorerForward.addEventListener("click",()=>{
openComputer();
});
}

if(explorerUp){
explorerUp.addEventListener("click",()=>{
openComputer();
});
}

if(documentsBack){
documentsBack.addEventListener("click",()=>{
openComputer();
});
}

if(documentsUp){
documentsUp.addEventListener("click",()=>{
openComputer();
});
}

/* =========================
   UPDATE COMPUTER COUNTER
========================= */

function updateExplorerCounter(){
if(!explorerItemCount)return;

const items=explorerGrid?
explorerGrid.querySelectorAll(".explorer-item").length:0;

explorerItemCount.textContent=`${items} items`;
}

updateExplorerCounter();