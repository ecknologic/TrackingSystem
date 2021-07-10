import { Menu, Select } from 'antd';
import React from 'react';
const { Option } = Select;

export const MONTHSFULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const WEEKDAYS = ["ALL", "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
export const bloodGroupOptions = [
    <Option key='1' value="A+">A+</Option>,
    <Option key='2' value="A-">A-</Option>,
    <Option key='3' value="B+">B+</Option>,
    <Option key='4' value="B-">B-</Option>,
    <Option key='5' value="O+">O+</Option>,
    <Option key='6' value="O-">O-</Option>,
    <Option key='7' value="AB+">AB+</Option>,
    <Option key='8' value="AB-">AB-</Option>,
]
export const idOptions = [
    <Option key='1' value="adharNo">Aadhar</Option>,
    <Option key='2' value="panNo">PAN</Option>,
    <Option key='3' value="voterId">Voter ID</Option>,
    <Option key='4' value="licenseNo">Driving License</Option>,
    <Option key='5' value="passportNo">Passport</Option>
]
export const corpIdOptions = [
    <Option key='1' value="panNo">PAN</Option>,
    <Option key='2' value="rocNo">ROC</Option>
]
export const statusOptions = [
    <Option key='1' value={1}>Active</Option>,
    <Option key='2' value={0}>Draft</Option>
]
export const AccountStatusOptions = [
    <Option key='1' value='revisit'>Revisit</Option>,
    <Option key='2' value='notintrested'>Not Interested</Option>
]
export const genderOptions = [
    <Option key='1' value='Male'>Male</Option>,
    <Option key='2' value='Female'>Female</Option>,
    <Option key='3' value='TransGender'>TransGender</Option>
]
export const statusFilterList = [
    { value: 0, name: 'Draft' },
    { value: 1, name: 'Active' }
]
export const accountFilterList = [
    { value: 'Corporate', name: 'Corporate' },
    { value: 'Individual', name: 'Individual' }
]
export const shiftOptions = [
    <Option key="1" value="Morning">Morning</Option>,
    <Option key="2" value="Evening">Evening</Option>,
    <Option key="3" value="Night">Night</Option>
]
export const invoiceOptions = [
    <Option key="1" value="complimentary">Complimentary</Option>,
    <Option key="2" value="nonComplimentary">Non Complimentary</Option>
]
export const numOptions = [
    <Option key="1" value={1}>01</Option>,
    <Option key="2" value={2}>02</Option>,
    <Option key="3" value={3}>03</Option>,
    <Option key="4" value={4}>04</Option>,
    <Option key="5" value={5}>05</Option>,
    <Option key="6" value={6}>06</Option>,
    <Option key="7" value={7}>07</Option>
]
export const dayOptions = [
    <Option key="0" value="ALL">ALL</Option>,
    <Option key="1" value="MON">MON</Option>,
    <Option key="2" value="TUE">TUE</Option>,
    <Option key="3" value="WED">WED</Option>,
    <Option key="4" value="THU">THU</Option>,
    <Option key="5" value="FRI">FRI</Option>,
    <Option key="6" value="SAT">SAT</Option>,
    <Option key="7" value="SUN">SUN</Option>
]
export const productOptions = [
    <Option key="1" value="p1">Product 1</Option>,
    <Option key="2" value="p2">Product 2</Option>,
    <Option key="3" value="p3">Product 3</Option>,
    <Option key="4" value="p4">Product 4</Option>,
    <Option key="5" value="p5">Product 5</Option>,
    <Option key="6" value="p6">Product 6</Option>,
    <Option key="7" value="p7">Product 7</Option>
]
export const testResultOptions = [
    <Option key="1" value="Approved">Approve</Option>,
    <Option key="2" value="Rejected">Reject</Option>
]
export const accountTypeOptions = [
    <Option key="1" value="Corporate">Corporate</Option>,
    <Option key="2" value="Individual">Individual</Option>
]
export const calendarMenu = [
    <Menu.Item key="Till Now" >Till Now</Menu.Item>,
    <Menu.Item key="Today" >Today</Menu.Item>,
    <Menu.Item key="This Week">This Week</Menu.Item>,
    <Menu.Item key="This Month" >This Month</Menu.Item>,
    <Menu.Item key="Date Range" >Date Range</Menu.Item>
]
export const calendarOptions = [
    <Option key="1" value="Till Now">Till Now</Option>,
    <Option key="2" value="Today">Today</Option>,
    <Option key="3" value="This Week">This Week</Option>,
    <Option key="4" value="This Month">This Month</Option>,
    <Option key="5" value="Date Range">Date Range</Option>
]
export const shiftMenu = [
    <Menu.Item key="Morning" >Morning</Menu.Item>,
    <Menu.Item key="Evening">Evening</Menu.Item>,
    <Menu.Item key="Night" >Night</Menu.Item>,
    <Menu.Item key="All" >All</Menu.Item>
]
export const getDefaultOptions = (options = []) => {
    return options.map((item) => ({ value: item.value, name: item.name }))
}
export const getDropdownOptions = (options = []) => {
    return options.map((item) => <Option key={item.value} value={item.value}>{item.name}</Option>)
}
export const getCreatorOptions = (creators = []) => {
    return creators.map((item) => ({ value: item.userId, name: item.userName }))
}
export const getDepartmentMenu = (departments = []) => {
    return departments.map((item) => <Menu.Item key={item.departmentName} >{item.departmentName}</Menu.Item>)
}
export const getProductOptions = (products = []) => {
    return products.map((item) => <Option key={item.productId} value={item.productName}>{item.productName}</Option>)
}
export const getDDownOptions = (options = []) => {
    return options.map((item) => <Option key={item.dropdownId} value={item.value}>{item.value}</Option>)
}
export const getDCOptions = (options = []) => {
    return options.map((item) => <Option key={item.dcNo} value={item.dcNo}>{item.dcNo}</Option>)
}
export const getCustomerOptions = (customers = []) => {
    return customers.map((item) => <Option key={item.customerId} value={item.customerId}>{item.customerName}</Option>)
}
export const getCustomerIdOptions = (customers = []) => {
    return customers.map((item) => <Option key={item.customerId} value={item.customerId}>{item.customerNo}</Option>)
}
export const getWarehouseOptions = (warehouses = []) => {
    return warehouses.map((item) => <Option key={item.departmentId} value={item.departmentId}>{item.departmentName}</Option>)
}
export const getDistributorOptions = (distributors = []) => {
    return distributors.map((item) => <Option key={item.distributorId} value={item.distributorId}>{item.agencyName}</Option>)
}
export const getRouteOptions = (routes = []) => {
    return routes.map((item) => <Option key={item.RouteId} value={item.RouteId}>{item.RouteName}</Option>)
}
export const getBatchIdOptions = (batches = []) => {
    return batches.map((item) => <Option key={item.batchId} value={item.batchId}>{item.batchId}</Option>)
}
export const getStaffOptions = (staff = []) => {
    return staff.map((item) => <Option key={item.userId} value={item.userId}>{item.userName}</Option>)
}
export const getRoleOptions = (roles = []) => {
    return roles.map((item) => <Option key={item.RoleId} disabled={item.disabled} value={item.RoleId}>{item.RoleLabel}</Option>)
}
export const getBatchOptions = (batches = []) => {
    return batches.map((item) => <Option key={item.productionQcId} value={item.productionQcId}>{item.batchId}</Option>)
}
export const getDriverOptions = (drivers = []) => {
    return drivers.map((item) => <Option key={item.driverId} value={item.driverId}>{item.driverName}</Option>)
}
export const getDepartmentOptions = (departments = []) => {
    return departments.map((item, index) => <Option key={index} value={item.departmentId}>{item.departmentName}</Option>)
}
export const getVehicleOptions = (vehicles = []) => {
    return vehicles.map((item) => <Option key={item.vehicleId} value={item.vehicleId}>{item.vehicleNo}</Option>)
}

export const vehicleColumns = [
    {
        title: 'Vehicle Number',
        dataIndex: 'vehicleNo',
        key: 'vehicleNo',
    },
    {
        title: 'Vehicle Name',
        dataIndex: 'vehicleName',
        key: 'vehicleName',
    },
    {
        title: 'Vehicle Type',
        dataIndex: 'vehicleType',
        key: 'vehicleType',
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    },
]

export const routeColumns = [
    {
        title: 'Route Name',
        dataIndex: 'RouteName',
        key: 'RouteName',
    },
    {
        title: 'Route Description',
        dataIndex: 'RouteDescription',
        key: 'RouteDescription',
    },
    {
        title: 'Department',
        dataIndex: 'departmentName',
        key: 'departmentName',
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    },
]
export const getEmptyCanColumns = (department) => {

    const columns = [
        {
            title: 'Return ID',
            dataIndex: 'returnId',
            key: 'returnId',
        },
        {
            title: 'Date',
            dataIndex: 'dateAndTime',
            key: 'dateAndTime',
        },
        {
            title: '20L Cans',
            dataIndex: 'emptycans_count',
            key: 'emptycans_count',
        },
        {
            title: 'Mother Plant',
            dataIndex: 'departmentName',
            key: 'departmentName',
        },
        {
            title: 'Driver',
            key: 'driverName',
            dataIndex: 'driverName',
        },
        {
            title: 'Phone Number',
            key: 'mobileNumber',
            dataIndex: 'mobileNumber',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action'
        },
    ]

    if (department === 'motherplant') {
        columns.splice(3, 1, {
            title: 'Warehouse',
            dataIndex: 'departmentName',
            key: 'departmentName'
        })
    }

    return columns
}
export const productColumns = [
    {
        title: 'HSN Code',
        dataIndex: 'hsnCode',
        key: 'hsnCode',
    },
    {
        title: 'Product Name',
        dataIndex: 'productName',
        key: 'productName',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Tax Percentage',
        dataIndex: 'tax',
        key: 'tax',
    },
    {
        title: 'Total Amount',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    },
]

export const receiptColumns = [
    {
        title: 'Date',
        dataIndex: 'receiptDate',
        key: 'receiptDate',
    },
    {
        title: 'Receipt Number',
        dataIndex: 'receiptNumber',
        key: 'receiptNumber',
    },
    {
        title: 'Customer ID',
        dataIndex: 'customerId',
        key: 'customerId',
    },
    {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
    },
    {
        title: 'Deposit Amount',
        dataIndex: 'depositAmount',
        key: 'depositAmount',
    },
    {
        title: 'No of Cans',
        dataIndex: 'noOfCans',
        key: 'noOfCans',
    },
    {
        title: 'Payment Mode',
        dataIndex: 'paymentMode',
        key: 'paymentMode',
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    },
]

export const roleColumns = [
    {
        title: 'Role Label',
        dataIndex: 'RoleLabel',
        key: 'RoleLabel',
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    },
]

export const getInvoiceColumns = (type) => {
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Invoice Number',
            dataIndex: 'invoiceId',
            key: 'invoiceId',
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Billing Address',
            dataIndex: 'billingAddress',
            key: 'billingAddress',
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
        },
        {
            title: 'Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
        },
        {
            title: 'Balance Due',
            dataIndex: 'pendingAmount',
            key: 'pendingAmount',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action'
        },
    ]

    if (type === 'single') {
        columns.splice(2, 1)
    }
    else if (type === 'dcNo') {
        columns.splice(4, 1, {
            title: 'DC Number',
            dataIndex: 'dcNo',
            key: 'dcNo',
        })
    }
    else if (type === 'warehouse') {
        columns.splice(3, 0, {
            title: 'Warehouse',
            dataIndex: 'departmentName',
            key: 'departmentName',
        })
    }

    return columns
}

