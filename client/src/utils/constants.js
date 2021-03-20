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
export const getDesignation = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user) {
        const { role } = user
        if (role === MOTHERPLANTADMIN) return 'Mother Plant Manager - Admin'
        else if (role === WAREHOUSEADMIN) return 'Warehouse Manager - Admin'
        else if (role === SUPERADMIN) return 'Chief Executive Officer - Super Admin'
        return ''
    }
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
                '/products', '/routes', '/distributors', '/invoices', '/roles']

        case ACCOUNTSADMIN:
            return ['/customers', '/invoices']

        case WAREHOUSEADMIN:
            return ['/manage-stock', '/manage-routes', '/manage-empty-cans', '/drivers', '/manage-invoices']

        case MOTHERPLANTADMIN:
            return ['/manage-production', '/manage-dispatches', '/manage-materials', '/manage-qc', '/manage-return-cans']

        default:
            return ['']
    }
}