class SvgRoadNetworkElementRotatable extends SvgRoadNetworkElement {
    constructor() {
        super();
    }
    
    onLatLongChanged(_map, _coords) {
        let p = _map.coordinatesToXY(_coords);
        p.x -= this.svgMapSize * 0.5;
        p.y -= this.svgMapSize * 0.5;
        p.x *= this.displayedSize / this.svgMapSize;
        p.y *= this.displayedSize / this.svgMapSize;
        let top = Math.round(p.y);
        let left = Math.round(p.x);
        if (this.parentHeight < this.canvasSize) {
            top = Math.round((this.parentHeight - this.canvasSize) * 0.5 + p.y);
        }
        if (this.parentWidth < this.canvasSize) {
            left = Math.round((this.parentWidth - this.canvasSize) * 0.5 + p.x);
        }
        let deltaRotation = 0;
        if (_map.orientation != "north") {
            deltaRotation = this._forcedDirection - _map.planeDirection;
        }
        this.translateCanvas(this._visibleCanvas.canvas, left, top, deltaRotation);
    }
}