'use strict';
const Model = require('./lib');

Model.setUpConnection({
    client: 'sqlite3',
    connection: {
        filename: "./mydb.sqlite"
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


(async () => {

    for (let i = 0; i < 120; ++i) {

        const l = new User('cc');
        // await l.save();
        // console.log(i);
    }

    console.log(await User.findByName('cc'));
})();


