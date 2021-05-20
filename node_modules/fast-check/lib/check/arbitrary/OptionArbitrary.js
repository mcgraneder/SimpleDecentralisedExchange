"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.option = void 0;
const ConstantArbitrary_1 = require("./ConstantArbitrary");
const FrequencyArbitrary_1 = require("./FrequencyArbitrary");
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
    const nilArb = ConstantArbitrary_1.constant(Object.prototype.hasOwnProperty.call(constraints, 'nil') ? constraints.nil : null);
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
    return FrequencyArbitrary_1.FrequencyArbitrary.from(weightedArbs, frequencyConstraints, 'fc.option');
}
exports.option = option;
