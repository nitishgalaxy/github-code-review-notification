import optionsStorage from '../options-storage';
import {GITHUB_REVIEW_REQUEST_CSS_SELECTOR, 
        GITHUB_ENTERPRISE_REVIEW_REQUEST_CSS_SELECTOR, 
        GITHUB_URL} from './constants';
import {validatePermission, requestPermission} from './permissions';


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


function is_valid_url(string){
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
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




async function get_pending_review_count(github_url){
    const target_url = get_github_review_page_url(github_url);

    var pending_request_count = null;

    try {
            var has_permission_to_invoke_url = await validatePermission({origins: [target_url]});
            console.log(`Permission to invoke '${target_url}' = ${has_permission_to_invoke_url}`);
        
        if(!has_permission_to_invoke_url){
            // Request for permission
            has_permission_to_invoke_url = await requestPermission({origins: ["https://github.office.opendns.com/*"]});

            console.log(`Permission requested to invoke '${target_url}' = ${has_permission_to_invoke_url}`);
        }
        
        if(!has_permission_to_invoke_url){
            console.log("Permission not granted to invoke ", target_url);
        }

        // Make AJAX call and fetch the page
        const response = await fetch(target_url);
        const html = await response.text();
        pending_request_count = get_pending_request_count_from_page(html, github_url);
     
	} catch (error) {
		console.error(`Error reading '${target_url}' :`, error);
    }
    
    return pending_request_count;
}


export async function get_consolidated_pending_review_counts(){
    const {github_url_1, github_url_2} = await optionsStorage.getAll();
    var pending_github_review_count = 0, pending_github_enterprise_review_count = 0;

    if(is_valid_url(github_url_1)){
        pending_github_review_count = await get_pending_review_count(github_url_1)
        console.log(`Pending code review count for '${github_url_1}' = ${pending_github_review_count}`);
    }

    if(is_valid_url(github_url_2)){
        pending_github_enterprise_review_count = await get_pending_review_count(github_url_2)
        console.log(`Pending code review count for '${github_url_2}' = ${pending_github_enterprise_review_count}`);
    }

    return {pending_github_review_count, pending_github_enterprise_review_count};
}
