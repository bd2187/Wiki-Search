var formEl = document.querySelector('form');
var searchInput = document.querySelector('.searchInput');
var ulEl = document.querySelector('ul');
var searchResults;

formEl.addEventListener('submit', cb);

function cb(evt) {
  evt.preventDefault(); // prevent page from refreshing

  var endpoint = `https://crossorigin.me/https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${searchInput.value}`;

  return ajaxRequest(endpoint)
    .then( function(val){
      searchResults = val;
      console.log(val);
      displayResults();
    } )
    .catch( function(err){
      console.log(err);
    } )
}

function displayResults() {
  ulEl.innerHTML = ''; // erase any existing content in <ul></ul>
  return searchResults.query.search.map(domManip)

}

function domManip(item) {
  var liEl = document.createElement('li');

  var title = item.title;
  var snippet = item.snippet;
  var insertUnderscore = title.replace(' ', '_');
  var pageLink = `https://en.wikipedia.org/wiki/${insertUnderscore}`;

  ulEl.appendChild(liEl);
  liEl.innerHTML = `
    <a href=${pageLink} target="_blank">${title}</a>
    <p>${snippet}</p>
  `
}

function ajaxRequest(url) {
  return new Promise( function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = handleData;

    function handleData() {
      if (xhr.status === 200 && xhr.readyState === 4) {
        var data = JSON.parse(xhr.responseText);
        return resolve ( data );
      } else {
        return reject( /*...*/ );
      }
    }

  xhr.send();
  } )
}
