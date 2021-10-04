const notificationQueries = require("../../dbQueries/notifications/queries")
const usersQueries = require("../../dbQueries/users/queries")
const { getSocketIo } = require("../../sockets")
const { notificationConstants } = require("./constants")
const { notificationContent } = require("./content")

const emitSocketToUsers = (data, userIds) => {
    if (userIds.length) {
        for (let i of userIds) {
            let messageId = notificationConstants.RECEIVE_NOTIFICATION + i.userId
            getSocketIo().emit(`${messageId}`, data)
        }
    }
}

const createNotifications = async ({ id, name, userName, isSuperAdminApproved, userId, dispatchTo, status, warehouseId, motherplantId }, key) => {
    let notificationData = await notificationContent[key]({ id, name, userName, isSuperAdminApproved, status, userId, dispatchTo, warehouseId, motherplantId })
    if (notificationData.userIds && notificationData.userIds.length && notificationData.userRoles && notificationData.userRoles.length) {
        usersQueries.getUserIdsByRole(notificationData.userRoles, (err, userIds) => {
            if (err) console.log('Err', err)
            else {
                insertNotificationsToDB({ notificationData, userIds: [...notificationData.userIds, ...userIds] })
            }
        })
    }
    else if (notificationData.userIds && notificationData.userIds.length) {
        insertNotificationsToDB({ notificationData, userIds: notificationData.userIds })
    }
    else if (notificationData.userRoles && notificationData.userRoles.length) {
        usersQueries.getUserIdsByRole(notificationData.userRoles, (err, userIds) => {
            if (err) console.log('Err', err)
            else {
                if (userIds.length) {
                    if (key == 'customerApproved') userIds = [...userIds, { userId }]
                    insertNotificationsToDB({ notificationData, userIds })
                }
            }
        })
    } else {
        console.log('Else Condition', JSON.stringify(notificationData))
    }
}

const insertNotificationsToDB = ({ notificationData, userIds }) => {
    notificationQueries.createNotification(notificationData, (notificationErr, results) => {
        if (notificationErr) console.log('notificationErr', notificationErr)
        else {
            const notificationId = results.insertId;
            notificationQueries.createNotificationUsers({ userIds, notificationId }, (notifyUsersErr, data) => {
                if (notifyUsersErr) console.log('notifyUsersErr', notifyUsersErr)
                else {
                    emitSocketToUsers({ ...notificationData, notificationId }, userIds)
                }
            })
        }
    })
}
module.exports = { emitSocketToUsers, createNotifications }