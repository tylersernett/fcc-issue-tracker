const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
   suite('POST /api/issues/{project} => object w/ issue data', function () {
      test('Create issue (all fields)', function (done) {
         chai.request(server)
            .post('/api/issues/chai')
            .send({
               issue_title: "chaititle",
               issue_text: "chaitext",
               created_by: "chaiauth",
               assigned_to: "chaias",
               status_text: "chaistat",
            })
            .end(function (err, res) {
               assert.equal(res.status, 200);
               assert.equal(res.body.project, "chai");
               assert.equal(res.body.issue_title, "chaititle");
               assert.equal(res.body.issue_text, "chaitext");
               assert.equal(res.body.created_by, "chaiauth");
               assert.equal(res.body.assigned_to, "chaias");
               assert.equal(res.body.status_text, "chaistat");
               assert.equal(res.body.open, true);
               done();
            });
      });

      test('Create issue (req fields only)', function (done) {
         chai.request(server)
            .post('/api/issues/chai')
            .send({
               issue_title: "chaititle",
               issue_text: "chaitext",
               created_by: "chaiauth",
            })
            .end(function (err, res) {
               assert.equal(res.status, 200);
               assert.equal(res.body.project, "chai");
               assert.equal(res.body.issue_title, "chaititle");
               assert.equal(res.body.issue_text, "chaitext");
               assert.equal(res.body.created_by, "chaiauth");
               assert.equal(res.body.assigned_to, "");
               assert.equal(res.body.status_text, "");
               assert.equal(res.body.open, true);
               done();
            });
      });

      test('Create issue (missing req field)', function (done) {
         chai.request(server)
            .post('/api/issues/chai')
            .send({
               issue_text: "chaitext",
               created_by: "chaiauth",
            })
            .end(function (err, res) {
               assert.equal(res.status, 200);
               assert.equal(res.body, "missing required field(s)");
               done();
            });
      });

   });
});
