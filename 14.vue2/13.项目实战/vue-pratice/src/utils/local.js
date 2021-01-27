// 将对象转换成字符串
export const setLocal = (key, value) => {
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    localStorage.setItem(key, value);
}

// 将字符串转成object
export const getLocal = key => {
    try {
        return JSON.parse(localStorage.getItem(key))
    } catch () {
        return localStorage.getItem(key)
    }
}

window.setLocal = setLocal;
window.getLocal = getLocal;