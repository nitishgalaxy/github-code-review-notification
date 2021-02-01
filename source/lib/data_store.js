export default {

	get(key) {
		return new Promise(function(resolve, reject){
			chrome.storage.local.get(key, function(result){
				resolve(result[key]);
			});
		});
	},

	async set(key, value) {
		return chrome.storage.local.set({[key]: value});
	},

	async remove(key) {
		return chrome.storage.local.remove(key);
	},

	async clear() {
		return chrome.storage.local.clear();
	}
};
