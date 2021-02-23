import { Menu, Select } from 'antd';
import React from 'react';
const { Option } = Select;

export const WEEKDAYS = ["ALL", "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
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
export const businessOptions = [
    <Option key='1' value="SoftwareAndIT">Software & IT</Option>,
    <Option key='2' value="HealthAndPharma">Health & Pharma</Option>,
    <Option key='3' value="RestaurantAndHospitality">Restaurant & Hospitality</Option>,
    <Option key='4' value="MediaAndAdvertising">Media & Advertising</Option>,
    <Option key='5' value="Manufacturers">Manufacturers</Option>,
    <Option key='6' value="Corporate Offices">Corporate Offices</Option>,
]
export const statusOptions = [
    <Option key='1' value={1}>Active</Option>,
    <Option key='2' value={0}>Draft</Option>
]
export const genderOptions = [
    <Option key='1' value='Male'>Male</Option>,
    <Option key='2' value='Female'>Female</Option>,
    <Option key='3' value='TransGender'>TransGender</Option>
]
export const statusFilterOptions = [
    { value: 0, option: 'Draft' },
    { value: 1, option: 'Active' }
]
export const accountFilterOptions = [
    { value: 'Corporate', option: 'Corporate' },
    { value: 'Individual', option: 'Individual' }
]
export const businessFilterOptions = [
    { value: 'Residential', option: 'Residential' },
    { value: 'Software', option: 'Software' },
    { value: 'Corporate', option: 'Corporate' },
    { value: 'Traders', option: 'Traders' }
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
export const calendarMenu = [
    <Menu.Item key="Today" >Today</Menu.Item>,
    <Menu.Item key="This Week">This Week</Menu.Item>,
    <Menu.Item key="This Month" >This Month</Menu.Item>,
    <Menu.Item key="Date Range" >Date Range</Menu.Item>
]
export const calendarOptions = [
    <Option key="1" value="Today">Today</Option>,
    <Option key="2" value="This Week">This Week</Option>,
    <Option key="3" value="This Month">This Month</Option>,
    <Option key="4" value="Date Range">Date Range</Option>,
]
export const shiftMenu = [
    <Menu.Item key="Morning" >Morning</Menu.Item>,
    <Menu.Item key="Evening">Evening</Menu.Item>,
    <Menu.Item key="Night" >Night</Menu.Item>,
    <Menu.Item key="All" >All</Menu.Item>
]
export const getDepartmentMenu = (departments = []) => {
    return departments.map((item) => <Menu.Item key={item.departmentName} >{item.departmentName}</Menu.Item>)
}
export const getProductOptions = (products = []) => {
    return products.map((item) => <Option key={item.productId} value={item.productName}>{item.productName}</Option>)
}
export const getDDownOptions = (options = []) => {
    return options.map((item) => <Option key={item.dropdownId} value={item.value}>{item.value}</Option>)
}
export const getCustomerOptions = (customers = []) => {
    return customers.map((item) => <Option key={item.customerId} value={item.customerId}>{item.customerName}</Option>)
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
export const getMaterialOpitons = (materials = [{ name: 'Caps' }, { name: 'Bottles' }]) => {
    return materials.map((item, index) => <Option key={index} value={item.name}>{item.name}</Option>)
}
export const getVendorOptions = (vendors = [{ name: 'Balaji Industries' }, { name: 'Praveen Builders' }]) => {
    return vendors.map((item, index) => <Option key={index} value={item.name}>{item.name}</Option>)
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
export const invoiceColumns = [
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
        title: 'Due Date',
        dataIndex: 'dueDate',
        key: 'dueDate',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'Balance Due',
        dataIndex: 'balanceDue',
        key: 'balanceDue',
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
export const deliveryColumns = [
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

export const receivedStockColumns = [
    {
        title: 'DC Number',
        dataIndex: 'dcNo',
        key: 'dcNo',
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
        title: 'Batch Id',
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
        title: 'QA Status',
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
        title: 'Batch Id',
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
        title: 'Batch Id',
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
    {
        title: 'Level-3 Inputs',
        dataIndex: 'level3',
        key: 'level3',
    },
    {
        title: 'Level-4 Inputs',
        dataIndex: 'level4',
        key: 'level4',
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

export const dummyWaterResults = [
    {
        "levels": [
            {
                "tds": 35,
                "phLevel": 6.5,
                "qcLevel": "1",
                "ozoneLevel": 5.5,
                "testResult": "Approved",
                "managerName": "Naveen",
                "testingDate": "2021-01-30 06:36:59.000000"
            },
            {
                "tds": 45,
                "phLevel": 5.5,
                "qcLevel": "2",
                "ozoneLevel": 6.5,
                "testResult": "Approved",
                "managerName": "Chandra",
                "testingDate": "2021-01-30 06:38:06.000000"
            }
        ],
        "batchId": "A-3001-21",
        "departmentName": "Patancheruvu Plant"
    },
    {
        "levels": [
            {
                "tds": 1,
                "phLevel": 1,
                "qcLevel": "1",
                "ozoneLevel": 1,
                "testResult": "Approved",
                "managerName": "MANAGER ",
                "testingDate": "2021-02-03 16:54:29.000000"
            },
            {
                "tds": 3,
                "phLevel": 3,
                "qcLevel": "2",
                "ozoneLevel": 3,
                "testResult": "Approved",
                "managerName": "DESCRIPTION",
                "testingDate": "2021-02-03 16:56:32.000000"
            }
        ],
        "batchId": "A-0302-22",
        "departmentName": "Gajuwaka Plant"
    },
    {
        "levels": [
            {
                "tds": 1,
                "phLevel": 1,
                "qcLevel": "1",
                "ozoneLevel": 1,
                "testResult": "Approved",
                "managerName": "MANAGER ",
                "testingDate": "2021-02-03 16:54:29.000000"
            },
            {
                "tds": 3,
                "phLevel": 3,
                "qcLevel": "2",
                "ozoneLevel": 3,
                "testResult": "Approved",
                "managerName": "DESCRIPTION",
                "testingDate": "2021-02-03 16:56:32.000000"
            }
        ],
        "batchId": "A-0302-23",
        "departmentName": "Kukatpally Plant"
    }
]