let currentNoteFile=null;
const noteEditor=document.getElementById("noteEditor");
const newNoteButton=document.getElementById("newNoteButton");
const saveNoteButton=document.getElementById("saveNoteButton");
const downloadNoteButton=document.getElementById("downloadNoteButton");
const noteStatus=document.getElementById("noteStatus");
const noteCount=document.getElementById("noteCount");
const notepadTitle=document.getElementById("notepadTitle");

function setNoteStatus(text){
if(noteStatus)noteStatus.textContent=text;
}

function updateNoteCount(){
if(!noteEditor||!noteCount)return;
const count=noteEditor.value.length;
noteCount.textContent=`${count} character${count===1?"":"s"}`;
}

function updateTitle(){
if(!notepadTitle)return;
notepadTitle.textContent=currentNoteFile?`📝 MunePad — ${currentNoteFile}`:"📝 MunePad — Untitled";
}

function newNote(){
if(!noteEditor)return;
if(noteEditor.value.trim()!==""){
if(!confirm("Start a new note? Your current document will be replaced."))return;
}
currentNoteFile=null;
noteEditor.value="";
updateTitle();
updateNoteCount();
setNoteStatus("New document ♡");
noteEditor.focus();
}

function showSaveAsDialog(){
return new Promise(resolve=>{
const overlay=document.createElement("div");
overlay.className="save-dialog-overlay";

overlay.innerHTML=`
<div class="save-dialog">
<div class="save-dialog-title">💾 Save document</div>
<div class="save-dialog-text">Choose a name for your document.</div>
<label class="save-dialog-label">File name</label>
<input class="save-dialog-input" id="saveFileNameInput" type="text" value="untitled.txt" autocomplete="off">
<div class="save-dialog-location">📁 Documents</div>
<div class="save-dialog-buttons">
<button type="button" id="saveDialogCancel">Cancel</button>
<button type="button" id="saveDialogSave">Save</button>
</div>
</div>`;

document.body.appendChild(overlay);

const input=overlay.querySelector("#saveFileNameInput");
const saveButton=overlay.querySelector("#saveDialogSave");
const cancelButton=overlay.querySelector("#saveDialogCancel");

function finish(value){
overlay.remove();
resolve(value);
}

input.focus();
input.select();

saveButton.addEventListener("click",()=>{
let name=input.value.trim();

if(!name){
alert("Please enter a file name.");
input.focus();
return;
}

if(!name.toLowerCase().endsWith(".txt")){
name+=".txt";
}

finish(name);
});

cancelButton.addEventListener("click",()=>{
finish(null);
});

input.addEventListener("keydown",event=>{
if(event.key==="Enter")saveButton.click();
if(event.key==="Escape")cancelButton.click();
});
});
}

async function saveNote(){
if(!noteEditor)return;

let fileName=currentNoteFile;

if(!fileName){
fileName=await showSaveAsDialog();

if(!fileName)return;
}

if(fileExists("Documents",fileName)){

const overwrite=confirm(
`${fileName} already exists.\n\nDo you want to replace it?`
);

if(!overwrite)return;

const success=updateFile(
"Documents",
fileName,
noteEditor.value
);

if(!success){
setNoteStatus("Save failed");
return;
}

}else{

const success=createFile(
"Documents",
fileName,
noteEditor.value
);

if(!success){
setNoteStatus("Save failed");
return;
}
}

currentNoteFile=fileName;
updateTitle();
updateNoteCount();
setNoteStatus("Saved ♡");

if(typeof renderDocuments==="function"){
renderDocuments();
}
}

function openNoteFile(fileName){
const file=getFile("Documents",fileName);

if(!file){
alert("Could not open "+fileName);
return;
}

currentNoteFile=fileName;
noteEditor.value=file.content||"";
updateTitle();
updateNoteCount();
setNoteStatus("Loaded ♡");

const win=document.getElementById("window-notepad");

if(win){
win.classList.remove("hidden");

if(typeof zIndex!=="undefined"){
zIndex++;
win.style.zIndex=zIndex;
}
}

noteEditor.focus();
}

function downloadNote(){
if(!noteEditor)return;

const fileName=currentNoteFile||"untitled.txt";
const blob=new Blob([noteEditor.value],{type:"text/plain"});
const url=URL.createObjectURL(blob);
const link=document.createElement("a");

link.href=url;
link.download=fileName;
document.body.appendChild(link);
link.click();
link.remove();
URL.revokeObjectURL(url);

setNoteStatus("Downloaded ♡");
}

if(noteEditor){
noteEditor.addEventListener("input",()=>{
setNoteStatus("Unsaved changes...");
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
downloadNoteButton.addEventListener("click",downloadNote);
}

updateTitle();
updateNoteCount();
setNoteStatus("Ready ♡");