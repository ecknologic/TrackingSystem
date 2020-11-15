import dayjs from 'dayjs';

export const TRACKFORM = 'trackForm'
export const MANDATORY = "Mandatory Field";
export const MARKETINGADMIN = 'SalesAndMarketing'
export const WAREHOUSEADMIN = 'WarehouseAdmin'
export const TODAYDATE = dayjs().format('YYYY-MM-DD')

export const getUserId = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user) return user.id
    return 1
}
export const getRole = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user) return user.role
    return 1
}
export const getUsername = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user) return user.name
    return ''
}
export const getWarehoseId = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user) return user.wareHouse
    return 1
}