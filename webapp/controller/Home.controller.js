sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
    return Controller.extend("ui5.cryptocurrency.app.controller.Home", {
        onInit: function() {
            let oList = this.getView().byId("cryptolist");

            if (oList) {
                oList.addEventDelegate({
                    "onAfterRendering": function() {
                        oList.$().attr("tabindex", -1);
                    }
                });
            }
        }
    });
});