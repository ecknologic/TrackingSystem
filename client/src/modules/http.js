import axios from 'axios'
import { message } from 'antd';
import { ACCOUNTSADMIN, SUPERADMIN, getRole, getUserId, getWarehoseId } from '../utils/constants'
import { isAbsoluteUrl } from '../utils/Functions';
message.config({ maxCount: 1 });

// Setting headers in request
axios.interceptors.request.use(function (config) {
    if (!isAbsoluteUrl(config.url)) {
        config.url = `${process.env.REACT_APP_API_HOST}${config.url}`;
    }

    config.headers.departmentId = getWarehoseId()
    config.headers.userId = getUserId()
    config.headers.isSuperAdmin = getRole() === SUPERADMIN
    config.headers.isAccountsAdmin = getRole() === ACCOUNTSADMIN

    return config;
})

// Handling unexpected errors
axios.interceptors.response.use(null, error => {
    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

    if (!expectedError) {
        if (error.message === 'Network Error')
            message.info('Please check your network connection')
        if (error.message === 'Cancelled') { } //Ignore
        else {
            message.error('Oops! Something went wrong, try again!')
        }
    }
    else if (expectedError) {
        if (error.response.status === 406) {
            sessionStorage.clear()
            message.error('Account no longer exists, Logging you out.')
            setTimeout(() => window.location.href = '/', 1500)
        }
    }

    return Promise.reject(error)
})

// GET Request
export const GET = async (axios, url, config) => {
    try {
        const { data } = await axios.get(url, config)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error)
    }
}
// POST Request
export const POST = async (axios, url, body, config) => {
    try {
        const { data } = await axios.post(url, body, config)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error)
    }
}
// PUT Request
export const PUT = async (axios, url, body, config) => {
    try {
        const { data } = await axios.put(url, body, config)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error)
    }
}
// PATCH Request
export const PATCH = async (axios, url, body, config) => {
    try {
        const { data } = await axios.patch(url, body, config)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error)
    }
}
// DELETE Request
export const DELETE = async (axios, url, config) => {
    try {
        const { data } = await axios.delete(url, config)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error)
    }
}
// CANCEL Request
export const ABORT = (source) => {
    source.cancel('Cancelled');
}

export const appApi = axios

export const http = {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,
    ABORT,
}
