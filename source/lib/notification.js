import {NUM_GITHUB_ACCOUNTS} from './constants.js';
import store from './data_store.js';

// UUID v4
function generateUuid()
{
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var randVal = Math.random() * 16 | 0;
        var val = c == 'x' ? randVal : (randVal & 0x3 | 0x8);
        return val.toString(16);
    });
    return uuid;
}


function sendNotification(){
    var title = "Github Code Review Notification";
    var notifOptions = {
        type: "basic",
        iconUrl: "../icons/icon48.png",
        title: title,
        message: "You have got pending code review request."
    };
    chrome.notifications.create(generateUuid(), notifOptions);
}

 function updateBadgeCount(count){
    //console.log("updateBadgeCount triggered!");
    if(count == '0'){
        count = '';
    }
    chrome.browserAction.setBadgeBackgroundColor({color:[255, 44, 51, 255]});
    chrome.browserAction.setBadgeText({text: count});
}

async function getTotalPendingReview(){
    var total = 0;
    for(var ID=1; ID<=NUM_GITHUB_ACCOUNTS; ID++){
        const count = await store.get(`count_github_url_${ID}`);
        try{
            if(!(count === null || count === undefined || count === "")){
                total += count;
            }
        }
        catch(err){}

    }

    return total;
}

export async function showNotification(){
    const notification_count = await getTotalPendingReview();
    var prev_notification_count = await store.get(`prev_notification_count`);
    var show_notification = false;

    if(!prev_notification_count){
        prev_notification_count = 0;
    }

    if(notification_count > prev_notification_count){
        show_notification = true;
        await store.set(`hide_badge`, false);
    }

    if(show_notification){
        sendNotification();
    }

    var hide_badge = await store.get(`hide_badge`);
    
    if(!hide_badge){
        updateBadgeCount(notification_count+'');
    }

    await store.set(`prev_notification_count`, notification_count);
}


export async function clearBadge(){
    await store.set(`hide_badge`, true);
    updateBadgeCount('');
}
