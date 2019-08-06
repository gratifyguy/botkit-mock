'use strict';
/**
 * Create promise based timeout.
 * @param timeout - milliseconds
 * @returns {Promise<void>}
 */
module.exports.setTimeoutAsync = async function (timeout = 100) {
    await new Promise((r) => setTimeout(r, timeout));
};