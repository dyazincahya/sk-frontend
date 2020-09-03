const application = require("tns-core-modules/application");
const ModeLoadingIndicator = require('@nstudio/nativescript-loading-indicator').Mode;

let theHost = "https://skripsi.vuspicture.com/";

global.gUrl = theHost;
global.gConfig = {
    "timeloader"        		: 100,
    "timepullrefresh"   		: 1000,
    "loadingOption" 	: {
	    message: 'Loading...',
	    margin: 10,
	    dimBackground: true,
	    color: '#FFFFFF', 
	    backgroundColor: '#FFFFFF',
	    userInteractionEnabled: true,
	    hideBezel: true,
	    mode: ModeLoadingIndicator.Indeterminate, 
	    android: {
			cancelable: false,
		},
	}
};

application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
