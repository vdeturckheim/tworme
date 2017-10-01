'use strict';
const Model = require('./lib/model');

Model.setUpConnection({
    client: 'sqlite3',
    connection: {
        filename: "./mydb.sqlite"
    }
});

const Schema = {
    name: 'string',
    value: 'integer'
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

    for (let i = 0; i < 1; ++i) {

        const l = new User('cc');
        await l.save();
    }

    console.log(await User.findByNameAndByValue('cc', 50));
})();


