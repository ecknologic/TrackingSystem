import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './UI/Login';
import LayoutPage from './UI/Layout';
import BiboWarehouse from './UI/Bibo_Warehouse_Stock Inventory'
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/' component={Login} />
         <LayoutPage>
          <Route exact path='/bibowarehouse' component={BiboWarehouse} />
          {/* <Route exact path='/bibowarehouses' component={BiboWarehouse} /> */}
          </LayoutPage>
        </Switch>
      </Router>
    </div>
  );
}

export default App;