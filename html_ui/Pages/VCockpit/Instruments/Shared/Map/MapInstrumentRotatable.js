class MapInstrumentRotatable extends MapInstrument {
	constructor() {
		super();
		
		/*
		 * Defines orientation of the map:
		 * hdg: current aircraft heading up
		 * trk: current ground track up
		 * north: North up
		 */
		this.orientation = "hdg";
	}
	
	init(arg) {
        if (arg !== undefined) {
            if (arg instanceof BaseInstrument) {
                this.instrument = arg;
                this.selfManagedInstrument = false;
                if (this.instrument instanceof NavSystem) {
                    this.gps = this.instrument;
                }
            }
            else {
                this.instrument = document.createElement("base-instrument");
                this.selfManagedInstrument = true;
                if (typeof (arg) === "string") {
                    this.instrument.setInstrumentIdentifier(arg);
                }
            }
        }
        else {
        }
        if (this.gps) {
            if (!this.gps.currFlightPlanManager) {
                this.gps.currFlightPlanManager = new FlightPlanManager(this.gps);
                this.gps.currFlightPlanManager.registerListener();
            }
            this.gps.addEventListener("FlightStart", this.onFlightStart.bind(this));
        }
        else {
            if (!this._flightPlanManager) {
                this._flightPlanManager = new FlightPlanManager(null);
                this._flightPlanManager.registerListener();
            }
        }
        let bingMapId = this.bingId;
        if (this.gps && this.gps.urlConfig.index)
            bingMapId += "_GPS" + this.gps.urlConfig.index;
        this.bingMap = this.getElementsByTagName("bing-map")[0];
        this.bingMap.setMode(this.eBingMode);
        this.bingMap.setReference(this.eBingRef);
        this.bingMap.setBingId(bingMapId);
        this.bingMap.setVisible(this.showBingMap);
        this.bVfrMapPlanePositionReady = true;
        if (this.eBingMode === EBingMode.VFR || this.eBingMode === EBingMode.CURSOR) {
            this.bVfrMapPlanePositionReady = false;
        }
        SimVar.SetSimVarValue("L:AIRLINER_MCDU_CURRENT_FPLN_WAYPOINT", "number", -1);
        if (this.eBingMode !== EBingMode.HORIZON) {
            this.navMap = new SvgMapRotatable(this, { svgElement: this.getElementsByTagName("svg")[0], configPath: this.configPath });
            this.navMap.lineCanvas = this.lineCanvas;
            var mapSVG = this.querySelector("#MapSVG");
            mapSVG.setAttribute("display", "visible");
            this.insertBefore(this.lineCanvas, mapSVG);
            this.wpt = this.querySelector("#WPT");
            this.dtkMap = this.querySelector("#DTKMap");
            this.disMap = this.querySelector("#DISMap");
            this.gsMap = this.querySelector("#GSMap");
            this.mapRangeElement = this.querySelector("#MapRange");
			this.mapRangeElementRange = this.mapRangeElement.getElementsByClassName("range")[0];
            this.mapOrientationElement = this.querySelector("#MapOrientation");
            if (!this.bShowOverlay) {
                this.mapRangeElement.classList.add("hide");
                this.mapOrientationElement.classList.add("hide");
            }
            this.mapNearestAirportListNoRunway = new NearestAirportList(this.instrument);
            this.mapNearestIntersectionList = new NearestIntersectionList(this.instrument);
            this.mapNearestNDBList = new NearestNDBList(this.instrument);
            this.mapNearestVorList = new NearestVORList(this.instrument);
            this.testAirspaceList = new NearestAirspaceList(this.instrument);
            this.roadNetwork = new SvgRoadNetworkElementRotatable();
            this.cityManager = new SvgCityManager(this.navMap);
            this.airwayIterator = 0;
            this.airspaceIterator = 0;
            this.smartIterator = new SmartIterator();
            this.roadsBuffer = [];
            this.drawCounter = 0;
            this.airportLoader = new AirportLoader(this.instrument);
            this.intersectionLoader = new IntersectionLoader(this.instrument);
            this.vorLoader = new VORLoader(this.instrument);
            this.ndbLoader = new NDBLoader(this.instrument);
            this.nearestAirspacesLoader = new NearestAirspacesLoader(this.instrument);
            this.nearestAirspacesLoader.onNewAirspaceAddedCallback = (airspace) => {
                if (airspace) {
                    this.roadsBuffer.push({
                        id: 0,
                        path: airspace.segments,
                        type: airspace.type + 100,
                        lod: 8
                    }, {
                        id: 0,
                        path: airspace.segments,
                        type: airspace.type + 100,
                        lod: 12
                    }, {
                        id: 0,
                        path: airspace.segments,
                        type: airspace.type + 100,
                        lod: 14
                    });
                }
            };
            this.npcAirplaneManager = new NPCAirplaneRotatableManager();
            this.airplaneIconElement = new SvgAirplaneElementRotatable();
            this.flightPlanElement = new SvgFlightPlanElement();
            this.flightPlanElement.source = this.flightPlanManager;
            this.flightPlanElement.flightPlanIndex = 0;
            this.tmpFlightPlanElement = new SvgFlightPlanElement();
            this.tmpFlightPlanElement.source = this.flightPlanManager;
            this.tmpFlightPlanElement.flightPlanIndex = 1;
            this.directToElement = new SvgBackOnTrackElement();
            Coherent.call("RESET_ROAD_ITERATOR");
            FacilityLoader.Instance.registerListener();
            this.addEventListener("mousedown", this.OnMouseDown.bind(this));
            this.addEventListener("mousemove", this.OnMouseMove.bind(this));
            this.addEventListener("mouseup", this.OnMouseUp.bind(this));
            this.addEventListener("mouseleave", this.OnMouseUp.bind(this));
            this.addEventListener("mousewheel", this.OnMouseWheel.bind(this));
        }
        this.loadBingMapConfig();
        if (this.bingMap.isReady())
            this.onBingMapReady();
        else
            this.bingMap.addEventListener("BingMapReady", this.onBingMapReady.bind(this));
        this.cursorSvg = this.querySelector("#MapCursor");
        this.weatherSVG = this.querySelector("#WeatherSVG");
        window.document.addEventListener("OnVCockpitPanelAttributesChanged", this.updateVisibility.bind(this));
        this.bIsInit = true;
    }
	
	onBeforeMapRedraw() {
		super.onBeforeMapRedraw();
		
		if (this.eBingMode !== EBingMode.HORIZON && (!this.isDisplayingWeatherRadar() || !this.weatherHideGPS) && this.bingMap) {
			let transform = "";
			if (!this.isDisplayingWeatherRadar() && this.orientation != "north") {
				if (this.orientation == "hdg") {
					var roundedCompass = fastToFixed(SimVar.GetSimVarValue("PLANE HEADING DEGREES TRUE", "degree"), 3);
				} else if (this.orientation == "trk") {
					var roundedCompass = fastToFixed(SimVar.GetSimVarValue("GPS GROUND MAGNETIC TRACK", "degree"), 3);
				}
				transform = "rotate(" + -roundedCompass + "deg)";
			}
			this.bingMap.style.transform = transform;
		}
	}
	
	update() {
        this.updateVisibility();
        this.updateSize(true);
        if (this.selfManagedInstrument) {
            this.instrument.dataMetaManager.UpdateAll();
        }
        if (this.wpt) {
            var wpId = SimVar.GetSimVarValue("GPS WP NEXT ID", "string");
            if (this.wpIdValue != wpId) {
                this.wpt.textContent = wpId;
                this.wpIdValue = wpId;
            }
        }
        if (this.dtkMap) {
            var wpDtk = fastToFixed(SimVar.GetSimVarValue("GPS WP DESIRED TRACK", "degree"), 0);
            if (this.wpDtkValue != wpDtk) {
                this.dtkMap.textContent = wpDtk;
                this.wpDtkValue = wpDtk;
            }
        }
        if (this.disMap) {
            var wpDis = fastToFixed(SimVar.GetSimVarValue("GPS WP DISTANCE", "nautical mile"), 1);
            if (this.wpDisValue != wpDis) {
                this.disMap.textContent = wpDis;
                this.wpDisValue = wpDis;
            }
        }
        if (this.gsMap) {
            var gs = fastToFixed(SimVar.GetSimVarValue("GPS GROUND SPEED", "knots"), 0);
            if (this.gsValue != gs) {
                this.gsMap.textContent = gs;
                this.gsValue = gs;
            }
        }
        if (this.mapRangeElement) {
			let currentRange = this.getDisplayRange();
            if (this.rangeValue != currentRange) {
				Avionics.Utils.diffAndSet(this.mapRangeElementRange, currentRange);
                this.rangeValue = currentRange;
            }
        }
        if (this.navMap) {
            this.navMap.update();
        }
        if (this.navMap && this.navMap.centerCoordinates) {
            this.updateInputs();
        }
        if (this.bIsCursorDisplayed && this.eBingMode != EBingMode.CURSOR) {
            this.hideCursor();
        }
    }
	
	setOrientation(_val) {
		switch (_val) {
			case "trk":
			case "north":
				this.orientation = _val;
				break;
			case "hdg":
			default:
				this.orientation = "hdg";
		}
		if (this.navMap) {
			this.navMap.setOrientation(this.orientation);
		}
		Avionics.Utils.diffAndSet(this.mapOrientationElement, this.orientation.toUpperCase() + " UP");
	}
	
	get templateID() { return "MapInstrumentRotatableTemplate"; }
	
	// adapt this method to the new orientation model for compatibility purposes
	rotateWithPlane(_val) {
		if (_val) {
			this.setOrientation("hdg");
		} else {
			this.setOrientation("north");
		}
	}
	
	updateBingMapSize() {
        let w = this.curWidth;
        let h = this.curHeight;
        let max = Math.max(w, h);
		
		// to compensate for potential rotation, we need to overdraw the map
		// the factor is sqrt(2)
		max *= 1.41421356;
		
        if (w * h > 1 && w * h !== this.lastWH) {
            this.lastWH = w * h;
            this.bingMap.style.width = fastToFixed(max, 0) + "px";
            this.bingMap.style.height = fastToFixed(max, 0) + "px";
            this.bingMap.style.top = fastToFixed((h - max) / 2, 0) + "px";
            this.bingMap.style.left = fastToFixed((w - max) / 2, 0) + "px";
        }
    }
	
	centerOnPlane() {
		if (this.orientation == "north") {
			super.centerOnPlane();
		} else {
			// if orientation is heading or track up, we want to place the plane 33% from the bottom of the map,
			// but vector needs to be adjusted for overdraw factor of sqrt(2)
			let target = this.navMap.XYToCoordinatesFromPlaneWithRotation(new Vec2(500, 382));
			this.setNavMapCenter(target);
		}
    }
}
customElements.define("map-instrument-rot", MapInstrumentRotatable);
checkAutoload();