export function getStorage(key) {
    try {
        const data = localStorage.getItem(key)
        const result = JSON.parse(data)
        return result
    } catch (error) {
        console.log(error.message);
    }
}

export function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.log(error.message);
        
    }
}


export function removeStorage(key) {
    try {
        localStorage.removeItem(key)
    } catch (error) {
        console.log(error.message);
        
    }
}


export function clearStorage() {
    try {
        localStorage.clear()
    } catch (error) {
        console.log(error.message);
        
    }
}
