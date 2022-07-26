import { transform, isEqual, isArray, isObject } from 'lodash';

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
export function difference(origObj: any, newObj: any) {
  function changes(newObj: any, origObj: any) {
    let arrayIndexCounter = 0;

    return transform(newObj, function (result: any, value, key) {
      if (!isEqual(value, origObj[key])) {
        let resultKey = isArray(origObj) ? arrayIndexCounter++ : key;

        result[resultKey] = (isObject(value) && isObject(origObj[key])) ? changes(value, origObj[key]) : value;
      }
    });
  }

  return changes(newObj, origObj);
}

const removeProperty = (propKey: string, { [propKey]: propValue, ...rest }) => rest;

/**
 * Remove properties from any object
 * @param  {object} object - Source object
 * @param  {strings} keys  - Keys to remove
 * @return {object} updated object
 */
export function removeProperties(object: any, ...keys: any): any {
  return (keys.length ? removeProperties(removeProperty(keys.pop(), object), ...keys) : object);
}
