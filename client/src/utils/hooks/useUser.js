import { useContext } from 'react';
import { AppContext } from '../../modules/appContext';
import { SUPERADMIN, MOTHERPLANTADMIN, WAREHOUSEADMIN, MARKETINGMANAGER, ACCOUNTSADMIN, MARKETINGADMIN } from '../constants'

const useUser = () => {
    const [state, setState] = useContext(AppContext);

    function getDesignation() {
        const { user: { ROLE } } = state
        if (ROLE === MOTHERPLANTADMIN) return 'Mother Plant Admin'
        else if (ROLE === WAREHOUSEADMIN) return 'Warehouse Admin'
        else if (ROLE === MARKETINGMANAGER) return 'Marketing Manager'
        else if (ROLE === MARKETINGADMIN) return 'Sales & Marketing Admin'
        else if (ROLE === SUPERADMIN) return 'Super Admin'
        else if (ROLE === ACCOUNTSADMIN) return 'Accounts Admin'
        return ''
    }

    function setUser(user) {
        setState(state => ({ ...state, user }))
    }

    return {
        ...state.user,
        setUser,
        getDesignation,
    }
};

export default useUser;