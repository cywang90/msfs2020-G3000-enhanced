# msfs2020-G3000-enhanced

### Current version: 0.1.0

### Description
This is a mod for MSFS2020 that aims to improve the in-game G3000. The goal is to bring functionality closer to the real-life G3000, with a focus on both features and layout/UI. Most of development and testing was done with the TBM 930, and the TBM 930 version of the G3000 pilot's guide was used as the primary reference. I made some effort into roughly approximating the layout and style of the UI itself, but I am not a graphics designer/UI artist, so I can only describe the results as passable, but not great.

This mod was created with cross-compatibility in mind. It modifies the minimum number of base files possible to achieve its goals, so it should be compatible with most other mods. However, because of the nature of the mod, it will conflict with other mods that make changes to the G3000.

**NOTE:** This version of the mod is _not_ compatible with the Cessna Citation Longitude yet. So far development has been primarily focused on the TBM 930, which I believe is more "mature" than the Longitude with regard to vanilla functionality and feature-completeness. I plan to make the mod compatible with the Longitude in the near future. It's mostly just porting html/css stuff, so it should be relatively simple.

### Installation
I recommend downloading the official release packages. If you want more up to date code, then you can always download snapshots of master or dev and build your packages directly from src/dev/working. master is *usually* pretty stable. dev is not guaranteed to be stable at all, but may be more up to date than master.

For your convenience, I've provided two different packages: msfs2020-G3000-enhanced-std and msfs2020-G3000-enhanced-tbm. At this point, I recommend downloading the -tbm version for several reasons. First, the -std version will break the Cessna Citation Longitude (if you don't have the Longitude installed you can safely ignore this point). Second, the -tbm version includes an extra feature for the TBM 930 (see below). The only downside of the -tbm version is that unlike the -std version, it modifies aircraft-specific files and therefore may have compatibility issues with other TBM 930 mods.

To install, copy msfs2020-G3000-enhanced-std or msfs2020-G3000-enhanced-tbm into your Community folder. To uninstall, delete the msfs2020-G3000-enhanced-xxx folder from your Community folder.

### Release Highlights (v0.1.0)
Please refer to the changelog for a more detailed description of updates.

- Initial public release!
- You can now adjust screen brightness with the touchscreen controller. No more burned out eyes during night flights!
- Many new features have been added to the navigational map (NavMap):
  - Change map orientation between Heading Up, Track Up, and North Up.
  - Maximum map range increased to 1000 NM.
  - Improved customization options for the display of map symbols (airspaces, airports, VORs, etc): toggle visibility and set maximum ranges for individual categories or use the DCLTR function to quickly clean up the map.
  - You can now sync map settings between the main navigational map (on the MFD) and the PFD inset maps.
- There is now a weather overlay (NEXRAD style) for the PFD inset map.
- The Audio/Radio page will now display ident codes for NAV1/NAV2 when tuned to the correct frequency.
- Fixes for vanilla bugs:
  - MFD wind display now has the arrow pointing in the right direction.
- **-tbm version only**: Made it so that the backlighting of the standby altimeter and airspeed indicator is controlled by the overhead Panel Lighting knob. This makes it so that every bit of lighting inside the TBM cockpit is adjustable (screens and associated buttons/knobs with G3000 digital control and everything else with the panel lighting knob).

### Known Issues
- \[PFD\] Co-pilot PFD softkeys are nonfunctional. (This is actually a vanilla game bug, but I'm including it because it's a pretty major one.)
- \[NavMap\] Roads will be slow to draw on the navigational map at large map ranges.
- \[NavMap\] The road overlay for the navigational map will sometimes fail to draw roads close to the aircraft, instead prioritizing roads farther away. This usually only happens when the map range is set to large values (>100 NM).

### TODO
*This is not a comprehensive list of planned features. It is simply an outline of the most immediate things I was planning to work on when this document was last updated.*
- \[NavMap\] Implement toggle and range setting for INT waypoint symbols.
- \[NavMap\] Implement Auto-North-Up and Auto Zoom.
- \[NavMap\] Implement compass/heading rose and range overlays for the main navigational map.
- \[NavMap\] Allow toggling of terrain elevation data on the navigational map.
- \[Compatibility\] Make this mod compatible with the Cessna Citation Longitude.