export const paymentColumns = [
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Invoice Number',
        dataIndex: 'invoiceId',
        key: 'invoiceId',
    },
    {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
    },
    {
        title: 'Billing Address',
        dataIndex: 'billingAddress',
        key: 'billingAddress',
    },
    {
        title: 'Mode',
        dataIndex: 'paymentMode',
        key: 'paymentMode',
    },
    {
        title: 'Amount',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    },
]

export const getDeliveryColumns = (type) => {
    const columns = [
        {
            title: 'DC Number',
            dataIndex: 'dcnumber',
            key: 'dcnumber',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'shopAddress',
            key: 'shopAddress',
        },
        {
            title: 'Route',
            dataIndex: 'route',
            key: 'route',
        },
        {
            title: 'Driver',
            key: 'driverName',
            dataIndex: 'driverName',
        },
        {
            title: 'Order Details',
            dataIndex: 'orderDetails',
            key: 'routeorderDetails',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action'
        },
    ]

    if (type === 'date') {
        columns.splice(1, 0, {
            title: 'Date & time',
            dataIndex: 'dateAndTime',
            key: 'dateAndTime',
        })
    }

    if (type === 'extra') {
        columns.splice(1, 0, {
            title: 'Date & time',
            dataIndex: 'dateAndTime',
            key: 'dateAndTime',
        })
        columns.splice(6, 0, {
            title: 'Return Cans',
            dataIndex: 'returnEmptyCans',
            key: 'returnEmptyCans',
        })
    }

    return columns
}

