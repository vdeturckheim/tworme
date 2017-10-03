const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Lab.expect;

describe('math', () => {

    before((done) => {

        done();
    });

    after((done) => {

        done();
    });

    it('returns true when 1 + 1 equals 2', (done) => {

        expect(1 + 1).to.equal(2);
        done();
    });
});