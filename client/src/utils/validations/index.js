import {
    isStrictDigit, isAadharValid, isPANValid, isEmpty, isGSTValid, isAlphaOnly,
    isIndMobileNum, isAlphaNumOnly, isEmail, isStrictIntFloat, isIntFloat
} from "../Functions"

export const checkValidation = (stateValues) => {
    return new Promise((resolve) => {
        let errors = {}
        Object.entries(stateValues).forEach((item) => {
            if (item[1] == "" || typeof item[1] == "string" && item[1].trim() == "" || item[1] == undefined) {
                errors[item[0]] = "Mandatory Field"
            }
            if (Array.isArray(item[1])) { // checks if it's an array and is empty
                !item[1].length && (errors[item[0]] = "Mandatory Field")
            }
        })
        resolve(errors)
    })
}

export const validateIDProofs = (proofs) => {
    let errors = {};
    const text = 'Required'
    if (Object.keys(proofs).length) {
        const { Front, Back } = proofs;
        if (!Front) errors.Front = text
        if (!Back) errors.Back = text
    } else errors = { Front: text, Back: text }

    return errors
}

export const validateDevDays = (days) => {
    let errors = {};
    const text = 'Required'
    if (!days.length) errors = { devDays: text }

    return errors
}

export const validateAccountValues = (data, customerType, isInView) => {
    let errors = {};
    let productErrors = {}
    const text = 'Required'
    const text2 = 'Incomplete'
    const {
        gstNo, panNo, adharNo, natureOfBussiness, organizationName, address, customerName,
        mobileNumber, invoicetype, creditPeriodInDays, EmailId, referredBy, idProofType,
        registeredDate, gstProof, depositAmount, routingId, deliveryLocation, ...rest
    } = data

    if (customerType === 'Corporate') {
        if (!organizationName) errors.organizationName = text
        else {
            const error = validateNames(organizationName)
            error && (errors.organizationName = error)
        }
        if (!creditPeriodInDays) errors.creditPeriodInDays = text
        else {
            const error = validateNumber(creditPeriodInDays)
            error && (errors.creditPeriodInDays = error)
        }
        if (!gstNo) errors.gstNo = text
        if (!gstProof) errors.gstProof = text
    }
    else {
        if (!isInView) { // General account form in add account screen
            if (!depositAmount) errors.depositAmount = text
            else {
                const error = validateNumber(depositAmount)
                error && (errors.depositAmount = error)
            }
            if (!routingId) errors.routingId = text
            if (!deliveryLocation) errors.deliveryLocation = text
            else {
                const error = validateNames(deliveryLocation)
                error && (errors.deliveryLocation = error)
            }
            productErrors = validateProductNPrice(rest)
        }
    }

    if (gstNo && !gstProof) errors.gstProof = text
    if (!gstNo && gstProof) errors.gstNo = text
    if (!address) errors.address = text
    if (!idProofType) errors.idProofType = text
    if (idProofType && !data[idProofType]) errors[idProofType] = text
    if (!invoicetype) errors.invoicetype = text
    if (!registeredDate) errors.registeredDate = text
    if (!natureOfBussiness) errors.natureOfBussiness = text
    if (!customerName) errors.customerName = text
    else {
        const error = validateNames(customerName)
        error && (errors.customerName = error)
    }
    if (!referredBy) errors.referredBy = text
    else {
        const error = validateNames(referredBy)
        error && (errors.referredBy = error)
    }
    if (!EmailId) errors.EmailId = text
    else {
        const error = validateEmailId(EmailId)
        error && (errors.EmailId = error)
    }
    if (!mobileNumber) errors.mobileNumber = text
    else {
        if (String(mobileNumber).length < 10) errors.mobileNumber = text2
        else {
            const error = validateMobileNumber(mobileNumber)
            error && (errors.mobileNumber = error)
        }
    }
    if (panNo) {
        if (String(panNo).length < 10) (errors.panNo = text2)
        else {
            const error = validateIDNumbers('panNo', panNo)
            error && (errors.panNo = error)
        }
    }
    if (adharNo) {
        if (String(adharNo).length < 12) errors.adharNo = text2
        else {
            const error = validateIDNumbers('adharNo', adharNo)
            error && (errors.adharNo = error)
        }
    }
    if (gstNo) {
        if (String(gstNo).length < 15) errors.gstNo = text2
        else {
            const error = validateIDNumbers('gstNo', gstNo)
            error && (errors.gstNo = error)
        }
    }

    return { ...errors, ...productErrors }
}
export const validateDeliveryValues = (data) => {
    let errors = {};
    const text = 'Required'
    const text2 = 'Incomplete'
    const {
        gstNo, gstProof, depositAmount, routingId, phoneNumber, contactPerson, address,
        deliveryLocation, ...rest
    } = data

    if (!depositAmount) errors.depositAmount = text
    else {
        const error = validateNumber(depositAmount)
        error && (errors.depositAmount = error)
    }
    if (!routingId) errors.routingId = text
    if (!address) errors.address = text
    if (gstNo && !gstProof) errors.gstProof = text
    if (!gstNo && gstProof) errors.gstNo = text
    if (gstNo) {
        if (String(gstNo).length < 15) errors.gstNo = text2
        else {
            const error = validateIDNumbers('gstNo', gstNo)
            error && (errors.gstNo = error)
        }
    }
    if (!phoneNumber) errors.phoneNumber = text
    else {
        if (String(phoneNumber).length < 10) errors.phoneNumber = text2
        else {
            const error = validateMobileNumber(phoneNumber)
            error && (errors.phoneNumber = error)
        }
    }
    if (!contactPerson) errors.contactPerson = text
    else {
        const error = validateNames(contactPerson)
        error && (errors.contactPerson = error)
    }
    if (!deliveryLocation) errors.deliveryLocation = text
    else {
        const error = validateNames(deliveryLocation)
        error && (errors.deliveryLocation = error)
    }

    const productErrors = validateProductNPrice(rest)
    return { ...errors, ...productErrors }
}

