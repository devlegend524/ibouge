import React, {useState, useEffect} from 'react'; //{useState, useRef, useCallback}
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import L from 'leaflet';
import {
  MapContainer,
  CircleMarker,
  TileLayer,
  Popup,
  LayersControl,
  ScaleControl,
  useMapEvents,
} from 'react-leaflet';
import GeoCoder from '../../components/GeoCoder';
import 'leaflet/dist/leaflet.css';

const MapView = (props) => {
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const [coordinates, setCoordinates] = useState(
    auth.sess.location.coordinates.length > 0
      ? auth.sess.location.coordinates
      : [37.7577, -122.4376]
  );
  const [geoData, setGeoData] = useState(props.data);
  const [mapBound, setMapBound] = useState({
    nE_lat: '',
    nE_lng: '',
    sW_lat: '',
    sW_lng: '',
  });
  useEffect(() => {
    setGeoData(props.data);
  }, [props.data]);
  const filterData = () => {
    let filtered;
    if (props.data.length > 0 && mapBound.nE_lat !== '') {
      filtered = props.data.filter((item) => {
        return (
          item.geometry.coordinates[0] > mapBound.sW_lat &&
          item.geometry.coordinates[0] < mapBound.nE_lat &&
          item.geometry.coordinates[1] > mapBound.sW_lng &&
          item.geometry.coordinates[1] < mapBound.nE_lng
        );
      });
      setGeoData(filtered);
      props.handleFilteredData(filtered);
    }
  };
  useEffect(() => {
    filterData();
  }, [mapBound]);

  const MyComponent = () => {
    let mapBound;
    const map = useMapEvents({
      click: (e) => {
        map.setView(e.latlng);
        map.flyTo(e.latlng);
        map.locate();
        mapBound = map.getBounds();
        setMapBound({
          nE_lat: mapBound._northEast.lat,
          nE_lng: mapBound._northEast.lng,
          sW_lat: mapBound._southWest.lat,
          sW_lng: mapBound._southWest.lng,
        });
      },
      locationfound: (location) => {
        console.log('location found:', location);
      },
      moveend: (event) => {
        mapBound = map.getBounds();
        setMapBound({
          nE_lat: mapBound._northEast.lat,
          nE_lng: mapBound._northEast.lng,
          sW_lat: mapBound._southWest.lat,
          sW_lng: mapBound._southWest.lng,
        });
      },
    });
    map.zoomControl.setPosition('bottomright');
    return null;
  };
  const onClickCircle = (userId) => {
    history.push(`profile/${userId}`);
  };
  return (
    <>
      <MapContainer
        style={{height: props.height, width: '100%', marginTop: '58px'}}
        zoom={9}
        center={coordinates}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Color Map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="GrayScale Map">
            <TileLayer url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
        </LayersControl>
        {geoData &&
          geoData.map((item, k) => {
            if (item.geometry.coordinates.length > 0) {
              return (
                <CircleMarker
                  key={k}
                  center={item.geometry.coordinates}
                  radius={5}
                  color={
                    props.type === 'users'
                      ? 'blue'
                      : props.type === 'blogs'
                      ? 'red'
                      : 'green'
                  }
                  fillOpacity={0.8}
                  stroke={false}
                  onClick={(e) => onClickCircle(item.properties.user_id)}
                >
                  <Popup>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.properties.description,
                      }}
                    ></div>
                  </Popup>
                </CircleMarker>
              );
            }
          })}
        <ScaleControl />
        <GeoCoder />
        <MyComponent />
      </MapContainer>
    </>
  );
};

export default MapView;
