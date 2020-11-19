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
        productErrors = validateProducts(rest)
    }


    if (gstNo && String(gstNo).length < 15) errors.gstNo = text2
    if (gstNo && !gstProof) errors.gstProof = text
    if (!gstNo && gstProof) errors.gstNo = text
    if (!address) errors.address = text
    if (!EmailId) errors.EmailId = text
    if (!referredBy) errors.referredBy = text
    if (!idProofType) errors.idProofType = text
    if (!invoicetype) errors.invoicetype = text
    if (!mobileNumber) errors.mobileNumber = text
    if (mobileNumber && String(mobileNumber) < 10) errors.mobileNumber = text2
    if (!customerName) errors.customerName = text
    if (!registeredDate) errors.registeredDate = text
    if (!natureOfBussiness) errors.natureOfBussiness = text
    if (panNo && String(panNo).length < 10) errors.panNo = text2
    if (adharNo && String(adharNo).length < 12) errors.adharNo = text2

    return { ...errors, ...productErrors }
}
export const validateDeliveryValues = (data) => {
    let errors = {};
    const text = 'Required'
    const text2 = 'Incomplete'
    const {
        gstNo, depositAmount, routingId, phoneNumber, contactPerson, address,
        deliveryLocation, ...rest
    } = data

    if (gstNo && String(gstNo).length < 15) errors.gst = text2
    if (!depositAmount) errors.depositAmount = text
    if (!routingId) errors.routingId = text
    if (!phoneNumber) errors.phoneNumber = text
    if (phoneNumber && String(phoneNumber).length < 10) errors.phoneNumber = text2
    if (!contactPerson) errors.contactPerson = text
    if (!address) errors.address = text
    if (!deliveryLocation) errors.deliveryLocation = text
    const productErrors = validateProducts(rest)
    return { ...errors, ...productErrors }
}

const validateProducts = ({ product20L, price20L, product1L, price1L, product500ML, price500ML }) => {
    let errors = {};
    const text = 'Required'
    if (product20L || price20L) {
        if (!product20L) errors.product20L = text
        if (!price20L) errors.price20L = text
    }
    if (product1L || price1L) {
        if (!product1L) errors.product1L = text
        if (!price1L) errors.price1L = text
    }
    if (product500ML || price500ML) {
        if (!product500ML) errors.product500ML = text
        if (!price500ML) errors.price500ML = text
    }
    if (!(product20L || price20L) && !(product1L || price1L) && !(product500ML || price500ML)) {
        errors.productNPrice = text
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
    // if (!value) return 'Required'
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