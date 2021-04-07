import { useContext } from 'react';
import { AppContext } from '../../modules/appContext';

const useDepartment = () => {
    const [state] = useContext(AppContext);

    return state.department
};

export default useDepartment;