'use strict';
// Dummy use case test, to be removed and replaced by real ones
const Fs = require('fs');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const after = lab.after;
const before = lab.before;
const it = lab.it;
const expect = Lab.expect;

const Model = require('../lib');

describe('query', () => {

    after((done) => {

        Fs.unlink('./test/mydb.sqlite', () => {

            done();
        });
    });

    it('test a generic use case', (done) => {

        Model.setUpConnection({
            client: 'sqlite3',
            connection: {
                filename: './test/mydb.sqlite'
            }
        });

        const Schema = {
            name: {
                type: 'string'
            },
            value: 'integer',
            age: 'integer'
        };

        const User = class extends Model.getBaseClass('User', Schema) {

            constructor(name) {
                super();

                this.name = name;
                this.value = Math.floor(Math.random() * 100);
            }

            sayHello() {

                console.log('hello my name is', this.name);
            }
        };

        const usr1 = new User('cc');

        (async () => {

            await usr1.save();


            const users = await User.find();

            expect(users).to.have.length(1);
            expect(users[0] instanceof User).to.be.true();

            done();
        })();
    });
});