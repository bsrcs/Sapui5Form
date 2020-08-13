sap.ui.define([
	"sap/ui/core/UIComponent",
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("workerapp.Component", {

		metadata: {
			manifest: "json"
		},

		init: async function () {
			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();

		}

	});
});