# msfs2020-G3000-enhanced Changelog

### v0.1.0
**New Features**
- \[MISC\] Added the ability to adjust backlighting via the G3000 touchscreen menu.
  - The menu adjustment will affect all G3000 screens (PFD, MFD, touchscreen) as well as backlighting of the PFD bezel keys (softkeys), and touchscreen knobs and bezel keys.
  - To change this setting, navigate to MFD Home -> Aircraft Systems -> Lighting Config. Use the slider or Inc/Dec buttons to adjust the backlight.
- \[PFD\] PFD softkeys with disabled functionality are now displayed as grayed-out.
- \[PFD\] Added the ability to toggle PFD inset map on/off.
  - To change this setting, use the PFD softkey menu to navigate to PFD Map Settings -> Map Layout, then select Map Off or Inset Map.
  - When the PFD inset map is disabled, associated softkeys will be automatically disabled until the map is turned back on.
- \[PFD\] Added ability to enable NEXRAD weather overlay for PFD inset map.
  - To change this setting, use the PFD softkey menu to navigate to PFD Map Settings, then select WX Overlay. When the weather overlay is enabled, the softkey will display "NEXRAD".
- \[MFD\] The wind display in the main navigational map will no longer show a bearing (arrow) if wind speed is less than 1 kt. The display will also now show NO WIND DATA if the aircraft is not moving.
- \[NavMap\] Increased maximum range of the navigational map to 1000 NM.
- \[NavMap\] Added the ability to change navigational map orientation to either Heading Up (the new default), Track Up, or North Up.
  - When Heading Up or Track Up is selected, the map will center itself slightly ahead of the aircraft along the current heading/track in order to increase the visible range of the map ahead of the aircraft.
  - To change this setting for the main navigational map, navigate to MFD Home -> Map Settings -> Map Orientation.
  - To change this setting for the PFD inset map, navigate to PFD Home -> PFD Map Settings -> Map Orientation.
- \[NavMap\] Added the ability to choose between four declutter (detail) settings for the navigational map.
  - The available declutter levels are: **None**: All map elements visible, **DCLTR 1**: Roads and cities decluttered, **DCLTR 2**: DCLTR 1 plus airways, airspaces, and navaids decluttered, **Least**: Everything decluttered except flight plan waypoints. 
  - To change this setting for the main navigational map, navigate to MFD Home -> Map Settings -> Map Detail.
  - To change this setting for the PFD inset map, navigate to PFD Home -> PFD Map Settings -> Map Detail, _or_ use the PFD softkey menu to navigate to PFD Map Settings, then select Detail.
- \[NavMap\] Added the ability to sync map settings across the main navigational map and the PFD inset maps.
  - Currently it is not possible to independently configure the two PFD inset maps, so the only available sync option is "All". Also, the map settings will automatically sync based on the Map Setting menu from which the syncing was enabled: if enabled through the PFD Map Settings menu, all maps will sync to the PFD inset map; if enabled through the MFD Map Settings menu, all maps will sync to the main navigational map. Functionality may be brought closer to the real G3000 in a future update.
  - To change this setting, navigate to MFD Home -> Map Settings -> Map Sync or PFD Home -> PFD Map Settings -> Map Sync.
- \[NavMap\] Added the ability to set the maximum range at which individual categories of symbols will display on the navigational map and the ability to toggle them off/on entirely. This gives finer control of what is displayed on the map than what DCLTR offers.
  - Currently, toggles and range settings are available for the following symbols: Airspaces (currently only one master setting for all airspaces), Airports (Small, Medium, and Large), VORs, NDBs, and Roads (Highway, Trunk, and Local).
  - To change this setting for the main navigational map, navigate to MFD Home -> Map Settings, then use the tabbed settings on the right side of the screen.
  - To change this setting for the main navigational map, navigate to PFD Home -> PFD Map Settings, then use the tabbed settings on the right side of the screen.
- \[NAV/COM\] The Audio/Radio menu will now display station identifiers in the upper right-hand corner of the frequency box (the right-most column) for NAV1 and NAV2 when they are receiving a valid signal on the active frequency.

**Fixes**
- \[PFD\] Modified PFD softkey menus to be more accurate to the real G3000.
- \[MFD\] The wind display in the main navigational map now shows the correct wind direction instead of being offset by 180 degrees.
- \[MFD\] The navigational data bar will now display distance to the nearest 0.1 NM instead of 1 NM for distances less than 100 NM.
- \[NavMap\] Adjusted formatting and location of the navigational map orientation and range displays to match the real G3000.
- \[NavMap\] Improved drawing of road and airspace graphics in the navigational map. These should update much more smoothly as the map pans/rotates.