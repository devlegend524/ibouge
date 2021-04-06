import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import MapboxGeocoder from "react-map-gl-geocoder";

import { MAPBOX_TOKEN }  from '../../constants'
import './styles.scss';

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = MAPBOX_TOKEN;

const MapCustom = (props) => {
  const mapContainer = useRef();
  const [lng, setLng] = useState(-122.4376);
  const [lat, setLat] = useState(37.7577);
  const [zoom, setZoom] = useState(9);

useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/positron/style.json?key=RGierAHokphISswP6JTB',
      center: [lng, lat],
      zoom: zoom
    });
    // add geocoder for users to search the map
    const geoCoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      position: "top-right"
    });
// create a geoLocator to give users their location at their request
    const geoLocator = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    // add geocoder to the map
    map.addControl(geoCoder);

    // add the geoLocator to the bottom right of the map screen
    map.addControl(geoLocator, "bottom-right");

    // adds navigation control for zooming
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    return () => map.remove();
  }, []);

  return (
    <>
      <div className="map-container" ref={mapContainer}  style={{ width: props.width, height: props.height }} />
    </>
  );
};

export default MapCustom;