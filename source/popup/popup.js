import store from '../lib/data_store.js';

$(document).ready(function () {

function setSpanContent(element_id, text){
    var span = document.getElementById(element_id);
    while( span.firstChild ) {
        span.removeChild( span.firstChild );
    }
    span.appendChild( document.createTextNode(text));
}

async function loadGithubUrls(){
    const github_url_1 = await store.get('github_url_1');
    const github_url_2 = await store.get('github_url_2');
    console.log("github_url_1 :", github_url_1, "github_url_2 :", github_url_2);
    setSpanContent("github_url_1", github_url_1);
    setSpanContent("github_url_2", github_url_2);

}


chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      var storageChange = changes[key];
      
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
    
     if(key == 'github_url_1' || key == 'github_url_2')
        loadGithubUrls();
     }
  });

loadGithubUrls()
});
