import axios from 'axios';
import { message } from 'antd';
import { getUserId, getWarehoseId } from '../utils/constants';
message.config({ maxCount: 1 });

// Setting headers in request
axios.interceptors.request.use(function (config) {
    config.headers.departmentId = getWarehoseId()
    config.headers.userId = getUserId()

    return config;
});

// Handling unexpected errors
axios.interceptors.response.use(null, error => {
    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

    if (!expectedError) {
        if (error.message === 'Network Error')
            message.info('Please check your network connection')
        else message.error('Oops! Something went wrong, try again!')
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
export const GET = async (url) => {
    try {
        const { data } = await axios.get(url)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error)
    }
}
// POST Request
export const POST = async (url, body) => {
    try {
        const { data } = await axios.post(url, body)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error)
    }
}
// PUT Request
export const PUT = async (url, body) => {
    try {
        const { data } = await axios.put(url, body)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error)
    }
}
// PATCH Request
export const PATCH = async (url, body) => {
    try {
        const { data } = await axios.patch(url, body)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error)
    }
}
// DELETE Request
export const DELETE = async (url) => {
    try {
        const { data } = await axios.delete(url)
        return Promise.resolve(data)
    } catch (error) {
        return Promise.reject(error)
    }
}

export const http = {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE
}
