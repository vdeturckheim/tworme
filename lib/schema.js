'use strict';
const Joi = require('joi');

const item = Joi.object().keys({
    type: Joi.string(),
    unique: Joi.boolean().default(false)
});


module.exports = class {

    constructor(schema) {

        for (let key in schema) {

            if (typeof schema[key] === 'string') {
                this[key] = {
                    type: schema[key],
                    unique: false
                };
            }
            else {
                this[key] = Object.assign({}, schema[key]);
            }
        }

        this.validate();
    }

    validate() {

        for (let key in this) {

            const result = Joi.validate(this[key], item);
            if (result.error !== null) {
                throw result.error;
            }
            this[key] = result.value;
        }
    }
};


