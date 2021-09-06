import { useLocation } from 'react-router';
import React, { useEffect, useMemo, useState } from 'react';
import { getMainPathname } from '../utils/Functions';
import { getDefaultOptions, statusFilterList } from '../assets/fixtures';
const StatusFilterContext = React.createContext([{}, () => { }]);

const StatusFilterProvider = ({ children }) => {
    const { pathname } = useLocation()
    const [status, setStatus] = useState([...statusFilterList])

    const mainPathname = useMemo(() => getMainPathname(pathname), [pathname])

    useEffect(() => {
        reset()
    }, [mainPathname])

    function reset() {
        setStatus(getDefaultOptions(statusFilterList))
    }

    return (
        <StatusFilterContext.Provider
            value={{ status, setStatus, reset }}
        >
            {children}
        </StatusFilterContext.Provider>
    );
};

export { StatusFilterContext, StatusFilterProvider };