import axios from 'axios'

const APPAPI = axios.create({
    baseURL: `${process.env.REACT_APP_API_HOST}`
})


export { APPAPI }