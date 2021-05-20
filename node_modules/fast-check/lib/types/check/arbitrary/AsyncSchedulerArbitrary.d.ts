import { Arbitrary } from './definition/Arbitrary';
/**
 * Define an item to be passed to `scheduleSequence`
 * @remarks Since 1.20.0
 * @public
 */
export declare type SchedulerSequenceItem<TMetaData = unknown> = {
    /**
     * Builder to start the task
     * @remarks Since 1.20.0
     */
    builder: () => Promise<any>;
    /**
     * Label
     * @remarks Since 1.20.0
     */
    label: string;
    /**
     * Metadata to be attached into logs
     * @remarks Since 1.25.0
     */
    metadata?: TMetaData;
} | (() => Promise<any>);
/**
 * Describe a task for the report produced by the scheduler
 * @remarks Since 1.25.0
 * @public
 */
export interface SchedulerReportItem<TMetaData = unknown> {
    /**
     * Execution status for this task
     * - resolved: task released by the scheduler and successful
     * - rejected: task released by the scheduler but with errors
     * - pending:  task still pending in the scheduler, not released yet
     *
     * @remarks Since 1.25.0
     */
    status: 'resolved' | 'rejected' | 'pending';
    /**
     * How was this task scheduled?
     * - promise: schedule
     * - function: scheduleFunction
     * - sequence: scheduleSequence
     *
     * @remarks Since 1.25.0
     */
    schedulingType: 'promise' | 'function' | 'sequence';
    /**
     * Incremental id for the task, first received task has taskId = 1
     * @remarks Since 1.25.0
     */
    taskId: number;
    /**
     * Label of the task
     * @remarks Since 1.25.0
     */
    label: string;
    /**
     * Metadata linked when scheduling the task
     * @remarks Since 1.25.0
     */
    metadata?: TMetaData;
    /**
     * Stringified version of the output or error computed using fc.stringify
     * @remarks Since 1.25.0
     */
    outputValue?: string;
}
/**
 * Constraints to be applied on {@link scheduler}
 * @remarks Since 2.2.0
 * @public
 */
export interface SchedulerConstraints {
    /**
     * Ensure that all scheduled tasks will be executed in the right context (for instance it can be the `act` of React)
     * @remarks Since 1.21.0
     */
    act: (f: () => Promise<void>) => Promise<unknown>;
}
/**
 * Instance able to reschedule the ordering of promises for a given app
 * @remarks Since 1.20.0
 * @public
 */
export interface Scheduler<TMetaData = unknown> {
    /**
     * Wrap a new task using the Scheduler
     * @remarks Since 1.20.0
     */
    schedule: <T>(task: Promise<T>, label?: string, metadata?: TMetaData) => Promise<T>;
    /**
     * Automatically wrap function output using the Scheduler
     * @remarks Since 1.20.0
     */
    scheduleFunction: <TArgs extends any[], T>(asyncFunction: (...args: TArgs) => Promise<T>) => (...args: TArgs) => Promise<T>;
    /**
     * Schedule a sequence of Promise to be executed sequencially.
     * Items within the sequence might be interleaved by other scheduled operations.
     *
     * Please note that whenever an item from the sequence has started,
     * the scheduler will wait until its end before moving to another scheduled task.
     *
     * A handle is returned by the function in order to monitor the state of the sequence.
     * Sequence will be marked:
     * - done if all the promises have been executed properly
     * - faulty if one of the promises within the sequence throws
     *
     * @remarks Since 1.20.0
     */
    scheduleSequence(sequenceBuilders: SchedulerSequenceItem<TMetaData>[]): {
        done: boolean;
        faulty: boolean;
        task: Promise<{
            done: boolean;
            faulty: boolean;
        }>;
    };
    /**
     * Count of pending scheduled tasks
     * @remarks Since 1.20.0
     */
    count(): number;
    /**
     * Wait one scheduled task to be executed
     * @throws Whenever there is no task scheduled
     * @remarks Since 1.20.0
     */
    waitOne: () => Promise<void>;
    /**
     * Wait all scheduled tasks,
     * including the ones that might be created by one of the resolved task
     * @remarks Since 1.20.0
     */
    waitAll: () => Promise<void>;
    /**
     * Produce an array containing all the scheduled tasks so far with their execution status.
     * If the task has been executed, it includes a string representation of the associated output or error produced by the task if any.
     *
     * Tasks will be returned in the order they get executed by the scheduler.
     *
     * @remarks Since 1.25.0
     */
    report: () => SchedulerReportItem<TMetaData>[];
}
/**
 * For scheduler of promises
 * @remarks Since 1.20.0
 * @public
 */
declare function scheduler<TMetaData = unknown>(constraints?: SchedulerConstraints): Arbitrary<Scheduler<TMetaData>>;
/**
 * For custom scheduler with predefined resolution order
 *
 * Ordering is defined by using a template string like the one generated in case of failure of a {@link scheduler}
 *
 * It may be something like:
 *
 * @example
 * ```typescript
 * fc.schedulerFor()`
 *   -> [task\${2}] promise pending
 *   -> [task\${3}] promise pending
 *   -> [task\${1}] promise pending
 * `
 * ```
 *
 * Or more generally:
 * ```typescript
 * fc.schedulerFor()`
 *   This scheduler will resolve task ${2} first
 *   followed by ${3} and only then task ${1}
 * `
 * ```
 *
 * WARNING:
 * Custom scheduler will
 * neither check that all the referred promises have been scheduled
 * nor that they resolved with the same status and value.
 *
 *
 * WARNING:
 * If one the promises is wrongly defined it will fail - for instance asking to resolve 5 while 5 does not exist.
 *
 * @remarks Since 1.25.0
 * @public
 */
declare function schedulerFor<TMetaData = unknown>(constraints?: SchedulerConstraints): (_strs: TemplateStringsArray, ...ordering: number[]) => Scheduler<TMetaData>;
/**
 * For custom scheduler with predefined resolution order
 *
 * WARNING:
 * Custom scheduler will not check that all the referred promises have been scheduled.
 *
 *
 * WARNING:
 * If one the promises is wrongly defined it will fail - for instance asking to resolve 5 while 5 does not exist.
 *
 * @param customOrdering - Array defining in which order the promises will be resolved.
 * Id of the promises start at 1. 1 means first scheduled promise, 2 second scheduled promise and so on.
 *
 * @remarks Since 1.25.0
 * @public
 */
declare function schedulerFor<TMetaData = unknown>(customOrdering: number[], constraints?: SchedulerConstraints): Scheduler<TMetaData>;
export { scheduler, schedulerFor };
