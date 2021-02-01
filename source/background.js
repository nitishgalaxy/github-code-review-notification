// eslint-disable-next-line import/no-unassigned-import
import options_storage from './lib/options-storage.js';
import {get_pending_review_count} from './lib/api.js';
import {POLLING_INTERVAL} from './lib/constants.js';
import store from './lib/data_store.js';



async function refreshCounter(task){
    console.log("Processing task : ", task);
    const review_count = await get_pending_review_count(task.url);
    const keyname = `count_${task.type}`;
    store.set(keyname, 0);
    store.set(keyname, review_count);

   
}


async function pollingService(){

    const {github_url_1, github_url_2} = await options_storage.getAll();

    // Cache current options in browser store
    store.set('github_url_1', github_url_1);
    store.set('github_url_2', github_url_2);

    var tasks = [];
    if(github_url_1.trim().length > 0){
        tasks.push({
            url: github_url_1,
            type: 'github'
        });
    }

    if(github_url_2.trim().length > 0){
        tasks.push({
            url: github_url_2,
            type: 'github_enterprise'
        });
    }

    //console.log('Tasks = ', tasks);
    tasks.forEach(task=>refreshCounter(task));
    
}


function schedulePollingService(){
    const requestTimerId = window.setInterval(pollingService, POLLING_INTERVAL*1000);
}




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

//send_analytics('Background', 'Triggered');
schedulePollingService()

