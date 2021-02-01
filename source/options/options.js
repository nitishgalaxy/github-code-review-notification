import optionsStorage from '../lib/options-storage.js';
import {GITHUB_URL} from '../lib/constants.js'

optionsStorage.syncForm('#options-form');

function resetDefaultURLs(){
    console.log("Resetting Github URLs to default values...");
    document.getElementById("github_url_1").value = GITHUB_URL;
    document.getElementById("github_url_2").value = "";
}

document.getElementById("restore_default_urls").addEventListener("click", resetDefaultURLs);


