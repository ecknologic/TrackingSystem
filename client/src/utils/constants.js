import dayjs from 'dayjs';

export const TRACKFORM = 'trackForm'
export const MANDATORY = "Mandatory Field";
export const MARKETINGADMIN = 'SalesAndMarketing'
export const WAREHOUSEADMIN = 'WarehouseAdmin'
export const SUPERADMIN = 'SuperAdmin'
export const ACCOUNTSADMIN = 'Accounts'
export const MOTHERPLANTADMIN = 'MotherPlantAdmin'
export const TODAYDATE = dayjs().format('YYYY-MM-DD')

export const getUserId = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user) return user.id
    return 1
}
export const getRoleId = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user) return user.roleId
    return null
}
export const getRole = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user) return user.role
    return null
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

export const isLogged = () => {
    return JSON.parse(sessionStorage.getItem('isLogged'))
}

export const getRoutesByRole = (role) => {
    switch (role) {
        case MARKETINGADMIN:
            return ['/add-customer', '/manage-accounts']

        case SUPERADMIN:
            return ['/customers', '/materials', '/motherplants', '/warehouses', '/staff', '/drivers',
                '/products', '/routes', '/distributors']

        case ACCOUNTSADMIN:
            return ['/customers']

        case WAREHOUSEADMIN:
            return ['/manage-stock', '/manage-routes', '/manage-empty-cans', '/drivers']

        case MOTHERPLANTADMIN:
            return ['/manage-production', '/manage-dispatches', '/manage-materials', '/manage-qc', '/manage-return-cans']

        default:
            return ['']
    }
}