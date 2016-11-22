"use strict";
/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires util.js
 */

Ext.namespace("gxp");

gxp.LoginPanel = Ext.extend(Ext.FormPanel, {

    //title: "Simple Form",
    //height: 150,
    //width: 350,
    //bodyPadding: 5,
    frame: true,
    labelWidth: 60,

    // The fields
    defaultType: "textfield",   // e.g. xtype: 'datefield' not needed
    items: [
        // input: username
        {
            fieldLabel: "User",
            name: "username",
            width: 137,
            allowBlank: false,
            listeners: {
                render: function() {
                    this.focus(true, 100);
                }
            }
        },
        // input: password
        {
            fieldLabel: "Password",
            name: "password",
            width: 137,
            inputType: "password",
            allowBlank: false
        }
    ],

    // error reader defines if request was successfull or failed
    // todo: check redirect location ends with &error=true
    // e.g. if (/error=true/.test(getHeader("Location"))) {
    errorReader: {
        read: function(response) {
            var success = false;
            var records = [];
            
            function isInResponse(response, text_snippet) {
                return response["responseText"].indexOf(text_snippet) > -1
            }
            
            // check if string "Invalid username/password combination"
            // appears in response body
            // todo: replace by checking redirect-url to end with error=true
            //console.log("response-text: ", response["responseText"]);
            var gerText = "Ungültige Kombination von " +
                          "Benutzername und Kennwort.";
            var engText = "Invalid username/password combination.";

            if (isInResponse(response, gerText) || isInResponse(response, engText)) {
                // login failed
                //success = false;
                var loginErrorText = "Invalid username or password.";
                records = [
                    {data: {id: "username", msg: loginErrorText}},
                    {data: {id: "password", msg: loginErrorText}}
                ];

            } else {
                // login correct
                success = true;
            }

            return {
                success: success,
                // empty on success, returns username/password on failed
                records: records
            };
        }
    },

    // Login Button
    buttons: [{
        text: "Login",
        formBind: true, //only enabled once the form is valid
        handler: function() {
            this.onButtonClick();
        },
        scope: this
    }],

    // keyboard shortcut (start function when ENTER is pressed)
    keys: [{
        key: [Ext.EventObject.ENTER],
        handler: function() {
            this.onButtonClick();
        },
        scope: this
    }],

    onButtonClick: function() {
    	var me = this;
	    // temporarily disable buttons to prevent further
	    // requests being sent
	    me.buttons[0].disable();

	    // get form via var panel
	    var form = me.getForm();

	    //var mythis = this;
	    if (form.isValid()) {
	        var formData = form.getFieldValues();

	        // The form will submit an AJAX request to this URL when submitted
	        // it works!!!
	        form.submit({
	            method: "POST",
	            url: "/geoserver/j_spring_security_check",
	            //headers: {"Content-Type": "application/x-www-form-urlencoded"},

	            // login successfull (defined by errorreader in loginPanel)
	            success: function(form, action) {
	                //Ext.Msg.alert('Success', action.result.msg);
	                console.log("login successfull!");

	                // set "user" cookie to entered login username
	                // to remember that user has working JSESSION ID and remains
	                // authorized and shown next to login/logout button
	                //console.log("my custom cookie: " + $.cookie("geoexplorer-user"));
	                me.parentView.setCookieValue("geoexplorer-user", formData.username);
	                //console.log("my custom cookie after login: " + $.cookie("geoexplorer-user"));

	                // set role to "authorized"
	                me.parentView.setAuthorizedRoles(["ROLE_ADMINISTRATOR"]);
	                
	                // refresh layers - workaround -> fix!
	                console.log("refreshing layers!");
	                //mythis.activate();
	                location.reload();   

	                // replace "login"-button with "logout"-button and entered username
	                me.parentView.showLogoutButton(formData.username);

	                // close login window
	                win.close();
	            },

	            // login failed (defined by errorreader)
	            failure: function(form, action) {
	                //Ext.Msg.alert('Failure', action.result.msg);
	                console.log("login failed!");
	                
	                me.parentView.deAuthorize();   // everything but unset authorizedroles
	                me.parentView.setAuthorizedRoles([]);   // works

	                // reactive buttons
	                me.buttons[0].enable(); 
	            }
	        });
	    }
	}
});



