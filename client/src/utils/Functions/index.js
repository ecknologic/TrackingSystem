const editData = (updatedItem, data, idField) => {
    return new Promise(resolve => {
        if (data.length) {
            const updatedData = []
            data.map(item => {
                if (item[idField] === updatedItem[idField]) {
                    item = updatedItem
                }
                updatedData.push(item)
            })
            resolve(updatedData)
        } else resolve([])
    })
}
const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
const stringToHslColor = (str) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', 45%, 45%)';
}

const getSideMenuKey = (path) => {
    switch (path) {
        case '/bibowarehouse':
            return '/dashboard'
        case '/addcustomer':
            return '/dashboard'
        default:
            return path
    }
}

const deepClone = (data) => {
    return JSON.parse(JSON.stringify(data))
}

module.exports = { editData, getBase64, stringToHslColor, getSideMenuKey, deepClone }