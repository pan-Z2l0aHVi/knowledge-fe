import { isAllArray, isArray, isEmptyArray, isEqualArray } from './array'
import { isAllBoolean, isBoolean } from './boolean'
import { isAllFunction, isFunction } from './function'
import { isAllNull, isNull } from './null'
import { isAllNumber, isNumber } from './number'
import { isAllObject, isEmptyObject, isObject, isPlainObject } from './object'
import { isAllString, isString } from './string'
import { isAllUndefined, isUndefined } from './undefined'

const object = isObject as typeof isObject & {
	empty: typeof isEmptyObject
	plain: typeof isPlainObject
}
object.empty = isEmptyObject
object.plain = isPlainObject

const array = isArray as typeof isArray & {
	empty: typeof isEmptyArray
	equal: typeof isEqualArray
}
array.empty = isEmptyArray
array.equal = isEqualArray

export default {
	undefined: isUndefined,
	null: isNull,
	string: isString,
	number: isNumber,
	boolean: isBoolean,
	function: isFunction,
	object,
	array,
	all: {
		undefined: isAllUndefined,
		null: isAllNull,
		object: isAllObject,
		array: isAllArray,
		function: isAllFunction,
		string: isAllString,
		number: isAllNumber,
		boolean: isAllBoolean
	}
}
