const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id_test = "";
let id_test2 = "";

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
               id_test = res.body._id; //for latter test
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
               id_test2 = res.body._id; //for latter test
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
               assert.equal(res.body.error, 'required field(s) missing');
               done();
            });
      });

   });


   suite('GET /api/issues/{project} => array of objects w/ issue data', function () {
      test('no filter', function (done) {
         chai.request(server)
            .get('/api/issues/chai')
            .query({})
            .end(function (err, res) {
               assert.equal(res.status, 200);
               assert.isArray(res.body);
               assert.property(res.body[0], "issue_title");
               assert.property(res.body[0], "issue_text");
               assert.property(res.body[0], "created_on");
               assert.property(res.body[0], "updated_on");
               assert.property(res.body[0], "created_by");
               assert.property(res.body[0], "assigned_to");
               assert.property(res.body[0], "open");
               assert.property(res.body[0], "status_text");
               assert.property(res.body[0], "_id");
               done();
            });
      })

      test('one filter', function (done) {
         chai.request(server)
            .get('/api/issues/chai')
            .query({ status_text: "chaistat" })
            .end(function (err, res) {
               res.body.forEach(issueResult => {
                  assert.equal(
                     issueResult.status_text,
                     "chaistat"
                  );
               });
               done();
            });
      })

      test('multiple filters', function (done) {
         chai.request(server)
            .get('/api/issues/chai')
            .query({ status_text: "chaistat", open: true })
            .end(function (err, res) {
               res.body.forEach(issueResult => {
                  assert.equal(issueResult.open, true);
                  assert.equal(
                     issueResult.status_text,
                     "chaistat"
                  );
               });
               done();
            });
      })
   })


   suite('PUT /api/issues/{project} => text', function () {
      test("No id", function (done) {
         chai
            .request(server)
            .put("/api/issues/chai")
            .send({})
            .end(function (err, res) {
               assert.equal(res.body.error, "missing _id");
               done();
            });
      });

      test("invalid id", function (done) {
         chai
            .request(server)
            .put("/api/issues/chai")
            .send({
               _id: "bad0001",
               issue_text: "updated text",
            })
            .end(function (err, res) {
               assert.equal(res.body.error, "could not update");
               done();
            });
      });

      test("One field to update", function (done) {
         chai
            .request(server)
            .put("/api/issues/chai")
            .send({
               _id: id_test,
               issue_text: "updated text"
            })
            .end(function (err, res) {
               assert.equal(res.body.result, "successfully updated");
               done();
            });
      });

      test("Two fields to update", function (done) {
         chai
            .request(server)
            .put("/api/issues/chai")
            .send({
               _id: id_test2,
               issue_text: "updated text",
               issue_title: "updated title"
            })
            .end(function (err, res) {
               assert.equal(res.body.result, "successfully updated");
               done();
            });
      });

      test("no fields to update", function (done) {
         chai
            .request(server)
            .put("/api/issues/chai")
            .send({
               _id: id_test
            })
            .end(function (err, res) {
               assert.equal(res.body.error, "no update field(s) sent");
               done();
            });
      });
   });


   suite("DELETE /api/issues/{project} => text", function () {
      test("No id", function (done) {
         chai
            .request(server)
            .delete("/api/issues/chai")
            .send({})
            .end(function (err, res) {
               assert.equal(res.body.error, "missing _id");
               done();
            });
      });

      test("invalid id", function (done) {
         chai
            .request(server)
            .delete("/api/issues/chai")
            .send({ _id: "bad00001" })
            .end(function (err, res) {
               assert.equal(res.body.error, "could not delete");
               done();
            });
      });

      test("delete issue", function (done) {
         chai
            .request(server)
            .delete("/api/issues/chai")
            .send({
               _id: id_test,
               project: "chai"
            })
            .end(function (err, res) {
               assert.equal(res.body.result, "successfully deleted");
               done();
            });
      });
   });

});
