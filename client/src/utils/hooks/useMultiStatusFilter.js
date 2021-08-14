import { useContext } from 'react';
import { MultiStatusFilterContext } from '../../modules/multiStatusFilterContext';

const useMultiStatusFilter = () => {
    const { setStatus, reset, status } = useContext(MultiStatusFilterContext);

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
        status
    }
};

export default useMultiStatusFilter;