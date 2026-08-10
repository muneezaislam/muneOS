const MUNE_FILE_SYSTEM_KEY="muneOS_file_system";

const defaultFileSystem={
folders:{
Documents:{type:"folder",files:{}},
Pictures:{type:"folder",files:{}},
Music:{type:"folder",files:{}},
Games:{type:"folder",files:{}}
}
};

function loadFileSystem(){
const saved=localStorage.getItem(MUNE_FILE_SYSTEM_KEY);

if(!saved){
const fresh=JSON.parse(JSON.stringify(defaultFileSystem));
saveFileSystem(fresh);
return fresh;
}

try{
return JSON.parse(saved);
}catch(error){
console.error("MUNE OS filesystem error:",error);
const fresh=JSON.parse(JSON.stringify(defaultFileSystem));
saveFileSystem(fresh);
return fresh;
}
}

function saveFileSystem(fileSystem){
localStorage.setItem(
MUNE_FILE_SYSTEM_KEY,
JSON.stringify(fileSystem)
);
}

function getFolder(folderName){
const fileSystem=loadFileSystem();
return fileSystem.folders[folderName]||null;
}

function listFiles(folderName){
const folder=getFolder(folderName);
if(!folder)return [];

return Object.entries(folder.files).map(([name,file])=>({
name:name,
...file
}));
}

function createFile(folderName,fileName,content=""){
const fileSystem=loadFileSystem();
const folder=fileSystem.folders[folderName];

if(!folder)return false;
if(folder.files[fileName])return false;

folder.files[fileName]={
type:"file",
content:content,
created:new Date().toISOString(),
modified:new Date().toISOString()
};

saveFileSystem(fileSystem);
return true;
}

function getFile(folderName,fileName){
const folder=getFolder(folderName);

if(!folder||!folder.files[fileName]){
return null;
}

return folder.files[fileName];
}

function updateFile(folderName,fileName,content){
const fileSystem=loadFileSystem();
const folder=fileSystem.folders[folderName];

if(!folder||!folder.files[fileName]){
return false;
}

folder.files[fileName].content=content;
folder.files[fileName].modified=new Date().toISOString();

saveFileSystem(fileSystem);
return true;
}

function deleteFile(folderName,fileName){
const fileSystem=loadFileSystem();
const folder=fileSystem.folders[folderName];

if(!folder||!folder.files[fileName]){
return false;
}

delete folder.files[fileName];
saveFileSystem(fileSystem);
return true;
}

function fileExists(folderName,fileName){
return getFile(folderName,fileName)!==null;
}