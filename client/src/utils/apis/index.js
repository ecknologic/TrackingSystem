import axios from 'axios';

export const getAPI = (url) => {
    return new Promise((resolve, reject) => {
        // var request = axios.create({
        //     headers: {
        //         'x-access-token': sessionStorage.token
        //     }
        // });
        axios.get(url).then((response) => {
            resolve(response.data)
        })
    })
}
export const createOrUpdateAPI = (url, data, methodName) => {
    return new Promise((resolve, reject) => {
        var request = new Request(process.env.REACT_APP_API_HOST + url, {
            method: methodName,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        });
        fetch(request)
            .then(response => response.json())
            .then(function (response) {
                resolve(response)
            })
    })
}