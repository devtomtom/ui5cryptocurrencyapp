sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.demo.basicTemplate.Component", {

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

			jQuery.ajax("model/live.json").then((oCurrencyData) => {
				oCurrencyData.flat = [];
				for (var sKey in oCurrencyData.rates) {
					oCurrencyData.flat.push({
						key: sKey,
						rate: oCurrencyData.rates[sKey]
					});
				}
				this.getModel("liveData").setData(oCurrencyData);
			});

			// create the views based on the url/hash
			this.getRouter().initialize();
		}
	});
});