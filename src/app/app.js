/**
 * Add all your dependencies here.
 *
 * @require widgets/Viewer.js
 * @require widgets/ScaleOverlay.js
 * @require plugins/LayerTree.js
 * @require plugins/OLSource.js
 * @require plugins/OSMSource.js
 * @require plugins/WMSCSource.js
 * @require plugins/ZoomToExtent.js
 * @require plugins/NavigationHistory.js
 * @require plugins/Zoom.js
 * @require plugins/AddLayers.js
 * @require plugins/RemoveLayer.js
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
                xtype: "container",
                layout: "fit",
                region: "west",
                width: 200
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
            ptype: "gxp_layertree",
            outputConfig: {
                id: "tree",
                title: "Layers",
                border: true,
                autoscroll: true,
                tbar: [] // we will add buttons to "tree.bbar" later
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

        // add layers

        {
            ptype: "gxp_addlayers",
            actionTarget: "tree.tbar"
        },

        // remove layers
        {
            ptype: "gxp_removelayer",
            actionTarget: ["tree.tbar", "tree.contextMenu"]
        },

        {
            ptype: "gxp_zoomtoextent",
            actionTarget: "map.tbar"
        },
        {
            ptype: "gxp_zoom",
            actionTarget: "map.tbar"
        },
        {
            ptype: "gxp_navigationhistory",
            actionTarget: "map.tbar"
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
