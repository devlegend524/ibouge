import React, { useState, useRef, useCallback } from "react";
import InteractiveMap, {
  Source,
  Layer,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl";
import axios from "axios";
import Geocoder from "react-map-gl-geocoder";

import { MAPBOX_TOKEN } from "../../constants";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

const mapStyle =
  "https://api.maptiler.com/maps/positron/style.json?key=RGierAHokphISswP6JTB";
const navControlStyle = {
  cursor: "pointer",
  right: 10,
  bottom: 50,
};
const getControlStyle = {
  cursor: "pointer",
  right: 10,
  bottom: 10,
};
const layerStyle = {
  id: "point",
  type: "circle",
  source: "single-point",
  paint: {
    "circle-radius": 10,
    "circle-color": "#007cbf",
  },
};

const Map = (props) => {
  const [coordinates, setCoordinates] = useState([37.7577, -122.4376]);
  const [locations, setLocation] = useState({
    coordinates: [],
    bbox: [],
    addrs1: "",
    addrs2: "",
    country: "",
    state: "",
    city: "",
    zip: "",
  });
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 9,
  });
  const [geojson] = useState({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: coordinates },
      },
    ],
  });

  const _onClick = (event) => {
    const lng = event.lngLat[0];
    const lat = event.lngLat[1];
    console.log("long", lng);
    console.log("lati", lat);
    setCoordinates([lng, lat]);
    const reverseGeocodingURL =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      lng +
      "," +
      lat +
      `.json?access_token=${MAPBOX_TOKEN}`;
    axios.get(reverseGeocodingURL).then(function (response) {
      if (response.data.features.length > 0) {
        setLocation({
          coordinates: coordinates,
          bbox: [],
          addrs1: response.data.features[0].place_name,
          addrs2: response.data.features[0].context[1].text,
          country: response.data.features[0].context[4].text,
          state: response.data.features[0].context[3].text,
          city: response.data.features[0].context[2].text,
          zip: response.data.features[0].context[0].text,
        });
        props.saveSelection(locations);
      }

      handleViewportChange({
        latitude: lat,
        longitude: lng,
        zoom: 9,
      });
    });
  };
  const mapRef = useRef();

  const handleViewportChange = useCallback((newViewport) => {
    setViewport(newViewport);
  }, []);
  const handleGeocoderViewportChange = useCallback((newViewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  }, []);
  return (
    <InteractiveMap
      {...viewport}
      ref={mapRef}
      width={props.width}
      height={props.height}
      mapStyle={mapStyle}
      onViewportChange={handleGeocoderViewportChange}
      onClick={(e) => _onClick(e)}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      <Geocoder
        mapRef={mapRef}
        onViewportChange={handleGeocoderViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        position="top-right"
      />
      <Source id="single-point" type="geojson" data={geojson}>
        <Layer {...layerStyle} />
      </Source>
      <NavigationControl style={navControlStyle} />
      <GeolocateControl style={getControlStyle} />
    </InteractiveMap>
  );
};

export default Map;
