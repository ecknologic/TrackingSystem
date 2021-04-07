import { useContext } from 'react';
import { AppContext } from '../../modules/appContext';
import { SUPERADMIN, MOTHERPLANTADMIN, WAREHOUSEADMIN } from '../constants'

const useUser = () => {
    const [state, setState] = useContext(AppContext);

    function getDesignation() {
        const { user: { ROLE } } = state
        if (ROLE === MOTHERPLANTADMIN) return 'Mother Plant Admin'
        else if (ROLE === WAREHOUSEADMIN) return 'Warehouse Admin'
        else if (ROLE === SUPERADMIN) return 'Super Admin'
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