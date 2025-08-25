import React, { version } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './state/store';
import SocketProvider from './SocketContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <SocketProvider>
      <App />
    </SocketProvider>
  </PersistGate>
</Provider>,
)
