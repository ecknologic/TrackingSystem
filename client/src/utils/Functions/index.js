const editData = (updatedItem, data, idField) => {
    return new Promise(resolve => {
        if (data.length) {
            const updatedData = []
            data.map(item => {
                console.log("editData", idField, updatedItem, item)
                if (item[idField] === updatedItem[idField]) {
                    console.log("editData------->")
                    item = updatedItem
                }
                updatedData.push(item)
            })
            resolve(updatedData)
        } else resolve([])
    })
}
module.exports = { editData }