import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { getRole, MARKETINGADMIN, WAREHOUSEADMIN } from './utils/constants';
import BiboWarehouse from './UI/Bibo_Warehouse_Stock Inventory';
import AccountsDashboard from './UI/accounts/dashboard';
import NoContent from './components/NoContent';
import ViewAccount from './UI/accounts/view';
import AddAccount from './UI/accounts/add';
import PageLayout from './UI/page-layout';
import StockDashboard from './UI/stock';
import Login from './UI/Login';
import './App.css';
import { message } from 'antd';

const App = () => {
   return (
      <Router>
         <Route exact path='/' component={Login} />
         <PageLayout>
            <Switch>
               <Route path='/bibowarehouse' render={(props) => requireAuth(<BiboWarehouse {...props} />)} />
               <Route path='/manage-stock' render={() => requireAuth(<StockDashboard />)} />
               <Route path='/manage-accounts/add-account' render={() => requireAuth(<AddAccount />)} />
               <Route path='/manage-accounts/:accountId' render={() => requireAuth(<ViewAccount />)} />
               <Route path='/manage-accounts' render={() => requireAuth(<AccountsDashboard />)} />
               <Route path='/add-customer' render={() => requireAuth(<AddAccount />)} />
               <Route path='/customerDashboard' render={() => requireAuth(<NoContent content='Design is in progress' />)} />
               <Route path='/reports' render={() => requireAuth(<NoContent content='Design is in progress' />)} />
               <Route path='/dashboard' render={() => renderByRole()} />
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

const renderByRole = () => {
   const authenticated = JSON.parse(sessionStorage.getItem('isLogged'))
   if (authenticated) {
      const role = getRole()
      if (role == MARKETINGADMIN) return <NoContent content='Design is in progress' />
      else if (role == WAREHOUSEADMIN) return <BiboWarehouse />
      return <NoContent content='Screen Not designed for your role' />
   }
   else return <Redirect to="/" />
}

export default App;
