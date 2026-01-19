sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller,Filter,FilterOperator) {
    "use strict";

    return Controller.extend("salesincentive.controller.SalesInvoice", {

        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteSalesInvoice")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");

            this._product = oArgs.product;
            this._month   = oArgs.month;
            this._year    = oArgs.year;
             console.log("Product:", this._product, "Month:", this._month, "Year:", this._year);
            this._bindInvoiceTable();
        },
        _bindInvoiceTable: function () {
            var sPath =
                "/ZC_Sales_Inv_Items(" +
                "p_month='" + this._month + "'," +
                "p_year='" + this._year + "'" +
                ")/Set";

            var oTable = this.byId("salesInvoiceTable");
            oTable.unbindItems();

            oTable.bindItems({
                path: sPath,
                filters: [
                    new Filter("Product", FilterOperator.EQ, this._product)
                ],
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({ text: "{SalesInvoice}" }),
                        new sap.m.Text({ text: "{LineItem}" }),
                        new sap.m.Text({ text: "{InvoiceDate}" }),
                        new sap.m.Text({ text: "{SalesGroup}" }),
                        new sap.m.Text({ text: "{CustomerCode}" }),
                        new sap.m.Text({ text: "{CustomerName}" }),
                        new sap.m.Text({ text: "{Product}" }),
                        new sap.m.Text({ text: "{ProductDesc}" }),
                        new sap.m.Text({ text: "{UOM}" }),
                        new sap.m.Text({ text: "{Qty}" }),
                        new sap.m.Text({ text: "{NetValue}" })
                    ]
                }),
                templateShareable: false
            });
        },

        onNavBack: function () {
            sap.ui.core.UIComponent
                .getRouterFor(this)
                .navTo("RouteProductDetails");
        }
    });
});
