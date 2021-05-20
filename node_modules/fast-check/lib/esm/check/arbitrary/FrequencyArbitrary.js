import { Stream } from '../../stream/Stream.js';
import { Arbitrary } from './definition/Arbitrary.js';
import { Shrinkable } from './definition/Shrinkable.js';
import { getDepthContextFor } from './helpers/DepthContext.js';
export class FrequencyArbitrary extends Arbitrary {
    constructor(warbs, constraints, context) {
        super();
        this.warbs = warbs;
        this.constraints = constraints;
        this.context = context;
        let currentWeight = 0;
        this.summedWarbs = [];
        for (let idx = 0; idx !== warbs.length; ++idx) {
            currentWeight += warbs[idx].weight;
            this.summedWarbs.push({ weight: currentWeight, arbitrary: warbs[idx].arbitrary });
        }
        this.totalWeight = currentWeight;
    }
    static from(warbs, constraints, label) {
        if (warbs.length === 0) {
            throw new Error(`${label} expects at least one weigthed arbitrary`);
        }
        let totalWeight = 0;
        for (let idx = 0; idx !== warbs.length; ++idx) {
            const currentArbitrary = warbs[idx].arbitrary;
            if (currentArbitrary === undefined) {
                throw new Error(`${label} expects arbitraries to be specified`);
            }
            const currentWeight = warbs[idx].weight;
            totalWeight += currentWeight;
            if (!Number.isInteger(currentWeight)) {
                throw new Error(`${label} expects weights to be integer values`);
            }
            if (currentWeight < 0) {
                throw new Error(`${label} expects weights to be superior or equal to 0`);
            }
        }
        if (totalWeight <= 0) {
            throw new Error(`${label} expects the sum of weights to be strictly superior to 0`);
        }
        return new FrequencyArbitrary(warbs, constraints, getDepthContextFor(constraints.depthIdentifier));
    }
    generate(mrng) {
        if (this.constraints.maxDepth !== undefined && this.constraints.maxDepth <= this.context.depth) {
            return this.safeGenerateForIndex(mrng, 0);
        }
        const selected = mrng.nextInt(this.computeNegDepthBenefit(), this.totalWeight - 1);
        for (let idx = 0; idx !== this.summedWarbs.length; ++idx) {
            if (selected < this.summedWarbs[idx].weight) {
                return this.safeGenerateForIndex(mrng, idx);
            }
        }
        throw new Error(`Unable to generate from fc.frequency`);
    }
    withBias(freq) {
        return new FrequencyArbitrary(this.warbs.map((v) => ({ weight: v.weight, arbitrary: v.arbitrary.withBias(freq) })), this.constraints, this.context);
    }
    safeGenerateForIndex(mrng, idx) {
        ++this.context.depth;
        try {
            const itemShrinkable = this.summedWarbs[idx].arbitrary.generate(mrng);
            if (idx === 0 || !this.constraints.withCrossShrink || this.warbs[0].weight === 0) {
                return itemShrinkable;
            }
            return this.enrichShrinkable(mrng.clone(), itemShrinkable);
        }
        finally {
            --this.context.depth;
        }
    }
    computeNegDepthBenefit() {
        const depthFactor = this.constraints.depthFactor;
        if (depthFactor === undefined || depthFactor <= 0) {
            return 0;
        }
        const depthBenefit = Math.floor(Math.pow(1 + depthFactor, this.context.depth)) - 1;
        return -Math.min(this.warbs[0].weight * depthBenefit, Number.MAX_SAFE_INTEGER) || 0;
    }
    enrichShrinkable(mrng, shrinkable) {
        let shrinkableForFirst = null;
        const getItemShrinkableForFirst = () => {
            if (shrinkableForFirst === null) {
                shrinkableForFirst = this.warbs[0].arbitrary.generate(mrng);
            }
            return shrinkableForFirst;
        };
        return new Shrinkable(shrinkable.value_, () => {
            return Stream.of(getItemShrinkableForFirst()).join(shrinkable.shrink());
        });
    }
}
function isFrequencyContraints(param) {
    return param != null && typeof param === 'object' && !('arbitrary' in param);
}
function frequency(...args) {
    const label = 'fc.frequency';
    const constraints = args[0];
    if (isFrequencyContraints(constraints)) {
        return FrequencyArbitrary.from(args.slice(1), constraints, label);
    }
    return FrequencyArbitrary.from(args, {}, label);
}
export { frequency };
