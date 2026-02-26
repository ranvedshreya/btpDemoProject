sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller,Filter,FilterOperator) {
    "use strict";

    return Controller.extend("salesincentive.controller.FDMisTrf", {

        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteFDMisTrf")
                .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function(oEvent) {
            var oArgs = oEvent.getParameter("arguments");

            var sTRMNo = oArgs.TRMNo;
            var sBukrs = oArgs.Bukrs;
            var sProdType = oArgs.ProdType;
            var sOnDate = oArgs.AsOnDate;

            var sBindingPath = "FDMISTrfModel>/ZC_FD_MIS_TRF(p_bukrs='" + sBukrs +
               "',p_prodtype='" + sProdType + "',p_asOnDate='" + sOnDate +
                "')/Set";

            var oTable = this.byId("FDTrfTable");
            oTable.unbindItems();

            oTable.bindItems({
                path: sBindingPath,
                filters: [
                    new Filter("TRMNo", FilterOperator.EQ, sTRMNo)
                ],
                template: new sap.m.ColumnListItem({
                    type: "Navigation",
                    cells: [
                        new sap.m.Text({ text: "{FDMISTrfModel>TRMNo}" }),
                        new sap.m.Text({ text: "{FDMISTrfModel>FlowType}" }),
                        new sap.m.Text({ text: "{FDMISTrfModel>BankName}" }),
                        new sap.m.Text({ text: "{FDMISTrfModel>Payer}" }),
                        new sap.m.Text({ text: "{FDMISTrfModel>FDNumber}" }),
                        new sap.m.Text({
                            text: {
                                path: "FDMISTrfModel>TermStart",
                                type: "sap.ui.model.type.Date",
                                formatOptions: {
                                    pattern: "dd-MM-yyyy"
                                }
                            }
                        }),
                        new sap.m.Text({
                            text: {
                                path: "FDMISTrfModel>TermEnd",
                                type: "sap.ui.model.type.Date",
                                formatOptions: {
                                    pattern: "dd-MM-yyyy"
                                }
                            }
                        }),
                        new sap.m.Text({ text: "{FDMISTrfModel>Rate}" }),
                        new sap.m.Text({ text: "{FDMISTrfModel>Annualised}" }),
                        new sap.m.Text({ text: "{FDMISTrfModel>Tenor}" }),
                        new sap.m.Text({ text: "{FDMISTrfModel>InvestmentAmount}" }),
                        new sap.m.Text({ text: "{FDMISTrfModel>MaturityAmount}" }),
                        new sap.m.Text({ text: "{FDMISTrfModel>AccrualDays}" }),
                        new sap.m.Text({ text: "{FDMISTrfModel>Interest}" })
                    ]
                }),
                templateShareable: false
            });
        },

        onNavBack: function () {
            sap.ui.core.UIComponent.getRouterFor(this).navTo("RouteFDMis");
        }
    });
});