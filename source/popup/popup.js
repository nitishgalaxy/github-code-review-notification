import store from '../lib/data_store.js';

$(document).ready(function () {

function displayElementByID(elm_id){
    var element, name, arr;
    element = document.getElementById(elm_id);
    name = "display-none";
    arr = element.className.split(" ");
    if (arr.indexOf(name) == -1) {
        element.className += " " + name;
    }
}

function hideElementByID(elm_id){
    var element = document.getElementById(elm_id);
    element.className = element.className.replace(/\bdisplay-none\b/g, "");
}

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


async function showConnectivityAndLoginStatus(){
    var keys = ["err_message_github", "err_message_github_enterprise"];
    keys.forEach(async function(key){
        var value = await store.get(key);

        console.log("Key = ", key, "Value = ", value);

        if(key.startsWith("err_message_")){
            var elm_id_disp = null;
            var elm_id_hide = null;
            
            if(key.indexOf("github_enterprise")>=0){
               if(value === 'connection_error'){
                   elm_id_disp = 'offline_github_enterprise';
                   elm_id_hide = 'logged_out_github_enterprise';
               }
               else if(value === 'login_error'){
                   elm_id_disp = 'logged_out_github_enterprise';
                   elm_id_hide = 'offline_github_enterprise';
               }
               else if(value === ""){
                   elm_id_hide = 'logged_out_github_enterprise';
                   hideElementByID(elm_id_hide);
                   elm_id_hide = 'offline_github_enterprise';
                   hideElementByID(elm_id_hide);
                   elm_id_hide = null;
               }
            }
            else{
               if(value === 'connection_error'){
                   elm_id_disp = 'offline_github';
                   elm_id_hide = 'logged_out_github';
               }
               else if(value === 'login_error'){
                   elm_id_disp = 'logged_out_github';
                   elm_id_hide = 'offline_github';
               }
               else if(value === ""){
                   elm_id_hide = 'logged_out_github';
                   hideElementByID(elm_id_hide);
                   elm_id_hide = 'offline_github';
                   hideElementByID(elm_id_hide);
                   elm_id_hide = null;
    
               }
            }
    
           if(elm_id_disp != null){
               displayElementByID(elm_id_disp);
           }
    
           if(elm_id_hide != null){
               hideElementByID(elm_id_hide);
           }
        }

    });

    
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

        loadGithubUrls();
        showNotificationCounts();

        showConnectivityAndLoginStatus();
  }
});

loadGithubUrls();
showNotificationCounts();
showConnectivityAndLoginStatus();
});
