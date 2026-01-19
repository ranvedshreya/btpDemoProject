sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
     "sap/m/MessageBox",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",

], (Controller, MessageToast, UIComponent,Fragment,MessageBox) => {
    "use strict";

    return Controller.extend("salesincentive.controller.ProductDetails", {

        onInit() {
            var oYearPicker = this.byId("yearPicker");
            oYearPicker.setMaxDate(new Date());

            this.onGoPress(); 
        },

        onGoPress: function () {
            var oView = this.getView();
            var sMonth = this.byId("monthSelect").getSelectedKey();
            var sYear  = this.byId("yearPicker").getValue();
            var oTable = oView.byId("productTable");

            if (!sMonth && !sYear) {
                sap.m.MessageToast.show("Please select Month and year");
                return;
            }

            var sBindingPath =
            "/ZC_ProductDetails(p_month='" + sMonth + "',p_year='" + sYear + "')/Set";

            var oTemplate = oView.byId("productTableItem").clone();

            oTable.bindItems({
                path: sBindingPath,
                template: oTemplate
            });
        },

        onRowPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oCtx  = oItem.getBindingContext();
            var oData = oCtx.getObject();

            var sMonth = this.byId("monthSelect").getSelectedKey();
            var sYear  = this.byId("yearPicker").getValue();

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo("RouteSalesInvoice", {
                product: oData.Product,
                year: sYear,
                month: sMonth
            });
        },
        
        onNavBack: function () {
            sap.ui.core.UIComponent
                .getRouterFor(this)
                .navTo("RouteHome");
        },

     
        onChartPress: async function () {
            debugger;
            var oView = this.getView();
            var sMonth = this.byId("monthSelect").getSelectedKey();
            var sYear = this.byId("yearPicker").getValue();

            if (!sMonth || !sYear) {
                sap.m.MessageBox.warning("Please select Month and Year first.");
                return;
            }

            if (!this._oChartDialog) {
                this._oChartDialog = await this.loadFragment({
                    name: "salesincentive.fragment.ProductChart"
                });
                oView.addDependent(this._oChartDialog);
            }

            var oChart = this.byId("productChart");

            if (oChart.getDataset()) {
                oChart.getDataset().unbindData();
            }

            this._oChartDialog.open();
            oChart.setBusy(true);

            var sPath = "/ZC_ProductDetails(p_month='" + sMonth + "',p_year='" + sYear + "')/Set";
            oChart.getDataset().bindData({
                path: sPath,
                events: {
                    // dataRequested: function () {
                    //     oChart.setBusy(true);
                    // },
                    dataReceived: function () {
                        oChart.setBusy(false);
                    }
                    
                }
            });

        },

         onCloseChart: function () {
            var oChart = this.byId("productChart");
            
            if (oChart) {
                oChart.setBusy(true);
                var oBinding = oChart.getDataset().getBinding("data");
                if (oBinding) {
                    oBinding.refresh();
                }
            }
            this._oChartDialog.close();
        }


    });
});