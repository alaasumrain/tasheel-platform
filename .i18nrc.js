const { defineConfig } = require('@lobehub/i18n-cli');

module.exports = defineConfig({
	entry: 'messages/en.json',
	entryLocale: 'en',
	output: 'messages',
	outputLocales: ['ar'],
	modelName: 'gpt-4o-mini',
	temperature: 0.3,
	topP: 1,
	concurrency: 5,
	saveImmediately: true,
	splitToken: 8000,
	reference: 'Tasheel is a government services concierge platform for Palestine. The translations should be professional, clear, and culturally appropriate for Arabic-speaking users in Palestine. Maintain consistency with government and business terminology.',
	experimental: {
		jsonMode: false,
	},
});

