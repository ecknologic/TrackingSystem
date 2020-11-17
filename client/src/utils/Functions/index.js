import { TRACKFORM } from "../constants"

export const editData = (updatedItem, data, idField) => {
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
export const blobToBase64 = (blob) => {
    const content = new Uint8Array(blob);

    return URL.createObjectURL(
        new Blob([content.buffer], { type: 'image/png' })
    );
}
export const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
export const base64String = (buffer) => {
    // var binary = '';
    // var bytes = new Uint8Array(buffer);
    // var len = bytes.byteLength;
    // for (var i = 0; i < len; i++) {
    //     binary += String.fromCharCode(bytes[i]);
    // }
    // console.lo
    return "data:image/png;base64," + btoa(
        new Uint8Array(buffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}

export const stringToHslColor = (str) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', 45%, 45%)';
}
export const getCleanObject = (data) => {
    return Object.entries(data).reduce((a, [k, v]) => (v === null ? a : (a[k] = v, a)), {})
}

export const getSideMenuKey = (path) => {
    switch (path) {
        case '/bibowarehouse':
            return '/dashboard'
        default:
            return path
    }
}

export const deepClone = (data) => {
    return JSON.parse(JSON.stringify(data))
}
export const isEmpty = (data) => {
    if (typeof data === 'object' && data !== null) return !Object.keys(data).length
    else if (Array.isArray(data)) return !data.length
}

export const getIdProofName = (type) => {
    switch (type) {
        case 'adharNo':
            return 'Aadhar Number'
        case 'panNo':
            return 'PAN Number'
        case 'dlNo':
            return 'Driving License Number'
        case 'passportNo':
            return 'Passport Number'
    }
}

export const getIdProofKey = (data) => {
    const { panNo, adharNo, dlNo, passportNo } = data

    if (panNo) return 'panNo'
    if (adharNo) return 'adharNo'
    if (dlNo) return 'dlNo'
    if (passportNo) return 'passportNo'
}
export const getDevDays = (data = {}) => {
    const days = []
    const { SUN, MON, TUE, WED, THU, FRI, SAT } = data
    if (Number(SUN)) days.push('SUN')
    if (Number(MON)) days.push('MON')
    if (Number(TUE)) days.push('TUE')
    if (Number(WED)) days.push('WED')
    if (Number(THU)) days.push('THU')
    if (Number(FRI)) days.push('FRI')
    if (Number(SAT)) days.push('SAT')

    return days
}
export const extractProductsFromForm = (data) => {
    const { product20L, price20L, product1L, price1L, product500ML, price500ML, product250ML, price250ML, product20LId, product1LId, product500MLId } = data //product250MLId

    return { product20L, price20L, product1L, price1L, product500ML, price500ML, product250ML, price250ML, product20LId, product1LId, product500MLId }//product250MLId
}
export const getProductsForDB = ({ product20L, price20L, product1L, price1L, product500ML, price500ML, product250ML, price250ML }) => {
    const products = []
    const item1 = { productName: '20L', productPrice: price20L || 0, noOfJarsTobePlaced: product20L || 0 }
    const item2 = { productName: '1L', productPrice: price1L || 0, noOfJarsTobePlaced: product1L || 0 }
    const item3 = { productName: '500ML', productPrice: price500ML || 0, noOfJarsTobePlaced: product500ML || 0 }
    // const item4 = { productName: '250ML', productPrice: price250ML, noOfJarsTobePlaced: product250ML }
    products.push(item1)
    products.push(item2)
    products.push(item3)
    //products.push(item4)

    return products
}
export const getProductsWithIdForDB = ({ product20L, price20L, product1L, price1L, product500ML, price500ML, product250ML, price250ML, product20LId, product1LId, product500MLId }) => {  //, product250MLId
    const products = []
    const item1 = { productName: '20L', productPrice: price20L || 0, noOfJarsTobePlaced: product20L || 0, productId: product20LId }
    const item2 = { productName: '1L', productPrice: price1L || 0, noOfJarsTobePlaced: product1L || 0, productId: product1LId }
    const item3 = { productName: '500ML', productPrice: price500ML || 0, noOfJarsTobePlaced: product500ML || 0, productId: product500MLId }
    // const item4 = { productName: '250ML', productPrice: price250ML, noOfJarsTobePlaced: product250ML, productId: product250MLId }
    products.push(item1)
    products.push(item2)
    products.push(item3)
    //products.push(item4)

    return products
}
export const getProductsForUI = (data) => {
    let product20L, price20L, product1L, price1L, product500ML, price500ML, product250ML, price250ML, product20LId, product1LId, product500MLId, product250MLId

    data.map((item) => {
        const { productName, productPrice, noOfJarsTobePlaced, productId } = item
        if (productName === '20L') {
            product20L = noOfJarsTobePlaced
            price20L = productPrice
            product20LId = productId
        }
        if (productName === '1L') {
            product1L = noOfJarsTobePlaced
            price1L = productPrice
            product1LId = productId
        }
        if (productName === '500ML') {
            product500ML = noOfJarsTobePlaced
            price500ML = productPrice
            product500MLId = productId
        }
        // if (productName === '250ML') {
        //     product250ML = noOfJarsTobePlaced
        //     price250ML = productPrice
        //     product250MLId = productId
        // }
    })
    const products = { product20L, price20L, product1L, price1L, product500ML, price500ML, product250ML, price250ML, product20LId, product1LId, product500MLId }//product250MLId
    return products
}

export const getIdProofsForDB = (data) => {
    const { Front, Back } = data
    const idProofs = [Front, Back]

    return idProofs
}
export const getDevDaysForDB = (data = []) => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    const daysObj = {}
    days.map((day) => {
        if (data.includes(day)) {
            daysObj[day] = 1
        } else daysObj[day] = 0
    })
    return daysObj
}

export const extractDeliveryDetails = (data) => {
    const clone = deepClone(data)
    delete clone.products
    delete clone.deliveryDays
    delete clone.price1L
    delete clone.price20L
    delete clone.price500ML
    // delete clone.price250ML
    delete clone.product1L
    delete clone.product20L
    delete clone.product500ML
    // delete clone.product250ML
    delete clone.product20LId
    delete clone.product1LId
    delete clone.product500MLId
    // delete clone.product250MLId
    return clone
}

export const extractGADeliveryDetails = ({ gstNo, address, depositAmount, mobileNumber, customerName: contactPerson }) => {
    return { gstNo, address, depositAmount, phoneNumber: mobileNumber, contactPerson }
}

export const extractGADetails = (data) => {
    const { customerName: organizationName, address: Address1 } = data
    const clone = deepClone(data)
    delete clone.address
    delete clone.price1L
    delete clone.price20L
    delete clone.price500ML
    // delete clone.price250ML
    delete clone.product1L
    delete clone.product20L
    delete clone.product500ML
    // delete clone.product250ML
    return { ...clone, Address1, organizationName }
}

export const getAddressesForDB = (data) => {
    return data.map((address) => {
        const { devDays, product20L, price20L, product1L, price1L, product500ML, price500ML, product250ML, price250ML, ...rest } = address
        const products = getProductsForDB({ product20L, price20L, product1L, price1L, product500ML, price500ML, product250ML, price250ML })
        const deliveryDays = getDevDaysForDB(devDays)
        return { products, deliveryDays, ...rest }
    })
}

export const setTrackForm = () => {
    sessionStorage.setItem(TRACKFORM, true)
}
export const resetTrackForm = () => {
    sessionStorage.removeItem(TRACKFORM)
}
export const trackAccountFormOnce = () => {
    window.addEventListener('input', setTrackForm, { once: true })
}
export const getIDInputValidationProps = (IDType) => {
    const props = {}
    if (IDType === 'panNo') {
        props.maxLength = 10
    }
    else if (IDType === 'adharNo') {
        props.maxLength = 12
    }

    return props
}

export const isPANValid = (PANNumber) => {
    return PANNumber.match(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/)
}

export const isNumber = (value) => {
    return value.match(/^(\s*|\d+)$/)
}

// multiplication table
const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
]

// permutation table
const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
]

// validates Aadhar number received as string
export const isAadharValid = (aadharNumber) => {
    let c = 0
    let invertedArray = aadharNumber.split('').map(Number).reverse()

    invertedArray.forEach((val, i) => {
        c = d[c][p[(i % 8)][val]]
    })

    return (c === 0)
}