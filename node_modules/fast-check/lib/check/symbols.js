"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCloneMethod = exports.cloneMethod = void 0;
exports.cloneMethod = Symbol('fast-check/cloneMethod');
const hasCloneMethod = (instance) => {
    return instance instanceof Object && typeof instance[exports.cloneMethod] === 'function';
};
exports.hasCloneMethod = hasCloneMethod;
