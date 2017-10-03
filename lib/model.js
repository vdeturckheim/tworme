'use strict';
const Knex = require('knex');

const Model = class {

    static setUpConnection(config) {

        if (this.knex === null) {
            this.knex = Knex(config);
        }
    }

    static async initORM() {

        if (this.knex === null) {
            throw new Error('Connection was not set up, call Mode.setUpConnection first.');
        }
        const exists = await Model.knex.schema.hasTable('TWORME');
        if (exists) {
            return;
        }
        await this.knex.schema.createTableIfNotExists('TWORME', (table) => {

            table.increments('id');
            table.string('table').unique(); // todo unique
            table.json('schema');
        });
    }

    get knex() {

        if (Model.knex === null) {
            throw new Error('Connection was not set up, call Mode.setUpConnection first.');
        }
        return Model.knex;
    }

};
Model.knex = null;

module.exports = Model;
