/**
 * This file is part of OpenMediaVault.
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Aaron Murray <aaron@omv-extras.org>
 * @copyright Copyright (c) 2013 Aaron Murray
 *
 * OpenMediaVault is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * OpenMediaVault is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenMediaVault. If not, see <http://www.gnu.org/licenses/>.
 */
// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")

Ext.define("OMV.module.admin.service.autoshutdown.Settings", {
	extend: "OMV.workspace.form.Panel",

	rpcService: "AutoShutdown",
	rpcGetMethod: "getSettings",
	rpcSetMethod: "setSettings",
	
	plugins: [{
		ptype: "linkedfields",
		correlations: [{
			name: [
				"uldlrate"
			],
			conditions: [
				{ name: "uldlcheck", value: true }
			],
			properties: [
				"!readOnly",
				"!allowBlank"
			]
		},{
			name: [
				"loadaverage"
			],
			conditions: [
				{ name: "loadaveragecheck", value: true }
			],
			properties: [
				"!readOnly",
				"!allowBlank"
			]
		}]
	}],
	
	getFormItems: function() {
		var me = this;
		return [{
			xtype: "fieldset",
			title: _("General settings"),
			fieldDefaults: {
				labelSeparator: ""
			},
			items: [{
				xtype: "checkbox",
				name: "enable",
				fieldLabel: _("Enable"),
				checked: false
			},{
				xtype: "numberfield",
				name: "cycles",
				fieldLabel: _("Cycles"),
				minValue: 1,
				maxValue: 999,
				allowDecimals: false,
				allowBlank: false,
				value: 6,
				plugins: [{
					ptype: "fieldinfo",
					text: _("Set the number of cycles with no result (no PC online, etc) before shutdown.")
				}]
			},{
				xtype: "numberfield",
				name: "sleep",
				fieldLabel: _("Sleep"),
				minValue: 1,
				maxValue: 9999,
				allowDecimals: false,
				allowBlank: false,
				value: 180,
				plugins: [{
					ptype: "fieldinfo",
					text: _("Numbers of seconds between each cycle.")
				}]
			},{
				xtype: "textfield",
				name: "range",
				fieldLabel: _("IP-Range"),
				value: "2..254",
				plugins: [{
					ptype: "fieldinfo",
					text: _("Define a range of IPs which should be scanned, via XXX.XXX.XXX.xxx last triple of IP address in a list. <br />The following scheme is mandatory v..v+m,w,x..x+n,y+o..y,z <br />  - define an ip range : &lt;start&gt;..&lt;end&gt; -> the two dots are mandatory <br />  - define a single ip : &lt;ip&gt; <br />  - all list entries are seperated by comma ',' <br />Please make sure to leave 1 and 255 out of the list !")
				}]
			}]
		},{
			xtype: "fieldset",
			title: _("Forced Uptime"),
			fieldDefaults: {
				labelSeparator: ""
			},
			items: [{
				xtype: "checkbox",
				name: "checkclockactive",
				fieldLabel: _("Check Clock"),
				checked: false,
				boxLabel: _("Check Clock to identify forced uptime.")
			},{
				xtype: "fieldcontainer",
				fieldLabel: "Uphours",
				layout: "hbox",
				items: [{
					xtype: "numberfield",
					name: "uphours-begin",
					fieldLabel: _("Begin"),
					minValue: 0,
					maxValue: 23,
					allowDecimals: false,
					allowBlank: false,					
					value: 6
				}]
			},{
				xtype: "fieldcontainer",
				fieldLabel: "&nbsp;",
				layout: "hbox",
				items: [{
					xtype: "numberfield",
					name: "uphours-end",
					fieldLabel: _("End"),
					minValue: 0,
					maxValue: 23,
					allowDecimals: false,
					allowBlank: false,					
					value: 20
				}]
			}]
		},{
			xtype: "fieldset",
			title: _("Network Socket Supervision Configuration"),
			fieldDefaults: {
				labelSeparator: ""
			},
			items: [{
				xtype: "textfield",
				name: "nsocketnumbers",
				fieldLabel: _("Sockets"),
				value: "21,22,80,139,445,3689,6991,9091,49152",
				plugins: [{
					ptype: "fieldinfo",
					text: _("Socket number to check for activity.  <a href='http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers' target='_blank'>List of Ports</a>")
				}]
			},{
				xtype: "fieldcontainer",
				fieldLabel: "ULDL Rate",
				layout: "hbox",
				items: [{
					xtype: "checkbox",
					name: "uldlcheck",
					fieldLabel: _(""),
					checked: true
				},{
					xtype: "displayfield",
					width: 25,
					value: ""
				},{
					xtype: "numberfield",
					name: "uldlrate",
					fieldLabel: _(""),
					minValue: 0,
					maxValue: 9999,
					allowDecimals: false,
					allowBlank: false,
					value: 50,
					plugins: [{
						ptype: "fieldinfo",
						text: _("Define the network traffic in kB/s")
					}]
				}]
			},{
				xtype: "fieldcontainer",
				fieldLabel: "Load Average",
				layout: "hbox",
				items: [{
					xtype: "checkbox",
					name: "loadaveragecheck",
					fieldLabel: _(""),
					checked: false
				},{
					xtype: "displayfield",
					width: 25,
					value: ""
				},{
					xtype: "numberfield",
					name: "loadaverage",
					fieldLabel: _(""),
					minValue: 0,
					maxValue: 9999,
					allowDecimals: false,
					allowBlank: false,
					value: 40,
					plugins: [{
						ptype: "fieldinfo",
						text: _("If the load average of the server is above this value, then no shutdown.<br />Example: 50 means a loadaverage of 0.50, 8 means a loadaverage of 0.08, 220 means a loadaverage of 2.20")
					}]
				}]
			}]
		},{
			xtype: "fieldset",
			title: _("Syslog Configuration"),
			fieldDefaults: {
				labelSeparator: ""
			},
			items: [{
				xtype: "checkbox",
				name: "syslog",
				fieldLabel: _("Log to Syslog"),
				checked: true,
				boxLabel: _("Write log informations to system logs.")
			},{
				xtype: "checkbox",
				name: "verbose",
				fieldLabel: _("Verbose"),
				checked: false,
				boxLabel: _("Verbose mode.")
			},{
				xtype: "checkbox",
				name: "fake",
				fieldLabel: _("Fake"),
				checked: false,
				boxLabel: _("Fake/Test mode.")
			}]
		},{
			xtype: "fieldset",
			title: _("Expert Settings"),
			fieldDefaults: {
				labelSeparator: ""
			},
			items: [{
				xtype: "textarea",
				name: "extraoptions",
				fieldLabel: _("Extra options"),
				allowBlank: true,
				plugins: [{
					ptype: "fieldinfo",
					text: _("Please check the <a href='https://github.com/OMV-Plugins/autoshutdown/blob/master/src/README' target='_blank'>README</a> for more details.")
				}]
			}]
		}];
	}
});

OMV.WorkspaceManager.registerPanel({
	id: "settings",
	path: "/service/autoshutdown",
	text: _("Settings"),
	position: 10,
	className: "OMV.module.admin.service.autoshutdown.Settings"
});
