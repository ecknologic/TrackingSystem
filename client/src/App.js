import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { getRoutesByRole, MARKETINGADMIN, MOTHERPLANTADMIN, SUPERADMIN, WAREHOUSEADMIN, ACCOUNTSADMIN, MARKETINGMANAGER } from './utils/constants';
import { getMainPathname, resetTrackForm } from './utils/Functions';
import Vendors from './UI/vendors';
import Login from './UI/auth/Login';
import Products from './UI/products';
import Receipts from './UI/receipts';
import Transport from './UI/transport';
import Customers from './UI/customers';
import Dispatches from './UI/dispatches';
import Staff from './UI/employees/Staff';
import PageLayout from './UI/page-layout';
import AddAccount from './UI/accounts/add';
import useUser from './utils/hooks/useUser';
import ResetPassword from './UI/auth/Reset';
import ManagePlant from './UI/plants/view';
import ManageVendor from './UI/vendors/view';
import Drivers from './UI/employees/Drivers';
import ForgotPassword from './UI/auth/Forgot';
import Distributors from './UI/distributors';
import ViewAccount from './UI/accounts/view';
import NoContent from './components/NoContent';
import Warehouses from './UI/plants/Warehouses';
import Invoices from './UI/invoices/super-admin';
import QualityControl from './UI/quality-control';
import WarehouseStock from './UI/stock/warehouse';
import ManageEmployee from './UI/employees/view';
import ApproveAccount from './UI/accounts/approve';
import Materials from './UI/materials/super-admin';
import ClosedCustomers from './UI/closed-customers';
import Motherplants from './UI/plants/Motherplants';
import MotherplantStock from './UI/stock/motherplant';
import ManageDistributor from './UI/distributors/view';
import WarehouseInvoices from './UI/invoices/warehouse';
import VisitedCustomers from './UI/visited-customers';
import ReturnEmptyCans from './UI/empty-cans/warehouse';
import { SocketProvider } from './modules/socketContext';
import EditInvoice from './UI/invoices/super-admin/edit';
import MarketingDashboard from './UI/dashboard/marketing';
import WarehouseDashboard from './UI/dashboard/warehouse';
import ReceivedEmptyCans from './UI/empty-cans/motherplant';
import NewCustomersReport from './UI/reports/new-customers';
import SuperAdminDashboard from './UI/dashboard/super-admin';
import AccountsAdminDashboard from './UI/dashboard/accounts';
import ManageInvoices from './UI/invoices/super-admin/manage';
import MotherplantDashboard from './UI/dashboard/motherplant';
import SalesAdminDashboard from './UI/dashboard/sales-admin';
import ResourceNotFound from './components/ResourceNotFound';
import MotherplantMaterials from './UI/materials/motherplant';
import ManageClosedCustomer from './UI/closed-customers/view';
import ManageVisitedCustomer from './UI/visited-customers/view';
import DeliveredDC from './UI/invoices/super-admin/delivered-dc';
import WarehouseStockRequest from './UI/stock-request/warehouse';
import ClosedCustomersReport from './UI/reports/closed-customers';
import DCwiseDispatchesReport from './UI/reports/dcwise-dispatches';
import { StatusFilterProvider } from './modules/statusFilterContext';
import MotherplantStockRequest from './UI/stock-request/motherplant';
import DaywiseDispatchesReport from './UI/reports/daywise-dispatches';
import InactiveCustomersReport from './UI/reports/inactive-customers';
import { CustomerFilterProvider } from './modules/customerFilterContext';
import DispensersViabilityReport from './UI/reports/dispensers-viability';
import PartywiseDispatchesReport from './UI/reports/partywise-dispatches';
import MarketingPerformanceReport from './UI/reports/marketing-performance';
import ProductwiseDispatchesReport from './UI/reports/productwise-dispatches';
import CollectionPerformanceReport from './UI/reports/collection-performance';
import { MultiStatusFilterProvider } from './modules/multiStatusFilterContext';


