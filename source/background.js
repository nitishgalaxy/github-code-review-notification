// eslint-disable-next-line import/no-unassigned-import
import options_storage from './lib/options-storage.js';
import {get_pending_review_count} from './lib/api.js';
import {POLLING_INTERVAL} from './lib/constants.js';
import store from './lib/data_store.js';
import {showNotification} from './lib/notification.js'
import {clearStorageForTask} from './lib/helpers.js';


async function refreshCounter(task){
    //console.log("Processing task : ", task);
    const {pending_request_count, connection_error, login_error} = await get_pending_review_count(task.url);

    const keyname_connection_error = `connection_error_${task.type}`;
    await store.set(keyname_connection_error, connection_error);

    const keyname_login_error = `login_error_${task.type}`;
    await store.set(keyname_login_error, login_error);

    if(pending_request_count != null){
        const keyname_count = `count_${task.type}`;
        await store.set(keyname_count, pending_request_count);
    }

    showNotification();
}




async function pollingService(){

    const {github_url_1, github_url_2} = await options_storage.getAll();

    // Cache current options in browser store
    await store.set('github_url_1', github_url_1);
    await store.set('github_url_2', github_url_2);

    var tasks = [];
    if(github_url_1.trim().length > 0){
        tasks.push({
            url: github_url_1,
            type: 'github_url_1'
        });
    }
    else{
        clearStorageForTask(1);
    }

    if(github_url_2.trim().length > 0){
        tasks.push({
            url: github_url_2,
            type: 'github_url_2'
        });
    }
    else{
        clearStorageForTask(2);
    }

    console.log('Tasks = ', tasks);
    tasks.forEach(task=>refreshCounter(task));
    
}


function schedulePollingService(){
    const requestTimerId = window.setInterval(pollingService, POLLING_INTERVAL*1000);
}



/*
browser.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
    }
  });
*/

//send_analytics('Background', 'Triggered');

schedulePollingService()

pollingService();   // Poll first time on extension install
