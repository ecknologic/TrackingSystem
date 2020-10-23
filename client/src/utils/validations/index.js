
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