const App = () => {
   const { isLogged: isUser, ROLE } = useUser()

   useEffect(() => {
      resetTrackForm()
   }, [])

   const byRole = (Component) => (props) => {
      if (!isUser) return <Redirect to='/' />
      else {
         const { match: { path } } = props
         const mainPath = getMainPathname(path)
         const routes = getRoutesByRole(ROLE)
         const pass = routes.includes(mainPath)
         if (!pass)
            return <Redirect to="/unauthorized" />
         return Component
      }
   }

   const dashboardAuth = () => {
      if (!isUser) return <Redirect to='/' />
      else {
         if (ROLE === MARKETINGADMIN) return <SalesAdminDashboard />
         else if (ROLE === MARKETINGMANAGER) return <MarketingDashboard />
         else if (ROLE === WAREHOUSEADMIN) return <WarehouseDashboard />
         else if (ROLE === MOTHERPLANTADMIN) return <MotherplantDashboard />
         else if (ROLE === SUPERADMIN) return <SuperAdminDashboard />
         else if (ROLE === ACCOUNTSADMIN) return <AccountsAdminDashboard />
         return <NoContent content='Screen Not designed for your role' />
      }
   }

   const loginAuth = () => {
      if (!isUser) return <Login />
      else return <Redirect to='/dashboard' />
   }

   const forgotAuth = () => {
      if (!isUser) return <ForgotPassword />
      else return <Redirect to='/' />
   }

   const resetAuth = () => {
      if (!isUser) return <ResetPassword />
      else return <Redirect to='/' />
   }

   const noMatchAuth = () => {
      if (!isUser) return <Redirect to='/' />
      return <ResourceNotFound />
   }

   const Unauthorized = () => {
      if (!isUser) return <Redirect to='/' />
      else return <NoContent content="Access denied." />
   }

   return (
      <Router>
         <SocketProvider>
            <CustomerFilterProvider>
               <MultiStatusFilterProvider>
                  <StatusFilterProvider>
                     <Switch>
                        <Route exact path='/reset-password' render={resetAuth} />
                        <Route exact path='/forgot-password' render={forgotAuth} />
                        <Route exact path='/' render={loginAuth} />
                        <PageLayout>
                           <Switch>
                              <Route path='/dashboard' render={dashboardAuth} />
                              <Route path='/add-customer' render={byRole(<AddAccount />)} />
                              <Route path='/manage-qc' render={byRole(<QualityControl />)} />
                              <Route path='/manage-production' render={byRole(<MotherplantStock />)} />
                              <Route path='/manage-dispatches' render={byRole(<Dispatches />)} />
                              <Route path='/manage-materials' render={byRole(<MotherplantMaterials />)} />
                              <Route path='/request-stock' render={byRole(<WarehouseStockRequest />)} />
                              <Route path='/manage-request-stock' render={byRole(<MotherplantStockRequest />)} />
                              <Route path='/manage-routes' render={byRole(<Transport />)} />
                              <Route path='/manage-return-cans' render={byRole(<ReceivedEmptyCans />)} />
                              <Route path='/manage-invoices/dc-list/:invoiceId' render={byRole(<DeliveredDC />)} />
                              <Route path='/manage-invoices/manage' render={byRole(<ManageInvoices />)} />
                              <Route path='/manage-invoices/:tab?' render={byRole(<WarehouseInvoices />)} />
                              <Route path='/manage-empty-cans' render={byRole(<ReturnEmptyCans />)} />
                              <Route path='/manage-stock/:tab?' render={byRole(<WarehouseStock />)} />
                              <Route path='/materials' render={byRole(<Materials />)} />
                              <Route path='/staff/manage/:employeeId' render={byRole(<ManageEmployee />)} />
                              <Route path='/drivers/manage/:employeeId' render={byRole(<ManageEmployee isDriver />)} />
                              <Route path='/distributors/manage/:distributorId' render={byRole(<ManageDistributor />)} />
                              <Route path='/motherplants/manage/:plantId' render={byRole(<ManagePlant />)} />
                              <Route path='/warehouses/manage/:plantId' render={byRole(<ManagePlant />)} />
                              <Route path='/staff/:tab?/:page?' render={byRole(<Staff />)} />
                              <Route path='/routes' render={byRole(<Transport />)} />
                              <Route path='/drivers/:tab?/:page?' render={byRole(<Drivers />)} />
                              <Route path='/warehouse-staff/manage/:employeeId' render={byRole(<ManageEmployee isDriver />)} />
                              <Route path='/warehouse-staff/:tab?/:page?' render={byRole(<Drivers />)} />
                              <Route path='/invoices/manage' render={byRole(<ManageInvoices />)} />
                              <Route path='/invoices/dc-list/:invoiceId' render={byRole(<DeliveredDC />)} />
                              <Route path='/invoices/edit/:invoiceId' render={byRole(<EditInvoice />)} />
                              <Route path='/invoices/:tab?' render={byRole(<Invoices />)} />
                              <Route path='/receipts' render={byRole(<Receipts />)} />
                              <Route path='/products' render={byRole(<Products />)} />
                              <Route path='/distributors/:tab?/:page?' render={byRole(<Distributors />)} />
                              <Route path='/motherplants' render={byRole(<Motherplants />)} />
                              <Route path='/warehouses' render={byRole(<Warehouses />)} />
                              <Route path='/customer-accounts/manage/:accountId' render={byRole(<ViewAccount />)} />
                              <Route path='/customers/add-account' render={byRole(<AddAccount />)} />
                              <Route path='/customer-accounts/add-account' render={byRole(<AddAccount />)} />
                              <Route path='/customers/approval/:accountId' render={byRole(<ApproveAccount />)} />
                              <Route path='/inactive-customers-report' render={byRole(<InactiveCustomersReport />)} />
                              <Route path='/marketing-performance-report' render={byRole(<MarketingPerformanceReport />)} />
                              <Route path='/customers/manage/:accountId/:tab?/:page?' render={byRole(<ViewAccount />)} />
                              <Route path='/customers/:tab?/:page?' render={byRole(<Customers />)} />
                              <Route path='/new-customers-report' render={byRole(<NewCustomersReport />)} />
                              <Route path='/closed-customers-report' render={byRole(<ClosedCustomersReport />)} />
                              <Route path='/dispensers-viability-report' render={byRole(<DispensersViabilityReport />)} />
                              <Route path='/collection-performance-report' render={byRole(<CollectionPerformanceReport />)} />
                              <Route path='/daywise-dispatches-report' render={byRole(<DaywiseDispatchesReport />)} />
                              <Route path='/partywise-dispatches-report' render={byRole(<PartywiseDispatchesReport />)} />
                              <Route path='/dcwise-dispatches-report' render={byRole(<DCwiseDispatchesReport />)} />
                              <Route path='/productwise-dispatches-report' render={byRole(<ProductwiseDispatchesReport />)} />
                              <Route path='/vendors/manage/:vendorId' render={byRole(<ManageVendor />)} />
                              <Route path='/vendors/:tab?/:page?' render={byRole(<Vendors />)} />
                              <Route path='/closed-customers/manage/:closingId' render={byRole(<ManageClosedCustomer />)} />
                              <Route path='/closed-customers/:tab?/:page?' render={byRole(<ClosedCustomers />)} />
                              <Route path='/visited-customers/manage/:enquiryId' render={byRole(<ManageVisitedCustomer />)} />
                              <Route path='/visited-customers/:tab?/:page?' render={byRole(<VisitedCustomers />)} />
                              <Route path='/unauthorized' render={Unauthorized} />
                              <Route render={noMatchAuth} />
                           </Switch>
                        </PageLayout>
                     </Switch>
                  </StatusFilterProvider>
               </MultiStatusFilterProvider>
            </CustomerFilterProvider>
         </SocketProvider>
      </Router>
   );
}

export default App;
