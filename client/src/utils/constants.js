import moment from 'moment';
const user = sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user'));
export const USERID = user && user.id || 1;
export const ROLE = user && user.role || 1;
export const USERNAME = user && user.name || '';
export const WAREHOUSEID = user && user.wareHouse || 1
export const TODAYDATE = moment().format('YYYY-MM-DD');
export const MANDATORY = "Mandatory Field";
export const MARKETINGADMIN = 'SalesAndMarketing'
export const WAREHOUSEADMIN = 'WarehouseAdmin'
