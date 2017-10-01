'use strict';
const SplitCC = require('split-camelcase');

module.exports.build = function (knex, table, expression) {

    const splitted = SplitCC(expression);

    const action = splitted.shift();
    if (action === 'find') {

        const by = splitted.shift();
        const prop = splitted.shift();

        return function (arg) {

            return knex.select().from(table).where(prop.toLowerCase(), '=', arg);
        }
    }
};
