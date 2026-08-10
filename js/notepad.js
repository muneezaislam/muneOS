let currentNoteFile=null;

const noteEditor=document.getElementById("noteEditor");
const newNoteButton=document.getElementById("newNoteButton");
const saveNoteButton=document.getElementById("saveNoteButton");
const downloadNoteButton=document.getElementById("downloadNoteButton");
const noteStatus=document.getElementById("noteStatus");
const noteCount=document.getElementById("noteCount");
const notepadTitle=document.getElementById("notepadTitle");

function updateNoteCount(){
if(!noteEditor||!noteCount)return;

const count=noteEditor.value.length;

noteCount.textContent=
`${count} character${count===1?"":"s"}`;
}

function updateTitle(){
if(!notepadTitle)return;

notepadTitle.textContent=currentNoteFile
?`📝 MunePad — ${currentNoteFile}`
:"📝 MunePad — Untitled";
}

function setNoteStatus(text){
if(noteStatus){
noteStatus.textContent=text;
}
}

function newNote(){
if(!noteEditor)return;

if(noteEditor.value.trim()!==""){
const answer=confirm(
"Start a new document? Your current document will be replaced."
);

if(!answer)return;
}

currentNoteFile=null;
noteEditor.value="";

updateTitle();
updateNoteCount();
setNoteStatus("New document ♡");

noteEditor.focus();
}

function saveNote(){
if(!noteEditor)return;

let fileName=currentNoteFile;

if(!fileName){

fileName=prompt(
"Save As",
"untitled.txt"
);

if(fileName===null)return;

fileName=fileName.trim();

if(!fileName){
alert("Please enter a file name.");
return;
}

if(!fileName.toLowerCase().endsWith(".txt")){
fileName+=".txt";
}
}

if(fileExists("Documents",fileName)){

const overwrite=confirm(
`${fileName} already exists.\n\nDo you want to replace it?`
);

if(!overwrite)return;

if(!updateFile(
"Documents",
fileName,
noteEditor.value
)){
setNoteStatus("Save failed");
return;
}

}else{

if(!createFile(
"Documents",
fileName,
noteEditor.value
)){
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

const file=getFile(
"Documents",
fileName
);

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

const blob=new Blob(
[noteEditor.value],
{type:"text/plain"}
);

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
saveNoteButton.addEventListener(
"click",
saveNote
);
}

if(newNoteButton){
newNoteButton.addEventListener(
"click",
newNote
);
}

if(downloadNoteButton){
downloadNoteButton.addEventListener(
"click",
downloadNote
);
}

updateTitle();
updateNoteCount();
setNoteStatus("Ready ♡");