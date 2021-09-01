var express = require('express');
var router = express.Router();
const reportsQueries = require('../../dbQueries/reports/index.js');
const { utils } = require('../../utils/functions.js');
let userId, adminUserName, userRole;

router.use(function timeLog(req, res, next) {
  userId = req.headers['userid']
  adminUserName = req.headers['username']
  userRole = req.headers['userrole']
  next();
});

router.get('/getNewCustomerBT', (req, res) => {
  reportsQueries.getNewCustomerBTDetails(req.query, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results)
  })
})

router.get('/getClosedCustomersReport', (req, res) => {
  reportsQueries.getClosedCustomersReport(req.query, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results)
  })
})

router.get('/getViabilityReport', (req, res) => {
  reportsQueries.getDispensersViabilityReport(req.query, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results)
  })
})

router.get('/getEnquiriesCount', (req, res) => {
  reportsQueries.getEnquiriesCountBySalesAgent(req.query, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else res.json(results)
  })
})

router.get('/getVisitedCustomersReport', (req, res) => {
  if (userRole != 'MarketingManager') req.query.staffId = userId
  reportsQueries.getVisitedCustomersReport(req.query, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else {
      reportsQueries.getVisitedCustomersReportByStatus(req.query, (err, results1) => {
        if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
        else {
          let onboardedCustomers = 0, pendingApprovals = 0
          if (results1.length) {
            if (results1[0].isApproved == 1) {
              onboardedCustomers = results1[0]?.customersCount
              pendingApprovals = results1[1]?.customersCount
            } else {
              pendingApprovals = results1[0]?.customersCount
              onboardedCustomers = results1[1]?.customersCount
            }
          }
          res.json({ ...results[0], onboardedCustomers, pendingApprovals })
        }
      })
    }
  })
})

router.get('/getInactiveCustomersReport', (req, res) => {
  const { startDate, endDate } = req.query;
  // const { startDate = '2021-08-31', endDate = '2021-08-31' } = req.query; Testing
  reportsQueries.getInActiveCustomersReport({ startDate, endDate }, (err, results) => {
    if (err) res.status(500).json({ status: 500, message: err.sqlMessage });
    else if (results.length) {
      let customerIds = results.map(item => item.customerId)
      let { startDate: prevStartDate, endDate: prevEndDate } = utils.getPrevMonthStartAndEndDates(1, startDate)
      reportsQueries.getInActiveCustomersInvoiceDetails({ customerIds, startDate: prevStartDate, endDate: prevEndDate }, (err1, data) => {
        if (err1) res.status(500).json({ status: 500, message: err1.sqlMessage });
        else {
          let finalData = mergeArrayObjects('customerId', results, data)
          res.json(finalData)
        }
      })
    }
    else res.json(results)
  })
})

function mergeArrayObjects(key, arr1, ...arr2) {
  let merged = [];

  for (let i = 0; i < arr1.length; i++) {
    const currentItem = arr1[i];
    let resultItem = { ...currentItem }

    arr2.map(item => {
      const found = item.find((itmInner) => itmInner[key] === currentItem[key]) || {}
      resultItem = { ...resultItem, ...found }
    })

    merged.push(resultItem)
  }
  return merged
}

router.get('/getCollectionPerformance', (req, res) => {
  const { startDate, endDate } = utils.getPrevMonthStartAndEndDates(2)
  // const startDate = '2021-08-01', endDate = '2021-08-30'
  Promise.all([
    getOpeningAmount({ startDate, endDate }),
    getLastMonthInvoiceAmount({ startDate, endDate }),
    getReceivedAmountAsOnDate({ startDate, endDate }),
    getReceivedCountAsOnDate({ startDate, endDate })
  ]).then(results => {
    let data = mergeArrayObjects('createdBy', results[0], results[1], results[2], results[3])
    // let data1 = mergeArrayObjects(data, results[2])
    // let data2 = mergeArrayObjects(data1, results[3])
    let finalData = []
    data.map(item => {
      const { openingAmount, lastMonthAmount, receivedAmount, openingCount, lastMonthCount, receivedCount } = item
      item.closingAmount = Number((Number(openingAmount) + Number(lastMonthAmount)) - Number(receivedAmount)).toFixed(2)
      item.closingCount = (Number(openingCount) + Number(lastMonthCount)) - Number(receivedCount)
      item.performance = Number((receivedAmount / lastMonthAmount) * 100).toFixed(2)
      item.performanceCount = Number((receivedCount / lastMonthCount) * 100).toFixed(2)
      finalData.push(item)
    })
    res.json(finalData)
  })
})

const getOpeningAmount = ({ startDate, endDate }) => {
  return new Promise((resolve) => {
    reportsQueries.getOpeningValuesBySalesAgent({ startDate, endDate }, (err, results) => {
      if (err) resolve([])
      else resolve(results)
    })
  })
}

const getLastMonthInvoiceAmount = ({ startDate, endDate }) => {
  return new Promise((resolve) => {
    reportsQueries.getLastMonthInvoiceAmountBySalesAgent({ startDate, endDate }, (err, results) => {
      if (err) resolve([])
      else resolve(results)
    })
  })
}

const getReceivedAmountAsOnDate = ({ startDate, endDate }) => {
  return new Promise((resolve) => {
    reportsQueries.getReceivedAmountAsOnDate({ startDate, endDate }, (err, results) => {
      if (err) resolve([])
      else resolve(results)
    })
  })
}

const getReceivedCountAsOnDate = ({ startDate, endDate }) => {
  return new Promise((resolve) => {
    reportsQueries.getReceivedCountAsOnDate({ startDate, endDate }, (err, results) => {
      if (err) resolve([])
      else resolve(results)
    })
  })
}


module.exports = router;
