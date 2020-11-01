import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Login from './UI/Login';
import BiboWarehouse from './UI/Bibo_Warehouse_Stock Inventory';
import AddCustomer from './UI/AddCustomer';
import ManageAccounts from './UI/ManageAccounts';
import AccountsDashboard from './UI/accounts/dashboard';
import ViewAccount from './UI/accounts/view';
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
          <Route path='/accounts/:accountId' component={ViewAccount} />
          <Route path='/accounts' component={AccountsDashboard} />
          <Route exact path='/bibowarehouse' render={(props) => requireAuth(<BiboWarehouse {...props} />)} />
          {/* <Route exact path='/bibowarehouses' component={BiboWarehouse} /> */}
          <Route exact path='/addcustomer' render={(props) => requireAuth(<AddCustomer {...props} />)} />
          <Route exact path='/' component={Login} />
          <Route exact path='/*' render={(props) => redirectAuth(props)} />
        </Switch>
      </Router>
    </div>
  );
}

function redirectAuth(props) {
  const authenticated = JSON.parse(sessionStorage.getItem('isLogged'))
  if (authenticated) return <Redirect to="/bibowarehouse" />
  else return <Redirect to="/" />
}

export default App;
