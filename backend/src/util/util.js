
export function isNullUndefined(variable) {
    return variable == null;
}

export function isString(variable) {
    return typeof variable === 'string' || variable instanceof String;
}

export function isNumber(variable) {
    return typeof variable === 'number';
}

export function isArray(variable) {
    return Array.isArray(variable);
}

/**
 * Checks if object is a valid Date object (i.e. no Date("hello"))
 * Checks if object is a valid Date object (i.e. no Date("hello"))
 * @param date Any object
 * @returns {boolean} true/false
 */
export function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}