export const validateBatchValues = (data) => {
    let errors = {};
    const text = 'Required'
    const { shiftType, phLevel, TDS, ozoneLevel, managerName, ...rest } = data

    if (!shiftType) errors.shiftType = text
    if (!phLevel) errors.phLevel = text
    if (!ozoneLevel) errors.ozoneLevel = text
    if (!TDS) errors.TDS = text
    if (!managerName) errors.managerName = text
    else {
        const error = validateNames(managerName)
        error && (errors.managerName = error)
    }

    const productErrors = validateProducts(rest)
    return { ...errors, ...productErrors }
}

export const validateDispatchValues = (data, currentStock) => {
    let errors = {};
    const text = 'Required'
    const { batchId, dispatchTo, managerName, vehicleNo, driverId, mobileNumber, ...rest } = data

    if (!batchId) errors.batchId = text
    if (!driverId) errors.driverId = text
    if (!vehicleNo) errors.vehicleNo = text
    if (!dispatchTo) errors.dispatchTo = text
    if (!mobileNumber) errors.mobileNumber = text
    else {
        const error = validateMobileNumber(mobileNumber)
        error && (errors.mobileNumber = error)
    }
    if (!managerName) errors.managerName = text
    else {
        const error = validateNames(managerName)
        error && (errors.managerName = error)
    }

    let productErrors = validateProducts(rest)
    if (isEmpty(productErrors)) {
        productErrors = validateProductsInStock(currentStock, rest, 'products')
    }
    return { ...errors, ...productErrors }
}

export const validateExternalDispatchValues = (data, currentStock) => {
    let errors = {};
    const text = 'Required'
    const { batchId, dispatchAddress, managerName, vehicleNo, mobileNumber, driverId, ...rest } = data

    if (!batchId) errors.batchId = text
    if (!driverId) errors.driverId = text
    if (!vehicleNo) errors.vehicleNo = text
    if (!dispatchAddress) errors.dispatchAddress = text
    if (!mobileNumber) errors.mobileNumber = text
    else {
        const error = validateMobileNumber(mobileNumber)
        error && (errors.mobileNumber = error)
    }
    if (!managerName) errors.managerName = text
    else {
        const error = validateNames(managerName)
        error && (errors.managerName = error)
    }

    let productErrors = validateProductNPrice(rest)
    if (isEmpty(productErrors)) {
        productErrors = validateProductsInStock(currentStock, rest, 'productNPrice')
    }
    return { ...errors, ...productErrors }
}

