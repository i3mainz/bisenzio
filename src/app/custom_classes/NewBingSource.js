/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @require plugins/BingSource.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = NewBingSource
 */

/** api: (extends)
 *  plugins/BingSource.js
 */

Ext.namespace("gxp.plugins");

/**
 * This extends the bingsource plugin and provides a new apiKey
 */
gxp.plugins.NewBingSource = Ext.extend(gxp.plugins.BingSource, {
    
    /** api: ptype = gxp_bingsource */
    ptype: "gxp_newbingsource",

    /** api: config[apiKey]
     *  ``String``
     *  API key generated from http://bingmapsportal.com/ for your domain.
     */
    apiKey: "AmVpvXnd2haOLplGCJh2CHd_jPPKo_9UpAM_wNb2tpURk61uQ1uwvx8vgACAkH3m"

});

Ext.preg(gxp.plugins.NewBingSource.prototype.ptype, gxp.plugins.NewBingSource);
