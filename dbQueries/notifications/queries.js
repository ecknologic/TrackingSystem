const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let notificationQueries = {}



notificationQueries.getNotifications = (userId, callback) => {
    let query = `Select n.*,nu.isRead from Notifications n INNER JOIN NotificationUsers nu on n.notificationId=nu.notificationId WHERE nu.userId=? ORDER BY n.createdDateTime DESC`;
    return executeGetParamsQuery(query, [userId], callback)
}

notificationQueries.createNotification = (input, callback) => {
    const { title, description, navigationUrl } = input;
    let query = `insert into Notifications (title,description,navigationUrl,createdDateTime) values(?,?,?,?)`;
    let requestBody = [title, description, navigationUrl, new Date()]
    return executePostOrUpdateQuery(query, requestBody, callback)
}

notificationQueries.createNotificationUsers = (input, callback) => {
    const { userIds, notificationId } = input;
    const sql = userIds.map(item => "(" + item.userId + ", " + notificationId + ")")
    let query = `insert into NotificationUsers (userId, notificationId) values ` + sql;
    return executeGetQuery(query, callback)
}

notificationQueries.updateNotificationStatus = (input, callback) => {
    const { userId, notificationId } = input;
    let query = `update NotificationUsers SET isRead=? WHERE userId=? AND notificationId=?`;
    return executeGetParamsQuery(query, [1, userId, notificationId], callback)
}

module.exports = notificationQueries