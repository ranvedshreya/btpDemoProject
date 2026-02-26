sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
     "sap/m/MessageBox",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Fragment",

], (Controller, MessageToast, UIComponent,Fragment,MessageBox) => {
    "use strict";

    return Controller.extend("salesincentive.controller.FDMis", {

        onInit() { 
            var oDatePicker = this.getView().byId("onDatePicker");
            oDatePicker.setMinDate(new Date());
        },

        
        onGoPress: function () {
            var oView = this.getView();
            var sCompanyCode = this.byId("comCodeInput").getValue();
            var sProductType = this.byId("prodTypeInput").getValue();
            var sAsOnDate  = this.byId("onDatePicker").getDateValue();
            var oTable = oView.byId("FDTable");

            
            if (!sCompanyCode || !sProductType || !sAsOnDate) {
                sap.m.MessageBox.warning("Please fill all input fields before searching.");
                return;
            }

            var fnFormatToABAP = function (oDate) {
                var y = oDate.getFullYear();
                var m = ("0" + (oDate.getMonth() + 1)).slice(-2);
                var d = ("0" + oDate.getDate()).slice(-2);
                return y + m + d;
            };

            var sOnDate = fnFormatToABAP(sAsOnDate);

            var sBindingPath =
            "FDMISModel>/ZC_FD_MIS_SUMM(p_bukrs='" + sCompanyCode + 
             "',p_prodtype='" + sProductType + "',p_asOnDate='" + sOnDate + "')/Set";

            var oTemplate = oView.byId("FDTableItem").clone();

            oTable.bindItems({
                path: sBindingPath,
                template: oTemplate,
                templateShareable: true
            });
        },

       onRowPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oCtx = oItem.getBindingContext("FDMISModel");
            var oData = oCtx.getObject();

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            // Get the filter criteria from FDMis view
            var sCompanyCode = this.byId("comCodeInput").getValue();
            var sProductType = this.byId("prodTypeInput").getValue();

            var fnFormatToABAP = function (oDate) {
                if (!oDate) return "";
                var y = oDate.getFullYear();
                var m = ("0" + (oDate.getMonth() + 1)).slice(-2);
                var d = ("0" + oDate.getDate()).slice(-2);
                return y + m + d;
            };

            var sOnDate = fnFormatToABAP(this.byId("onDatePicker").getDateValue());

            oRouter.navTo("RouteFDMisTrf", {
                TRMNo: oData.TRMNo,
                Bukrs: sCompanyCode,
                ProdType: sProductType,
                AsOnDate: sOnDate
            });
        },
        
       onNavBack: function () {
            sap.ui.core.UIComponent.getRouterFor(this)
            .navTo("RouteHome");

            this.byId("prodTypeInput").setValue("");
            this.byId("onDatePicker").setValue("");

            var oTable = this.byId("FDTable");
            if (oTable) {
                oTable.unbindItems();
                oTable.removeAllItems();
            }
        },

        onChartPress: async function () {
            var oView = this.getView();
            var sCompanyCode = this.byId("comCodeInput").getValue();
            var sProductType = this.byId("prodTypeInput").getValue();

            var fnFormatToABAP = function (oDate) {
                if (!oDate) return "";
                var y = oDate.getFullYear();
                var m = ("0" + (oDate.getMonth() + 1)).slice(-2);
                var d = ("0" + oDate.getDate()).slice(-2);
                return y + m + d;
            };

            var sOnDate = fnFormatToABAP(this.byId("onDatePicker").getDateValue());

            if (!sCompanyCode || !sProductType || !sOnDate) {
                sap.m.MessageBox.warning("Please select all input first.");
                return;
            }

            if (!this._oChartDialog) {
                this._oChartDialog = await this.loadFragment({
                    name: "salesincentive.fragment.FDMisPayerChart"
                });
                oView.addDependent(this._oChartDialog);
            }

            this._oChartDialog.open();

            var sBindingPath =
                "/ZC_FD_MIS_SUMM(p_bukrs='" + sCompanyCode +
                "',p_prodtype='" + sProductType +
                "',p_asOnDate='" + sOnDate + "')/Set";

            var aChartIds = [
                "chartCurrentFD",
                "chartBoardLimit",
                "chartBalanceLimit",
                "chartTotalFD"
            ];

            aChartIds.forEach(function (sId) {

                var oChart = this.byId(sId);

                if (oChart && oChart.getDataset()) {
                    oChart.setBusy(true);
                    oChart.getDataset().unbindData();
                    oChart.getDataset().bindData({
                        path: sBindingPath,
                        model: "FDMISModel",
                        events: {
                            dataRequested: function () {
                                oChart.setBusy(true);
                            },
                            dataReceived: function () {
                                oChart.setBusy(false);
                            }
                        }
                    });
                }
            }.bind(this));
        },

        onCloseChart: function () {
            var oChart = this.byId("FDMisChart");
            
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