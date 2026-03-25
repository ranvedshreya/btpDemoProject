sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/Menu",
  "sap/m/MenuItem"
], (Controller,MessageBox,Menu,MenuItem) => {
  "use strict";

  return Controller.extend("salesincentive.controller.Home", {
      onInit() {
        var sLogoPath = sap.ui.require.toUrl("salesincentive/images/alkem.jpg");
        var oHeaderModel = new sap.ui.model.json.JSONModel({
            logoPath: sLogoPath
        });
        this.getView().setModel(oHeaderModel, "headerModel");

      },
      onLogoPress: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteHome");
      },
        
      onPressTile: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteProductDetails");
      },
      onPressTile2: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteSalesAdjustment");
      },
      onPressTile3: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteFDMis");
      },
      onPressTile4: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteSalesDetails");
      }
  });
});