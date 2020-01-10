sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"./Popover2",
		"./Popover3",
		"./Popover1",
		"./utilities",
		"sap/ui/core/routing/History"
	], function (BaseController, MessageBox, Popover2, Popover3, Popover1, Utilities, History) {
		"use strict";
		return BaseController.extend("com.sap.build.standard.vai.controller.Page1", {
			handleRouteMatched: function (oEvent) {
				var sAppId = "App5e0f8929cf5bb2780c3e077a";
				var oParams = {};
				if (oEvent.mParameters.data.context) {
					this.sContext = oEvent.mParameters.data.context;
				} else {
					if (this.getOwnerComponent().getComponentData()) {
						var patternConvert = function (oParam) {
							if (Object.keys(oParam).length !== 0) {
								for (var prop in oParam) {
									if (prop !== "sourcePrototype" && prop.includes("Set")) {
										return prop + "(" + oParam[prop][0] + ")";
									}
								}
							}
						};
						this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);
					}
				}
				var oPath;
				if (this.sContext) {
					oPath = {
						path: "/" + this.sContext,
						parameters: oParams
					};
					this.getView().bindObject(oPath);
				}
			},
			avatarInitialsFormatter: function (sTextValue) {
				return typeof sTextValue === "string" ? sTextValue.substr(0, 2) : undefined;
			},
			_onImagePress: function (oEvent) {
				var sPopoverName = "Popover2";
				this.mPopovers = this.mPopovers || {};
				var oPopover = this.mPopovers[sPopoverName];
				if (!oPopover) {
					oPopover = new Popover2(this.getView());
					this.mPopovers[sPopoverName] = oPopover;
					oPopover.getControl().setPlacement("Auto");
					// For navigation.
					oPopover.setRouter(this.oRouter);
				}
				var oSource = oEvent.getSource();
				oPopover.open(oSource);
			},
			_onImagePress1: function (oEvent) {
				var sPopoverName = "Popover3";
				this.mPopovers = this.mPopovers || {};
				var oPopover = this.mPopovers[sPopoverName];
				if (!oPopover) {
					oPopover = new Popover3(this.getView());
					this.mPopovers[sPopoverName] = oPopover;
					oPopover.getControl().setPlacement("Auto");
					// For navigation.
					oPopover.setRouter(this.oRouter);
				}
				var oSource = oEvent.getSource();
				oPopover.open(oSource);
			},
			_onToggleButtonPress: function (oEvent) {
				console.log(this.value);
				this.oRouter.navTo("Page2", {
					externalCode:  this.value
				});
			},
			doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oModel = oBindingContext ? oBindingContext.getModel() : null;
				var sEntityNameSet;
				if (sPath !== null && sPath !== "") {
					if (sPath.substring(0, 1) === "/") {
						sPath = sPath.substring(1);
					}
					sEntityNameSet = sPath.split("(")[0];
				}
				var sNavigationPropertyName;
				var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;
				if (sEntityNameSet !== null) {
					sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
						sRouteName);
				}
				if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
					if (sNavigationPropertyName === "") {
						this.oRouter.navTo(sRouteName, {
							context: sPath,
							masterContext: sMasterContext
						}, false);
					} else {
						oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
							if (bindingContext) {
								sPath = bindingContext.getPath();
								if (sPath.substring(0, 1) === "/") {
									sPath = sPath.substring(1);
								}
							} else {
								sPath = "undefined";
							}
							// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
							if (sPath === "undefined") {
								this.oRouter.navTo(sRouteName);
							} else {
								this.oRouter.navTo(sRouteName, {
									context: sPath,
									masterContext: sMasterContext
								}, false);
							}
						}.bind(this));
					}
				} else {
					this.oRouter.navTo(sRouteName);
				}
				if (typeof fnPromiseResolve === "function") {
					fnPromiseResolve();
				}
			},
			_onImagePress2: function (oEvent) {
				var sPopoverName = "Popover1";
				this.mPopovers = this.mPopovers || {};
				var oPopover = this.mPopovers[sPopoverName];
				if (!oPopover) {
					oPopover = new Popover1(this.getView());
					this.mPopovers[sPopoverName] = oPopover;
					oPopover.getControl().setPlacement("Auto");
					// For navigation.
					oPopover.setRouter(this.oRouter);
				}
				var oSource = oEvent.getSource();
				oPopover.open(oSource);
			},
			_onRouteMatched: function (oEvent) {
				var oArgs, oView;
				oArgs = oEvent.getParameters("arguments");
				oView = this.getView();
				this.value =  oArgs["arguments"]["externalCode"];
				oView.bindElement({
					path: "/User('" + oArgs["arguments"]["externalCode"] + "')",
					events: {
						dataRequested: function () {
							oView.setBusy(true);
						},
						dataReceived: function () {
							oView.setBusy(false);
						}
					}
				});
				var test = false;
				var dados;
				$.ajax({
					"url": "/odata/v2/Photo(photoType = 1, userId='" + this.value + "')?$format=json",
					"method": "GET",
					"timeout": 0,
					async: false,
					"headers": {
						"Authorization": "Basic c2ZhZG1pbkBTRlBBUlQwMzQ2NTc6cGFydDE4MDJEQzI="
					},
					success: function(data){
						test = true;
						console.log(data);
						dados = data;
					},
					error: function(data){
						MessageBox.show("Erro ao enviar");
					}
				});
				if(test){
					this.getView().byId("image4").setSrc("data:image/jpeg;base64," + dados["d"]["photo"]);
				}
			},
			onInit: function () {
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.getRoute("Page1").attachMatched(this._onRouteMatched, this);
			},
			/**
			 *@memberOf com.sap.build.standard.vai.controller.Page1
			 */
			action: function (oEvent) {
				var that = this;
				var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
				var eventType = oEvent.getId();
				var aTargets = actionParameters[eventType].targets || [];
				aTargets.forEach(function (oTarget) {
					var oControl = that.byId(oTarget.id);
					if (oControl) {
						var oParams = {};
						for (var prop in oTarget.parameters) {
							oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
						}
						oControl[oTarget.action](oParams);
					}
				});
				var oNavigation = actionParameters[eventType].navigation;
				if (oNavigation) {
					var oParams = {};
					(oNavigation.keys || []).forEach(function (prop) {
						oParams[prop.name] = encodeURIComponent(JSON.stringify({
							value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
							type: prop.type
						}));
					});
					if (Object.getOwnPropertyNames(oParams).length !== 0) {
						this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
					} else {
						this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
					}
				}
			}
		});
	}, /* bExport= */
	true);