import {
    isStrictDigit, isAadharValid, isPANValid, isEmpty, isGSTValid, isAlphaOnly, isIFSCValid,
    isIndMobileNum, isAlphaNumOnly, isEmail, isStrictIntFloat, isIntFloat, isDLValid, isAlphaNum
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

export const validateRequired = (data) => {
    const errors = {}
    const text = 'Required'

    Object.entries(data).map(([key, value]) => {
        if (!value) errors[key] = text
        else if (!value.trim())
            errors[key] = text
    })

    return errors
}

export const validateIDProofs = (proofs, proofType) => {
    let errors = {};
    const text = 'Required'
    if (Object.keys(proofs).length) {
        const { Front, Back } = proofs;
        if (!Front) errors.Front = text
        if (proofType !== 'panNo' && !Back) errors.Back = text
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
        gstNo, panNo, adharNo, licenseNo, natureOfBussiness, organizationName, address, customerName,
        mobileNumber, invoicetype, creditPeriodInDays = "", EmailId, referredBy, idProofType,
        registeredDate, gstProof, depositAmount = "", departmentId, routeId, deliveryLocation, ...rest
    } = data

    if (customerType === 'Corporate') {
        if (!organizationName) errors.organizationName = text
        else {
            const error = validateNames(organizationName)
            error && (errors.organizationName = error)
        }
        if (!String(creditPeriodInDays)) errors.creditPeriodInDays = text
        else {
            const error = validateNumber(creditPeriodInDays)
            error && (errors.creditPeriodInDays = error)
        }
        if (!gstNo) errors.gstNo = text
        if (!gstProof) errors.gstProof = text
    }
    else {
        if (!isInView) { // General account form in add account screen
            if (!String(depositAmount)) errors.depositAmount = text
            else {
                const error = validateNumber(depositAmount)
                error && (errors.depositAmount = error)
            }
            if (!departmentId) errors.departmentId = text
            if (!routeId) errors.routeId = text
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
    if (referredBy) {
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
    if (licenseNo) {
        if (String(licenseNo).length < 16) errors.licenseNo = text2
        else {
            const error = validateIDNumbers('licenseNo', licenseNo)
            error && (errors.licenseNo = error)
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
        gstNo, gstProof, depositAmount = "", departmentId, routeId, phoneNumber, contactPerson, address,
        deliveryLocation, ...rest
    } = data

    if (!String(depositAmount)) errors.depositAmount = text
    else {
        const error = validateNumber(depositAmount)
        error && (errors.depositAmount = error)
    }
    if (!departmentId) errors.departmentId = text
    if (!routeId) errors.routeId = text
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
    const { shiftType, batchId, phLevel, TDS, ozoneLevel, managerName, ...rest } = data

    if (!shiftType) errors.shiftType = text
    if (!batchId) errors.batchId = text
    if (!phLevel) errors.phLevel = text
    else {
        const error = validateIntFloat(phLevel)
        error && (errors.phLevel = error)
    }
    if (!ozoneLevel) errors.ozoneLevel = text
    else {
        const error = validateIntFloat(ozoneLevel)
        error && (errors.ozoneLevel = error)
    }
    if (!TDS) errors.TDS = text
    else {
        const error = validateIntFloat(TDS)
        error && (errors.TDS = error)
    }
    if (!managerName) errors.managerName = text
    else {
        const error = validateNames(managerName)
        error && (errors.managerName = error)
    }

    const productErrors = validateProducts(rest)
    return { ...errors, ...productErrors }
}

export const validatePlantValues = (data) => {
    let errors = {};
    const text = 'Required'
    const text2 = 'Incomplete'
    const { gstNo, gstProof, departmentName, address, adminId, phoneNumber, city, state, pinCode } = data

    if (!adminId) errors.adminId = text
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
    if (phoneNumber) {
        const error = validateMobileNumber(phoneNumber)
        error && (errors.phoneNumber = error)
    }
    if (!departmentName) errors.departmentName = text
    else {
        const error = validateNames(departmentName)
        error && (errors.departmentName = error)
    }
    if (!city) errors.city = text
    else {
        const error = validateNames(city)
        error && (errors.city = error)
    }
    if (!state) errors.state = text
    else {
        const error = validateNames(state)
        error && (errors.state = error)
    }
    if (!pinCode) errors.pinCode = text
    else {
        const error = validatePinCode(pinCode)
        error && (errors.pinCode = error)
    }

    return errors
}

export const validateEmployeeValues = (data, employeeType) => {
    let errors = {};
    const text = 'Required'
    const text2 = 'Incomplete'
    const { userName, adharNo, parentName, gender, dob, mobileNumber, address, joinedDate, permanentAddress,
        accountNo, branchName, bankName, ifscCode, recruitedBy, roleId, licenseNo, emailid } = data

    if (!dob) errors.dob = text
    if (!joinedDate) errors.joinedDate = text
    if (!permanentAddress) errors.permanentAddress = text
    if (employeeType === 'Staff' && !roleId) errors.roleId = text
    if (employeeType === 'Driver' && !licenseNo) errors.licenseNo = text
    if (!address) errors.address = text
    if (!gender) errors.gender = text
    if (!emailid) errors.emailid = text
    else {
        const error = validateEmailId(emailid)
        error && (errors.emailid = error)
    }
    if (!branchName) errors.branchName = text
    else {
        const error = validateNames(branchName)
        error && (errors.branchName = error)
    }
    if (!bankName) errors.bankName = text
    else {
        const error = validateNames(bankName)
        error && (errors.bankName = error)
    }
    if (!recruitedBy) errors.recruitedBy = text
    else {
        const error = validateNames(recruitedBy)
        error && (errors.recruitedBy = error)
    }
    if (!userName) errors.userName = text
    else {
        const error = validateNames(userName)
        error && (errors.userName = error)
    }
    if (!accountNo) errors.accountNo = text
    else {
        const error = validateNumber(accountNo)
        error && (errors.accountNo = error)
    }
    if (!parentName) errors.parentName = text
    else {
        const error = validateNames(parentName)
        error && (errors.parentName = error)
    }
    if (!mobileNumber) errors.mobileNumber = text
    if (mobileNumber) {
        const error = validateMobileNumber(mobileNumber)
        error && (errors.mobileNumber = error)
    }
    if (!ifscCode) errors.ifscCode = text
    else {
        if (String(ifscCode).length < 11) errors.ifscCode = text2
        else {
            const error = validateIFSCCode(ifscCode)
            error && (errors.ifscCode = error)
        }
    }
    if (!adharNo) errors.adharNo = text
    else {
        if (String(adharNo).length < 12) errors.adharNo = text2
        else {
            const error = validateIDNumbers('adharNo', adharNo)
            error && (errors.adharNo = error)
        }
    }

    return errors
}
export const validateDependentValues = (data) => {
    let errors = {};
    const text = 'Required'
    const text2 = 'Incomplete'
    const { name, adharNo, gender, dob, relation, mobileNumber } = data

    if (!dob) errors.dob = text
    if (!gender) errors.gender = text
    if (!relation) errors.relation = text
    else {
        const error = validateNames(relation)
        error && (errors.relation = error)
    }
    if (!name) errors.name = text
    else {
        const error = validateNames(name)
        error && (errors.name = error)
    }
    if (!mobileNumber) errors.mobileNumber = text
    if (mobileNumber) {
        const error = validateMobileNumber(mobileNumber)
        error && (errors.mobileNumber = error)
    }
    if (!adharNo) errors.adharNo = text
    else {
        if (String(adharNo).length < 12) errors.adharNo = text2
        else {
            const error = validateIDNumbers('adharNo', adharNo)
            error && (errors.adharNo = error)
        }
    }

    return errors
}

export const validateQCValues = (data) => {
    let errors = {};
    const text = 'Required'
    const { shiftType, phLevel, TDS, ozoneLevel, managerName } = data

    if (!shiftType) errors.shiftType = text
    if (!phLevel) errors.phLevel = text
    else {
        const error = validateIntFloat(phLevel)
        error && (errors.phLevel = error)
    }
    if (!ozoneLevel) errors.ozoneLevel = text
    else {
        const error = validateIntFloat(ozoneLevel)
        error && (errors.ozoneLevel = error)
    }
    if (!TDS) errors.TDS = text
    else {
        const error = validateIntFloat(TDS)
        error && (errors.TDS = error)
    }
    if (!managerName) errors.managerName = text
    else {
        const error = validateNames(managerName)
        error && (errors.managerName = error)
    }

    return errors
}

export const validateQCcheckValues = (data, type) => {
    let errors = {};
    const text = 'Required'
    const { batchId, testResult, productionQcId, testType, description, phLevel, TDS, ozoneLevel, managerName } = data
    if (type === 'prod') {
        if (!productionQcId) errors.productionQcId = text
    }
    else if (!batchId) errors.batchId = text
    if (!testResult) errors.testResult = text
    if (!description) errors.description = text
    if (!phLevel) errors.phLevel = text
    else {
        const error = validateIntFloat(phLevel)
        error && (errors.phLevel = error)
    }
    if (!ozoneLevel) errors.ozoneLevel = text
    else {
        const error = validateIntFloat(ozoneLevel)
        error && (errors.ozoneLevel = error)
    }
    if (!TDS) errors.TDS = text
    else {
        const error = validateIntFloat(TDS)
        error && (errors.TDS = error)
    }
    if (!testType) errors.testType = text
    else {
        const error = validateNames(testType)
        error && (errors.testType = error)
    }
    if (!managerName) errors.managerName = text
    else {
        const error = validateNames(managerName)
        error && (errors.managerName = error)
    }

    return errors
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
    const { batchId, dispatchAddress, managerName, mobileNumber, ...rest } = data

    if (!batchId) errors.batchId = text
    if (!dispatchAddress) errors.dispatchAddress = text
    if (mobileNumber) {
        const error = validateMobileNumber(mobileNumber, true)
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
    const { itemName, itemQty, vendorName, description, reorderLevel, minOrderLevel } = data

    if (!itemName) errors.itemName = text
    if (!vendorName) errors.vendorName = text
    if (!description) errors.description = text
    if (!itemQty) errors.itemQty = text
    else {
        const error = validateNumber(itemQty)
        error && (errors.itemQty = error)
        if (Number(itemQty) < Number(minOrderLevel)) {
            errors.itemQty = `Quantity should exceed ${minOrderLevel}`
        }
    }
    if (!reorderLevel) errors.reorderLevel = text
    else {
        const error = validateNumber(reorderLevel)
        error && (errors.reorderLevel = error)
    }
    if (!minOrderLevel) errors.minOrderLevel = text
    else {
        const error = validateNumber(minOrderLevel)
        error && (errors.minOrderLevel = error)
    }

    return errors
}

export const validateReceivedMaterialValues = (data) => {
    let errors = {};
    const text = 'Required'
    const { receiptImage, receiptNo, invoiceNo, invoiceAmount, invoiceDate, taxAmount, managerName } = data

    if (!receiptImage) errors.receiptImage = text
    if (!invoiceDate) errors.invoiceDate = text
    if (!managerName) errors.managerName = text
    else {
        const error = validateNames(managerName)
        error && (errors.managerName = error)
    }
    if (!invoiceNo) errors.invoiceNo = text
    else {
        const error = validateNumber(invoiceNo)
        error && (errors.invoiceNo = error)
    }
    if (!invoiceAmount) errors.invoiceAmount = text
    else {
        const error = validateNumber(invoiceAmount)
        error && (errors.invoiceAmount = error)
    }
    if (!receiptNo) errors.receiptNo = text
    else {
        const error = validateNumber(receiptNo)
        error && (errors.receiptNo = error)
    }
    if (!taxAmount) errors.taxAmount = text
    else {
        const error = validateNumber(taxAmount)
        error && (errors.taxAmount = error)
    }

    return errors
}

const validateProducts = ({ product20L, product1L, product500ML, product250ML }) => {
    let errors = {};

    const noP20L = !Number(product20L)
    const noP1L = !Number(product1L)
    const noP500ML = !Number(product500ML)
    const noP250ML = !Number(product250ML)

    if (noP20L && noP1L && noP500ML && noP250ML) {
        errors.products = 'Atleast 1 product is required'
    }
    const error1 = validateNumber(product20L)
    const error2 = validateNumber(product1L)
    const error3 = validateNumber(product500ML)
    const error4 = validateNumber(product250ML)

    if (error1 || error2 || error3 || error4)
        errors.products = error1 || error2 || error3 || error4

    return errors
}

const validateDamagedProducts = ({ damaged20LCans, damaged1LBoxes, damaged500MLBoxes, damaged250MLBoxes }) => {
    let errors = {};

    const noP20L = !Number(damaged20LCans)
    const noP1L = !Number(damaged1LBoxes)
    const noP500ML = !Number(damaged500MLBoxes)
    const noP250ML = !Number(damaged250MLBoxes)

    if (noP20L && noP1L && noP500ML && noP250ML) {
        errors.damaged = 'Atleast 1 product is required'
    }
    const error1 = validateNumber(damaged20LCans)
    const error2 = validateNumber(damaged1LBoxes)
    const error3 = validateNumber(damaged500MLBoxes)
    const error4 = validateNumber(damaged250MLBoxes)

    if (error1 || error2 || error3 || error4)
        errors.damaged = error1 || error2 || error3 || error4

    return errors
}

const validateProductNPrice = ({ product20L, price20L, product1L, price1L,
    product500ML, price500ML, product250ML, price250ML }) => {
    let errors = {};

    const noP20L = !Number(product20L)
    const nop20L = !Number(price20L)
    const noP1L = !Number(product1L)
    const nop1L = !Number(price1L)
    const noP500ML = !Number(product500ML)
    const nop500ML = !Number(price500ML)
    const noP250ML = !Number(product250ML)
    const nop250ML = !Number(price250ML)

    if (noP20L && nop20L && noP1L && nop1L && noP500ML && nop500ML && noP250ML && nop250ML) {
        errors.productNPrice = 'Atleast 1 product is required'
    }
    else {
        if (!noP250ML || !nop250ML) {
            if (noP250ML) errors.productNPrice = 'Enter quantity for 250 ml'
            if (nop250ML) errors.productNPrice = 'Enter price for 250 ml'
        }
        if (!noP500ML || !nop500ML) {
            if (noP500ML) errors.productNPrice = 'Enter quantity for 500 ml'
            if (nop500ML) errors.productNPrice = 'Enter price for 500 ml'
        }
        if (!noP1L || !nop1L) {
            if (noP1L) errors.productNPrice = 'Enter quantity for 1 Ltrs'
            if (nop1L) errors.productNPrice = 'Enter price for 1 Ltrs'
        }
        if (!noP20L || !nop20L) {
            if (noP20L) errors.productNPrice = 'Enter quantity for 20 Ltrs'
            if (nop20L) errors.productNPrice = 'Enter price for 20 Ltrs'
        }
    }

    const error7 = validateNumber(product250ML)
    const error8 = validateNumber(price250ML)
    const error5 = validateNumber(product500ML)
    const error6 = validateNumber(price500ML)
    const error3 = validateNumber(product1L)
    const error4 = validateNumber(price1L)
    const error1 = validateNumber(product20L)
    const error2 = validateNumber(price20L)

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

export const validateDamagedWithArrived = (data, key) => {
    let errors = {};
    let textArray = []
    const { total20LCans = 1, total1LBoxes = 1, total250MLBoxes = 1, total500MLBoxes = 1,
        damaged20LCans, damaged1LBoxes, damaged500MLBoxes, damaged250MLBoxes } = data

    if (Number(damaged20LCans) > total20LCans) {
        textArray.push('20 Ltrs')
    }
    if (Number(damaged1LBoxes) > total1LBoxes) {
        textArray.push('1 Ltrs')
    }
    if (Number(damaged500MLBoxes) > total500MLBoxes) {
        textArray.push('500 Ml')
    }
    if (Number(damaged250MLBoxes) > total250MLBoxes) {
        textArray.push('250 Ml')
    }

    if (textArray.length) {
        errors[key] = `${textArray.join(',')} qty exceeds arrived stock`
    }

    return errors
}

export const validateDCValues = (data) => {
    let errors = {};
    const text = 'Required'
    const text2 = 'Incomplete'

    const { routeId, customerName, phoneNumber, address,
        driverId, twentyLCans, OneLBoxes, fiveHLBoxes, twofiftyLBoxes } = data

    if (!routeId) errors.routeId = text
    if (!driverId) errors.driverId = text
    if (!address) errors.address = text
    if (!phoneNumber) errors.phoneNumber = text
    else {
        if (String(phoneNumber).length < 10) errors.phoneNumber = text2
        else {
            const error = validateMobileNumber(phoneNumber)
            error && (errors.phoneNumber = error)
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

export const validateASValues = (data) => {
    let errors = {}
    let productErrors = {}
    const text = 'Required'

    const { isDamaged, damagedDesc, ...rest } = data

    if (isDamaged) {
        if (!damagedDesc) errors.damagedDesc = text
        productErrors = validateDamagedProducts(rest)

        if (isEmpty(productErrors)) {
            productErrors = validateDamagedWithArrived(rest, 'damaged')
        }
    }

    return { ...errors, ...productErrors }

}

export const validateAddresses = (data) => {
    let errors = {};
    for (let index = 0; index < data.length; index++) {
        const error = validateDeliveryValues(data[index])
        const devDaysError = validateDevDays(data[index]['devDays'])
        if (!isEmpty(error) || !isEmpty(devDaysError)) {
            errors[`address${index}`] = { ...error, ...devDaysError }
            errors.key = String(index)
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
    else if (key === 'licenseNo') {
        if (isBlur && value) {
            const isValid = isAlphaNum(value)
            if (!isValid) return 'Invalid'
        }
        if (isBlur && value && String(value).length < 16) {
            return 'Incomplete'
        }
        if (!isAlphaNum(value)) {
            return 'Enter aphanumeric only'
        }
        if (String(value).length === 16) {
            const isValid = isDLValid(value)
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

export const validatePinCode = (value, isBlur) => {
    if (isBlur && value) {
        const isValid = isStrictDigit(value)
        if (!isValid) return 'Invalid'
    }
    if (isBlur && value && String(value).length < 6) {
        return 'Incomplete'
    }
    if (value && !isStrictDigit(value)) {
        return 'Enter digits only'
    }
    return ''
}

export const validateIFSCCode = (value, isBlur) => {
    if (isBlur && value) {
        const isValid = isAlphaNum(value)
        if (!isValid) return 'Invalid'
    }
    if (isBlur && value && String(value).length < 11) {
        return 'Incomplete'
    }
    if (!isAlphaNum(value)) {
        return 'Enter aphanumeric only'
    }
    if (String(value).length === 11) {
        const isValid = isIFSCValid(value)
        if (!isValid) return 'Invalid'
    }
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