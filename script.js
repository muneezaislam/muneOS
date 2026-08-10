const windows={};

document.querySelectorAll(".app-window").forEach(win=>{
    windows[win.id.replace("window-","")]=win;
});

const taskButtons=document.getElementById("taskButtons");
const startMenu=document.getElementById("startMenu");
const startButton=document.getElementById("startButton");
let zIndex=20;

function openWindow(name){
    const win=windows[name];
    if(!win)return;
    win.classList.remove("hidden");
    zIndex++;
    win.style.zIndex=zIndex;
    startMenu.classList.add("hidden");
    refreshTasks();
    if(name==="browser") initialiseBrowser();
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
    taskButtons.innerHTML="";
    Object.entries(windows).forEach(([name,win])=>{
        if(!win.classList.contains("hidden")){
            const button=document.createElement("button");
            button.className="task-button";
            button.textContent=win.dataset.title;
            button.onclick=()=>openWindow(name);
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

    const close=event.target.closest(".close");
    if(close){
        closeWindow(close.closest(".app-window"));
        return;
    }

    const minimize=event.target.closest(".minimize");
    if(minimize){
        minimizeWindow(minimize.closest(".app-window"));
    }
});

document.querySelectorAll(".app-window").forEach(win=>{
    win.addEventListener("mousedown",()=>{
        zIndex++;
        win.style.zIndex=zIndex;
    });
});

startButton.addEventListener("click",event=>{
    event.stopPropagation();
    startMenu.classList.toggle("hidden");
});

document.addEventListener("click",event=>{
    if(!event.target.closest("#startMenu")&&!event.target.closest("#startButton")){
        startMenu.classList.add("hidden");
    }
});


/* MUNENET */

const pages={
    home:{
        title:"MuneNet",
        url:"http://munenet.local/",
        type:"home"
    },
    cybersecurity:{
        title:"Cybersecurity",
        url:"http://munenet.local/cybersecurity",
        heading:"Cybersecurity",
        description:"My cybersecurity learning journey, projects, notes and experiments.",
        text:`
            <p>Welcome to my cybersecurity corner.</p>
            <p>This section will contain my cybersecurity learning journey, coding projects, notes and experiments.</p>
            <h2>Coming soon...</h2>
            <p>This page will become a proper collection of my cybersecurity work.</p>
        `
    },
    books:{
        title:"Books",
        url:"http://munenet.local/books",
        heading:"My Books",
        description:"Fantasy, romance and the books currently living in my brain.",
        text:`
            <p>Welcome to my little book corner. ♡</p>
            <p>Here I'll eventually keep reviews, recommendations, favourite characters and whatever I'm currently reading.</p>
            <h2>Currently reading...</h2>
            <p>Book information will be added here.</p>
        `
    },
    projects:{
        title:"Projects",
        url:"http://munenet.local/projects",
        heading:"My Projects",
        description:"Coding projects, experiments and things I'm building.",
        text:`
            <p>This is where all my coding projects will eventually live.</p>
            <h2>DecryptHer</h2>
            <p>An educational game designed to teach young people about women's contributions to computing.</p>
            <h2>Cybersecurity Projects</h2>
            <p>More projects will be added as I build them.</p>
        `
    },
    about:{
        title:"About Mune",
        url:"http://munenet.local/about",
        heading:"About Mune",
        description:"A little introduction to Mune.",
        text:`
            <p>Hi! I'm Mune. ♡</p>
            <p>Welcome to my little corner of the internet. This entire computer is designed to feel like my own personal digital world.</p>
            <p>Explore around and see what you can find.</p>
        `
    },
    blog:{
        title:"Mune's Blog",
        url:"http://munenet.local/blog",
        heading:"Mune's Blog",
        description:"Personal blog posts and thoughts.",
        text:`
            <p>Welcome to my blog.</p>
            <p>This is where my actual posts will eventually appear.</p>
            <h2>01 — Why I Love The Internet</h2>
            <p>There's something special about old personal websites. They felt handmade, weird, colourful and completely personal.</p>
        `
    }
};

let browserHistory=[];
let browserHistoryIndex=-1;
let browserInitialised=false;

const browserContent=document.getElementById("browserContent");
const searchInput=document.getElementById("searchInput");
const searchButton=document.getElementById("searchButton");
const addressInput=document.getElementById("addressInput");
const goButton=document.getElementById("goButton");
const backButton=document.getElementById("backButton");
const forwardButton=document.getElementById("forwardButton");
const refreshButton=document.getElementById("refreshButton");

function escapeHTML(text){
    return text.replace(/[&<>"']/g,char=>({
        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        '"':"&quot;",
        "'":"&#039;"
    }[char]));
}

function createHomePage(){
    return `
        <div class="browser-home">
            <div class="logo">MUNE<span>NET</span></div>
            <p class="tagline">the tiny internet inside my computer ♡</p>
            <div class="search-big">
                <input id="homeSearch" type="search" placeholder="What are you looking for?" autocomplete="off">
                <button id="homeSearchButton">🔎</button>
            </div>
            <div class="fake-links">
                <a href="#" data-page="cybersecurity">Cybersecurity</a>
                <a href="#" data-page="books">Books</a>
                <a href="#" data-page="projects">Projects</a>
                <a href="#" data-page="about">About me</a>
            </div>
            <div class="home-message">
                <p>♡ Welcome to MuneNet ♡</p>
                <small>Search for something or explore the links above.</small>
            </div>
        </div>
    `;
}

function createSearchPage(query){
    const term=query.toLowerCase().trim();
    const results=Object.entries(pages).filter(([key,page])=>{
        if(key==="home")return false;
        return page.title.toLowerCase().includes(term) ||
        page.description.toLowerCase().includes(term) ||
        page.text.toLowerCase().replace(/<[^>]*>/g," ").toLowerCase().includes(term);
    });

    if(!results.length){
        return `
            <div class="browser-home">
                <div class="logo" style="font-size:28px">MUNE<span>NET</span></div>
                <div class="result">
                    <h2>404 — Nothing found ♡</h2>
                    <p>MuneNet couldn't find anything matching "<b>${escapeHTML(query)}</b>".</p>
                    <p>Try searching for cybersecurity, books, projects, blog or about.</p>
                </div>
            </div>
        `;
    }

    return `
        <div class="browser-home">
            <div class="logo" style="font-size:28px">MUNE<span>NET</span></div>
            <div class="search-results">
                <p class="search-heading">Search results for: <b>${escapeHTML(query)}</b></p>
                ${results.map(([key,page])=>`
                    <div class="result">
                        <h2>${page.title}</h2>
                        <p>${page.description}</p>
                        <a href="#" class="result-link" data-page="${key}">Open page →</a>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

function createArticlePage(page){
    return `
        <div class="site-page">
            <div class="site-page-header">🌐 MuneNet &nbsp;|&nbsp; ${page.url}</div>
            <h1>${page.heading}</h1>
            ${page.text}
            <a href="#" class="page-back" data-page="home">← MuneNet Home</a>
        </div>
    `;
}

function getPageHTML(pageName){
    const page=pages[pageName];
    if(!page)return createHomePage();
    if(page.type==="home")return createHomePage();
    return createArticlePage(page);
}

function updateAddress(url){
    addressInput.value=url;
}

function updateBrowserButtons(){
    backButton.disabled=browserHistoryIndex<=0;
    forwardButton.disabled=browserHistoryIndex>=browserHistory.length-1;
}

function displayPage(pageName,addHistory=true){
    const page=pages[pageName];
    if(!page)return;

    browserContent.innerHTML=getPageHTML(pageName);
    updateAddress(page.url);

    if(addHistory){
        browserHistory=browserHistory.slice(0,browserHistoryIndex+1);
        browserHistory.push({type:"page",name:pageName});
        browserHistoryIndex++;
    }

    bindPageLinks();
    updateBrowserButtons();
}

function displaySearchResults(query,addHistory=true){
    browserContent.innerHTML=createSearchPage(query);
    updateAddress(`http://munenet.local/search?q=${encodeURIComponent(query)}`);

    if(addHistory){
        browserHistory=browserHistory.slice(0,browserHistoryIndex+1);
        browserHistory.push({type:"search",query:query});
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
    }
}

function performSearch(){
    const query=searchInput.value.trim();
    if(!query)return;
    displaySearchResults(query,true);
}

function goBack(){
    if(browserHistoryIndex<=0)return;
    browserHistoryIndex--;
    displayHistory(browserHistory[browserHistoryIndex]);
}

function goForward(){
    if(browserHistoryIndex>=browserHistory.length-1)return;
    browserHistoryIndex++;
    displayHistory(browserHistory[browserHistoryIndex]);
}

function refreshBrowser(){
    if(browserHistoryIndex<0)return;
    displayHistory(browserHistory[browserHistoryIndex]);
}

function navigateAddress(){
    const address=addressInput.value.trim();
    if(!address)return;

    if(address==="http://munenet.local/"||address==="http://munenet.local"){
        displayPage("home",true);
        return;
    }

    const clean=address
        .replace("http://munenet.local/","")
        .replace(/^\/+/,"");

    const pageName=Object.keys(pages).find(key=>key===clean);

    if(pageName){
        displayPage(pageName,true);
    }else{
        addressInput.value="http://munenet.local/";
        displayPage("home",true);
    }
}

function bindPageLinks(){
    document.querySelectorAll("[data-page]").forEach(link=>{
        link.addEventListener("click",event=>{
            event.preventDefault();
            displayPage(link.dataset.page,true);
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

searchButton.addEventListener("click",performSearch);

searchInput.addEventListener("keydown",event=>{
    if(event.key==="Enter")performSearch();
});

backButton.addEventListener("click",goBack);
forwardButton.addEventListener("click",goForward);
refreshButton.addEventListener("click",refreshBrowser);
goButton.addEventListener("click",navigateAddress);

addressInput.addEventListener("keydown",event=>{
    if(event.key==="Enter")navigateAddress();
});

function initialiseBrowser(){
    if(browserInitialised)return;

    browserInitialised=true;
    browserHistory=[{type:"page",name:"home"}];
    browserHistoryIndex=0;

    displayPage("home",false);
}

function updateClock(){
    document.getElementById("clock").textContent=new Date().toLocaleTimeString([],{
        hour:"numeric",
        minute:"2-digit"
    });
}

updateClock();
setInterval(updateClock,30000);
refreshTasks();