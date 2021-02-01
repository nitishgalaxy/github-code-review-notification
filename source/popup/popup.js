import store from '../lib/data_store.js';

$(document).ready(function () {

function setSpanTextContent(element_id, text){
    var span = document.getElementById(element_id);
    while( span.firstChild ) {
        span.removeChild( span.firstChild );
    }
    span.appendChild( document.createTextNode(text));
}

function setSpanAnchorTag(element_id, url){
    var span = document.getElementById(element_id);
    while( span.firstChild ) {
        span.removeChild( span.firstChild );
    }

    var a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.text = url;
    span.appendChild(a);

}

async function loadGithubUrls(){
    const github_url_1 = await store.get('github_url_1');
    const github_url_2 = await store.get('github_url_2');
    console.log("github_url_1 :", github_url_1, "github_url_2 :", github_url_2);
    setSpanAnchorTag("github_url_1", github_url_1);
    setSpanAnchorTag("github_url_2", github_url_2);

}


async function showNotificationCounts(){
    const count_github = await store.get('count_github');
    const count_github_enterprise = await store.get('count_github_enterprise');
    console.log("count_github :", count_github, "count_github_enterprise :", count_github_enterprise);
    setSpanTextContent("count_github", count_github);
    setSpanTextContent("count_github_enterprise", count_github_enterprise);
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

     if(key == 'count_github' || key == 'count_github_enterprise'){
        showNotificationCounts();
     }
  });

loadGithubUrls()
showNotificationCounts()
});
