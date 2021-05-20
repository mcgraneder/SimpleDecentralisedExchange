export const cloneMethod = Symbol('fast-check/cloneMethod');
export const hasCloneMethod = (instance) => {
    return instance instanceof Object && typeof instance[cloneMethod] === 'function';
};
