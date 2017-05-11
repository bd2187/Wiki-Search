var endpoint = "https://crossorigin.me/https://en.wikipedia.org/w/api.php?action=query&format=json&prop=&list=search&titles=lakers&srsearch=lakers&srnamespace=-2";

var obj;

var ulEl = document.querySelector('ul');

function foo() {
  obj.query.search.map(function(item){
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
  } );

}

ajaxRequest(endpoint)
  .then( function(val){
    obj = val;
    console.log(val);
    foo();
  } )
  .catch( function(err){
    console.log(err);
  } )


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