export const orderColumns = [
    {
        title: 'Order ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Contact Person',
        dataIndex: 'contactPerson',
        key: 'contactPerson',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Order Details',
        dataIndex: 'orderDetails',
        key: 'orderDetails',
    },
    {
        title: 'Route',
        dataIndex: 'route',
        key: 'route',
    },
    {
        title: 'Driver',
        dataIndex: 'driverName',
        key: 'driverName',
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    },
]

export const getStockColumns = (isDamaged, adminType) => {

    const columns = [
        {
            title: 'DC Number',
            dataIndex: 'dcNo',
            key: 'dcNo',
        },
        {
            title: 'Date & time',
            dataIndex: 'dateAndTime',
            key: 'dateAndTime',
        },
        {
            title: 'Mother Plant',
            dataIndex: 'departmentName',
            key: 'departmentName',
        },
        {
            title: 'Stock Details',
            dataIndex: 'stockDetails',
            key: 'stockDetails',
        },
        {
            title: 'Driver',
            dataIndex: 'driverName',
            key: 'driverName',
        },
        {
            title: 'Phone Number',
            dataIndex: 'mobileNumber',
            key: 'mobileNumber',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action'
        },
    ]

    if (isDamaged) {
        columns.splice(3, 1, {
            title: 'Damage Details',
            dataIndex: 'stockDetails',
            key: 'stockDetails',
        })
    }

    if (adminType === 'MPAdmin') {
        columns.splice(2, 1, {
            title: 'Warehouse',
            dataIndex: 'departmentName',
            key: 'departmentName'
        })
    }

    return columns;
}

