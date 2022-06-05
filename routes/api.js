'use strict';
const mongoose = require('mongoose');
const IssueModel = require('../models').Issue;


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
         const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
         if (!_id) {
            res.json({ error: 'missing _id' });
            return;
         }

         if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
            res.json({ error: 'no update field(s) sent', _id: _id });
            return;
         }

         //set 'open' equal to the opposite [checked = !open, unchecked = open]
         IssueModel.findByIdAndUpdate(_id, {
            issue_title: issue_title,
            issue_text: issue_text,
            created_by: created_by,
            assigned_to: assigned_to,
            status_text: status_text,
            open: !open,
            updated_on: new Date()
         }, (err, doc) => {
            if (err) {
               res.json({ error: 'could not update', _id: _id });
               return;
            } else {
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