"use strict"

const mod = ( function(){
  var formEl        = document.querySelector('form');
  var searchInput   = document.querySelector('.searchInput');
  var ulEl          = document.querySelector('ul');
  var randomEl      = document.querySelector('.random');
  var searchResults;

  const requestWiki = function requestWiki(evt) {
    evt.preventDefault(); // prevent page from default refresh

    // MediaWiki API
    var endpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${searchInput.value}&origin=*`;

    // Make AJAX call
    return ajaxRequest(endpoint)
      .then( function(val){
        // Store object in sesarchResults
        searchResults = val;
        iterateSearchResults();
      } )
      .catch( function(err){
        console.log(err);
      } );
  }

  const iterateSearchResults = function iterateSearchResults() {
    // Array of results:
    var resultsArr = searchResults.query.search;

    // erase any existing content in <ul></ul>
    ulEl.innerHTML = '';

    // Iterate through resultsArr. For each result, store them in an <li> tag.
    return resultsArr.map(displayResults);
  }

  const displayResults = function displayResults(result) {
    var title            = result.title; // Wiki Article Title
    var snippet          = result.snippet; // Wiki Paragraph Snippet
    // Replace any spaces with an underscore for url compatibility
    var insertUnderscore = title.replace(/ /g, '_');
    var pageLink         = `https://en.wikipedia.org/wiki/${insertUnderscore}`;

    // Add <li></li> to <ul></ul>
    var liEl = document.createElement('li');
    ulEl.appendChild(liEl);

    /*<li>*/
    return liEl.innerHTML = `
      <a class="wikiLink" href=${pageLink} target="_blank">${title}</a>
      <p>${snippet}</p>
    `
    /*</li>*/
  }

  // CB for searInput eventListener. Position header to the top of viewport
  const moveHeader = function moveHeader() {
    var headerEl    = document.querySelector('header');
    var titleEl     = document.querySelector('.title');
    var buttons     = document.querySelector('.buttons');
    var elementsArr = [titleEl, buttons, searchInput, formEl];

    // Add classes that adjust styling
    headerEl.classList.add('moveHeaderToTop');
    titleEl.classList.add('fltLeft', 'widthTwenty');
    formEl.classList.add('fltLeft', 'widthEighty');
    searchInput.classList.add('updatedSearchInput');

    // Replace "Wiki-Search" with "WS"
    // titleEl.textContent = "WS";
    titleEl.innerHTML = '<a href="https://bd2187.github.io/Wiki-Search/">WS</a>';

    function convertToInlineBlk(element) {
      return element.classList.add('displayInlineBlk');
    }

    // Iterate through elementsArr and give it "display: inline-block"
    return elementsArr.map(convertToInlineBlk);
  }

  const ajaxRequest = function ajaxRequest(url) {
    return new Promise( function(resolve, reject){
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = handleData;
      xhr.send();

      function handleData() {
        if (xhr.status === 200 && xhr.readyState === 4) {
          var data = JSON.parse(xhr.responseText);
          return resolve ( data );
        } else {
          return reject( xhr.statusText );
        }
      }
    } );
  }

  return {
    formElListener() {
      return formEl.addEventListener('submit', requestWiki);
    },
    searchInputListener() {
      return searchInput.addEventListener('keyup', moveHeader);
    }
  }
} )();

mod.formElListener();
mod.searchInputListener();
