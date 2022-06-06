'use strict';
const mongoose = require('mongoose');
const IssueModel = require('../models').Issue;
mongoose.set('useFindAndModify', false); //deprecation

module.exports = function (app) {
   // colon allows for variable project names
   app.route('/api/issues/:project')

      .get(function (req, res) {
         let project = req.params.project;
         let filterObject = Object.assign(req.query);
         filterObject['project'] = project;

         //find all issues with project name & other filters
         IssueModel.find(filterObject, (err, arrayOfIssues) => {
            if (!err && arrayOfIssues) {
               console.log(arrayOfIssues)
               return res.json(arrayOfIssues)
            } else {
               console.error("error finding issues in db")
               return;
            }
         })
      })


      .post(function (req, res) {
         let project = req.params.project; //from URL
         //grab vars from req.body & check for required fields
         const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
         if (!issue_title || !issue_text || !created_by) {
            res.json({ error: 'required field(s) missing' });
            return;
         }

         //assign all req.body vars to newIssue object
         const newIssue = new IssueModel({
            project: project,
            issue_title: issue_title,
            issue_text: issue_text,
            created_by: created_by,
            assigned_to: assigned_to || "",
            status_text: status_text || "",
            created_on: new Date(),
            updated_on: new Date(),
            open: true,
         });

         newIssue.save((err, data) => {
            if (err || !data) {
               res.send("Error saving post");
               return;
            } else {
               res.json(newIssue); //return newIssue from above in JSON form
               return;
            }
         });
      })


      .put(function (req, res) {
         let project = req.params.project;
         let params = {};
         let _id = ""
         //only put non-empty parameters into params
         for (let prop in req.body) {
            if (req.body[prop]) {
               if (prop == "open") {
                  params[prop] = !req.body[prop];
               } else if (prop != "_id") {
                  //set 'open' equal to the opposite [checked = !open, unchecked = open]
                  params[prop] = req.body[prop];
               } else {
                  _id = req.body[prop]
               }
            }
         }
         //console.log("params0:" + JSON.stringify(params))
         if (Object.keys(params).length === 0) {
            res.json({ error: 'no update field(s) sent', _id: _id });
            console.log("exit - no param")
            return;
         } else {
            params['updated_on'] = new Date();
         }
         //console.log("params1:" + JSON.stringify(params))
         if (!_id) {
            res.json({ error: 'missing _id' });
            console.log("exit - no id")
            return;
         }

         IssueModel.findByIdAndUpdate(_id, params, (err, doc) => {
            if (err) {
               console.error("could not update")
               res.json({ error: 'could not update', _id: _id });
               return;
            } else {
               console.log("update success!")
               res.json({ result: 'successfully updated', _id: _id })
               return;
               //console.log("update success: \n" + doc)
            }
         })
      })


      .delete(function (req, res) {
         let project = req.params.project;
         const _id = req.body._id;
         if (!_id) {
            res.json({ error: 'missing _id' });
            return;
         }
         IssueModel.findOneAndDelete({ project: project, _id: _id }, (err, data) => {
            if (err) {
               res.json({ error: 'could not delete', _id: _id });
               return;
            } else {
               res.json({ result: 'successfully deleted', _id: _id });
               return;
            }
         });
      });
};