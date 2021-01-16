import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { isLogged, getRole, getRoutesByRole, MARKETINGADMIN, MOTHERPLANTADMIN, SUPERADMIN, WAREHOUSEADMIN } from './utils/constants';
import { getMainPathname, resetTrackForm } from './utils/Functions';
import Login from './UI/auth/Login';
import Products from './UI/products';
import Customers from './UI/customers';
import Dispatches from './UI/dispatches';
import PageLayout from './UI/page-layout';
import Staff from './UI/employees/Staff';
import AddAccount from './UI/accounts/add';
import ViewAccount from './UI/accounts/view';
import ManagePlant from './UI/plants/manage';
import Drivers from './UI/employees/Drivers';
import Warehouses from './UI/plants/Warehouses';
import NoContent from './components/NoContent';
import QualityControl from './UI/quality-control';
import WarehouseStock from './UI/stock/warehouse';
import Motherplants from './UI/plants/Motherplants';
import ManageEmployee from './UI/employees/manage';
import ApproveAccount from './UI/accounts/approve';
import MotherplantStock from './UI/stock/motherplant';
import AccountsDashboard from './UI/accounts/dashboard';
import WarehouseMaterials from './UI/materials/warehouse';
import MotherplantMaterials from './UI/materials/motherplant';

const App = () => {

   useEffect(() => {
      resetTrackForm()
   }, [])

   const byRole = (Component) => (props) => {
      const isUser = isLogged()
      if (!isUser) return <Redirect to='/' />
      else {
         const { match: { path } } = props
         const mainPath = getMainPathname(path)
         const role = getRole()
         const routes = getRoutesByRole(role)
         const pass = routes.includes(mainPath)
         if (!pass)
            return <Redirect to="/unauthorized" />
         return Component
      }
   }

   const dashboardAuth = (props) => {
      const isUser = isLogged()
      if (!isUser) return <Redirect to='/' />
      else {
         const role = getRole()
         if (role === MARKETINGADMIN) return <Redirect to='/manage-accounts' />
         else if (role === WAREHOUSEADMIN) return <Redirect to='/manage-stock' />
         else if (role === MOTHERPLANTADMIN) return <Redirect to='/manage-production' />
         else if (role === SUPERADMIN) return <Redirect to='/customers' />
         return <NoContent content='Screen Not designed for your role' />
      }
   }

   const loginAuth = (props) => {
      const isUser = isLogged()
      if (!isUser) return <Login />
      else return <Redirect to='/dashboard' />
   }

   const noMatchAuth = () => {
      const isUser = isLogged()
      if (!isUser) return <Redirect to='/' />
      return <NoContent content='Page Not found' />
   }

   const isUser = isLogged()

   return (
      <Router>
         <Switch>
            <Route exact path='/' render={loginAuth} />
            <PageLayout>
               <Switch>
                  <Route path='/dashboard' render={dashboardAuth} />
                  <Route path='/manage-accounts/add-account' render={byRole(<AddAccount />)} />
                  <Route path='/manage-accounts/:accountId' render={byRole(<ViewAccount />)} />
                  <Route path='/manage-accounts' render={byRole(<AccountsDashboard />)} />
                  <Route path='/add-customer' render={byRole(<AddAccount />)} />
                  <Route path='/manage-qc' render={byRole(<QualityControl />)} />
                  <Route path='/manage-production' render={byRole(<MotherplantStock />)} />
                  <Route path='/manage-dispatches' render={byRole(<Dispatches />)} />
                  <Route path='/manage-materials' render={byRole(<WarehouseMaterials />)} />
                  <Route path='/manage-stock' render={byRole(<WarehouseStock />)} />
                  <Route path='/materials' render={byRole(<MotherplantMaterials />)} />
                  <Route path='/staff/manage/:employeeId' render={byRole(<ManageEmployee />)} />
                  <Route path='/drivers/manage/:employeeId' render={byRole(<ManageEmployee />)} />
                  <Route path='/motherplants/manage/:plantId' render={byRole(<ManagePlant />)} />
                  <Route path='/warehouses/manage/:plantId' render={byRole(<ManagePlant />)} />
                  <Route path='/staff' render={byRole(<Staff />)} />
                  <Route path='/drivers' render={byRole(<Drivers />)} />
                  <Route path='/products' render={byRole(<Products />)} />
                  <Route path='/motherplants' exact render={byRole(<Motherplants />)} />
                  <Route path='/warehouses' render={byRole(<Warehouses />)} />
                  <Route path='/customers/add-account' render={byRole(<AddAccount />)} />
                  <Route path='/customers/approval/:accountId' render={byRole(<ApproveAccount />)} />
                  <Route path='/customers/manage/:accountId' render={byRole(<ViewAccount />)} />
                  <Route path='/customers' render={byRole(<Customers />)} />
                  <Route path='/unauthorized' component={Unauthorized} />
                  <Route render={noMatchAuth} />
               </Switch>
            </PageLayout>
         </Switch>
      </Router>
   );
}

const Unauthorized = () => {
   return <NoContent content="Access denied." />
}
export default App;
