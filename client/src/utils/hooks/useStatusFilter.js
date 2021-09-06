import { useContext } from 'react';
import { StatusFilterContext } from '../../modules/statusFilterContext';

const useStatusFilter = () => {
    const { setStatus, reset, status } = useContext(StatusFilterContext);

    function onChange(value, target, checked) {
        const data = [...status]
        const field = data.find(item => item.value === value)
        field.checked = checked

        if (target === 'status') {
            setStatus(data)
        }
    }

    function hasFilters() {
        const hasFilter = true

        const sFilter = status.some(item => item.checked)
        if (sFilter) return hasFilter

        return false
    }

    return {
        onSelect: (value, target) => onChange(value, target, true),
        onDeselect: (value, target) => onChange(value, target, false),
        hasFilters: hasFilters(),
        resetFilters: reset,
        status,
        setStatus
    }
};

export default useStatusFilter;