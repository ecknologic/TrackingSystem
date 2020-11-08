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
        default:
            return path
    }
}

const deepClone = (data) => {
    return JSON.parse(JSON.stringify(data))
}

const getIdProofName = (type) => {
    switch (type) {
        case 'adharNo':
            return 'Aadhar Number'
        case 'panNo':
            return 'PAN Number'
        case 'dlNo':
            return 'Driving License Number'
        case 'passportNo':
            return 'Passport Number'
        default:
            return ''
    }
}

const getIdProofKey = (data) => {
    const { panNo, adharNo, dlNo, passportNo } = data

    if (panNo) return 'panNo'
    if (adharNo) return 'adharNo'
    if (dlNo) return 'dlNo'
    if (passportNo) return 'passportNo'
}

module.exports = { editData, getBase64, stringToHslColor, getSideMenuKey, deepClone, getIdProofName, getIdProofKey }