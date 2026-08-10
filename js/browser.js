const browserContent=document.getElementById("browserContent");
const searchInput=document.getElementById("searchInput");
const searchButton=document.getElementById("searchButton");
const addressInput=document.getElementById("addressInput");
const goButton=document.getElementById("goButton");
const backButton=document.getElementById("backButton");
const forwardButton=document.getElementById("forwardButton");
const refreshButton=document.getElementById("refreshButton");

let browserHistory=[];
let browserHistoryIndex=-1;
let browserInitialised=false;

function createHomePage(){
return`
<div class="browser-home">

<div class="logo">
MUNE<span>NET</span>
</div>

<p class="tagline">
the tiny internet inside my computer ♡
</p>

<div class="search-big">

<input
id="homeSearch"
type="search"
placeholder="What are you looking for?"
autocomplete="off"
>

<button id="homeSearchButton">
🔎
</button>

</div>

<div class="fake-links">

<a href="#" data-page="cybersecurity">
Cybersecurity
</a>

<a href="#" data-page="books">
Books
</a>

<a href="#" data-page="projects">
Projects
</a>

<a href="#" data-page="about">
About me
</a>

</div>

<div class="home-message">

<p>
♡ Welcome to MuneNet ♡
</p>

<small>
Search for something or explore the links above.
</small>

</div>

</div>
`;
}

function createArticlePage(page){
return`
<div class="site-page">

<div class="site-page-header">
🌐 MuneNet &nbsp;|&nbsp; ${page.url}
</div>

<h1>
${page.heading}
</h1>

${page.text}

<a href="#" class="page-back" data-page="home">
← MuneNet Home
</a>

</div>
`;
}

function getPageHTML(pageName){
const page=pages[pageName];

if(!page){
return createHomePage();
}

if(page.type==="home"){
return createHomePage();
}

return createArticlePage(page);
}

function updateAddress(url){
addressInput.value=url;
}

function updateBrowserButtons(){
backButton.disabled=browserHistoryIndex<=0;

forwardButton.disabled=
browserHistoryIndex>=browserHistory.length-1;
}

function displayPage(pageName,addHistory=true){

const page=pages[pageName];

if(!page)return;

browserContent.innerHTML=
getPageHTML(pageName);

updateAddress(page.url);

if(addHistory){

browserHistory=
browserHistory.slice(
0,
browserHistoryIndex+1
);

browserHistory.push({
type:"page",
name:pageName
});

browserHistoryIndex++;

}

bindPageLinks();
updateBrowserButtons();

}

async function displaySearchResults(query,addHistory=true){
browserContent.innerHTML=await createSearchPage(query);

updateAddress(
`http://munenet.local/search?q=${encodeURIComponent(query)}`
);

if(addHistory){

browserHistory=
browserHistory.slice(
0,
browserHistoryIndex+1
);

browserHistory.push({
type:"search",
query:query
});

browserHistoryIndex++;

}

bindPageLinks();
updateBrowserButtons();

}

function displayHistory(entry){
if(entry.type==="page"){
displayPage(entry.name,false);
}else if(entry.type==="search"){
displaySearchResults(entry.query,false);
}else if(entry.type==="article"){
openArticle(entry.id,false);
}
}

function performSearch(){

const query=
searchInput.value.trim();

if(!query)return;

displaySearchResults(
query,
true
);

}

function goBack(){

if(browserHistoryIndex<=0)return;

browserHistoryIndex--;

displayHistory(
browserHistory[browserHistoryIndex]
);

}

function goForward(){

if(browserHistoryIndex>=browserHistory.length-1)return;

browserHistoryIndex++;

displayHistory(
browserHistory[browserHistoryIndex]
);

}

function refreshBrowser(){

if(browserHistoryIndex<0)return;

displayHistory(
browserHistory[browserHistoryIndex]
);

}

function navigateAddress(){

const address=
addressInput.value.trim();

if(!address)return;

if(
address==="http://munenet.local/"||
address==="http://munenet.local"
){

displayPage(
"home",
true
);

return;

}

const clean=address
.replace(
"http://munenet.local/",
""
)
.replace(
/^\/+/,
""
);

const pageName=
Object.keys(pages).find(
key=>key===clean
);

if(pageName){

displayPage(
pageName,
true
);

}else{

addressInput.value=
"http://munenet.local/";

displayPage(
"home",
true
);

}

}

async function openArticle(articleId,addHistory=true){
const article=articleIndex.find(item=>item.id===articleId);

if(!article)return;

try{
const response=await fetch("content/"+article.file);

if(!response.ok){
throw new Error(`HTTP ${response.status}`);
}

const html=await response.text();

browserContent.innerHTML=`
<div class="site-page">
<div class="site-page-header">
🌐 MuneNet &nbsp;|&nbsp; ${article.title}
</div>
${html}
<a href="#" class="page-back" data-page="home">
← MuneNet Home
</a>
</div>
`;

updateAddress(
"http://munenet.local/articles/"+article.id
);

if(addHistory){
browserHistory=browserHistory.slice(0,browserHistoryIndex+1);
browserHistory.push({
type:"article",
id:articleId
});
browserHistoryIndex++;
}

bindPageLinks();
updateBrowserButtons();

}catch(error){
console.error("Could not open article:",error);

browserContent.innerHTML=`
<div class="browser-home">
<div class="result">
<h2>♡ MuneNet Error</h2>
<p>Sorry, MuneNet couldn't open this article.</p>
<p><small>${escapeHTML(error.message)}</small></p>
</div>
</div>
`;
}
}
function bindPageLinks(){
document.querySelectorAll("[data-page]").forEach(link=>{
link.addEventListener("click",event=>{
event.preventDefault();
displayPage(link.dataset.page,true);
});
});

document.querySelectorAll("[data-article]").forEach(link=>{
link.addEventListener("click",event=>{
event.preventDefault();
openArticle(link.dataset.article,true);
});
});

const homeSearch=document.getElementById("homeSearch");
const homeSearchButton=document.getElementById("homeSearchButton");

if(homeSearch&&homeSearchButton){
homeSearchButton.addEventListener("click",()=>{
const query=homeSearch.value.trim();
if(!query)return;
searchInput.value=query;
displaySearchResults(query,true);
});

homeSearch.addEventListener("keydown",event=>{
if(event.key==="Enter"){
const query=homeSearch.value.trim();
if(!query)return;
searchInput.value=query;
displaySearchResults(query,true);
}
});
}
}

searchButton.addEventListener(
"click",
performSearch
);

searchInput.addEventListener(
"keydown",
event=>{

if(event.key==="Enter"){
performSearch();
}

}
);

backButton.addEventListener(
"click",
goBack
);

forwardButton.addEventListener(
"click",
goForward
);

refreshButton.addEventListener(
"click",
refreshBrowser
);

goButton.addEventListener(
"click",
navigateAddress
);

addressInput.addEventListener(
"keydown",
event=>{

if(event.key==="Enter"){
navigateAddress();
}

}
);

function initialiseBrowser(){

if(browserInitialised)return;

browserInitialised=true;

browserHistory=[
{
type:"page",
name:"home"
}
];

browserHistoryIndex=0;

displayPage(
"home",
false
);

}