export const damagedStockColumns = [
    {
        title: 'Batch No',
        dataIndex: 'batchId',
        key: 'batchId',
    },
    {
        title: 'Date & time',
        dataIndex: 'dateAndTime',
        key: 'dateAndTime',
    },
    {
        title: 'Stock Details',
        dataIndex: 'stockDetails',
        key: 'stockDetails',
    },
    {
        title: 'Manager',
        dataIndex: 'managerName',
        key: 'managerName',
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    }
]

export const todayDeliveryColumns = [
    {
        title: 'DC Number',
        dataIndex: 'DCNO',
        key: 'DCNO',
    },
    {
        title: 'Dispatch To',
        dataIndex: 'dispatchAddress',
        key: 'dispatchAddress',
    },
    {
        title: 'Production Details',
        dataIndex: 'production',
        key: 'production',
    },
    {
        title: 'Driver Name',
        dataIndex: 'driverName',
        key: 'driverName',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    }
]

export const productionColumns = [
    {
        title: 'Batch No',
        dataIndex: 'batchId',
        key: 'batchId',
    },
    {
        title: 'Production Details',
        dataIndex: 'productionDetails',
        key: 'productionDetails',
    },
    {
        title: 'PH',
        dataIndex: 'phLevel',
        key: 'phLevel',
    },
    {
        title: 'Ozone Level',
        key: 'ozoneLevel',
        dataIndex: 'ozoneLevel',
    },
    {
        title: 'TDS',
        dataIndex: 'TDS',
        key: 'TDS',
    },
    {
        title: 'Date & time',
        dataIndex: 'dateAndTime',
        key: 'dateAndTime',
    },
    {
        title: 'Shift Type',
        dataIndex: 'shiftType',
        key: 'shiftType'
    },
    {
        title: 'Manager',
        dataIndex: 'managerName',
        key: 'managerName'
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    },
]

export const currentStockColumns = [
    {
        title: 'Product Name',
        dataIndex: 'itemName',
        key: 'itemName',
    },
    {
        title: 'Item Code',
        dataIndex: 'itemCode',
        key: 'itemCode',
    },
    {
        title: 'Reorder Level',
        dataIndex: 'reorderLevel',
        key: 'reorderLevel',
    },
    {
        title: 'Current Quantity',
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
    },
    {
        title: 'Damaged',
        dataIndex: 'damagedCount',
        key: 'damagedCount',
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    }
]

