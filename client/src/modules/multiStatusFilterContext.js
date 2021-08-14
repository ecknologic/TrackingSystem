import { useLocation } from 'react-router';
import React, { useEffect, useMemo, useState } from 'react';
import { getMainPathname } from '../utils/Functions';
import { getDefaultOptions, multiFilterList } from '../assets/fixtures';
const MultiStatusFilterContext = React.createContext([{}, () => { }]);

const MultiStatusFilterProvider = ({ children }) => {
    const { pathname } = useLocation()
    const [status, setStatus] = useState([...multiFilterList])

    const mainPathname = useMemo(() => getMainPathname(pathname), [pathname])

    useEffect(() => {
        reset()
    }, [mainPathname])

    function reset() {
        setStatus(getDefaultOptions(multiFilterList))
    }

    return (
        <MultiStatusFilterContext.Provider
            value={{ status, setStatus, reset }}
        >
            {children}
        </MultiStatusFilterContext.Provider>
    );
};

export { MultiStatusFilterContext, MultiStatusFilterProvider };