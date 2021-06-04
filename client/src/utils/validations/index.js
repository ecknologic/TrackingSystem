import {
    isStrictDigit, isAadharValid, isPANValid, isEmpty, isGSTValid, isAlphaOnly, isIFSCValid,
    isIndMobileNum, isAlphaNumOnly, isEmail, isStrictIntFloat, isIntFloat, isDLValid, isAlphaNum, getValidObject
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
    const valid = getValidObject(proofs)

    if (!isEmpty(valid)) {
        const { Front, Back } = proofs;
        if (!Front) errors.Front = text
        if (proofType !== 'panNo' && !Back) errors.Back = text
    }
    // else errors = { Front: text, Back: text }

    return errors
}

export const validateDevDays = (days) => {
    let errors = {};
    const text = 'Required'
    if (isEmpty(days)) errors = { devDays: text }

    return errors
}

export const validateAccountValues = (data, customerType, isInView) => {
    let errors = {};
    let productErrors = {}
    const text = 'Required'
    const {
        gstNo, panNo, adharNo, licenseNo, natureOfBussiness, organizationName, address, customerName, deliveryLocation,
        mobileNumber, invoicetype, creditPeriodInDays = "", EmailId, referredBy, idProofType, pinCode, alternatePhNo,
        contractPeriod, dispenserCount = "", registeredDate, gstProof, depositAmount = "", departmentId, routeId,
        salesAgent, contactPerson, ...rest
    } = data

    if (customerType === 'Corporate') {
        if (!organizationName) errors.organizationName = text
        if (!contractPeriod) errors.contractPeriod = text
        if (!contactPerson) errors.contactPerson = text
        if (dispenserCount === null || !String(dispenserCount)) errors.dispenserCount = text
        // if (!gstNo) errors.gstNo = text
        // if (!gstProof) errors.gstProof = text
    }
    else {
        if (!customerName) errors.customerName = text
        if (!isInView) { // General account form in add account screen
            if (!departmentId) errors.departmentId = text
            if (!routeId) errors.routeId = text
            productErrors = validateProductNPrice(rest)
        }
    }

    // if (gstNo && !gstProof) errors.gstProof = text
    // if (!gstNo && gstProof) errors.gstNo = text
    if (!address) errors.address = text
    // if (!idProofType) errors.idProofType = text
    // if (idProofType && !data[idProofType]) errors[idProofType] = text
    if (!invoicetype) errors.invoicetype = text
    if (!registeredDate) errors.registeredDate = text
    if (!natureOfBussiness) errors.natureOfBussiness = text
    if (!pinCode) errors.pinCode = text
    if (!salesAgent) errors.salesAgent = text
    else {
        const error = validatePinCode(pinCode)
        error && (errors.pinCode = error)
    }
    if (referredBy) {
        const error = validateNames(referredBy)
        error && (errors.referredBy = error)
    }
    if (alternatePhNo) {
        const error = validateNumber(alternatePhNo)
        error && (errors.alternatePhNo = error)
    }
    if (creditPeriodInDays === null || !String(creditPeriodInDays)) errors.creditPeriodInDays = text
    else {
        const error = compareMaxNumber(creditPeriodInDays, 90, 'days')
        error && (errors.creditPeriodInDays = error)
    }
    if (depositAmount === null || !String(depositAmount)) errors.depositAmount = text
    else {
        const error = validateNumber(depositAmount)
        error && (errors.depositAmount = error)
    }
    if (!EmailId) errors.EmailId = text
    else {
        const error = validateEmailId(EmailId)
        error && (errors.EmailId = error)
    }
    if (!mobileNumber) errors.mobileNumber = text
    else {
        const error = validateMobileNumber(mobileNumber, true)
        error && (errors.mobileNumber = error)
    }
    if (panNo) {
        const error = validateIDNumbers('panNo', panNo, true)
        error && (errors.panNo = error)
    }
    if (adharNo) {
        const error = validateIDNumbers('adharNo', adharNo, true)
        error && (errors.adharNo = error)
    }
    if (licenseNo) {
        const error = validateIDNumbers('licenseNo', licenseNo, true)
        error && (errors.licenseNo = error)
    }

    return { ...errors, ...productErrors }
}
export const validateDeliveryValues = (data) => {
    let errors = {};
    const text = 'Required'
    const {
        gstNo, gstProof, departmentId, routeId, phoneNumber, contactPerson, address, deliveryLocation, ...rest
    } = data

    if (!departmentId) errors.departmentId = text
    if (!contactPerson) errors.contactPerson = text
    if (!routeId) errors.routeId = text
    if (!address) errors.address = text
    // if (gstNo && !gstProof) errors.gstProof = text
    // if (!gstNo && gstProof) errors.gstNo = text
    if (!phoneNumber) errors.phoneNumber = text
    else {
        const error = validateMobileNumber(phoneNumber, true)
        error && (errors.phoneNumber = error)
    }
    if (!deliveryLocation) errors.deliveryLocation = text

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
    const { gstNo, gstProof, departmentName, address, adminId, phoneNumber, city, state, pinCode } = data

    if (!adminId) errors.adminId = text
    if (!address) errors.address = text
    if (gstNo && !gstProof) errors.gstProof = text
    if (!gstNo && gstProof) errors.gstNo = text
    if (phoneNumber) {
        const error = validateMobileNumber(phoneNumber, true)
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
        const error = validateMobileNumber(mobileNumber, true)
        error && (errors.mobileNumber = error)
    }
    if (!ifscCode) errors.ifscCode = text
    else {
        const error = validateIFSCCode(ifscCode, true)
        error && (errors.ifscCode = error)
    }
    if (!adharNo) errors.adharNo = text
    else {
        const error = validateIDNumbers('adharNo', adharNo, true)
        error && (errors.adharNo = error)
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
        const error = validateMobileNumber(mobileNumber, true)
        error && (errors.mobileNumber = error)
    }
    if (!adharNo) errors.adharNo = text
    else {
        const error = validateIDNumbers('adharNo', adharNo, true)
        error && (errors.adharNo = error)
    }

    return errors
}
export const validateDistributorValues = (data) => {
    let errors = {};
    const text = 'Required'
    const { agencyName, gstNo, gstProof, operationalArea, contactPerson, mobileNumber, address,
        alternateNumber, mailId, alternateMailId, deliveryLocation, ...rest } = data

    if (mailId && alternateMailId) {
        if (mailId.trim() === alternateMailId.trim()) {
            errors.alternateMailId = 'Duplicate'
        }
    }
    if (mobileNumber && alternateNumber) {
        if (mobileNumber == alternateNumber) {
            errors.alternateNumber = 'Duplicate'
        }
    }
    if (!deliveryLocation) errors.deliveryLocation = text
    if (!address) errors.address = text
    if (!gstProof) errors.gstProof = text
    if (!gstNo) errors.gstNo = text
    if (!mobileNumber) errors.mobileNumber = text
    else {
        const error = validateMobileNumber(mobileNumber, true)
        error && (errors.mobileNumber = error)
    }
    if (alternateNumber) {
        const error = validateMobileNumber(alternateNumber, true)
        error && (errors.alternateNumber = error)
    }
    if (!agencyName) errors.agencyName = text
    else {
        const error = validateNames(agencyName)
        error && (errors.agencyName = error)
    }
    if (!contactPerson) errors.contactPerson = text
    else {
        const error = validateNames(contactPerson)
        error && (errors.contactPerson = error)
    }
    if (!operationalArea) errors.operationalArea = text
    else {
        const error = validateNames(operationalArea)
        error && (errors.operationalArea = error)
    }
    if (!mailId) errors.mailId = text
    else {
        const error = validateEmailId(mailId)
        error && (errors.mailId = error)
    }
    if (alternateMailId) {
        const error = validateEmailId(alternateMailId)
        error && (errors.alternateMailId = error)
    }

    let productErrors = validateProductNPrice(rest)
    return { ...errors, ...productErrors }
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

export const validateEnquiryValues = (data) => {
    let errors = {};
    const text = 'Required'
    const { customerName, mobileNumber, address, EmailId, accountStatus, salesAgent, revisitDate, contactperson, customertype, state, city, ...rest } = data

    if (!customerName) errors.customerName = text
    if (!address) errors.address = text
    if (!accountStatus) errors.accountStatus = text
    if (!salesAgent) errors.salesAgent = text
    if (!contactperson) errors.contactperson = text
    if (!customertype) errors.customertype = text
    if (!state) errors.state = text
    if (!city) errors.city = text

    if (accountStatus !== 'notintrested') {
        if (!revisitDate) errors.revisitDate = text
    }
    if (!mobileNumber) errors.mobileNumber = text
    else {
        const error = validateMobileNumber(mobileNumber, true)
        error && (errors.mobileNumber = error)
    }
    if (!EmailId) errors.EmailId = text
    else {
        const error = validateEmailId(EmailId)
        error && (errors.EmailId = error)
    }

    return errors
}

export const validateProductValues = (data) => {
    let errors = {};
    const text = 'Required'
    const { productName, price, tax, hsnCode } = data;
    if (!price) errors.price = text;
    else {
        const error = validateIntFloat(price, true);
        if (error) errors.price = error;
    }
    if (!tax) errors.tax = text;
    else {
        const error = validateIntFloat(tax, true);
        if (error) errors.tax = error;
        else if (tax > 100) errors.tax = 'Should not exceed 100';
    }
    if (!productName) errors.productName = text;
    else {
        const isValid = isAlphaNum(productName);
        if (!isValid) errors.productName = 'Enter aphanumeric only';
    }
    if (!hsnCode) errors.hsnCode = text;
    else {
        const error = validateNumber(hsnCode);
        error && (errors.hsnCode = error)
    }
    return errors
}

export const validateInvoiceValues = (data, isWHAdmin) => {
    let errors = {};
    const text = 'Required'
    const { customerId, customerName, poNo, hsnCode, invoiceDate, dueDate,
        TAndC, fromDate, toDate, products, dcNo } = data;

    if (isWHAdmin) {
        if (!customerName) errors.customerName = text;
        if (!dcNo) errors.dcNo = text;
        if (!TAndC) errors.TAndC = text;
        if (isEmpty(products)) errors.products = 'Atleast 1 product is required'
        else {
            const error = validateTableProducts(products)
            if (error) errors.products = error
        }
    }
    else {
        if (!customerId) errors.customerId = text;
        if (!dueDate) errors.dueDate = text;
        if (!fromDate) errors.fromDate = text;
        if (!toDate) errors.toDate = text;
    }

    if (!invoiceDate) errors.invoiceDate = text;
    if (poNo) {
        const error = validateNumber(poNo);
        error && (errors.poNo = error)
    }
    if (!hsnCode) errors.hsnCode = text;
    else {
        const error = validateNumber(hsnCode);
        error && (errors.hsnCode = error)
    }

    return errors
}

const validateTableProducts = (products) => {
    let error = ''
    const length = products.length
    for (let index = 0; index < length; index++) {
        const element = products[index];
        const { productName } = element
        if (!productName) {
            error = 'One or more fields in the table are empty'
            break
        }
    }

    return error
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
        const error = validateMobileNumber(mobileNumber, true)
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
        const error = validateMobileNumber(mobileNumber, true, true)
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

const validateProducts = ({ product20L, product2L, product1L, product500ML, product300ML }) => {
    let errors = {};

    const noP20L = !Number(product20L)
    const noP2L = !Number(product2L)
    const noP1L = !Number(product1L)
    const noP500ML = !Number(product500ML)
    const noP300ML = !Number(product300ML)

    if (noP20L && noP2L && noP1L && noP500ML && noP300ML) {
        errors.products = 'Atleast 1 product is required'
    }
    const error1 = validateNumber(product20L)
    const error2 = validateNumber(product2L)
    const error3 = validateNumber(product1L)
    const error4 = validateNumber(product500ML)
    const error5 = validateNumber(product300ML)

    if (error1 || error2 || error3 || error4 || error5)
        errors.products = error1 || error2 || error3 || error4 || error5

    return errors
}

const validateDamagedProducts = ({ damaged20LCans, damaged2LBoxes, damaged1LBoxes, damaged500MLBoxes, damaged300MLBoxes }) => {
    let errors = {};

    const noP20L = !Number(damaged20LCans)
    const noP2L = !Number(damaged2LBoxes)
    const noP1L = !Number(damaged1LBoxes)
    const noP500ML = !Number(damaged500MLBoxes)
    const noP300ML = !Number(damaged300MLBoxes)

    if (noP20L && noP2L && noP1L && noP500ML && noP300ML) {
        errors.damaged = 'Atleast 1 product is required'
    }
    const error1 = validateNumber(damaged20LCans)
    const error2 = validateNumber(damaged2LBoxes)
    const error3 = validateNumber(damaged1LBoxes)
    const error4 = validateNumber(damaged500MLBoxes)
    const error5 = validateNumber(damaged300MLBoxes)

    if (error1 || error2 || error3 || error4 || error5)
        errors.damaged = error1 || error2 || error3 || error4 || error5

    return errors
}

const validateProductNPrice = ({ product20L, product2L, price20L, product1L, price2L, price1L,
    product500ML, price500ML, product300ML, price300ML }) => {
    let errors = {};

    const noP20L = !Number(product20L)
    const nop20L = !Number(price20L)
    const noP2L = !Number(product2L)
    const nop2L = !Number(price2L)
    const noP1L = !Number(product1L)
    const nop1L = !Number(price1L)
    const noP500ML = !Number(product500ML)
    const nop500ML = !Number(price500ML)
    const noP300ML = !Number(product300ML)
    const nop300ML = !Number(price300ML)

    if (noP20L && nop20L && noP2L && nop2L && noP1L && nop1L && noP500ML && nop500ML && noP300ML && nop300ML) {
        errors.productNPrice = 'Atleast 1 product is required'
    }
    else {
        if (!noP300ML || !nop300ML) {
            if (noP300ML) errors.productNPrice = 'Enter quantity for 300 ml'
            if (nop300ML) errors.productNPrice = 'Enter price for 300 ml'
        }
        if (!noP500ML || !nop500ML) {
            if (noP500ML) errors.productNPrice = 'Enter quantity for 500 ml'
            if (nop500ML) errors.productNPrice = 'Enter price for 500 ml'
        }
        if (!noP1L || !nop1L) {
            if (noP1L) errors.productNPrice = 'Enter quantity for 1 Ltrs'
            if (nop1L) errors.productNPrice = 'Enter price for 1 Ltrs'
        }
        if (!noP2L || !nop2L) {
            if (noP2L) errors.productNPrice = 'Enter quantity for 2 Ltrs'
            if (nop2L) errors.productNPrice = 'Enter price for 2 Ltrs'
        }
        if (!noP20L || !nop20L) {
            if (noP20L) errors.productNPrice = 'Enter quantity for 20 Ltrs'
            if (nop20L) errors.productNPrice = 'Enter price for 20 Ltrs'
        }
    }

    const error7 = validateNumber(product300ML)
    const error5 = validateNumber(product500ML)
    const error1 = validateNumber(product20L)
    const error9 = validateNumber(product2L)
    const error3 = validateNumber(product1L)
    const error8 = validateIntFloat(price300ML, true)
    const error6 = validateIntFloat(price500ML, true)
    const error4 = validateIntFloat(price1L, true)
    const error2 = validateIntFloat(price20L, true)
    const error10 = validateIntFloat(price2L, true)

    if (error1 || error2 || error3 || error4 || error5 || error6 || error7 || error8 || error9 || error10)
        errors.productNPrice = error1 || error2 || error3 || error4 || error5 || error6 || error7 || error8 || error9 || error10


    return errors
}

export const validateProductsInStock = (inStock, products, key) => {
    let errors = {};
    let textArray = []
    const { product20L, product2L, product1L, product500ML, product300ML } = products
    const { product20LCount, product2LCount, product1LCount, product500MLCount, product300MLCount } = inStock

    if (Number(product20L) > product20LCount) {
        textArray.push('20 Ltrs')
    }
    if (Number(product2L) > product2LCount) {
        textArray.push('2 Ltrs')
    }
    if (Number(product1L) > product1LCount) {
        textArray.push('1 Ltrs')
    }
    if (Number(product500ML) > product500MLCount) {
        textArray.push('500 Ml')
    }
    if (Number(product300ML) > product300MLCount) {
        textArray.push('300 Ml')
    }

    if (!isEmpty(textArray)) {
        errors[key] = `${textArray.join(',')} qty exceeds current stock`
    }

    return errors
}

export const compareDispatchValues = (products, inStock) => {
    let outOfStock = 1
    const { product20L, product2L, product1L, product500ML, product300ML } = products
    const { product20LCount, product2LCount, product1LCount, product500MLCount, product300MLCount } = inStock

    if (Number(product20L) !== product20LCount) {
        outOfStock = 0
    }
    if (Number(product2L) !== product2LCount) {
        outOfStock = 0
    }
    if (Number(product1L) !== product1LCount) {
        outOfStock = 0
    }
    if (Number(product500ML) !== product500MLCount) {
        outOfStock = 0
    }
    if (Number(product300ML) !== product300MLCount) {
        outOfStock = 0
    }

    return outOfStock
}

export const validateDamagedWithArrived = (data, key) => {
    let errors = {};
    let textArray = []
    const { product20L = 1, product2L = 1, product1L = 1, product300ML = 1, product500ML = 1,
        damaged20LCans, damaged2LBoxes, damaged1LBoxes, damaged500MLBoxes, damaged300MLBoxes } = data

    if (Number(damaged20LCans) > product20L) {
        textArray.push('20 Ltrs')
    }
    if (Number(damaged2LBoxes) > product2L) {
        textArray.push('2 Ltrs')
    }
    if (Number(damaged1LBoxes) > product1L) {
        textArray.push('1 Ltrs')
    }
    if (Number(damaged500MLBoxes) > product500ML) {
        textArray.push('500 Ml')
    }
    if (Number(damaged300MLBoxes) > product300ML) {
        textArray.push('300 Ml')
    }

    if (!isEmpty(textArray)) {
        errors[key] = `${textArray.join(',')} qty exceeds arrived stock`
    }

    return errors
}

export const validateDCValues = (data) => {
    let errors = {};
    const text = 'Required'

    const { routeId, customerName, customerType, existingCustomerId, phoneNumber, address,
        driverId, distributorId, EmailId, deliveryLocation, ...rest } = data

    const isDistributor = customerType === 'distributor'
    const isExistingCustomer = customerType === 'internal'
    if (!EmailId) errors.EmailId = text
    else {
        const error = validateEmailId(EmailId)
        error && (errors.EmailId = error)
    }

    if (isDistributor) {
        if (!routeId) errors.routeId = text
        if (!driverId) errors.driverId = text
        if (!distributorId) errors.distributorId = text
    }
    else {
        if (routeId || driverId) {
            if (!routeId) errors.routeId = text
            if (!driverId) errors.driverId = text
        }

        if (isExistingCustomer) {
            if (!existingCustomerId) errors.existingCustomerId = text
        }
        else {
            if (!customerName) errors.customerName = text
            else {
                const error = validateNames(customerName)
                error && (errors.customerName = error)
            }
        }
    }

    if (!address) errors.address = text
    if (!deliveryLocation) errors.deliveryLocation = text
    if (!phoneNumber) errors.phoneNumber = text
    else {
        const error = validateMobileNumber(phoneNumber, true)
        error && (errors.phoneNumber = error)
    }
    const productErrors = validateProductNPrice(rest)
    return { ...errors, ...productErrors }
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

export const validateDSValues = (data) => {
    let errors = {}
    const text = 'Required'

    const { details, ...rest } = data
    if (!details) errors.details = text

    const productErrors = validateDamagedProducts(rest)
    return { ...errors, ...productErrors }
}

export const validateRECValues = (data) => {
    let errors = {}
    const text = 'Required'

    const { motherplantId, driverId, vehicleId, details, emptycans_count } = data

    if (!Number(emptycans_count)) errors.emptycans_count = text
    else {
        const error = validateNumber(emptycans_count)
        if (error) errors.emptycans_count = error
    }
    if (!motherplantId) errors.motherplantId = text
    if (!driverId) errors.driverId = text
    if (!vehicleId) errors.vehicleId = text
    if (!details) errors.details = text
    if (!emptycans_count) errors.details = text

    return errors
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
        // if (isBlur && value && String(value).length < 16) {
        //     return 'Incomplete'
        // }
        if (!isAlphaNum(value)) {
            return 'Enter aphanumeric only'
        }
        // if (String(value).length === 16) {
        //     const isValid = isDLValid(value)
        //     if (!isValid) return 'Invalid'
        // }
    }
    else if (key === 'rocNo') {
        if (isBlur && value) {
            const isValid = isStrictDigit(value)
            if (!isValid) return 'Invalid'
        }
        if (value && !isStrictDigit(value)) {
            return 'Enter digits only'
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

export const compareMaxNumber = (value, max, unit) => {
    const error = validateNumber(value)
    if (error) return error
    if (Number(value) > max) {
        return `Should not exceed ${max} ${unit}`
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
        if (!isValid) return 'Invalid format'
    }
    if (value) {
        const isValid = isIntFloat(value)
        if (!isValid) return 'Enter digits only'
    }
    return ''
}