/**
 * Takes a key/value pair and returns the corresponding encoded query string to represent it
 * @param key
 * @param value
 * @returns {*}
 */
function encodePair(key, value) {
  if (typeof key !== 'string') {
    return '';
  }

  // for arrays we repeat the key without braces
  if (Array.isArray(value)) {
    return value.map(val => encodePair(key, val)).join('&');
  }

  return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
}

/**
 * Convert a parameter object to an encoded query string
 * @param params object
 * @returns {*} query string
 */
export default function toQueryString(params) {
  if (typeof params !== 'object' || params === null) {
    return '';
  }

  return Object.keys(params)
    .map(k => encodePair(k, params[ k ]))
    .join('&');
}