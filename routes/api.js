'use strict';
const mongoose = require('mongoose');
const IssueModel = require('../models').Issue;
//const ProjectModel = require('../models').Project;


module.exports = function (app) {

   app.route('/api/issues/:project')

      .get(function (req, res) {
         let project = req.params.project;
         console.log('project: ' + project)
         let filterObject = Object.assign(req.query);
         filterObject['project']= project;
         console.log(filterObject)
         IssueModel.find( filterObject , (err, arrayOfIssues) => {
            if (!err && arrayOfIssues) {
               console.log(arrayOfIssues)
               return res.json(arrayOfIssues)
            } else {
               console.error("error finding issues in db")
            }
         })
      })

      
      .post(function (req, res) {
         let project = req.params.project; //from URL
         //grab vars from req.body & check for required fields
         const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
         if (!issue_title || !issue_text || !created_by) {
            res.json({ error: 'missing required field(s)' });
            return;
         }

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
            } else {
               res.json(newIssue); //return newIssue from above in JSON form
            }
         });

         
      })


      .put(function (req, res) {
         let project = req.params.project;

      })


      .delete(function (req, res) {
         let project = req.params.project;

      });

};
