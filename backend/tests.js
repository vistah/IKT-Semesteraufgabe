import chai from 'chai';
import chaiHttp from 'chai-http';
import { app as server } from './server.js';

let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('Posts', () => {
    /*
     * Test the /GET route
     */
    describe('/GET /posts', () => {
        it('it should GET all the posts', (done) => {
            chai.request(server)
                .get('/posts')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(3);
                    done();
                });
        });
    });

});
