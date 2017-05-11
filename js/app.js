"use strict"

var formEl = document.querySelector('form');
var searchInput = document.querySelector('.searchInput');
var ulEl = document.querySelector('ul');
var searchResults;

formEl.addEventListener('submit', requestWiki);
searchInput.addEventListener('keyup', moveHeader);

function moveHeader() {
  var headerEl = document.querySelector('header');
  var titleEl = document.querySelector('.title');
  var buttons = document.querySelector('.buttons');
  var elementsArr = [titleEl, buttons, searchInput, formEl];

  titleEl.textContent = "WS";
  function convertToInlineBlk(element) {
    return element.classList.add('displayInlineBlk');
  }

  headerEl.classList.add('moveHeaderToTop');
  titleEl.classList.add('fltLeft', 'widthTwenty');
  formEl.classList.add('fltLeft', 'widthEighty');
  searchInput.classList.add('updatedSearchInput');

  return elementsArr.map(convertToInlineBlk);
}

function requestWiki(evt) {
  evt.preventDefault(); // prevent page from refreshing

  var endpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${searchInput.value}&origin=*`;

  return ajaxRequest(endpoint)
    .then( function(val){
      searchResults = val;
      iterateResults();
    } )
    .catch( function(err){
      console.log(err);
    } )
}

function iterateResults() {
  var resultsArr = searchResults.query.search;

  ulEl.innerHTML = ''; // erase any existing content in <ul></ul>
  return resultsArr.map(displayResults);

}

function displayResults(result) {
  var liEl = document.createElement('li');
  var title = result.title;
  var snippet = result.snippet;
  var insertUnderscore = title.replace(/ /g, '_');
  var pageLink = `https://en.wikipedia.org/wiki/${insertUnderscore}`;

  ulEl.appendChild(liEl);

  return liEl.innerHTML = `
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
