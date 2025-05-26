import React from 'react';
import Navigation from './src/navigation/Navigation';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persister, store} from './src/store/store';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <Navigation />
      </PersistGate>
    </Provider>
  );
};

export default App;
