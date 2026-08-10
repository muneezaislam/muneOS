let explorerFolder="computer";
let explorerHistory=["computer"];
let explorerHistoryIndex=0;

const explorerGrid=document.getElementById("explorerGrid");
const explorerTitle=document.getElementById("explorerTitle");
const explorerSubtitle=document.getElementById("explorerSubtitle");
const explorerItemCount=document.getElementById("explorerItemCount");
const explorerAddress=document.getElementById("explorerAddress");
const documentsFileGrid=document.getElementById("documentsFileGrid");
const documentsCount=document.getElementById("documentsCount");

function showWindow(name){
if(typeof openWindow==="function"){
openWindow(name);
return;
}

const win=document.getElementById("window-"+name);

if(win){
win.classList.remove("hidden");
}
}

function setActiveFolder(folder){
document.querySelectorAll(".explorer-place").forEach(button=>{
button.classList.toggle(
"active",
button.dataset.folder===folder
);
});
}

function escapeHTML(text){
return String(text).replace(
/[&<>"']/g,
char=>({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"
}[char])
);
}

function renderComputer(){

if(!explorerGrid)return;

explorerFolder="computer";

explorerTitle.textContent="My Computer";
explorerSubtitle.textContent="Choose a place to explore.";

if(explorerAddress){
explorerAddress.textContent="C:\\Users\\Mune\\";
}

explorerItemCount.textContent="6 items";

explorerGrid.innerHTML=`
<button class="explorer-item" data-explorer-window="about" type="button">
<div class="explorer-icon">🎀</div>
<strong>About Me</strong>
<small>personal</small>
</button>

<button class="explorer-item" data-explorer-folder="Documents" type="button">
<div class="explorer-icon">📁</div>
<strong>Documents</strong>
<small>your files</small>
</button>

<button class="explorer-item" data-explorer-window="browser" type="button">
<div class="explorer-icon">🌐</div>
<strong>Internet</strong>
<small>MuneNet</small>
</button>

<button class="explorer-item" data-explorer-window="games" type="button">
<div class="explorer-icon">🕹️</div>
<strong>Games</strong>
<small>javascript</small>
</button>

<button class="explorer-item" data-explorer-window="music" type="button">
<div class="explorer-icon">🎵</div>
<strong>Music</strong>
<small>playlist</small>
</button>

<button class="explorer-item" data-explorer-window="mail" type="button">
<div class="explorer-icon">💌</div>
<strong>Mail</strong>
<small>contact</small>
</button>
`;

setActiveFolder("computer");
}

function renderDocuments(){

if(!documentsFileGrid)return;

const files=listFiles("Documents");

if(documentsCount){
documentsCount.textContent=
`${files.length} item${files.length===1?"":"s"}`;
}

if(files.length===0){

documentsFileGrid.innerHTML=`
<div class="empty-documents">
<div class="empty-icon">📁</div>
<strong>Your Documents folder is empty</strong>
<span>Save a MunePad document and it will appear here.</span>
</div>
`;

return;
}

documentsFileGrid.innerHTML=files.map(file=>`
<button
class="explorer-item document-file"
data-file-name="${encodeURIComponent(file.name)}"
type="button"
>
<div class="explorer-icon">📝</div>
<strong>${escapeHTML(file.name)}</strong>
<small>text document</small>
</button>
`).join("");
}

function openDocuments(){

renderDocuments();

if(typeof openWindow==="function"){
openWindow("documents");
}else{
const win=document.getElementById("window-documents");

if(win){
win.classList.remove("hidden");
}
}
}

function openFolder(folder){

if(folder==="computer"){
renderComputer();
return;
}

if(folder==="Documents"){
openDocuments();
return;
}

explorerFolder=folder;

explorerTitle.textContent=folder;
explorerSubtitle.textContent=
`Your ${folder.toLowerCase()} folder.`;

if(explorerAddress){
explorerAddress.textContent=
`C:\\Users\\Mune\\${folder}\\`;
}

const files=listFiles(folder);

explorerItemCount.textContent=
`${files.length} item${files.length===1?"":"s"}`;

if(files.length===0){

explorerGrid.innerHTML=`
<div class="empty-documents">
<div class="empty-icon">♡</div>
<strong>This folder is empty</strong>
<span>Nothing has been saved here yet.</span>
</div>
`;

}else{

explorerGrid.innerHTML=files.map(file=>`
<button class="explorer-item document-file" data-file-name="${encodeURIComponent(file.name)}" type="button">
<div class="explorer-icon">📄</div>
<strong>${escapeHTML(file.name)}</strong>
<small>file</small>
</button>
`).join("");
}

setActiveFolder(folder);
}

function navigate(folder){

if(
explorerHistory[explorerHistory.length-1]!==folder
){

explorerHistory=
explorerHistory.slice(
0,
explorerHistoryIndex+1
);

explorerHistory.push(folder);

explorerHistoryIndex++;
}

openFolder(folder);
}

function goBack(){

if(explorerHistoryIndex<=0){
return;
}

explorerHistoryIndex--;

openFolder(
explorerHistory[explorerHistoryIndex]
);
}

function goForward(){

if(
explorerHistoryIndex>=
explorerHistory.length-1
){
return;
}

explorerHistoryIndex++;

openFolder(
explorerHistory[explorerHistoryIndex]
);
}

function goUp(){

if(explorerFolder!=="computer"){
navigate("computer");
}
}

document.addEventListener("click",event=>{

const folderButton=
event.target.closest(
"[data-explorer-folder]"
);

if(folderButton){
navigate(
folderButton.dataset.explorerFolder
);
return;
}

const appButton=
event.target.closest(
"[data-explorer-window]"
);

if(appButton){
showWindow(
appButton.dataset.explorerWindow
);
return;
}

const fileButton=
event.target.closest(
".document-file"
);

if(fileButton){

const fileName=
decodeURIComponent(
fileButton.dataset.fileName
);

if(typeof openNoteFile==="function"){
openNoteFile(fileName);
}

return;
}

const place=
event.target.closest(
".explorer-place[data-folder]"
);

if(place){

navigate(
place.dataset.folder
);

}
});

document.getElementById(
"explorerBack"
)?.addEventListener(
"click",
goBack
);

document.getElementById(
"explorerForward"
)?.addEventListener(
"click",
goForward
);

document.getElementById(
"explorerUp"
)?.addEventListener(
"click",
goUp
);

document.getElementById(
"documentsBack"
)?.addEventListener(
"click",
()=>{
const win=
document.getElementById(
"window-documents"
);

if(win)win.classList.add("hidden");
}
);

document.getElementById(
"documentsUp"
)?.addEventListener(
"click",
()=>{
const win=
document.getElementById(
"window-documents"
);

if(win)win.classList.add("hidden");

showWindow("computer");
renderComputer();
}
);

document.getElementById(
"documentsComputer"
)?.addEventListener(
"click",
()=>{
const win=
document.getElementById(
"window-documents"
);

if(win)win.classList.add("hidden");

showWindow("computer");
renderComputer();
}
);

document.addEventListener(
"dblclick",
event=>{
const file=
event.target.closest(
".document-file"
);

if(!file)return;

const fileName=
decodeURIComponent(
file.dataset.fileName
);

if(typeof openNoteFile==="function"){
openNoteFile(fileName);
}
}
);

renderComputer();
renderDocuments();