export const getDispatchColumns = (type) => {

    const columns = [
        {
            title: 'DC Number',
            dataIndex: 'dcnumber',
            key: 'dcnumber',
        },
        {
            title: 'Batch No',
            dataIndex: 'batchId',
            key: 'batchId',
        },
        {
            title: 'Production Details',
            dataIndex: 'productionDetails',
            key: 'productionDetails',
        },
        {
            title: 'Vehicle No',
            dataIndex: 'vehicleNo',
            key: 'vehicleNo',
        },
        {
            title: 'Driver',
            key: 'driverName',
            dataIndex: 'driverName',
        },
        {
            title: 'Dispatch To',
            dataIndex: 'dispatchTo',
            key: 'dispatchTo',
        },
        {
            title: 'Date & time',
            dataIndex: 'dateAndTime',
            key: 'dateAndTime',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action'
        },
    ]

    if (type === 'external') {
        columns.splice(3, 2)
    }

    return columns

}

export const getReceivedRMColumns = (isSuperAdmin) => {

    const columns = [
        {
            title: 'Order Id',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: 'Invoice No',
            dataIndex: 'invoiceNo',
            key: 'invoiceNo',
        },
        {
            title: 'Date of Invoice',
            dataIndex: 'dateAndTime',
            key: 'dateAndTime',
        },
        {
            title: 'Quantity',
            dataIndex: 'itemQty',
            key: 'itemQty',
        },
        {
            title: 'Product Details',
            dataIndex: 'itemName',
            key: 'itemName',
        },
        {
            title: 'Vendor Name',
            dataIndex: 'vendorName',
            key: 'vendorName',
        },
        {
            title: 'Invoice Value',
            key: 'invoiceAmount',
            dataIndex: 'invoiceAmount',
        },
        {
            title: 'Tax Amount',
            dataIndex: 'taxAmount',
            key: 'taxAmount',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action'
        }
    ]

    if (isSuperAdmin) {
        columns.splice(7, 1, {
            title: 'Warehouse',
            dataIndex: 'departmentName',
            key: 'departmentName'
        })
    }

    return columns
}

export const internalQCColumns = [
    {
        title: 'Batch ID',
        dataIndex: 'batchId',
        key: 'batchId',
    },
    {
        title: 'Date & Time',
        dataIndex: 'dateAndTime',
        key: 'dateAndTime',
    },
    {
        title: 'Shift Type',
        dataIndex: 'shiftType',
        key: 'shiftType',
    },
    {
        title: 'Manager',
        dataIndex: 'managerName',
        key: 'managerName',
    },
    {
        title: 'PH',
        dataIndex: 'phLevel',
        key: 'phLevel',
    },
    {
        title: 'Ozone Level',
        dataIndex: 'ozoneLevel',
        key: 'ozoneLevel',
    },
    {
        title: 'TDS',
        key: 'TDS',
        dataIndex: 'TDS',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action'
    }
]

export const testedBatchesColumns = [
    {
        title: 'Batch ID',
        dataIndex: 'batchId',
        key: 'batchId',
    },
    {
        title: 'Request Date',
        dataIndex: 'dateAndTime',
        key: 'dateAndTime',
    },
    {
        title: 'Request Inputs',
        dataIndex: 'reqInputs',
        key: 'reqInputs',
    },
    {
        title: 'Tested Date',
        dataIndex: 'testedDate',
        key: 'testedDate',
    },
    {
        title: 'Level-1 Inputs',
        dataIndex: 'testInputs',
        key: 'testInputs',
    },
    {
        title: 'Tested Manager',
        dataIndex: 'managerName',
        key: 'managerName',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    }
]

export const productionTBColumns = [
    {
        title: 'Batch ID',
        dataIndex: 'batchId',
        key: 'batchId',
    },
    {
        title: 'Level-1 Inputs',
        dataIndex: 'level1',
        key: 'level1',
    },
    {
        title: 'Level-2 Inputs',
        dataIndex: 'level2',
        key: 'level2',
    },
    // {
    //     title: 'Level-3 Inputs',
    //     dataIndex: 'level3',
    //     key: 'level3',
    // },
    // {
    //     title: 'Level-4 Inputs',
    //     dataIndex: 'level4',
    //     key: 'level4',
    // },
    {
        title: 'Tested Manager',
        dataIndex: 'managerName',
        key: 'managerName',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    }
]

