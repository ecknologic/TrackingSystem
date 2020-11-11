
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
    const text = 'Required'
    const {
        gstNo, natureOfBussiness, organizationName, address, customerName,
        mobileNumber, invoicetype, creditPeriodInDays, EmailId, referredBy, idProofType,
        registeredDate, gstProof, depositAmount, contactPerson
    } = data

    if (customerType === 'Corporate') {
        if (!organizationName) errors.organizationName = text
        if (!natureOfBussiness) errors.natureOfBussiness = text
        if (!creditPeriodInDays) errors.creditPeriodInDays = text
    }
    else {
        if (!depositAmount) errors.depositAmount = text
        if (!contactPerson) errors.contactPerson = text
    }

    if (!gstNo) errors.gstNo = text
    if (!address) errors.address = text
    if (!EmailId) errors.EmailId = text
    if (!gstProof) errors.gstProof = text
    if (!referredBy) errors.referredBy = text
    if (!idProofType) errors.idProofType = text
    if (!invoicetype) errors.invoicetype = text
    if (!mobileNumber) errors.mobileNumber = text
    if (!customerName) errors.customerName = text
    if (!registeredDate) errors.registeredDate = text

    return errors
}
export const validateDeliveryValues = (data) => {
    let errors = {};
    const text = 'Required'
    const {
        gstNo, depositAmount, routingId, phoneNumber, contactPerson, address,
        deliveryLocation, product20L, price20L, product1L, price1L, product500ML, price500ML
    } = data

    if (!gstNo) errors.gstNo = text
    if (!depositAmount) errors.depositAmount = text
    if (!routingId) errors.routingId = text
    if (!phoneNumber) errors.phoneNumber = text
    if (!contactPerson) errors.contactPerson = text
    if (!address) errors.address = text
    if (!deliveryLocation) errors.deliveryLocation = text
    if (!product20L) errors.product20L = text
    if (!price20L) errors.price20L = text
    if (!product1L) errors.product1L = text
    if (!price1L) errors.price1L = text
    if (!product500ML) errors.product500ML = text
    if (!price500ML) errors.price500ML = text

    return errors
}

export const validateAddresses = (data) => {
    let errors = {};
    for (let index = 0; index < data.length; index++) {
        const error = validateDeliveryValues(data[index])
        if (error) {
            errors[`address${index}`] = error
            break;
        }
    }

    return errors
}