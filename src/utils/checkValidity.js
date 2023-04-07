module.exports = {
    checkValidity: () => {

    },
    checkValidityOfInputData: (key, obj) => {
        let result = true;
        key.forEach(element => {
            if (!JSON.parse(JSON.stringify(obj)).hasOwnProperty(element)) {
                result = false;
            }
        });
        return result;
    },
    isNumber: (n) => {
        return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
    },
    isEmpty: (key, obj) => {
        if (obj[key].toString().trim()) {
            return false;
        }
        return true;
    }
}