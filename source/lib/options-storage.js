import OptionsSync from 'webext-options-sync';
import {GITHUB_URL} from './constants';


export default new OptionsSync({
	defaults: {
		github_url_1: GITHUB_URL,
		github_url_2: ""
	},
	migrations: [
		OptionsSync.migrations.removeUnused
	],
	logging: true
});
