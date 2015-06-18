/**
 * Add all your dependencies here.
 *
 * @require widgets/Viewer.js
 * @require widgets/ScaleOverlay.js
 * @require plugins/AddLayers.js
 * @require plugins/BingSource.js
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

console.log("... start up boundless sdk app! 1.25");

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
            ptype: "gxp_layermanager",
            //ptype: "gxp_layertree",
            outputConfig: {
                id: "tree",
                title: "Layers",
                border: true,
                autoScroll: true
                //tbar: [] // we will add buttons to "tree.bbar" later
            },
            outputTarget: "westpanel",

            // layer groups
            groups: {
                "capture": {
                    title: "Capture",
                    expanded: false
                },
                "arch": {
                    title: "Archaeology",
                    expanded: false
                },
                "topo": {
                    title: "Topographic maps",
                    expanded: false
                },
                "general": {
                    title: "General",
                    expanded: false
                },
                "dtm": {
                    title: "DEM",
                    expanded: false
                },

                "luft": {
                    title: "Aerial photos",
                    expanded: false
                },
                "orto": {
                    title: "Ortophotos",
                    expanded: false
                },

                //"default": "Zusätzliche Layer"
                "background": {
                    title: "Base Layers",
                    exclusive: true, // radio button instead of checkbox
                    expanded: false
                }
            }
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
                target: "map.tbar", // default
                index: 7
            },
            format: "grid"  // fixes output
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
        // local geoserver
        local: {
            ptype: "gxp_wmscsource",
            //url: "/geoserver/wms",
            url: "/geoserver/bisenzio/wms",
            //version: "1.1.1",
            title: "Local GeoServer"
        },

        // OpenStreetMap
        osm: {
            ptype: "gxp_osmsource"
        },

        // Bing
        bing: {
            ptype: "gxp_bingsource"
        },

        // OpenLayers
        ol: {
            ptype: "gxp_olsource"
        }

        // MapQuest
        // mapquest: {
        //     ptype: "gxp_mapquestsource"
        // },

        // Google
        // google: {
        //     ptype: "gxp_googlesource"
        // }
    },

    // map properties
    map: {
        id: "mymap", // id needed to reference map in portalConfig above
        title: "Map",
        projection: "EPSG:900913",
        //center: [-10764594.758211, 4523072.3184791],
        center: [1321889, 5247337],
        maxExtent: [-1221438, 4331851, 4130376, 7726878],
        //zoom: 3,
        zoom: 11,

        layers: [

            // ORTO (Ortophotos)
            {
                group: "orto",
                source: "local",
                title: "1988/89",
                name: "ortophoto_1988_89",
                visibility: false,
                authReq: true
            },
            {
                group: "orto",
                source: "local",
                title: "1994/98",
                name: "ortophoto_1994_98",
                visibility: false,
                authReq: true
            },
            {
                group: "orto",
                source: "local",
                title: "2000",
                name: "ortophoto_2000",
                visibility: false,
                authReq: true
            },
            {
                group: "orto",
                source: "local",
                title: "2006",
                name: "ortophoto_2006",
                visibility: false,
                authReq: true
            },
            {
                group: "orto",
                source: "local",
                title: "2008",
                name: "ortophoto_2008",
                visibility: false,
                authReq: true
            },
            
            // LUFT (Luftbilder)
            {
                source: "local",
                title: "Royal AF 1944 - 1",
                name: "raf_1944_1",
                group: "luft",
                visibility: false,
                authReq: true
            },
            {
                source: "local",
                title: "Royal AF 1944 - 2",
                name: "raf_1944_2",
                group: "luft",
                visibility: false,
                authReq: true
            },
            {
                source: "local",
                title: "Royal AF 1944 - 3",
                name: "raf_1944_3",
                group: "luft",
                visibility: false,
                authReq: true
            },
            {
                group: "luft",
                source: "local",
                name: "armee_1939",
                title: "Armee 1939",
                visibility: false,
                authReq: true
            },
            
            // DTM
            {
                source: "local",
                title: "DTM5 Shade",
                name: "dtm5-shade",
                group: "dtm",
                visibility: false,
                authReq: true
            },
            {
                source: "local",
                title: "DTM5 Relief",
                name: "dtm5-relief",
                group: "dtm",
                visibility: false,
                authReq: true
            },
            {
                group: "dtm",
                source: "local",
                name: "dtm5-aspect",
                title: "DTM5 Aspect",
                visibility: false,
                authReq: true
            },
            {
                group: "dtm",
                source: "local",
                name: "dtm5-slope2",
                title: "DTM5 Slope",
                visibility: false,
                authReq: true
            },
            {
                group: "dtm",
                source: "local",
                name: "dtm5",
                title: "DTM5",
                visibility: false,
                authReq: true
            },
            {   
                group: "dtm",
                source: "local",
                title: "DTM5 Contours",
                name: "dtm5-contours",
                visibility: false,
                authReq: true
            },
            
            // GENERAL (Allgemeines)
            {     
                source: "local",
                title: "Kommunen",
                name: "kommunen",
                group: "general",
                visibility: false,
                authReq: true  
            },
            {   
                group: "general",  
                source: "local",
                name: "carta_batimetrica",
                title: "Bathymetrie",
                visibility: false,
                authReq: true
            },
            {   
                group: "general",  
                source: "local",
                name: "planung_2015",
                title: "Planung 2015",
                visibility: false,
                authReq: true
            },
            
            // TOPO (Topographische Karten)
            {
                source: "local",
                title: "CTR 5K Schema",
                name: "ctr_5k_schema",
                group: "topo",
                visibility: false,
                authReq: true
            },
            {
                source: "local",
                title: "CTR 5K 2002/2003",
                name: "ctr_5k",
                group: "topo",
                visibility: false,
                authReq: true
            },
            {
                source: "local",
                title: "CTR 2002",
                name: "ctr_2002_merged",
                group: "topo",
                visibility: false,
                authReq: true
            },
            {
                source: "local",
                title: "Catasto Storico 1940",
                name: "catasto_storico_1940",
                group: "topo",
                visibility: false,
                authReq: true
            },
            {
                source: "local",
                title: "Catasto Rustico (105_08)",
                name: "ua_lazio_105_08",
                group: "topo",
                visibility: false,
                authReq: true
            },
            {
                source: "local",
                title: "Catasto Rustico (105_05)",
                name: "ua_lazio_105_05",
                group: "topo",
                visibility: false,
                authReq: true
            },
            {
                group: "topo",
                source: "local",
                name: "ua_lazio_103_10",
                title: "Catasto Rustico (103_10)",
                visibility: false,
                authReq: true
            },
            
            // ARCH (Archäologische Fachdaten)
            {
                group: "arch",
                source: "local",
                title: "Raddatz 1975 Beilage 2",
                name: "Raddatz 1975 Beil 2_modifiziert",   // wms name
                visibility: false,
                authReq: true
            },
            {
                group: "arch",
                source: "local",
                title: "Raddatz 1975 Beilage 1",
                name: "raddatz_1975_beil_1",
                visibility: false,
                authReq: true
            },
            {
                group: "arch",
                source: "local",
                title: "Driehaus 1987 - Siedlungen",
                name: "driehaus_1987-siedlungen",
                visibility: false,
                authReq: true
            },
            {
                group: "arch",
                source: "local",
                title: "Rossi 2012 Abb.3",
                name: "rossi_2012_abb3",
                visibility: false,
                authReq: true
            },
            {
                group: "arch",
                source: "local",
                title: "Ortsnamen (JGU)",
                name: "bisenzio_place_names",
                visibility: false,
                authReq: true
            },
            {
                group: "arch",
                source: "local",
                title: "Funde (JGU)",
                name: "bisenzio_finds",
                visibility: false,
                authReq: true
            },
            
            // CAPTURE (Erfassung)
            {
                group: "capture",
                source: "local",
                name: "areas_g",
                title: "Flächengeometrien",
                visibility: false
            },
            {
                group: "capture",
                source: "local",
                name: "lines_g",
                title: "Liniengeometrien",
                visibility: false
            },
            {
                group: "capture",
                source: "local",
                name: "points_g",   // wms name
                title: "Punkte",    // display name
                visibility: false
                //showButtonText: true,
                //buttonText: "This is a test!"
            },
            
            // BACKGROUND
            {
                group: "background",
                source: "ol",
                //fixed: true,  // prevents dragging
                type: "OpenLayers.Layer",
                args: ["None", {
                    visibility: false
                }]
            },
            {
                group: "background",
                source: "bing",
                name: "Aerial", // "Aerial", "Road", "ArealWithLabels"
                title: "Bing Aerial",
                visibility: true
                //authReq: false
            }

        ],

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
