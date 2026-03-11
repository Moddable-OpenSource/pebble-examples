console.log("hello, localization");

const locals = new Locals("modLocals");
const localize = function(it) {
	return locals.get(it);
};

try {
	locals.language = device.info.language.slice(0, 2);
	// locals.language = "fr";		// uncomment to test with French
	console.log(`Successfully set language to ${locals.language}`);
}
catch (e) {
	console.log(e);
	locals.language = "en";
	console.log("Fallback to English");
}

["English", "German", "French", "Spanish", "TAP_TO_CHANGE_LANGUAGE"].forEach(msg => {
	console.log(`key: "${msg}", localized: "${localize(msg)}"`);
});
