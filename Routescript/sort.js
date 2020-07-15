const merge = require("lodash/mergeWith");
const objA = {bob: ['data']};
const objB = {bob: ['thung'], that: 'doh'};

function customizer(objValue, srcValue) {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  }

console.log(merge(objA, objB, customizer));