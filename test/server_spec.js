/* TODO: 動くようにする
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('App', function() {
  describe('/webhook 「スタンド」', function() {
    it('responds with status 200', function(done) {
      chai.request(app)
        .post('/set?somekey=somevalue')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
*/
