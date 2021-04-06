import React, { useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapGL, {
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  Popup,
  Marker,
} from "react-map-gl";

import Geocoder from "react-map-gl-geocoder";
import { MAPBOX_TOKEN } from "../../constants";

// load helper
import { getArrayOfGeoJSON } from "../../helpers/utils";

import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

const navControlStyle = {
  right: 10,
  bottom: 50,
};
const getControlStyle = {
  right: 10,
  bottom: 10,
};

export const countiesLayer = {
  id: "user_icon",
  source: "usersIcons",
  type: "circle",
  paint: {
    "circle-radius": 6,
    "circle-color": "#329CEC",
    "circle-opacity": 1,
  },
};
// Highlighted county polygons
export const highlightLayer = {
  id: "counties-highlighted",
  source: "usersIcons",
  type: "circle",
  paint: {
    "circle-radius": 6,
    "circle-color": "#329CEC",
    "circle-opacity": 1,
  },
};

const Map = (props) => {
  const auth = useSelector((state) => state.auth);
  const defaultUsersData = useSelector((state) => state.users);
  const [users] = useState(defaultUsersData.users);

  const [viewport, setViewport] = useState({
    latitude: auth.sess.location?.coordinates[0]
      ? auth.sess.location?.coordinates[0]
      : 37.7577,
    longitude: auth.sess.location?.coordinates[1]
      ? auth.sess.location?.coordinates[1]
      : -122.4376,
    zoom: 12,
  });

  const [geojson, setGeoJson] = useState({
    type: "FeatureCollection",
    features: getArrayOfGeoJSON(users),
  });
  const finalUsers = [];

  const mapRef = useRef();
  const handleViewportChange = useCallback((newViewport) => {
    if (newViewport.longitude > 0) {
      newViewport.longitude = 0;
    }
    setViewport(newViewport);
    // const usersOnMap = mapRef.current.queryRenderedFeatures();
    // if (usersOnMap) {
    //   const uniqueUsers = getUniqueIcons(usersOnMap);
    //   for (let i = 0; i < uniqueUsers.length; i++) {
    //     for (let j = 0; j < users.length; j++) {
    //       if (uniqueUsers[i].properties.user_id === users[j]._id) {
    //         finalUsers.push(users[j]);
    //         break;
    //       }
    //     }
    //   }
    // }
    // setGeoJson({
    //   type: "FeatureCollection",
    //   features: getArrayOfGeoJSON(finalUsers),
    // });
  }, []);

  const handleGeocoderViewportChange = useCallback((newViewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  }, []);
  const [hoverInfo, setHoverInfo] = useState(null);

  const onHover = useCallback((event) => {
    const user = event.features && event.features[0];
    setHoverInfo({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
      countyName: user && user.properties.description,
    });
  }, []);

  const selectedCounty = (hoverInfo && hoverInfo.countyName) || "";
  const filter = useMemo(() => ["in", "user_icon", selectedCounty], [
    selectedCounty,
  ]);

  return (
    <div style={{ height: "90vh" }}>
      <MapGL
        ref={mapRef}
        {...viewport}
        width={props.width}
        height={props.height}
        onViewportChange={handleViewportChange}
        onHover={onHover}
        interactiveLayerIds={["user_icon"]}
        mapStyle="https://api.maptiler.com/maps/positron/style.json?key=RGierAHokphISswP6JTB"
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position="top-right"
        />
        <Source id="usersIcons" type="geojson" data={geojson}>
          <Layer {...countiesLayer} />
          <Layer {...highlightLayer} filter={filter} />
        </Source>
        {selectedCounty && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            className="county-info"
          >
            <div dangerouslySetInnerHTML={{ __html: selectedCounty }}></div>
          </Popup>
        )}
        {/* {markers} */}
        <NavigationControl style={navControlStyle} />
        <GeolocateControl style={getControlStyle} />
      </MapGL>
    </div>
  );
};

export default Map;
