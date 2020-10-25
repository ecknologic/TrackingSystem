import moment from 'moment';
export const USERID = sessionStorage.getItem('user') && sessionStorage.getItem('user').id || 1;
export const USERNAME = sessionStorage.getItem('user') && sessionStorage.getItem('user').name || '';
export const WAREHOUSEID = sessionStorage.getItem('warehouseId') && sessionStorage.getItem('warehouseId') || 1
export const TODAYDATE = moment().format('YYYY-MM-DD');
export const MANDATORY = "Mandatory Field";