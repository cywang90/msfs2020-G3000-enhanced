class AS3000_MapElement extends MapInstrumentElement {
    constructor(_orientationVarName) {
        super();
		this.orientationVarName = _orientationVarName;
		
		this.lastOrientation = 0;
    }
	
	init(root) {
        this.instrument = root.querySelector("map-instrument-rot");
        if (this.instrument) {
            TemplateElement.callNoBinding(this.instrument, () => {
                this.onTemplateLoaded();
            });
        }
		SimVar.SetSimVarValue(this.orientationVarName, "number", 0); // set default map orientation (0 = hdg, 1 = trk, 2 = north)
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
		
		// update map orientation
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
}