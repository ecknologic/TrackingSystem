import { useContext } from 'react';
import { FilterContext } from '../../modules/filterContext';

const useCustomerFilter = () => {
    const { setAccount, setCreator, setBusiness, setStatus,
        setMainUrl, reset, ...rest } = useContext(FilterContext);

    function onChange(value, target, checked) {
        const data = [...rest[target]]
        const field = data.find(item => item.value === value)
        field.checked = checked

        if (target === 'account') {
            setAccount(data)
        }
        else if (target === 'creator') {
            setCreator(data)
        }
        else if (target === 'business') {
            setBusiness(data)
        }
        else if (target === 'status') {
            setStatus(data)
        }
    }

    function hasFilters() {
        const { account, creator, business, status } = rest
        const hasFilter = true

        const aFilter = account.some(item => item.checked)
        if (aFilter) return hasFilter

        const cFilter = creator.some(item => item.checked)
        if (cFilter) return hasFilter

        const bFilter = business.some(item => item.checked)
        if (bFilter) return hasFilter

        const sFilter = status.some(item => item.checked)
        if (sFilter) return hasFilter

        return false
    }

    return {
        ...rest,
        onSelect: (value, target) => onChange(value, target, true),
        onDeselect: (value, target) => onChange(value, target, false),
        hasFilters: hasFilters(),
        resetFilters: reset
    }
};

export default useCustomerFilter;