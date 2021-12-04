const assert = require('assert');
const axios = require('axios');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../indexForTest');

const should = chai.should();

// declared to use in future tests after login
let userInfo = {};
chai.use(chaiHttp);

describe('/GET all users(internal API)', () => {
  it('it should GET all the users', (done) => {
    chai.request(server)
      .get('/users/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        // res.body.length.should.be.eql(0);
        done();
      });
  });
});

describe('/POST login', () => {
  it('it should login a user', (done) => {
    const userCredentials = {
      email: 'rakesh.nagarajappa@sjsu.edu',
      password: 'Zerodhaacc1',
    };
    chai.request(server)
      .post('/users/login')
      .send(userCredentials)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('userData');
        res.body.userData.should.have.property('name').eql('qwe');
        res.body.should.have.property('token');
        userInfo = res.body.userData;
        userInfo.token = res.body.token;
        done();
      });
  });
});

describe('/PUT update user', () => {
  it('it should update a user with given information', (done) => {
    const updatedDetails = {
      ...userInfo,
      nickname: 'Chick magnet',
    };
    chai.request(server)
      .put('/users/update')
      .set('authorization', userInfo.token)
      .send(updatedDetails)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('/POST to get all orders for given user', () => {
  it('it should GET all the orders for the user', (done) => {
    chai.request(server)
      .post('/users/orders')
      .set('authorization', userInfo.token)
      .send({ userID: userInfo.id })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.gt(0);
        done();
      });
  });
});

describe('/GET all restaurants', () => {
  it('it should GET all the restaurants', (done) => {
    chai.request(server)
      .get('/restaurants/')
      .set('authorization', userInfo.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.gt(0);
        done();
      });
  });
});
