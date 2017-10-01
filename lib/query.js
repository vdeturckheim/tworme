'use strict';
const SplitCC = require('split-camelcase');

module.exports.build = function (knex, table, expression) {

    const splitted = SplitCC(expression).filter(Boolean).map((x) => x.toLowerCase());

    const action = splitted.shift();
    if (action === 'find') {

        const select = [];

        let next = splitted.shift();
        while (next !== undefined && next !== 'by') {
            select.push(next);
            next = splitted.shift();
        }

        if (next !== 'by') {

            return function () {

                return knex.select(select).from(table)
                    .then((res) => {

                        return res.map((x) => Object.setPrototypeOf(x, this.prototype))
                    });
            }
        }

        // next === 'by'

        const selector = [];
        while (next !== undefined) {

            if (next === 'by') { // new item
                const item = {key: splitted.shift()};

                if (splitted[0] !== 'and') {

                }

                if (item.comp === undefined) {
                    item.comp = '=';
                }
                selector.push(item);
            }
            next = splitted.shift();
        }

        return function (...args) {


            let query = knex.select(select).from(table);
            for (let i = 0; i < selector.length; ++i) {

                if (i === 0) {
                    query = query.where(selector[i].key, selector[i].comp, args[i]);
                    continue;
                }
                query = query.andWhere(selector[i].key, selector[i].comp, args[i]);
            }

            return query.then((res) => {

                return res.map((x) => Object.setPrototypeOf(x, this.prototype))
            });
        }
    }
};
