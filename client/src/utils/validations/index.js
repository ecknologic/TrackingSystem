import {
    isNumber, isAadharValid, isPANValid, isEmpty, isGSTValid, hasLowerCase, isAlphaOnly,
    isIndMobileNum, isAlphaNumOnly, isEmail
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

export const validateAccountValues = (data, customerType) => {
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
        if (!creditPeriodInDays) errors.creditPeriodInDays = text
        if (!gstNo) errors.gstNo = text
        if (!gstProof) errors.gstProof = text
    }
    else {
        if (!depositAmount) errors.depositAmount = text
        if (!routingId) errors.routingId = text
        if (!deliveryLocation) errors.deliveryLocation = text
        else {
            const error = validateNames(deliveryLocation)
            error && (errors.deliveryLocation = error)
        }
        productErrors = validateProducts(rest)
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
        if (String(mobileNumber) < 10) errors.mobileNumber = text2
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

    const productErrors = validateProducts(rest)
    return { ...errors, ...productErrors }
}

const validateProducts = ({ product20L, price20L, product1L, price1L, product500ML, price500ML }) => {
    let errors = {};
    if (product20L || price20L) {
        if (!product20L) errors.productNPrice = 'Enter quantity for 20 Ltrs'
        if (!price20L) errors.productNPrice = 'Enter price for 20 Ltrs'
    }
    if (product1L || price1L) {
        if (!product1L) errors.productNPrice = 'Enter quantity for 1 Ltrs'
        if (!price1L) errors.productNPrice = 'Enter price for 1 Ltrs'
    }
    if (product500ML || price500ML) {
        if (!product500ML) errors.productNPrice = 'Enter quantity for 500 ml'
        if (!price500ML) errors.productNPrice = 'Enter price for 500 ml'
    }
    if (!(product20L || price20L) && !(product1L || price1L) && !(product500ML || price500ML)) {
        errors.productNPrice = 'Atleast 1 product is required'
    }
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
        if (isBlur && value && String(value).length < 10) {
            return 'Incomplete'
        }
        if (hasLowerCase(value)) {
            return 'Enter uppercase only'
        }
        if (String(value).length === 10) {
            const isValid = isPANValid(value)
            if (!isValid) return 'Invalid'
        }
    }
    else if (key === 'adharNo') {
        if (isBlur && value && String(value).length < 12) {
            return 'Incomplete'
        }
        if (!isNumber(value)) {
            return 'Enter digits only'
        }
        if (String(value).length === 12) {
            const isValid = isAadharValid(value)
            if (!isValid) return 'Invalid'
        }
    }
    else if (key === 'gstNo') {
        if (isBlur && value && String(value).length < 15) {
            return 'Incomplete'
        }
        if (hasLowerCase(value)) {
            return 'Enter uppercase only'
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
export const validateMobileNumber = (value, isBlur) => {
    if (isBlur && value && String(value).length < 10) {
        return 'Incomplete'
    }
    if (String(value).length === 10) {
        const isValid = isIndMobileNum(value)
        if (!isValid) return 'Invalid'
    }
    return ''
}