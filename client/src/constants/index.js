import L from 'leaflet';
import {loadStripe} from '@stripe/stripe-js';
let hostName = 'ws://www.ibouge.com';
if (
  document.location.hostname === 'localhost' ||
  document.location.hostname === '127.0.0.1'
) {
  hostName = document.location.hostname + ':5000';
}
export const FACEBOOK_AUTH_LINK = `${hostName}/auth/facebook`;
export const GOOGLE_AUTH_LINK = `${hostName}/auth/google`;
export const TWITTER_AUTH_LINK = `${hostName}/auth/twitter`;
export const MAPBOX_TOKEN =
  'pk.eyJ1IjoiaWJvdWdlIiwiYSI6ImNqY2wzaXJ5YTAycWIzM2pyb3JhN20yenkifQ.jhimhHWkb-6GD3Tq8bvCKA';
export const stripePromise = loadStripe(
  'pk_test_51Ie00NJxDIKJqiU8h1FRs9ULUyTRq7x9kzpXFLL4YRg9CLC1cVnUyDn16OioX3hJ1fUCyhHAJ1qBTCFYsmEdT8Hf00t5v2me9N'
);

export const socketUrl = 'http://' + hostName;
export default L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png',
});
