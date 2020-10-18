import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { baseUrl } from '../config'

const RoutesComp = () => {
    const [routesAll, setRoutesAll] = useState([]);
    const [countries, setCountries] = useState([]);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        getAllRoutes();
    }, []);

    const getAllRoutes = () => {
        axios.get(baseUrl+'/warehouse/getroutes')
            .then(res => {
                setCountries(res.data.data);
                setLoad(true);
            })
            .catch(err => {
                setLoad(true)
            })
    }
    if (load) {
        return (
            <div><h1>Kumar</h1></div>
        );
    } else {
        return (
            <div>
                Loading...
            </div>
        );
    }
};

export default RoutesComp;