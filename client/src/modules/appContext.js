
import React, { useEffect, useState } from 'react';
import { http, appApi } from './http';

const AppContext = React.createContext([{}, () => { }]);

const AppProvider = ({ children }) => {
    const [state, setState] = useState({
        user: JSON.parse(sessionStorage.getItem('user')) || {},
        department: {},
    });

    useEffect(() => {
        const { user: { WAREHOUSEID } } = state
        WAREHOUSEID && getDepartment(WAREHOUSEID)
    }, [state.user.WAREHOUSEID])

    const getDepartment = async (id) => {
        const url = `warehouse/getWarehouseDetails/${id}`

        try {
            const { data } = await http.GET(appApi, url)
            setState(state => ({ ...state, department: data }))
        } catch (error) { }
    }

    return (
        <AppContext.Provider value={[state, setState]}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };