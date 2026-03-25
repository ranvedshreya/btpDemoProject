sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (BaseController) => {
    "use strict";

    return BaseController.extend("salesincentive.controller.SalesAdjustment", {
        onInit() {
            var sLogoPath = sap.ui.require.toUrl("salesincentive/images/alkem.jpg");
    
            var oHeaderModel = new sap.ui.model.json.JSONModel({
                logoPath: sLogoPath
            });
            this.getView().setModel(oHeaderModel, "headerModel");
        },
        

        onGoPress: function () {
            var oTable = this.byId("salesAdjustmentTable");
            var sBukrs = this.byId("companyCodeInput").getValue().trim();
            var oFromDate = this.byId("fromDatePicker").getDateValue();
            var oToDate = this.byId("toDatePicker").getDateValue();

            if (!sBukrs || !oFromDate || !oToDate) {
                sap.m.MessageToast.show("Please fill all filters");
                return;
            }

            var fnFormatToABAP = function (oDate) {
                var y = oDate.getFullYear();
                var m = ("0" + (oDate.getMonth() + 1)).slice(-2);
                var d = ("0" + oDate.getDate()).slice(-2);
                return y + m + d;
            };

            var sFrom = fnFormatToABAP(oFromDate);
            var sTo = fnFormatToABAP(oToDate);

            var sPath =
                "invoiceModel>/ZC_Invoice_Sales(p_bukrs='" + sBukrs + 
                "',p_from='" +  sFrom + "',p_to='" + sTo + "')/Set";

            oTable.removeAllItems();

            oTable.bindItems({
                path: sPath,
                factory: function () {
                    return new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({ text: "{invoiceModel>InvoiceNumber}" }),
                            new sap.m.Text({ text: "{invoiceModel>InvoiceItem}" }),
                            new sap.m.Text({ text: "{invoiceModel>Plant}" }),
                            new sap.m.Text({ text: "{invoiceModel>PlantName}" }),
                            new sap.m.Text({ text: "{invoiceModel>Division}" }),
                            new sap.m.Text({ text: "{invoiceModel>DivisionName}" }),
                            new sap.m.Text({ text: "{invoiceModel>Region}" }),
                            new sap.m.Text({ text: "{invoiceModel>RegionName}" }),
                            new sap.m.Text({text: { 
                                    path: "invoiceModel>OrderDate",
                                    type: "sap.ui.model.type.Date",
                                    formatOptions: {
                                        pattern: "dd-MM-yyyy"
                                    }
                                }
                            }),
                            new sap.m.Text({text: { 
                                    path: "invoiceModel>InvoiceDate",
                                    type: "sap.ui.model.type.Date",
                                    formatOptions: {
                                        pattern: "dd-MM-yyyy"
                                    }
                                }
                            }),
                            new sap.m.Text({ text: "{invoiceModel>InvoiceMonth}" }),
                            new sap.m.Input({ value: "{invoiceModel>InvoiceYear}", editable: false }),
                            new sap.m.Input({ value: "{invoiceModel>FY}", editable: false }),
                            new sap.m.Input({ value: "{invoiceModel>Period}", editable: false }),
                            new sap.m.Text({text: { 
                                    path: "invoiceModel>LRDate",
                                    type: "sap.ui.model.type.Date",
                                    formatOptions: {
                                        pattern: "dd-MM-yyyy"
                                    }
                                }
                            }),
                            new sap.m.Text({ text: "{invoiceModel>MaterialNo}" }),
                            new sap.m.Text({ text: "{invoiceModel>MaterialDesc}" }),
                            new sap.m.Text({ text: "{invoiceModel>BatchNumber}" }),
                            new sap.m.Text({text: { 
                                    path: "invoiceModel>ExpiryDate",
                                    type: "sap.ui.model.type.Date",
                                    formatOptions: {
                                        pattern: "dd-MM-yyyy"
                                    }
                                }
                            }),
                            new sap.m.Text({ text: "{invoiceModel>CustomerNumber}" }),
                            new sap.m.Text({ text: "{invoiceModel>CustomerName}" }),
                            new sap.m.Text({ text: "{invoiceModel>ProductQty}" }),
                            new sap.m.Text({ text: "{invoiceModel>ProductValue}" }),
                            new sap.m.Text({ text: "{invoiceModel>ProductTaxAmount}" }),
                            new sap.m.Text({text: { 
                                    path: "invoiceModel>ReceiptDate",
                                    type: "sap.ui.model.type.Date",
                                    formatOptions: {
                                        pattern: "dd-MM-yyyy"
                                    }
                                }
                            }),
                            new sap.m.Text({ text: "{invoiceModel>PaymentTerms}" })
                        ]
                    });
                },
                templateShareable: false
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

        onNavBack: function () {
            sap.ui.core.UIComponent.getRouterFor(this)
                .navTo("RouteHome");
            this._resetPage();
        },
        onLogoPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteHome");
            this._resetPage();
        },

        _resetPage: function () {
            // Clear inputs
            this.byId("companyCodeInput").setValue("1000");
            this.byId("fromDatePicker").setValue("");
            this.byId("toDatePicker").setValue("");

            // Clear table
            var oTable = this.byId("salesAdjustmentTable");
            oTable.removeAllItems();
            oTable.removeSelections();

            // Reset edit flag
            this._editEnabled = false;
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