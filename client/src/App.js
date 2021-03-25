import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { isLogged, getRole, getRoutesByRole, MARKETINGADMIN, MOTHERPLANTADMIN, SUPERADMIN, WAREHOUSEADMIN, ACCOUNTSADMIN } from './utils/constants';
import { getMainPathname, resetTrackForm } from './utils/Functions';
import Login from './UI/auth/Login';
import Products from './UI/products';
import Transport from './UI/transport';
import Customers from './UI/customers';
import Dispatches from './UI/dispatches';
import Staff from './UI/employees/Staff';
import PageLayout from './UI/page-layout';
import AddAccount from './UI/accounts/add';
import ManagePlant from './UI/plants/manage';
import Drivers from './UI/employees/Drivers';
import Distributors from './UI/distributors';
import ViewAccount from './UI/accounts/view';
import Warehouses from './UI/plants/Warehouses';
import NoContent from './components/NoContent';
import Invoices from './UI/invoices/super-admin';
import QualityControl from './UI/quality-control';
import WarehouseStock from './UI/stock/warehouse';
import ManageEmployee from './UI/employees/manage';
import ApproveAccount from './UI/accounts/approve';
import Materials from './UI/materials/super-admin';
import Motherplants from './UI/plants/Motherplants';
import MotherplantStock from './UI/stock/motherplant';
import WarehouseInvoices from './UI/invoices/warehouse';
import AccountsDashboard from './UI/accounts/dashboard';
import ReturnEmptyCans from './UI/empty-cans/warehouse';
import EditInvoice from './UI/invoices/super-admin/edit';
import ManageDistributor from './UI/distributors/manage';
import WarehouseDashboard from './UI/dashboard/warehouse';
import ReceivedEmptyCans from './UI/empty-cans/motherplant';
import SuperAdminDashboard from './UI/dashboard/super-admin';
import ManageInvoices from './UI/invoices/super-admin/manage';
import MotherplantDashboard from './UI/dashboard/motherplant';
import MotherplantMaterials from './UI/materials/motherplant';
import DeliveredDC from './UI/invoices/super-admin/delivered-dc';

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

   const dashboardAuth = () => {
      const isUser = isLogged()
      if (!isUser) return <Redirect to='/' />
      else {
         const role = getRole()
         if (role === MARKETINGADMIN) return <Redirect to='/manage-accounts' />
         else if (role === WAREHOUSEADMIN) return <WarehouseDashboard />
         else if (role === MOTHERPLANTADMIN) return <MotherplantDashboard />
         else if (role === SUPERADMIN) return <SuperAdminDashboard />
         else if (role === ACCOUNTSADMIN) return <Redirect to='/customers' />
         return <NoContent content='Screen Not designed for your role' />
      }
   }

   const loginAuth = () => {
      const isUser = isLogged()
      if (!isUser) return <Login />
      else return <Redirect to='/dashboard' />
   }

   const noMatchAuth = () => {
      const isUser = isLogged()
      if (!isUser) return <Redirect to='/' />
      return <NoContent content='Page Not found' />
   }

   const Unauthorized = () => {
      const isUser = isLogged()
      if (!isUser) return <Redirect to='/' />
      else return <NoContent content="Access denied." />
   }

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
                  <Route path='/manage-materials' render={byRole(<MotherplantMaterials />)} />
                  <Route path='/manage-routes' render={byRole(<Transport />)} />
                  <Route path='/manage-return-cans' render={byRole(<ReceivedEmptyCans />)} />
                  <Route path='/manage-invoices/dc-list/:invoiceId' render={byRole(<DeliveredDC />)} />
                  <Route path='/manage-invoices/manage' render={byRole(<ManageInvoices />)} />
                  <Route path='/manage-invoices/:active?' render={byRole(<WarehouseInvoices />)} />
                  <Route path='/manage-empty-cans' render={byRole(<ReturnEmptyCans />)} />
                  <Route path='/manage-stock/staff/:employeeId' render={byRole(<ManageEmployee isDriver />)} />
                  <Route path='/manage-stock/:active?' render={byRole(<WarehouseStock />)} />
                  <Route path='/materials' render={byRole(<Materials />)} />
                  <Route path='/staff/manage/:employeeId' render={byRole(<ManageEmployee />)} />
                  <Route path='/drivers/manage/:employeeId' render={byRole(<ManageEmployee isDriver />)} />
                  <Route path='/distributors/manage/:distributorId' render={byRole(<ManageDistributor />)} />
                  <Route path='/motherplants/manage/:plantId' render={byRole(<ManagePlant />)} />
                  <Route path='/warehouses/manage/:plantId' render={byRole(<ManagePlant />)} />
                  <Route path='/staff' render={byRole(<Staff />)} />
                  <Route path='/routes' render={byRole(<Transport />)} />
                  <Route path='/drivers' render={byRole(<Drivers />)} />
                  <Route path='/invoices/manage' render={byRole(<ManageInvoices />)} />
                  <Route path='/invoices/dc-list/:invoiceId' render={byRole(<DeliveredDC />)} />
                  <Route path='/invoices/edit/:invoiceId' render={byRole(<EditInvoice />)} />
                  <Route path='/invoices/:active?' render={byRole(<Invoices />)} />
                  <Route path='/products' render={byRole(<Products />)} />
                  <Route path='/distributors' render={byRole(<Distributors />)} />
                  <Route path='/motherplants' render={byRole(<Motherplants />)} />
                  <Route path='/warehouses' render={byRole(<Warehouses />)} />
                  <Route path='/customers/add-account' render={byRole(<AddAccount />)} />
                  <Route path='/customers/approval/:accountId' render={byRole(<ApproveAccount />)} />
                  <Route path='/customers/manage/:accountId' render={byRole(<ViewAccount />)} />
                  <Route path='/customers/:active?' render={byRole(<Customers />)} />
                  <Route path='/unauthorized' render={Unauthorized} />
                  <Route render={noMatchAuth} />
               </Switch>
            </PageLayout>
         </Switch>
      </Router>
   );
}

export default App;
