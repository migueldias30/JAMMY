(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/map-view.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "loadingState": "map-view-module__XaUgyq__loadingState",
  "loadingText": "map-view-module__XaUgyq__loadingText",
  "map": "map-view-module__XaUgyq__map",
  "marker": "map-view-module__XaUgyq__marker",
  "markerInner": "map-view-module__XaUgyq__markerInner",
  "popup": "map-view-module__XaUgyq__popup",
  "popupMeta": "map-view-module__XaUgyq__popupMeta",
  "popupTitle": "map-view-module__XaUgyq__popupTitle",
  "pulse": "map-view-module__XaUgyq__pulse",
});
}),
"[project]/src/components/map-view.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2d$view$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/map-view.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Custom marker icon
const createJamIcon = (icon)=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].divIcon({
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2d$view$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].marker,
        html: `<div class="${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2d$view$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].markerInner}">${icon || ""}</div>`,
        iconSize: [
            40,
            40
        ],
        iconAnchor: [
            20,
            40
        ],
        popupAnchor: [
            0,
            -40
        ]
    });
};
function MapView({ jams, onJamSelect, onMapClick, selectedJam }) {
    _s();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const mapElementRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const markersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapView.useEffect": ()=>{
            setIsMounted(true);
        }
    }["MapView.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapView.useEffect": ()=>{
            if (!isMounted || mapRef.current || !mapElementRef.current) {
                return;
            }
            const map = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].map(mapElementRef.current, {
                zoomControl: false
            }).setView([
                38.7223,
                -9.1393
            ], 13);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            if (onMapClick) {
                map.on("click", {
                    "MapView.useEffect": (event)=>{
                        onMapClick([
                            event.latlng.lat,
                            event.latlng.lng
                        ]);
                    }
                }["MapView.useEffect"]);
            }
            mapRef.current = map;
            return ({
                "MapView.useEffect": ()=>{
                    map.remove();
                    mapRef.current = null;
                    markersRef.current = {};
                }
            })["MapView.useEffect"];
        }
    }["MapView.useEffect"], [
        isMounted,
        onMapClick
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapView.useEffect": ()=>{
            const map = mapRef.current;
            if (!map) {
                return;
            }
            Object.values(markersRef.current).forEach({
                "MapView.useEffect": (marker)=>marker.remove()
            }["MapView.useEffect"]);
            markersRef.current = {};
            jams.forEach({
                "MapView.useEffect": (jam)=>{
                    const marker = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].marker(jam.pos, {
                        icon: createJamIcon(jam.icon)
                    }).addTo(map);
                    marker.bindPopup(`
        <div class="${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2d$view$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].popup}">
          <h3 class="${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2d$view$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].popupTitle}">${jam.title}</h3>
          <div class="${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2d$view$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].popupMeta}">
            <div>${jam.location}</div>
            <div>${formatDate(jam.dateTime)}</div>
            <div>${jam.duration}</div>
            <div>${jam.attendees.length} attending</div>
          </div>
        </div>
      `);
                    marker.on("click", {
                        "MapView.useEffect": ()=>{
                            onJamSelect(jam);
                        }
                    }["MapView.useEffect"]);
                    markersRef.current[jam.id] = marker;
                }
            }["MapView.useEffect"]);
        }
    }["MapView.useEffect"], [
        jams,
        onJamSelect
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapView.useEffect": ()=>{
            if (!selectedJam) {
                return;
            }
            const marker = markersRef.current[selectedJam.id];
            const map = mapRef.current;
            if (!marker || !map) {
                return;
            }
            map.flyTo(selectedJam.pos, map.getZoom(), {
                duration: 0.4
            });
            marker.openPopup();
        }
    }["MapView.useEffect"], [
        selectedJam
    ]);
    if (!isMounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2d$view$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].loadingState,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2d$view$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].loadingText,
                children: "Loading map..."
            }, void 0, false, {
                fileName: "[project]/src/components/map-view.tsx",
                lineNumber: 123,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/map-view.tsx",
            lineNumber: 122,
            columnNumber: 7
        }, this);
    }
    const formatDate = (dateString)=>{
        const date = new Date(dateString);
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        if (date.toDateString() === now.toDateString()) {
            return `Today at ${date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })}`;
        }
        if (date.toDateString() === tomorrow.toDateString()) {
            return `Tomorrow at ${date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })}`;
        }
        return date.toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: mapElementRef,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$map$2d$view$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].map
    }, void 0, false, {
        fileName: "[project]/src/components/map-view.tsx",
        lineNumber: 142,
        columnNumber: 10
    }, this);
}
_s(MapView, "whQJLaXG8Q9rv5Qwm5GVOYIw5oU=");
_c = MapView;
var _c;
__turbopack_context__.k.register(_c, "MapView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/map-view.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/map-view.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_0tami.6._.js.map