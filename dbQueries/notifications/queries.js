const { executeGetQuery, executeGetParamsQuery, executePostOrUpdateQuery } = require('../../utils/functions.js');
let notificationQueries = {}



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

module.exports = notificationQueries