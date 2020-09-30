class AS3000_MapElement extends MapInstrumentElement {
    constructor(_varNameID) {
        super();
		this.varNameID = _varNameID;
		
		this.lastOrientation = 0;
		this.lastSync = 0;
		this.lastDcltr = 0;
    }
	
	init(root) {
        this.instrument = root.querySelector("map-instrument-rot");
        if (this.instrument) {
            TemplateElement.callNoBinding(this.instrument, () => {
                this.onTemplateLoaded();
            });
        }
		SimVar.SetSimVarValue(AS3000_MapElement.VARNAME_ORIENTATION_ROOT + this.varNameID, "number", 0);	// set default map orientation (0 = hdg, 1 = trk, 2 = north)
		SimVar.SetSimVarValue(AS3000_MapElement.VARNAME_DETAIL_ROOT + this.varNameID, "number", 0);		// set default declutter (0 = none, 1 = DCLTR1, 2 = DCLTR2, 3 = least)
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
				let initID = SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_SYNC_INITID, "string");
				SimVar.SetSimVarValue(AS3000_MapElement.VARNAME_ORIENTATION_ROOT + AS3000_MapElement.VARNAME_SYNC_ALL_ID, "number", SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_ORIENTATION_ROOT + initID, "number"));
				SimVar.SetSimVarValue(AS3000_MapElement.VARNAME_DETAIL_ROOT + AS3000_MapElement.VARNAME_SYNC_ALL_ID, "number", SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_DETAIL_ROOT + initID, "number"));
			}
			this.lastSync = sync;
		}
		this.syncSettings(sync);
		
		let id = (sync == 1) ? AS3000_MapElement.VARNAME_SYNC_ALL_ID : this.varNameID;
		this.updateOrientation(id);
		this.updateDcltr(id);
    }
	
	syncSettings(_sync) {
		if (_sync == 1) {
			// Sync All
			SimVar.SetSimVarValue(AS3000_MapElement.VARNAME_ORIENTATION_ROOT + AS3000_MapElement.VARNAME_SYNC_ALL_ID, "number", AS3000_MapElement.VARNAME_ORIENTATION_ROOT + this.varNameID, "number");
			SimVar.SetSimVarValue(AS3000_MapElement.VARNAME_DETAIL_ROOT + AS3000_MapElement.VARNAME_SYNC_ALL_ID, "number", AS3000_MapElement.VARNAME_DETAIL_ROOT + this.varNameID, "number");
		}
	}
	
	updateOrientation(_id) {
		let orientation = SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_ORIENTATION_ROOT + _id, "number");
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
	
	updateDcltr(_id) {
		let dcltr = SimVar.GetSimVarValue(AS3000_MapElement.VARNAME_DETAIL_ROOT + _id, "number");
		if (this.lastDcltr != dcltr) {
			let settings = this.getDcltrSettings(dcltr);
			
			for (let [attr, value] of settings) {
				this.instrument.setAttribute(attr, value);
			}
			
			this.lastDcltr = dcltr;
		}
	}
	
	// returns key-value pairs for declutter settings for a given declutter level
	getDcltrSettings(_level) {
		return this.dcltrSettings[_level];
	}
}
AS3000_MapElement.VARNAME_ORIENTATION_ROOT = "L:AS3000_Map_Orientation";
AS3000_MapElement.VARNAME_SYNC = "L:AS3000_Map_Sync";
AS3000_MapElement.VARNAME_SYNC_INITID = "L:AS3000_Map_Sync_InitID";
AS3000_MapElement.VARNAME_DETAIL_ROOT = "L:AS3000_Map_Dcltr";
AS3000_MapElement.VARNAME_SYNC_ALL_ID = "_SyncAll";