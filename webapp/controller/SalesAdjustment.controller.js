sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (BaseController) => {
    "use strict";

    return BaseController.extend("salesincentive.controller.SalesAdjustment", {
        onInit() {
        },

        onGoPress: function () {
            var oView = this.getView();
            var oTable = oView.byId("salesAdjustmentTable");
            var oTemplate = this.byId("salesAdjustmentItem");

            var sBukrs = this.byId("companyCodeInput").getValue();
            var oFromDate = this.byId("fromDatePicker").getDateValue();
            var oToDate = this.byId("toDatePicker").getDateValue();

            if (!sBukrs || !oFromDate || !oToDate) {
                sap.m.MessageToast.show("Please fill all filters");
                return;
            }

            // Helper to format Date object to YYYYMMDD string
            var fnFormatToABAP = function (oDate) {
                var sYear = oDate.getFullYear();
                var sMonth = ("0" + (oDate.getMonth() + 1)).slice(-2);
                var sDay = ("0" + oDate.getDate()).slice(-2);
                return sYear + sMonth + sDay;
            };

            var sFrom = fnFormatToABAP(oFromDate);
            var sTo = fnFormatToABAP(oToDate);

            // Correct OData V2 Path Syntax for parameterized entities
            var sBindingPath = "invoiceModel>/ZC_Invoice_Sales(p_bukrs='" + sBukrs + "',p_from='" + sFrom +
                "',p_to='" + sTo + "')/Set";

            console.log("Binding Path:", sBindingPath);

            oTable.bindItems({
                path: sBindingPath,
                template: oTemplate
            });
        },

        onCompanyCodeChange: function (oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();

            if (sValue.length > 4) {
                sap.m.MessageToast.show("Maximum length is 4");
                oInput.setValue(sValue.substring(0, 4));
            }
        },
        onAfterRendering: function () {
            this.byId("fromDatePicker").$().find("input").attr("readonly", true);
            this.byId("toDatePicker").$().find("input").attr("readonly", true);
        },
        onEditPress: function () {
            var oTable = this.byId("salesAdjustmentTable");
            var aItems = oTable.getSelectedItems();

            if (!aItems.length) {
                sap.m.MessageToast.show("Select at least one row");
                return;
            }

            this._editEnabled = true;

            aItems.forEach(function (oItem) {
                var aCells = oItem.getCells();
                aCells[11].setEditable(true); // Invoice Year
                aCells[12].setEditable(true); // FY
                aCells[13].setEditable(true); // Period
            });
        },
        onSelectionChange: function (oEvent) {
            if (!this._editEnabled) {
                return; // Edit not pressed → do nothing
            }

            var aRemovedItems = oEvent.getParameter("listItems") || [];
            var bSelected = oEvent.getParameter("selected");

            // If item was UNSELECTED → lock it
            if (!bSelected) {
                aRemovedItems.forEach(function (oItem) {
                    var aCells = oItem.getCells();
                    aCells[11].setEditable(false);
                    aCells[12].setEditable(false);
                    aCells[13].setEditable(false);
                });
            }
        },



        onHomePress: function () {
            sap.ui.core.UIComponent.getRouterFor(this)
                .navTo("RouteHome");
        },


        onSavePress: function () {
            var oTable = this.byId("salesAdjustmentTable");
            var aSelectedItems = oTable.getSelectedItems();

            if (!aSelectedItems.length) {
                sap.m.MessageToast.show("Select at least one row to save");
                return;
            }

            var oModel = this.getView().getModel("salesAdjModel");

            aSelectedItems.forEach(function (oItem) {
                var aCells = oItem.getCells();

                var sInvoiceNumber = aCells[0].getText();
                var sInvoiceItem = aCells[1].getText();

                var oPayload = {
                    Invoicenumber: sInvoiceNumber,
                    Invoiceitem: sInvoiceItem,
                    Invoiceyear: aCells[11].getValue(),
                    Fy: aCells[12].getValue(),
                    Period: aCells[13].getValue()
                };

                // Try to create first
                oModel.create("/SalesAdjSet", oPayload, {
                    success: function () {
                        sap.m.MessageToast.show(
                            "Created: " + sInvoiceNumber + " / " + sInvoiceItem
                        );
                        // Make cells non-editable after save
                        [11, 12, 13].forEach(function (i) {
                            aCells[i].setEditable(false);
                        });
                    },
                    error: function (oError) {

                        if (oError.statusCode === 409 || oError.statusCode === 400) {
                            // Already exists → update
                            var sPath = "/SalesAdjSet(Invoicenumber='" +
                                sInvoiceNumber +
                                "',Invoiceitem='" +
                                sInvoiceItem +
                                "')";

                            oModel.update(sPath, oPayload, {
                                merge: true,
                                success: function () {
                                    sap.m.MessageToast.show(
                                        "Updated: " + sInvoiceNumber + " / " + sInvoiceItem
                                    );
                                    // Make cells non-editable after save
                                    [11, 12, 13].forEach(function (i) {
                                        aCells[i].setEditable(false);
                                    });
                                },
                                error: function (oErr2) {
                                    console.error(oErr2);
                                    sap.m.MessageBox.error(
                                        "Update failed: " + sInvoiceNumber + " / " + sInvoiceItem
                                    );
                                }
                            });

                        } else {
                            console.error(oError);
                            sap.m.MessageBox.error(
                                "Save failed: " + sInvoiceNumber + " / " + sInvoiceItem
                            );
                        }
                    }
                });
            });

            oTable.removeSelections();
            this._editEnabled = false;
        }



























    });
});