export const getRMColumns = (type, isSuperAdmin) => {

    let statusText = 'Approval Status'
    let dateText = 'Date'

    if (type === 'add') {
        statusText = 'Confirm Order'
        dateText = 'Approval Date'
    }

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: dateText,
            dataIndex: 'dateAndTime',
            key: 'dateAndTime',
        },
        {
            title: 'Quantity',
            dataIndex: 'itemQty',
            key: 'itemQty',
        },
        {
            title: 'Product Details',
            dataIndex: 'itemName',
            key: 'itemName',
        },
        {
            title: 'Vendor Name',
            dataIndex: 'vendorName',
            key: 'vendorName',
        },
        {
            title: 'Reorder level',
            key: 'reorderLevel',
            dataIndex: 'reorderLevel',
        },
        {
            title: 'Min Order level',
            dataIndex: 'minOrderLevel',
            key: 'minOrderLevel',
        },
        {
            title: statusText,
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action'
        },
    ]

    if (isSuperAdmin) {
        columns.splice(5, 2, {
            title: 'Warehouse',
            dataIndex: 'departmentName',
            key: 'departmentName'
        })
    }
    if (type === 'add') {
        columns.pop()
    }

    return columns
}

export const defaultBars = [
    {
        name: "20 Ltrs",
        label: "20 Ltrs",
        value: 0
    },
    {
        name: "2 Ltrs",
        label: "2 Ltrs",
        value: 0
    },
    {
        name: "1 Ltrs",
        label: "1 Ltrs",
        value: 0
    },
    {
        name: "500 ml",
        label: "500 ml",
        value: 0
    },
    {
        name: "300 ml",
        label: "300 ml",
        value: 0
    }
]

export const defaultPie = [
    {
        type: 'Cleared Invoices',
        value: 0,
    },
    {
        type: 'Pending to Clear',
        value: 0,
    }
]
export const newCustomersReportColumns = [
    {
        title: 'S. No',
        dataIndex: 'sNo',
        key: 'sNo',
    },
    {
        title: 'Customer ID',
        dataIndex: 'customerNo',
        key: 'customerNo',
    },
    {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
    },
    {
        title: 'Executive Name',
        dataIndex: 'salesAgent',
        key: 'salesAgent',
    },
    {
        title: 'No. of Bottles Placed',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Price',
        dataIndex: 'productPrice',
        key: 'productPrice',
    },
    {
        title: 'Deposit',
        dataIndex: 'depositAmount',
        key: 'depositAmount',
    },
    {
        title: 'Dispensers Placed',
        dataIndex: 'dispenserCount',
        key: 'dispenserCount',
    }
]
export const closedCustomersReportColumns = [
    {
        title: 'S. No',
        dataIndex: 'sNo',
        key: 'sNo',
    },
    {
        title: 'Customer ID',
        dataIndex: 'customerId',
        key: 'customerId',
    },
    {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
    },
    {
        title: 'Deposit',
        dataIndex: 'depositAmount',
        key: 'depositAmount',
    },
    {
        title: 'No. of Bottles with Customer',
        dataIndex: 'noOfBottlesWithCustomer',
        key: 'noOfBottlesWithCustomer',
    },
    {
        title: 'Amount Due',
        dataIndex: 'pendingAmount',
        key: 'pendingAmount',
    },
    {
        title: 'Status of Closure',
        dataIndex: 'closureStatus',
        key: 'closureStatus',
    }
]
export const dispensersViabilityReportColumns = [
    {
        title: 'S. No',
        dataIndex: 'sNo',
        key: 'sNo',
    },
    {
        title: 'Customer ID',
        dataIndex: 'customerId',
        key: 'customerId',
    },
    {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Invoice Amount',
        dataIndex: 'invoiceAmount',
        key: 'invoiceAmount',
    },
    {
        title: 'No. of Coolers Placed',
        dataIndex: 'dispenserCount',
        key: 'dispenserCount',
    }
]