import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
	defaults: {
		github_url_1: "https://github.com",
		github_url_2: ""
	},
	migrations: [
		OptionsSync.migrations.removeUnused
	],
	logging: true
});
