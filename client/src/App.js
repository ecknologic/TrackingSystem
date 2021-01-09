import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { getRole, MARKETINGADMIN, MOTHERPLANTADMIN, SUPERADMIN, WAREHOUSEADMIN } from './utils/constants';
import Login from './UI/auth/Login';
import Customers from './UI/customers';
import Dispatches from './UI/dispatches';
import PageLayout from './UI/page-layout';
import AddAccount from './UI/accounts/add';
import ViewAccount from './UI/accounts/view';
import NoContent from './components/NoContent';
import QualityControl from './UI/quality-control';
import WarehouseStock from './UI/stock/warehouse';
import { resetTrackForm } from './utils/Functions';
import ApproveAccount from './UI/accounts/approve';
import MotherplantStock from './UI/stock/motherplant';
import AccountsDashboard from './UI/accounts/dashboard';
import WarehouseMaterials from './UI/materials/warehouse';
import MotherplantMaterials from './UI/materials/motherplant';

const App = () => {

   useEffect(() => {
      resetTrackForm()
   }, [])

   return (
      <Router>
         <Route exact path='/' component={Login} />
         <PageLayout>
            <Switch>
               <Route path='/quality-control' render={requireAuth(<QualityControl />)} />
               <Route path='/stock-details' render={requireAuth(<MotherplantStock />)} />
               <Route path='/dispatches' render={requireAuth(<Dispatches />)} />
               {/* <Route path='/materials' render={requireAuth(<MotherplantMaterials />)} /> */}
               <Route path='/materials' render={requireAuth(<WarehouseMaterials />)} />
               <Route path='/quality-control' render={requireAuth(<NoContent content='Design is in progress' />)} />
               <Route path='/manage-stock' render={requireAuth(<WarehouseStock />)} />
               <Route path='/manage-accounts/add-account' render={requireAuth(<AddAccount />)} />
               <Route path='/manage-accounts/:accountId' render={requireAuth(<ViewAccount />)} />
               <Route path='/manage-accounts' render={requireAuth(<AccountsDashboard />)} />
               <Route path='/add-customer' render={requireAuth(<AddAccount />)} />
               <Route path='/customers/add-account' render={requireAuth(<AddAccount />)} />
               <Route path='/customers/approval/:accountId' render={requireAuth(<ApproveAccount />)} />
               <Route path='/customers/manage/:accountId' render={requireAuth(<ViewAccount />)} />
               <Route path='/customers' render={requireAuth(<Customers />)} />
               <Route path='/customerDashboard' render={requireAuth(<NoContent content='Design is in progress' />)} />
               <Route path='/manage-routes' render={requireAuth(<NoContent content='Design is in progress' />)} />
               <Route path='/reports' render={requireAuth(<NoContent content='Design is in progress' />)} />
               <Route path='/dashboard' render={renderByRole()} />
               <Route path='/*' render={redirectAuth()} />
            </Switch>
         </PageLayout>
      </Router>
   );
}

const requireAuth = (Component) => (props) => {
   const isLogged = JSON.parse(sessionStorage.getItem('isLogged'))
   if (!isLogged) return <Redirect to="/" />
   else {
      const { match: { path } } = props
      // console.log('path>>>', path)
      const role = getRole()
      return Component
   }
}

const redirectAuth = (Component) => (props) => {
   const authenticated = JSON.parse(sessionStorage.getItem('isLogged'))
   if (authenticated) return <Redirect to="/dashboard" />
   else return <Redirect to="/" />
}

const renderByRole = (Component) => (props) => {
   const authenticated = JSON.parse(sessionStorage.getItem('isLogged'))
   if (authenticated) {
      const role = getRole()
      if (role == MARKETINGADMIN) return <Redirect to='/manage-accounts' />
      else if (role == WAREHOUSEADMIN) return <Redirect to='/manage-stock' />
      else if (role == MOTHERPLANTADMIN) return <Redirect to='/stock-details' />
      else if (role == SUPERADMIN) return <Redirect to='/customers' />
      return <NoContent content='Screen Not designed for your role' />
   }
   else return <Redirect to="/" />
}

export default App;
