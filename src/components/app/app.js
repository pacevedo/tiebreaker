import React from 'react';
import { Provider } from 'react-redux'
import store from '../../redux/store'
import './app.css';
import FixturesContainer from '../fixtures/fixturesContainer';
import FilterContainer from '../filter/filterContainer';
import CombinationContainer from '../combinations/combinationContainer';
import ErrorBoundary from '../errors/errorBoundary';

function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <ErrorBoundary>
        <FixturesContainer />
        <FilterContainer/>
        <CombinationContainer />
      </ErrorBoundary>
    </div>
    </Provider>
  );
}

export default App;
