import axios from 'axios';
import { message } from 'antd';

message.config({ maxCount: 1, });

// Setting access token in request
// axios.interceptors.request.use(function (config) {
// const token = sessionStorage.getItem('token')
// config.headers['x-access-token'] = token

// return config;
// });

// Handling unexpected errors
axios.interceptors.response.use(null, error => {
    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

    if (!expectedError) {
        if (error.message === 'Network Error')
            message.info('Please check your network connection')
        else message.error('Oops! Something went wrong!')
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
