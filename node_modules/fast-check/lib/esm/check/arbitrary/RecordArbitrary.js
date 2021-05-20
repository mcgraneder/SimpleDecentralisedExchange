import { option } from './OptionArbitrary.js';
import { genericTuple } from './TupleArbitrary.js';
function extractAllKeys(recordModel) {
    const keys = Object.keys(recordModel);
    const symbols = Object.getOwnPropertySymbols(recordModel);
    for (let index = 0; index !== symbols.length; ++index) {
        const symbol = symbols[index];
        const descriptor = Object.getOwnPropertyDescriptor(recordModel, symbol);
        if (descriptor && descriptor.enumerable) {
            keys.push(symbol);
        }
    }
    return keys;
}
function rawRecord(recordModel) {
    const keys = extractAllKeys(recordModel);
    const arbs = [];
    for (let index = 0; index !== keys.length; ++index) {
        arbs.push(recordModel[keys[index]]);
    }
    return genericTuple(arbs).map((gs) => {
        const obj = {};
        for (let idx = 0; idx !== keys.length; ++idx) {
            obj[keys[idx]] = gs[idx];
        }
        return obj;
    });
}
function record(recordModel, constraints) {
    if (constraints == null) {
        return rawRecord(recordModel);
    }
    if ('withDeletedKeys' in constraints && 'requiredKeys' in constraints) {
        throw new Error(`requiredKeys and withDeletedKeys cannot be used together in fc.record`);
    }
    const requireDeletedKeys = ('requiredKeys' in constraints && constraints.requiredKeys !== undefined) ||
        ('withDeletedKeys' in constraints && !!constraints.withDeletedKeys);
    if (!requireDeletedKeys) {
        return rawRecord(recordModel);
    }
    const updatedRecordModel = {};
    const requiredKeys = ('requiredKeys' in constraints ? constraints.requiredKeys : undefined) || [];
    for (let idx = 0; idx !== requiredKeys.length; ++idx) {
        const descriptor = Object.getOwnPropertyDescriptor(recordModel, requiredKeys[idx]);
        if (descriptor === undefined) {
            throw new Error(`requiredKeys cannot reference keys that have not been defined in recordModel`);
        }
        if (!descriptor.enumerable) {
            throw new Error(`requiredKeys cannot reference keys that have are enumerable in recordModel`);
        }
    }
    const keys = extractAllKeys(recordModel);
    for (let index = 0; index !== keys.length; ++index) {
        const k = keys[index];
        const requiredArbitrary = recordModel[k].map((v) => ({ value: v }));
        if (requiredKeys.indexOf(k) !== -1)
            updatedRecordModel[k] = requiredArbitrary;
        else
            updatedRecordModel[k] = option(requiredArbitrary);
    }
    return rawRecord(updatedRecordModel).map((rawObj) => {
        const obj = rawObj;
        const nobj = {};
        for (let index = 0; index !== keys.length; ++index) {
            const k = keys[index];
            if (obj[k] !== null) {
                nobj[k] = obj[k].value;
            }
        }
        return nobj;
    });
}
export { record };
