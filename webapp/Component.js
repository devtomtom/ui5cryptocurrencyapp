sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/IntervalTrigger"
], function(UIComponent, IntervalTrigger) {
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

			var oIntervalTrigger = new IntervalTrigger(1000),
				aCryptoManifest, mAll;

			jQuery.ajax("img/icons/manifest.json").then((aCryptoManifest) => {

				mAll = aCryptoManifest.reduce((mAll, oCurrency) => {
					mAll[oCurrency.symbol] =  oCurrency.name;
					return mAll;
				}, {});

				jQuery.ajax("model/live.json").then((oLiveData) => {
					this.flatten(oLiveData, mAll);
				});

				oIntervalTrigger.addListener(() => {
					var oModel = this.getModel("liveData");
					var oData = oModel.getData();
					if (oData.flat) {
						oData.flat.forEach((oNais) => {
							oNais.rate = Math.random();
						});
						oModel.setData(oData);
					}
				});
			});

			// create the views based on the url/hash
			this.getRouter().initialize();
		},

		flatten: function(oLiveData, mAll) {
			var mConfig = {
				DEFAULT: {
					digits: 5
				}
			};

			oLiveData.flat = [];
			for (var sKey in oLiveData.rates) {
				if (mAll[sKey]) {
					mConfig[sKey] = {
						symbol: sKey,
					};

					oLiveData.flat.push({
						key: sKey,
						name: mAll[sKey],
						rate: Math.random(), //oLiveData.rates[sKey],
						url: "img/icons/" + sKey.toLowerCase() + ".png"
					});
				}
			}

			this.getModel("liveData").setData(oLiveData);
			sap.ui.getCore().getConfiguration().getFormatSettings().addCustomCurrencies(mConfig);
		}
	});
});