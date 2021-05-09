import { http, appApi } from './http';
import { useLocation } from 'react-router';
import React, { useEffect, useMemo, useState } from 'react';
import useUser from '../utils/hooks/useUser';
import { getMainPathname } from '../utils/Functions';
import { ACCOUNTSADMIN, MARKETINGMANAGER, SUPERADMIN } from '../utils/constants';
import { accountFilterList, getDefaultOptions, statusFilterList, getCreatorOptions } from '../assets/fixtures';
const FilterContext = React.createContext([{}, () => { }]);

const FilterProvider = ({ children }) => {
    const { ROLE } = useUser()
    const { pathname } = useLocation()

    const [creator, setCreator] = useState([])
    const [creatorList, setCreatorList] = useState([])
    const [business, setBusiness] = useState([])
    const [businessList, setBusinessList] = useState([])
    const [status, setStatus] = useState([...statusFilterList])
    const [account, setAccount] = useState([...accountFilterList])

    const isSMManager = useMemo(() => ROLE === MARKETINGMANAGER, [ROLE])
    const isAdmin = useMemo(() => ROLE === SUPERADMIN || ROLE === ACCOUNTSADMIN, [ROLE])
    const mainPathname = useMemo(() => getMainPathname(pathname), [pathname])

    useEffect(() => {
        getBusinessList()
    }, [])

    useEffect(() => {
        reset()
    }, [mainPathname])

    useEffect(() => {
        if (isAdmin) {
            setStatus([])
        }
    }, [isAdmin])

    useEffect(() => {
        getCreatorList()
    }, [isSMManager])

    async function getBusinessList() {
        const url = `bibo/getList/natureOfBusiness`

        try {
            const business = await http.GET(appApi, url)
            setBusiness(getDefaultOptions(business))
            setBusinessList(getDefaultOptions(business))
        } catch (error) { }
    }

    async function getCreatorList() {
        const roleName = getRoleName()
        if (!roleName) return;

        const url = `users/getUsersByRole/${roleName}`

        try {
            const creator = await http.GET(appApi, url)
            setCreator(getCreatorOptions(creator))
            setCreatorList(getCreatorOptions(creator))
        } catch (error) { }
    }

    function getRoleName() {
        if (isSMManager) return 'SalesAndMarketing'
        return ''
    }

    function reset() {
        setAccount(getDefaultOptions(accountFilterList))
        setStatus(getDefaultOptions(statusFilterList))
        setCreator(getDefaultOptions(creatorList))
        setBusiness(getDefaultOptions(businessList))
    }

    return (
        <FilterContext.Provider
            value={{
                account, setAccount,
                creator, setCreator,
                business, setBusiness,
                status, setStatus,
                reset
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};

export { FilterContext, FilterProvider };