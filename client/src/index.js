import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {PersistGate} from 'redux-persist/lib/integration/react';

import configureStore from './store';
import * as serviceWorker from './serviceWorker';
import App from './App';
import './index.scss';
const store = configureStore();

render(
  <Provider store={store.store}>
    <PersistGate persistor={store.persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
