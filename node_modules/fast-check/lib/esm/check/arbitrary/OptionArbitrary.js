import { constant } from './ConstantArbitrary.js';
import { FrequencyArbitrary } from './FrequencyArbitrary.js';
function extractOptionConstraints(constraints) {
    if (!constraints)
        return {};
    if (typeof constraints === 'number')
        return { freq: constraints };
    return constraints;
}
function option(arb, rawConstraints) {
    const constraints = extractOptionConstraints(rawConstraints);
    const freq = constraints.freq == null ? 5 : constraints.freq;
    const nilArb = constant(Object.prototype.hasOwnProperty.call(constraints, 'nil') ? constraints.nil : null);
    const weightedArbs = [
        { arbitrary: nilArb, weight: 1 },
        { arbitrary: arb, weight: freq },
    ];
    const frequencyConstraints = {
        withCrossShrink: true,
        depthFactor: constraints.depthFactor,
        maxDepth: constraints.maxDepth,
        depthIdentifier: constraints.depthIdentifier,
    };
    return FrequencyArbitrary.from(weightedArbs, frequencyConstraints, 'fc.option');
}
export { option };
