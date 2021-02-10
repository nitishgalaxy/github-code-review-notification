import store from '../lib/data_store.js';
import {NUM_GITHUB_ACCOUNTS} from '../lib/constants.js';
import {showNotification} from '../lib/notification.js'
import options_storage from '../lib/options-storage.js';
import {clearStorageForTask} from '../lib/helpers.js';


function hideElementByID(elm_id){
    var element, name, arr;
    element = document.getElementById(elm_id);
    if(element){
        name = "display-none";
        arr = element.className.split(" ");
        if (arr.indexOf(name) == -1) {
            element.className += " " + name;
        }
    }
}

function displayElementByID(elm_id){
    var element = document.getElementById(elm_id);
    if(element){
        element.className = element.className.replace(/\bdisplay-none\b/g, "");
    }
}

function setSpanTextContent(element_id, text){
    var span = document.getElementById(element_id);

    if(span){
        while( span.firstChild ) {
            span.removeChild( span.firstChild );
        }
        span.appendChild( document.createTextNode(text));
        
    }
}

function setSpanAnchorTag(element_id, url){
    var span = document.getElementById(element_id);

    if(span){
        while( span.firstChild ) {
            span.removeChild( span.firstChild );
        }

        var a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.text = url;
        span.appendChild(a);
    }

}

async function loadGithubUrl(ID){
    const container_id = `container_github_url_${ID}`;
    const span_url_display_id = `github_url_${ID}`;
    const github_url = await store.get(`github_url_${ID}`);

    
    if(github_url === null || github_url === undefined || github_url.trim() === ''){
        // Hide container
        //console.log("Hiding container :", container_id);
        hideElementByID(container_id);
        await clearStorageForTask(ID);
    }
    else{
        // Show container
        //console.log("Showing container :", container_id);
        displayElementByID(container_id);
        setSpanAnchorTag(span_url_display_id, github_url);
    }
}


async function showNotificationCount(ID){
    const count = await store.get(`count_github_url_${ID}`);
    const span_count = `count_github_url_${ID}`;

    if(count === null || count === undefined || count === ""){
        hideElementByID(span_count);
    }
    else{
        displayElementByID(span_count);
        setSpanTextContent(span_count, count);
    }
}


async function showConnectivityStatus(ID){
    const connection_error = await store.get(`connection_error_github_url_${ID}`);
    const span_connection_error = `connection_error_github_url_${ID}`;

    if(!connection_error){
        hideElementByID(span_connection_error);
    }
    else{
        displayElementByID(span_connection_error);
    }
}

async function showLoggedInStatus(ID){
    const login_error = await store.get(`login_error_github_url_${ID}`);
    const span_login_error = `login_error_github_url_${ID}`;

    if(!login_error){
        hideElementByID(span_login_error);
    }
    else{
        displayElementByID(span_login_error);
    }
}




export async function refreshDashboard(){
    //console.log("refreshDashboard called");
    for(var ID=1; ID<=NUM_GITHUB_ACCOUNTS; ID++){
        await loadGithubUrl(ID);
        await showNotificationCount(ID);
        await showConnectivityStatus(ID);
        await showLoggedInStatus(ID);
    }

    await showNotification();
}


export async function updateDashboard(){
    const {github_url_1, github_url_2} = await options_storage.getAll();

    // Cache current options in browser store
    await store.set('github_url_1', github_url_1);
    await store.set('github_url_2', github_url_2);

    await refreshDashboard();

}


