class AS3000_MapElement extends MapInstrumentElement {
    constructor(_simVarNameID) {
        super();
		this.simVarNameID = _simVarNameID;
		
		this.lastOrientation = 0;
		this.lastSync = 0;
		//this.lastDcltr = 0;
		this.lastSymbolVis = new Map([
			["show-roads", 1],
			["show-cities", 1],
			["show-airspaces", 1],
			["show-airways", 1],
			["show-vors", 1],
			["show-ndbs", 1],
			["show-intersections", 1],
			["show-airports", 1]
		]);
    }
	
	init(root) {
        this.instrument = root.querySelector("map-instrument-enhanced");
        if (this.instrument) {
            TemplateElement.callNoBinding(this.instrument, () => {
                this.onTemplateLoaded();
            });
        }
		SimVar.SetSimVarValue(AS3000_MapElement.VARNAME_ORIENTATION_ROOT + this.simVarNameID, "number", 0);	// set default map orientation (0 = hdg, 1 = trk, 2 = north)
		SimVar.SetSimVarValue(AS3000_MapElement.VARNAME_DETAIL_ROOT + this.simVarNameID, "number", 0);		// set default declutter (0 = none, 1 = DCLTR1, 2 = DCLTR2, 3 = least)
		
		for (let [attr, val] of this.lastSymbolVis) {
			SimVar.SetSimVarValue(AS3000_MapElement.VARNAME_SYMBOL_VIS_ROOT.get(attr) + this.simVarNameID, "number", 1);
		}
		
		this.initDcltrSettings();
    }
	
	initDcltrSettings() {
		this.dcltrSettings = [new Map(), new Map(), new Map(), new Map()];
		
		// no declutter
		this.dcltrSettings[0].set("show-roads", true);
		this.dcltrSettings[0].set("show-cities", true);
		this.dcltrSettings[0].set("show-airspaces", true);
		this.dcltrSettings[0].set("show-airways", true);
		this.dcltrSettings[0].set("show-vors", true);
		this.dcltrSettings[0].set("show-ndbs", true);
		this.dcltrSettings[0].set("show-intersections", true);
		this.dcltrSettings[0].set("show-airports", true);
		
		// DCLTR1
		this.dcltrSettings[1].set("show-roads", false);
		this.dcltrSettings[1].set("show-cities", false);
		this.dcltrSettings[1].set("show-airspaces", true);
		this.dcltrSettings[1].set("show-airways", true);
		this.dcltrSettings[1].set("show-vors", true);
		this.dcltrSettings[1].set("show-ndbs", true);
		this.dcltrSettings[1].set("show-intersections", true);
		this.dcltrSettings[1].set("show-airports", true);
		
		// DCLTR2
		this.dcltrSettings[2].set("show-roads", false);
		this.dcltrSettings[2].set("show-cities", false);
		this.dcltrSettings[2].set("show-airspaces", false);
		this.dcltrSettings[2].set("show-airways", false);
		this.dcltrSettings[2].set("show-vors", false);
		this.dcltrSettings[2].set("show-ndbs", false);
		this.dcltrSettings[2].set("show-intersections", false);
		this.dcltrSettings[2].set("show-airports", true);
		
		// Least
		this.dcltrSettings[3].set("show-roads", false);
		this.dcltrSettings[3].set("show-cities", false);
		this.dcltrSettings[3].set("show-airspaces", false);
		this.dcltrSettings[3].set("show-airways", false);
		this.dcltrSettings[3].set("show-vors", false);
		this.dcltrSettings[3].set("show-ndbs", false);
		this.dcltrSettings[3].set("show-intersections", false);
		this.dcltrSettings[3].set("show-airports", false);
	}
	
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
		
