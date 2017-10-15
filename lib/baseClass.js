'use strict';
const Model = require('./model');
const Diff = require('diff-json');


const Query = require('./query');
const Schema = require('./schema');

module.exports.getBaseClass = function(tableName, schemaCandidate) {

    const schema = new Schema(schemaCandidate);


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
                const [model] = await Model.knex.select().from('TWORME').where('table', '=', tableName);

                const oldSchema = JSON.parse(model.schema);

                const diff = Diff.diff(oldSchema, schema);

                cl.isInit = true;
                return;
            }

            await Model.knex.insert({ table: tableName, schema: JSON.stringify(schema) }).into('TWORME');

            await Model.knex.schema.createTable(tableName, (table) => {

                table.increments('id');
                for (let key in schema) {
                    table[schema[key].type](key);
                }
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

            return await this.knex.insert(this).into(tableName); // TODO: get id at this point
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
