import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Login from './UI/Login';
import BiboWarehouse from './UI/Bibo_Warehouse_Stock Inventory';
import AddCustomer from './UI/customer/AddCustomer';
import AccountsDashboard from './UI/accounts/dashboard';
import ViewAccount from './UI/accounts/view';
import AddAccount from './UI/accounts/add';
import NoContent from './components/NoContent';
import PageLayout from './UI/page-layout';
import './App.css';

const App = () => {
   return (
      <Router>
         <Route exact path='/' component={Login} />
         <PageLayout>
            <Switch>
               <Route path='/addcustomer' render={(props) => requireAuth(<AddCustomer {...props} />)} />
               <Route path='/add-customer' render={() => requireAuth(<AddAccount />)} />
               <Route path='/bibowarehouse' render={(props) => requireAuth(<BiboWarehouse {...props} />)} />
               <Route path='/customerDashboard' render={() => requireAuth(<NoContent content='Design is in progress' />)} />
               <Route path='/dashboard' render={() => requireAuth(<NoContent content='Design is in progress' />)} />
               <Route path='/manage-accounts/add-account' render={() => requireAuth(<AddAccount />)} />
               <Route path='/manage-accounts/:accountId' render={() => requireAuth(<ViewAccount />)} />
               <Route path='/manage-accounts' render={() => requireAuth(<AccountsDashboard />)} />
               <Route path='/*' render={() => redirectAuth()} />
            </Switch>
         </PageLayout>
      </Router>
   );
}

const requireAuth = (Component) => {
   const authenticated = JSON.parse(sessionStorage.getItem('isLogged'))
   if (authenticated) return Component
   else return <Redirect to="/" />
};

const redirectAuth = () => {
   const authenticated = JSON.parse(sessionStorage.getItem('isLogged'))
   if (authenticated) return <Redirect to="/bibowarehouse" />
   else return <Redirect to="/" />
}

export default App;