export const validateRequestMaterialValues = (data) => {
    let errors = {};
    const text = 'Required'
    const { itemName, itemCode, vendorName, description, recordLevel, minOrderLevel } = data

    if (!itemName) errors.itemName = text
    if (!vendorName) errors.vendorName = text
    if (!description) errors.description = text
    if (!itemCode) errors.itemCode = text
    if (!recordLevel) errors.recordLevel = text
    else {
        const error = validateNumber(recordLevel)
        error && (errors.recordLevel = error)
    }
    if (!minOrderLevel) errors.minOrderLevel = text
    else {
        const error = validateNumber(minOrderLevel)
        error && (errors.minOrderLevel = error)
    }

    return errors
}

const validateProducts = ({ product20L, product1L, product500ML, product250ML }) => {
    let errors = {};

    const noP20L = product20L == 0 || !product20L
    const noP1L = product1L == 0 || !product1L
    const noP500ML = product500ML == 0 || !product500ML
    const noP250ML = product250ML == 0 || !product250ML

    if (noP20L && noP1L && noP500ML && noP250ML) {
        errors.productNPrice = 'Atleast 1 product is required'
    }
    const error1 = validateNumber(product20L)
    const error2 = validateNumber(product1L)
    const error3 = validateNumber(product500ML)
    const error4 = validateNumber(product250ML)

    if (error1 || error2 || error3 || error4)
        errors.products = error1 || error2 || error3 || error4

    return errors
}

const validateProductNPrice = ({ product20L, price20L, product1L, price1L,
    product500ML, price500ML, product250ML, price250ML }) => {
    let errors = {};

    const noP20L = product20L == 0 || !product20L
    const nop20L = price20L == 0 || !price20L
    const noP1L = product1L == 0 || !product1L
    const nop1L = price1L == 0 || !price1L
    const noP500ML = product500ML == 0 || !product500ML
    const nop500ML = price500ML == 0 || !price500ML
    const noP250ML = product250ML == 0 || !product250ML
    const nop250ML = price250ML == 0 || !price250ML

    if (noP20L && nop20L && noP1L && nop1L && noP500ML && nop500ML && noP250ML && nop250ML) {
        errors.productNPrice = 'Atleast 1 product is required'
    }
    else {
        if (!noP20L || !nop20L) {
            if (noP20L) errors.productNPrice = 'Enter quantity for 20 Ltrs'
            if (nop20L) errors.productNPrice = 'Enter price for 20 Ltrs'
        }
        else if (!noP1L || !nop1L) {
            if (noP1L) errors.productNPrice = 'Enter quantity for 1 Ltrs'
            if (nop1L) errors.productNPrice = 'Enter price for 1 Ltrs'
        }
        else if (!noP500ML || !nop500ML) {
            if (noP500ML) errors.productNPrice = 'Enter quantity for 500 ml'
            if (nop500ML) errors.productNPrice = 'Enter price for 500 ml'
        }
        else if (!noP250ML || !nop250ML) {
            if (noP250ML) errors.productNPrice = 'Enter quantity for 250 ml'
            if (nop250ML) errors.productNPrice = 'Enter price for 250 ml'
        }
    }

    const error1 = validateNumber(product20L)
    const error2 = validateNumber(price20L)
    const error3 = validateNumber(product1L)
    const error4 = validateNumber(price1L)
    const error5 = validateNumber(product500ML)
    const error6 = validateNumber(price500ML)
    const error7 = validateNumber(product250ML)
    const error8 = validateNumber(price250ML)

    if (error1 || error2 || error3 || error4 || error5 || error6 || error7 || error8)
        errors.productNPrice = error1 || error2 || error3 || error4 || error5 || error6 || error7 || error8


    return errors
}

export const validateProductsInStock = (inStock, products, key) => {
    let errors = {};
    let textArray = []
    const { product20L, product1L, product500ML, product250ML } = products
    const { product20LCount, product1LCount, product500MLCount, product250MLCount } = inStock

    if (Number(product20L) > product20LCount) {
        textArray.push('20 Ltrs')
    }
    if (Number(product1L) > product1LCount) {
        textArray.push('1 Ltrs')
    }
    if (Number(product500ML) > product500MLCount) {
        textArray.push('500 Ml')
    }
    if (Number(product250ML) > product250MLCount) {
        textArray.push('250 Ml')
    }

    if (textArray.length) {
        errors[key] = `${textArray.join(',')} qty exceeds current stock`
    }

    return errors
}

