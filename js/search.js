let articleIndex=[];
let articlesReady=loadArticles();

async function loadArticles(){
try{
const response=await fetch("content/index.json");

if(!response.ok){
throw new Error(`HTTP ${response.status}`);
}

articleIndex=await response.json();

console.log("MuneNet articles loaded:",articleIndex.length);

return true;
}catch(error){
console.error("MuneNet article index error:",error);
return false;
}
}

function escapeHTML(text){
return String(text).replace(/[&<>"']/g,char=>({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"
}[char]));
}

function searchArticles(query){
const stopWords=[
"what",
"are",
"is",
"a",
"an",
"the",
"about",
"tell",
"me",
"please",
"can",
"you",
"explain",
"how",
"why",
"do",
"does",
"of",
"to",
"in",
"on",
"for",
"and",
"or",
"i",
"want",
"know"
];

const words=query
.toLowerCase()
.trim()
.split(/\s+/)
.filter(word=>!stopWords.includes(word));

if(!words.length)return[];

return articleIndex
.map(article=>{

const title=(article.title||"").toLowerCase();

const description=
(article.description||"").toLowerCase();

const keywords=
(article.keywords||[])
.join(" ")
.toLowerCase();

const searchableText=
`${title} ${description} ${keywords}`;

let score=0;

words.forEach(word=>{

if(title.includes(word)){
score+=10;
}

if(description.includes(word)){
score+=5;
}

if(keywords.includes(word)){
score+=3;
}

});

return{
article,
score
};

})
.filter(result=>result.score>0)
.sort((a,b)=>b.score-a.score)
.map(result=>result.article);
}

function createSearchPage(query){
const results=searchArticles(query);

if(!results.length){
return`
<div class="search-page">
<div class="search-heading">
No results found for "<b>${escapeHTML(query)}</b>"
</div>

<div class="no-results">
<p>MuneNet couldn't find anything matching your search.</p>
<p>Try another word or phrase.</p>
</div>
</div>
`;
}

return`
<div class="search-page">

<div class="search-query">
Search results for "<b>${escapeHTML(query)}</b>"
</div>

<div class="results-list">

${results.map(article=>`

<div class="search-result">

<a href="#"
class="search-result-title"
data-article="${escapeHTML(article.id)}">
${escapeHTML(article.title)}
</a>

<div class="search-result-url">
http://munenet.local/articles/${escapeHTML(article.id)}
</div>

<p class="search-result-description">
${escapeHTML(article.description)}
</p>

<a href="#"
class="search-result-open"
data-article="${escapeHTML(article.id)}">
Open page →
</a>

</div>

`).join("")}

</div>

</div>
`;
}