import React, {useState, useEffect} from 'react'; //{useState, useRef, useCallback}
import L from 'leaflet';
import {MapContainer, TileLayer, useMapEvents} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

const MapView = (props) => {
  const [coordinates, setCoordinates] = useState([37.7577, -122.4376]);
  const [locations, setLocation] = useState({
    coordinates: [],
    bbox: [],
    addrs1: '',
    addrs2: '',
    country: '',
    state: '',
    city: '',
    zip: '',
  });
  useEffect(() => {
    props.saveSelection(locations);
  }, [locations]);
  const MyComponent = () => {
    const map = useMapEvents({
      click: (e) => {
        map.setView(e.latlng);
        map.locate();
        new L.CircleMarker(e.latlng, {
          radius: 5,
          fillColor: 'blue',
          width: 0.5,
          stroke: 'black',
          color: '#000080',
          fillOpacity: 0.5,
        }).addTo(map);
        setLocation({
          coordinates: [e.latlng.lat, e.latlng.lng],
          bbox: map.getBounds(),
        });
        props.saveSelection(locations);
      },
      locationfound: (location) => {
        console.log('location found:', location);
      },
    });
    return null;
  };
  return (
    <>
      <MapContainer
        style={{height: '300px', width: '100%'}}
        zoom={9}
        center={coordinates}
      >
        <MyComponent />
        <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </>
  );
};

export default MapView;
