/**
 * Add all your dependencies here.
 *
 * @require widgets/Viewer.js
 * @require widgets/ScaleOverlay.js
 * @require plugins/AddLayers.js
 * @require plugins/FeatureManager.js
 * @require plugins/FeatureEditor.js
 * @require plugins/LayerManager.js
 * @require plugins/LayerTree.js
 * @require plugins/Measure.js
 * @require plugins/Navigation.js
 * @require plugins/NavigationHistory.js
 * @require plugins/OLSource.js
 * @require plugins/OSMSource.js
 * @require plugins/RemoveLayer.js
 * @require plugins/WMSCSource.js
 * @require plugins/WMSGetFeatureInfo.js
 * @require plugins/Zoom.js
 * @require plugins/ZoomToExtent.js
 * @require plugins/ZoomToLayerExtent.js
 * @require RowExpander.js
 */

console.log("... start up boundless sdk app!");

var app = new gxp.Viewer({
    portalConfig: {
        layout: "border",
        region: "center",

        // by configuring items here, we don't need to configure portalItems
        // and save a wrapping container
        items: [

            // top
            {
                id: "toppanel",
                xtype: "panel",
                height: 27,     // workaround
                region: "north",
                tbar: {
                    items: []
                }
            },

            // map area
            {
                id: "centerpanel",
                xtype: "panel",
                layout: "fit",
                region: "center",
                border: false,
                items: ["mymap"]
            },

            // left sidebar
            {
                id: "westpanel",
                //xtype: "container",
                xtype: "panel",
                layout: "fit",
                region: "west",
                width: 200,
                split: true, // dragable border
                collapseMode: "mini" // clickable border
                //hideCollapseTool: true
            }
        ],
        bbar: {id: "mybbar"}
    },


    // TOOLS
    // =====
    tools: [

        // TOOLS WITHIN SIDEBAR

        // layer tree within left panel
        {
            //ptype: "opacitylayermanager",
            ptype: "gxp_layermanager",
            //ptype: "gxp_layertree",
            outputConfig: {
                id: "tree",
                title: "Layers",
                border: true,
                autoscroll: true,
                //tbar: [] // we will add buttons to "tree.bbar" later
            },
            outputTarget: "westpanel"
        },

        // TOOLS IN NORTH BAR


        {
            // about-button
            actions: ["aboutbutton"],   // defined in viewer.js initPortal
            actionTarget: "toppanel.tbar"
        },

        // Skip to right edge (rquired for login button)
        {
            actions: ["->"],
            actionTarget: "toppanel.tbar"
        },

        // Login Button
        {
            actions: ["loginbutton"],
            actionTarget: "toppanel.tbar"
        },


        // MAP TBAR TOOLS
        // ---------------

        // Navigation tool (move tool)
        {
            ptype: "gxp_navigation"
        },

        // zoom to max extent
        {
            ptype: "gxp_zoomtoextent",
            actionTarget: "map.tbar"
        },

        // zoom in or out
        {
            ptype: "gxp_zoom",
            showZoomBoxAction: true, // adds "Zoom by dragging"
            actionTarget: "map.tbar"
        },

        // zoom to previous or next extend
        {
            ptype: "gxp_navigationhistory",
            actionTarget: "map.tbar"
        },

        // object info
        {
            ptype: "gxp_wmsgetfeatureinfo",

            // changes tools position
            actionTarget: {
                target: "map.tbar", // not needed
                index: 7
            }
        },

        // Messen
        {
            ptype: "gxp_measure",
            //toggleGroup: "interaction",
            controlOptions: {
                immediate: true
            },
            showButtonText: false,
            actionTarget: "map.tbar"
        },

        // Featuremanager (invisible)
        {
            ptype: "gxp_featuremanager",
            id: "featuremanager",
            paging: false,
            autoSetLayer: true
        },

        // Edit (requires Feature Manager)
        {
            ptype: "gxp_featureeditor",
            featureManager: "featuremanager",
            autoLoadFeature: true,
            splitButton: true,
            showButtonText: false,
            //toggleGroup: "interaction",
            actionTarget: "map.tbar"
        },


        // LAYERTREE CONTEXT TOOLS
        // ------------------------

        // Zoom to layer extent
        {
            ptype: "gxp_zoomtolayerextent",
            actionTarget: ["tree.contextMenu"]
        }
    ],

    // layer sources
    sources: {
        local: {
            ptype: "gxp_wmscsource",
            url: "/geoserver/wms",
            version: "1.1.1"
        },
        osm: {
            ptype: "gxp_osmsource"
        }
    },

    // map and layers
    map: {
        id: "mymap", // id needed to reference map in portalConfig above
        title: "Map",
        projection: "EPSG:900913",
        center: [-10764594.758211, 4523072.3184791],
        zoom: 3,
        layers: [{
            source: "osm",
            name: "mapnik",
            group: "background"
        }, {
            source: "local",
            name: "usa:states",
            selected: true
        }],

        // TOOLS MAP OVERLAY
        // ------------------
        items: [

            // zoomslider
            {
                xtype: "gx_zoomslider",
                vertical: true,
                height: 100
            },

            // scale overlay
            {
                xtype: "gxp_scaleoverlay"
            }
        ]
    }

});
