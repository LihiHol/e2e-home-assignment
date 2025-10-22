/**
 * @typedef {"text"|"number"|"select"|"password"|"email"} FieldType
 */

/** @typedef {{ label: string, value: string|number }} SelectOption */

/**
 * @typedef {Object} IFormField
 * @property {string} name
 * @property {FieldType} type
 * @property {string} [placeholder]
 * @property {object} [registerOptions]
 * @property {SelectOption[]} [options]   // for select
 * @property {string|number} [value]
 * @property {Object.<string, any>} [inputProps]
 */

export {};
