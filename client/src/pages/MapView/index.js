import React, { useState , useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import requireAuth from '../../hoc/requireAuth';
import MapChart  from '../../components/MapChart'
import { setTitle } from '../../actions/commonAction'

import * as Highcharts from 'highcharts';
import mapData from "@highcharts/map-collection/custom/world-eckert3-highres.geo.json";
// Load the exporting module.
import './styles.scss';

import MapModule from 'highcharts/modules/map';
MapModule(Highcharts);

const MapView = () => {
  const history = useHistory();
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setTitle('Map-Overview'))
  }, [])
  const auth = useSelector(state => state.auth);
  const data = Highcharts.geojson(mapData);
  data.forEach(function (i) {
    i.drilldown = i.properties["hc-key"];
    i.value = i;
  });
  const [open, setOpen] = useState(false)
  const closeModal = () => setOpen(false)
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Instantiate the map
  const mapOptions = {
    credits: {
      enabled: false,
    },

    tooltip: {
      borderColor: "#acadb3",
      backgroundColor: "#F7F8FA",
      borderRadius: 20,
      borderWidth: 1,
      formatter: function () {
        return this.point.name;
      },
    },
    title: {
      text: null,
    },
    plotOptions: {
      series: {
        events: {
          click: function (event) {
            sessionStorage.countryName = event.point.name;
            sessionStorage.countryISOKey = event.point.drilldown;
            history.push('/mapOSM');
          },
        },
      },
      map: {
        states: {
          hover: {
            color: "#acadb3",
          },
        },

        color: "#DFE0E6",
        showInLegend: false,
      },
    },

    series: [
      {
        data: data,
        dataLabels: {
          enabled: false,
        },
      },
    ],
  };
  return (
    <>
      <div className="home-page">
        {!auth.isAuthenticated ? (
          <div>
            <p>
              Welcome guest!{' '}
              <Link className="bold" to="/login">
                Log in
              </Link>{' '}
              or{' '}
              <Link className="bold" to="/register">
                Register
              </Link>
            </p>
          </div>
        ) : (
          <>
            <Navbar />
            <div className="w-100 h-100-120"  id="countryModalDiv">
                <MapChart 
                  options={mapOptions} 
                  highcharts={Highcharts} 
                  containerProps = {{ className: "chartContainer" }}
                />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default requireAuth(MapView);
