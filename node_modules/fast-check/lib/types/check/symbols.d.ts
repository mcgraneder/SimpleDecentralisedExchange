/**
 * Generated instances having a method [cloneMethod]
 * will be automatically cloned whenever necessary
 *
 * This is pretty useful for statefull generated values.
 * For instance, whenever you use a Stream you directly impact it.
 * Implementing [cloneMethod] on the generated Stream would force
 * the framework to clone it whenever it has to re-use it
 * (mainly required for chrinking process)
 *
 * @remarks Since 1.8.0
 * @public
 */
export declare const cloneMethod: unique symbol;
