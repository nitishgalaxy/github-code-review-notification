import store from './data_store.js';


export function getCodeReviewCounters(){
    const github_count = store.get('github_count');
    const github_ent_count = store.get('github_ent_count');

    return {github_count, github_ent_count};
}