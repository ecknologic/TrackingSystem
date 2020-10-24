import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Login from './UI/Login';
import LayoutPage from './UI/Layout';
import BiboWarehouse from './UI/Bibo_Warehouse_Stock Inventory'
import './App.css';
const requireAuth = (Component) => {
  const authenticated = JSON.parse(sessionStorage.getItem('isLogged'))
  if (authenticated) return Component
  else return <Redirect to="/" />
};
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/bibowarehouse' render={(props) => requireAuth(<BiboWarehouse {...props} />)} />
          {/* <Route exact path='/bibowarehouses' component={BiboWarehouse} /> */}
          <Route exact path='/*' component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;