export const validateDCValues = (data) => {
    let errors = {};
    const text = 'Required'
    const text2 = 'Incomplete'

    const { routeId, customerName, mobileNumber, address,
        driverId, twentyLCans, OneLBoxes, fiveHLBoxes, twofiftyLBoxes } = data

    if (!routeId) errors.routeId = text
    if (!driverId) errors.driverId = text
    if (!address) errors.address = text
    if (!mobileNumber) errors.mobileNumber = text
    else {
        if (String(mobileNumber).length < 10) errors.mobileNumber = text2
        else {
            const error = validateMobileNumber(mobileNumber)
            error && (errors.mobileNumber = error)
        }
    }
    if (!customerName) errors.customerName = text
    else {
        const error = validateNames(customerName)
        error && (errors.customerName = error)
    }

    const error1 = validateNumber(twentyLCans)
    const error2 = validateNumber(OneLBoxes)
    const error3 = validateNumber(fiveHLBoxes)
    const error4 = validateNumber(twofiftyLBoxes)

    if (error1 || error2 || error3 || error4)
        errors.stockDetails = error1 || error2 || error3 || error4

    return errors
}

export const validateAddresses = (data) => {
    let errors = {};
    for (let index = 0; index < data.length; index++) {
        const error = validateDeliveryValues(data[index])
        const devDaysError = validateDevDays(data[index]['devDays'])
        if (!isEmpty(error) || !isEmpty(devDaysError)) {
            errors[`address${index}`] = { ...error, ...devDaysError }
            break;
        }
    }

    return errors
}

export const validateIDNumbers = (key, value, isBlur) => {
    if (key === 'panNo') {
        if (isBlur && value) {
            const isValid = isAlphaNumOnly(value)
            if (!isValid) return 'Invalid'
        }
        if (isBlur && value && String(value).length < 10) {
            return 'Incomplete'
        }
        if (!isAlphaNumOnly(value)) {
            return 'Enter aphanumeric only'
        }
        if (String(value).length === 10) {
            const isValid = isPANValid(value)
            if (!isValid) return 'Invalid'
        }
    }
    else if (key === 'adharNo') {
        if (isBlur && value) {
            const isValid = isStrictDigit(value)
            if (!isValid) return 'Invalid'
        }
        if (isBlur && value && String(value).length < 12) {
            return 'Incomplete'
        }
        if (value && !isStrictDigit(value)) {
            return 'Enter digits only'
        }
        if (String(value).length === 12) {
            const isValid = isAadharValid(value)
            if (!isValid) return 'Invalid'
        }
    }
    else if (key === 'gstNo') {
        if (isBlur && value) {
            const isValid = isAlphaNumOnly(value)
            if (!isValid) return 'Invalid'
        }
        if (isBlur && value && String(value).length < 15) {
            return 'Incomplete'
        }
        if (!isAlphaNumOnly(value)) {
            return 'Enter aphanumeric only'
        }
        if (String(value).length === 15) {
            const isValid = isGSTValid(value)
            if (!isValid) return 'Invalid'
        }
    }

    return ''
}

export const validateNames = (value) => {
    const isValid = isAlphaOnly(value)
    if (!isValid) return 'Enter letters only'
    return ''
}

export const validateEmailId = (value) => {
    const isValid = isEmail(value)
    if (!isValid) return 'Invalid'
    return ''
}

export const validateNumber = (value, isBlur) => {
    if (isBlur && value) {
        const isValid = isStrictDigit(value)
        if (!isValid) return 'Invalid'
    }
    if (value && !isStrictDigit(value)) {
        return 'Enter digits only'
    }
    return ''
}

export const validateMobileNumber = (value, isBlur) => {
    if (isBlur && value) {
        const isValid = isStrictDigit(value)
        if (!isValid) return 'Invalid'
    }
    if (isBlur && value && String(value).length < 10) {
        return 'Incomplete'
    }
    if (value && !isStrictDigit(value)) {
        return 'Enter digits only'
    }
    if (String(value).length === 10) {
        const isValid = isIndMobileNum(value)
        if (!isValid) return 'Invalid'
    }
    return ''
}

export const validateIntFloat = (value, isBlur) => {
    if (isBlur && value) {
        const isValid = isStrictIntFloat(value)
        if (!isValid) return 'Invalid'
    }
    if (value) {
        const isValid = isIntFloat(value)
        if (!isValid) return 'Enter digits only'
    }
    return ''
}