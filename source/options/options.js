import optionsStorage from '../lib/options-storage.js';
import {GITHUB_URL} from '../lib/constants.js'
import {updateDashboard} from '../lib/popup_dashboard_handler.js';

optionsStorage.syncForm('#options-form');

function resetDefaultURLs(){
    console.log("Resetting Github URLs to default values...");
    document.getElementById("github_url_1").value = GITHUB_URL;
    document.getElementById("github_url_2").value = "";
}

//document.getElementById("restore_default_urls").addEventListener("click", resetDefaultURLs);


document.getElementById("github_url_1").addEventListener("change", updateDashboard);
document.getElementById("github_url_2").addEventListener("change", updateDashboard);
