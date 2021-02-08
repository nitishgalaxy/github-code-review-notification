
import {clearBadge} from '../lib/notification.js'
import {refreshDashboard} from '../lib/popup_dashboard_handler.js';

$(document).ready(function () {


    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
        var storageChange = changes[key];
        /*
        console.log('Storage key "%s" in namespace "%s" changed. ' +
                    'Old value was "%s", new value is "%s".',
                    key,
                    namespace,
                    storageChange.oldValue,
                    storageChange.newValue);
        */
        
        }
    refreshDashboard();
    });


    document.getElementById("clear_notification").addEventListener("click", clearBadge);


    refreshDashboard();
});