		let sync = SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_SYNC, "number");
		if (sync != this.lastSync) {
			if (sync == 1) {
				// Sync All
				let initID = AS3000_MapElement.SYNC_INITID_ARRAY[SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_SYNC_INITID, "number")];
				SimVar.SetSimVarValue(AS3000_MapElement.VARNAME_ORIENTATION_ROOT + AS3000_MapElement.VARNAME_SYNC_ALL_ID, "number", SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_ORIENTATION_ROOT + initID, "number"));
				SimVar.SetSimVarValue(AS3000_MapElement.VARNAME_DETAIL_ROOT + AS3000_MapElement.VARNAME_SYNC_ALL_ID, "number", SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_DETAIL_ROOT + initID, "number"));
			}
			this.lastSync = sync;
		}
		this.syncSettings(sync);
		
		this.updateOrientation();
		this.updateSymbolVisibility();
    }
	
	syncSettings(_sync) {
		if (_sync == 1) {
			// Sync All
			SimVar.SetSimVarValue(AS3000_MapElement.VARNAME_ORIENTATION_ROOT + this.simVarNameID, "number", SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_ORIENTATION_ROOT + AS3000_MapElement.VARNAME_SYNC_ALL_ID, "number"));
			SimVar.SetSimVarValue(AS3000_MapElement.VARNAME_DETAIL_ROOT + this.simVarNameID, "number", SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_DETAIL_ROOT + AS3000_MapElement.VARNAME_SYNC_ALL_ID, "number"));
		}
	}
	
	updateOrientation() {
		let orientation = SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_ORIENTATION_ROOT + this.simVarNameID, "number");
		if (this.lastOrientation != orientation) {
			switch (orientation) {
			case 0:
				this.instrument.setOrientation("hdg");
				break;
			case 1:
				this.instrument.setOrientation("trk");
				break;
			case 2:
				this.instrument.setOrientation("north");
				break;
			}
			this.lastOrientation = orientation;
		}
	}
	
	updateSymbolVisibility() {
		let dcltr = SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_DETAIL_ROOT + this.simVarNameID, "number");
		let changedValues = new Map();
		for (let [attr, lastVal] of this.lastSymbolVis) {
			let currentVal = (SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_SYMBOL_VIS_ROOT.get(attr) + this.simVarNameID, "number") == 1) && this.getDcltrSettings(dcltr).get(attr);
			if (currentVal != lastVal) {
				this.instrument.setAttribute(attr, currentVal);
			}
			changedValues.set(attr, currentVal);
		}
		for (let [attr, currentVal] of changedValues) {
			this.lastSymbolVis.set(attr, currentVal);
		}
	}
	
	// returns key-value pairs for declutter settings for a given declutter level
	getDcltrSettings(_level) {
		return this.dcltrSettings[_level];
	}
	
	static getSyncInitIDIndex(_id) {
		return AS3000_MapElement.SYNC_INITID_ARRAY.indexOf(_id);
	}
	
	static setSyncedSettingVar(_root, _id, _val) {
		SimVar.SetSimVarValue(_root + _id, "number", _val);
		if (SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_SYNC, "number") == 1) {
			SimVar.SetSimVarValue(_root + AS3000_MapElement.VARNAME_SYNC_ALL_ID, "number", _val);
		}
	}
}
AS3000_MapElement.VARNAME_ORIENTATION_ROOT = "L:AS3000_Map_Orientation";
AS3000_MapElement.VARNAME_SYNC = "L:AS3000_Map_Sync";
AS3000_MapElement.VARNAME_SYNC_INITID = "L:AS3000_Map_Sync_InitID";
AS3000_MapElement.SYNC_INITID_ARRAY = ["_PFD", "_MFD"];						// horrible hack because I can't get SetSimVar to work for strings
AS3000_MapElement.VARNAME_DETAIL_ROOT = "L:AS3000_Map_Dcltr";
AS3000_MapElement.VARNAME_SYNC_ALL_ID = "_SyncAll";

AS3000_MapElement.VARNAME_SYMBOL_VIS_ROOT = new Map([
		["show-roads", "L:AS3000_Map_Roads_Show"],
		["show-cities", "L:AS3000_Map_Cities_Show"],
		["show-airspaces", "L:AS3000_Map_Cities_Show"],
		["show-airways", "L:AS3000_Map_Airways_Show"],
		["show-vors", "L:AS3000_Map_VORs_Show"],
		["show-ndbs", "L:AS3000_Map_NDBs_Show"],
		["show-intersections", "L:AS3000_Map_Intersections_Show"],
		["show-airports", "L:AS3000_Map_Airports_Show"]
]);