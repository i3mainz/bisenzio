"use strict";
/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @require plugins/LayerManager.js
 * @require GeoExt/widgets/LayerOpacitySlider.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = LayerManager
 */

/** api: (extends)
 *  plugins/LayerTree.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: NewLayerManager(config)
 *
 *    GXP Plugin that extends the GXP LayerManager by displaying 
 *    the GeoExt LayerOpacitySlider for every wms layer
 */

gxp.plugins.NewLayerManager = Ext.extend(gxp.plugins.LayerManager, {

    /** api: ptype = gxp_layermanager */
    ptype: "gxp_newlayermanager",

    /**
     * loops over all attributes and assigns something to it
     */
    configureLayerNode: function(loader, attr) {

        // keep settings from gxp_layermanager
        gxp.plugins.NewLayerManager.superclass.configureLayerNode.apply(this, arguments);

        var layer = attr.layer;

        if (layer instanceof OpenLayers.Layer.WMS) {  // is wms layer

            // apply opacity slider to this layer (attr is the node)
            Ext.apply(layer, {
                component: {
                    xtype: "gx_opacityslider",
                    id: "opslider",
                    layer: this.target.mapPanel.layers.getByLayer(attr.layer),
                    //aggressive: true,
                    width: 100,
                    //height: 20,
                    inverse: true,
                    cls: "gx-opslider" // for css referencing
                }
            });

        } else if (layer instanceof OpenLayers.Layer.Vector) {  // is vector layer
            // do nothing
            console.log("is vector!");
        }
    }

});

Ext.preg(gxp.plugins.NewLayerManager.prototype.ptype, gxp.plugins.NewLayerManager);
