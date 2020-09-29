class AS3000_MapElement extends MapInstrumentElement {
    constructor(_orientationVarName, _dcltrVarName) {
        super();
		this.orientationVarName = _orientationVarName;
		this.dcltrVarName = _dcltrVarName;
		
		this.lastOrientation = 0;
		this.lastDcltr = 0;
    }
	
	init(root) {
        this.instrument = root.querySelector("map-instrument-rot");
        if (this.instrument) {
            TemplateElement.callNoBinding(this.instrument, () => {
                this.onTemplateLoaded();
            });
        }
		SimVar.SetSimVarValue(this.orientationVarName, "number", 0);	// set default map orientation (0 = hdg, 1 = trk, 2 = north)
		SimVar.SetSimVarValue(this.dcltrVarName, "number", 0);			// set default declutter (0 = none, 1 = DCLTR1, 2 = DCLTR2, 3 = least)
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
		
		this.updateOrientation();
		this.updateDcltr();
    }
	
	updateOrientation() {
		let orientation = SimVar.GetSimVarValue(this.orientationVarName, "number");
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
	
	updateDcltr() {
		let dcltr = SimVar.GetSimVarValue(this.dcltrVarName, "number");
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