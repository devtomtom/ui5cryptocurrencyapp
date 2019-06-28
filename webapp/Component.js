sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("ui5.cryptocurrency.app.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			jQuery.ajax("img/icons/manifest.json").then((aCryptoManifest) => {
				let mAll = aCryptoManifest.reduce((mAll, oCurrency) => {
					mAll[oCurrency.symbol] =  oCurrency.name;
					return mAll;
				}, {});

				jQuery.ajax("model/live.json").then((oLiveData) => {
					this.flatten(oLiveData, mAll);
				});
			});

			// create the views based on the url/hash
			this.getRouter().initialize();
		},

		flatten: function(oLiveData, mAll) {
			let mConfig = {
				DEFAULT: {
					digits: 5
				}
			}
			oLiveData.flat = [];

			for (var sKey in oLiveData.rates) {
				if (mAll[sKey]) {
					mConfig[sKey] = {
						symbol: sKey,
					};

					oLiveData.flat.push({
						key: sKey,
						name: mAll[sKey],
						rate: oLiveData.rates[sKey],
						url: `img/icons/${sKey.toLowerCase()}.png`
					});
				}
			}

			setInterval(() => {
				if (oLiveData.flat) {
					oLiveData.flat.forEach((oNais) => {
						oNais.rate *= Math.random();
					});
					this.getModel("liveData").setData(oLiveData);
				}
			}, 2000);

			sap.ui.getCore().getConfiguration().getFormatSettings().addCustomCurrencies(mConfig);
		}
	});
});