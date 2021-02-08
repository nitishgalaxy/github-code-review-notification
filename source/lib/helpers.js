import store from '../lib/data_store.js';


export async function clearStorageForTask(ID){
    const keyname_connection_error = `connection_error_github_url_${ID}`;
    await store.remove(keyname_connection_error);

    const keyname_login_error = `login_error_github_url_${ID}`;
    await store.remove(keyname_login_error);

    const keyname_count = `count_github_url_${ID}`;
    await store.remove(keyname_count);

}
