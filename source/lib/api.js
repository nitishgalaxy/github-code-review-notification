import Timeout from 'await-timeout';
import {GITHUB_REVIEW_REQUEST_CSS_SELECTOR, 
        GITHUB_ENTERPRISE_REVIEW_REQUEST_CSS_SELECTOR, 
        GITHUB_URL} from './constants.js';


function get_github_review_page_url(baseUrl) {
    const page = 'pulls/review-requested';
    var url = null;

    if(baseUrl.endsWith('/')){
        url = `${baseUrl}${page}`;
    } 
    else{
        url = `${baseUrl}/${page}`;
    }

    return url;
}


function get_pending_request_count_from_page(html, baseUrl){
    var css_selector = null;

    if(baseUrl.indexOf(GITHUB_URL) >=0 ){
        css_selector = GITHUB_REVIEW_REQUEST_CSS_SELECTOR;
    }
    else{
        css_selector = GITHUB_ENTERPRISE_REVIEW_REQUEST_CSS_SELECTOR;
    }

    var doc = new DOMParser().parseFromString(html, "text/html");
    var element = doc.querySelector(css_selector);
    var element_text = element.text;
    var pending_request_count = parseInt(element_text);

    return pending_request_count;
}


export async function get_pending_review_count(github_url){
    const target_url = get_github_review_page_url(github_url);
    const timer = new Timeout();
    var pending_request_count = null;
    var error_message = "";
    var connection_error = false;
    var login_error = false;
    var html;

    try {
        // Make AJAX call and fetch the page
        const response = await Promise.race([
            fetch(target_url),
            timer.set(15000, 'Timeout!')
          ]);

        html = await response.text();
    } catch (error) {
        // Debug
        console.log(`Error reading '${target_url}' :`, error);
        error_message = 'connection_error';
        connection_error = true;
    } 

    if(!error_message){
        try{
            pending_request_count = get_pending_request_count_from_page(html, github_url);
        
        } catch (error) {
            // Debug
            console.log(`Error in get_pending_request_count_from_page :`, error);
            error_message = 'login_error'
            login_error = true;
        } 
    }

    // Finally clear timer
    timer.clear();

    // Debug
    //console.log(`Code review request count for ${github_url} = ${pending_request_count}`);
    var response = {
        github_url: github_url,
        pending_request_count: pending_request_count,
        connection_error: connection_error,
        login_error: login_error
    }

    //console.log(response);

    return response;
}
