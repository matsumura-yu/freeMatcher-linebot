var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');

var expect = chai.expect;

chai.use(chaiHttp);

const standEvent = {
  type: 'message',
  replyToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  source: { userId: 'userId1', type: 'user' },
  timestamp: 1536376169305,
  message: {
    type: 'text', id: '0000000000000', text: 'スタンド'
  }
}

const replyRequest = (events) => {
  return {
    headers: {
      "x-line-signature": "t7Hn4ZDHqs6e+wdvI5TyQIvzie0DmMUmuXEBqyyE/tM="
    },
    body: {
      events: events
    }
  }
}

describe('App', function() {
  describe('/webhook 「スタンド」', function() {
    it('responds with status 200', function(done) {
      chai.request(app)
        .post('/webhook')
        .send(replyRequest([standEvent]))
        .end(function(err, res) {
          expect(res).to.have.status(200);
          console.log(res);
          done();
        });
    });
  });
});

