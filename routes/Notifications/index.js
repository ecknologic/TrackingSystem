var express = require('express');
const notificationQueries = require('../../dbQueries/notifications/queries');
var router = express.Router();
const { dbError } = require('../../utils/functions');
let departmentId, userId;
//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    departmentId = req.headers['departmentid']
    userId = req.headers['userid']
    next();
});

router.get('/getNotifications', (req, res) => {
    notificationQueries.getNotifications(userId, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});

router.put('/updateNotificationStatus/:notificationId', (req, res) => {
    notificationQueries.updateNotificationStatus({ notificationId: req.params.notificationId, userId }, (err, results) => {
        if (err) res.status(500).json(dbError(err));
        else res.json(results);
    });
});

module.exports = router;

