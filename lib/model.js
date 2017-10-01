'use strict';
const Knex = require('knex');

const Query = require('./query');

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
        await this.knex.schema.createTableIfNotExists('TWORME', (table) => {

            table.increments('id');
            table.string('table'); // todo unique
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

const getBaseClass = function(tableName, schema) {


    const cl = class extends Model {

        constructor() {
            super();

            this.id = -1;
        }

        static async init() {

            if (cl.isInit) {
                return;
            }

            await Model.initORM();

            const exists = await Model.knex.schema.hasTable(tableName);
            if (exists) {

                // TODO: compute migration
                cl.isInit = true;
                return;
            }

            await Model.knex.insert({ table: tableName, schema: schema }).into('TWORME');

            await Model.knex.schema.createTable(tableName, (table) => {

                table.increments('id');
                Object.keys(schema) // TODO: tmp
                    .forEach((key) => {

                        table[schema[key]](key);
                    })
            });

            // insert schema into base
            cl.isInit = true;
        }

        get schema() {

            return schema;
        }

        get tableName() {

            return tableName;
        }

        async save() {

            await cl.init();

            if (this.id === -1) {
                delete this.id;
            }

            return await this.knex.insert(this).into(tableName);
        }
    };

    cl.isInit = false;

    return new Proxy(cl, {
        get(target, propertyName) {

            if (Reflect.has(target, propertyName)) {
                return Reflect.get(target, propertyName);
            }
            const query = Query.build(Model.knex, tableName, propertyName);
            if (query !== null) {

                Reflect.set(target, propertyName, query);
                return query;
            }
            return Reflect.get(target, propertyName);
        }
    })
};

module.exports = Model;
module.exports.getBaseClass = getBaseClass;
