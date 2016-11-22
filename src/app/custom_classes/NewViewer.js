/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires util.js
 * @requires widgets/Viewer.js
 * @requires custom_classes/LoginPanel.js
 */

Ext.namespace("gxp");

gxp.NewViewer = Ext.extend(gxp.Viewer, {

    /** api: property[authenticate]
     *  ``Function`` Like the config option above, but this can be set after
     *  configuration e.g. by a plugin that provides authentication. It can
     *  also be accessed to check if an authentication mechanism is available.
     */
    authenticate: function() {

        // logout from geoserver if already logged in
        this.logoutUsingJSpringSecurityLogout();

        // text snippets
        var loginErrorText = "Invalid username or password.";

        var mythis = this;

        // form panel to enter username / password
        // this form will sibmit AJAX request to the specified URL when submitted
        // this form will be displayed in the window defined later
        var loginPanel = new gxp.LoginPanel();  // extends Ext.FormPanel

        // window that holds username/password panel
        // variable panel has to be defined before referencing it here
        var win = new Ext.Window({
            title: "Login",
            layout: "fit",
            width: 235,
            height: 130,
            plain: true,
            border: false,
            modal: true,
            items: [loginPanel], // holds var panel defined later
            listeners: {
                beforedestroy: mythis.cancelAuthentication,
                scope: this
            }
        });

        //setCookieToExpired()
        //this.clearCookieValue("JSESSIONID");
        win.show();
    },

    // function called within initPortal
    initAboutButton: function() {

        // text snippets used in about section
        var appInfoText = "Bisenzio WebGIS";
        var mapInfoText = "Map info";
        var aboutThisMapText = "About this map";
        var titleText = "Title";
        var descriptionText = "Description";
        var contactText ="Contact";
        var aboutText = "About GeoExplorer";
        var aboutTitle = appInfoText;
        var aboutAbstract = "This exemplary WebGIS application presents layers of the Monte Bisenzio area. " +
            "In addition, authorized users are able to edit layers to capture relevant archaeological information. ";
        var aboutContact = "For additional information please contact " +
            "<a href='mailto:axel.kunz@hs-mainz.de'</a>i3mainz</a><a> (Axel Kunz)</a>.";

        new Ext.Button({
            id: "aboutbutton",  // linked to in app.js in the tools section
            text: appInfoText,
            iconCls: "icon-geoexplorer",
            handler: displayAboutInfos,
            scope: this
        });

        // define handler function
        function displayAboutInfos() {

            // define map info ("map info")
            var mapInfo = new Ext.Panel({
                title: mapInfoText,
                html: '<div class="gx-info-panel">' +
                      '<h2>'+titleText+'</h2><p>' + aboutTitle +
                      '</p><h2>'+descriptionText+'</h2><p>' + aboutAbstract +
                      '</p> <h2>'+contactText+'</h2><p>' + aboutContact +'</p></div>',
                height: 'auto',
                width: 'auto'
            });

            // define geoexplorer/boundless_sdk info page
            var appInfo = new Ext.Panel({
                title: aboutText,
                html: "<iframe style='border: none; height: 100%; width: 100%' src='../about.html' frameborder='0' border='0'><a target='_blank' href='../about.html'>"+aboutText+"</a> </iframe>"
            });

            // define tabs of about window
            var tabs = new Ext.TabPanel({
                activeTab: 0,
                items: [mapInfo, appInfo]
            });

            // define window in which tabs are displayed
            var win = new Ext.Window({
                title: aboutThisMapText,
                modal: true,
                layout: "fit",
                width: 350,
                height: 350,
                items: [tabs]
            });

            // init window
            win.show();
        }
    },

    // function called within initPortal
    initLoginButton: function() {
        // run this when user is logged in
        
        function userCookieIsValid(cookie) {
            return (cookie && cookie !== null && cookie !== "null");
        }

        function userIsLoggedIntoGeoserver(cookie) {
            // sends request to login page and
            // checks if user is already logged in
            function userStringInResponse(responseData) {
                var success;
                var eng_string = '<span class="username">Logged in as <span>' + userCookie + '</span></span>';
                var de_string = '<span class="username">Angemeldet als <span>' + userCookie + '</span></span>';
                if (responseData.indexOf(eng_string) > -1) {
                    success = true;
                } else if (responseData.indexOf(de_string) > -1) {
                    success = true;
                }
                return success;
            }

            var isLoggedIn = false;
            $.ajax({
                url: "/geoserver/web/",
                type: "GET",
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function(data, textStatus, jqXHR){
                    // username string in response data
                    if (userStringInResponse(data)) {
                        //console.log(data);
                        console.log("logged into geoserver!");
                        isLoggedIn = true;
                    } 
                    else {
                        console.log("not logged into geoserver!");
                    }
                },
                failure: function() {
                    console.log("request to geoserver failed!");
                }
                
            }); // end ajax
            return isLoggedIn;
        }

        // create login/logout button
        new Ext.Button({
            id: "loginbutton"}
        );

        // check status of login
        var userCookie = $.cookie("geoexplorer-user");
        if (userCookieIsValid(userCookie) === true && userIsLoggedIntoGeoserver(userCookie) === true) {
            // has webgis cookie -> is logged in
            this.showLogoutButton(userCookie);
            //console.log("already logged in! :D: ");
            //console.log("isAuthorized: " + this.isAuthorized());
            //console.log("isAuthanticated: " + this.isAuthenticated());

        } else {
            // no webgis cookie -> not logged in
            this.deAuthorize();     // just in case
            this.showLoginButton();
        }
    },

    // show this when no user is logged in
    showLoginButton: function() {
        var iconCls = 'login';
        var text = "Login";
        var handler = this.authenticate;  // call auth function
        var scope = this;

        var loginButton = Ext.getCmp("loginbutton");
        loginButton.setIconClass(iconCls);
        loginButton.setText(text);
        loginButton.setHandler(handler, scope);
    },

    logoutUsingJSpringSecurityLogout: function() {
        //console.log("j_spring_security_logout!");
        $.ajax({
            url: "/geoserver/j_spring_security_logout/",
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            async: false,
            success: function(){
                console.log("killed logiN!");
            }
        });
    },

    showLogoutButton: function(user) {

        var doLogout = function() {

            var mythis = this;

            // logout function (called when pressing "logout")
            var callback = function() {
                // all but set unauthorizedroles
                mythis.deAuthorize();
                // set role to unauthorized
                mythis.setAuthorizedRoles([]);    // works

                // refresh window
                console.log("refreshing window ...");
                //window.location.reload();
                location.reload();
            }

            // confirm logout message window
            Ext.Msg.show({
                title: "Warning",
                msg: "Logging out will undo any unsaved changes. Are you sure you want to logout?",
                buttons: Ext.Msg.YESNO, // YESNOCANCEL
                icon: Ext.MessageBox.WARNING,
                fn: function(btn) {
                    if (btn === 'yes') {
                        // on button click, run callback function
                        callback.call(this);
                        //callback()
                    }
                },
                scope: this
            });
        };

        var iconCls = 'logout';
        var logoutText = "Logout, {user}";
        var text = new Ext.Template(logoutText).applyTemplate({user: user});
        var handler = doLogout;
        var scope = this;

        var loginButton = Ext.getCmp("loginbutton");
        loginButton.setIconClass(iconCls);
        loginButton.setText(text);
        loginButton.setHandler(handler, scope);
    },

    activate: function() {
        console.log("-> activate!");
        // initialize tooltips
        Ext.QuickTips.init();

        // add any layers from config
        this.addLayers();

        // respond to any queued requests for layer records
        this.checkLayerRecordQueue();

        // broadcast ready state
        this.fireEvent("ready");
    },

    /**
     * deauthorize the application
     */
    deAuthorize: function() {
        // set role to unauthorized
        // this.setAuthorizedRoles([]);  - not working
        
        //this.clearCookieValue("JSESSIONID");   // not defined - fix!
        this.logoutUsingJSpringSecurityLogout();

        // clear user cookie value
        $.cookie('geoexplorer-user', null);
        //this.clearCookieValue("geoexplorer-user")   // original
    }
});

(function() {
    // OGC "standardized rendering pixel size"
    OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
})();
