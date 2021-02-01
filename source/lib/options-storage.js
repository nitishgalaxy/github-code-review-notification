import OptionsSync from './webext-options-sync.js';
import {GITHUB_URL} from './constants.js';


export default new OptionsSync({
	defaults: {
		github_url_1: GITHUB_URL,
		github_url_2: ""
	},

	logging: true
});
