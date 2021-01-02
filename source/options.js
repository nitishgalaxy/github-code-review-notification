import optionsStorage from './options-storage';

optionsStorage.syncForm('#options-form');


function optionsPageLoaded(){
	console.log("optionsPageLoaded");
}

window.addEventListener('load', optionsPageLoaded);

function resetDefaultURLs(){
    console.log("Click");
    document.getElementById("github_url_1").value = "https://github.com";
    document.getElementById("github_url_2").value = "";
}

document.getElementById("restore_default_urls").addEventListener("click", resetDefaultURLs);


