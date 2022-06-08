const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
    project: {type: String},
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: String,
    status_text: String,
    open: { type: Boolean },
    created_on: { type: Date },
    updated_on: { type: Date },
});

const Issue = mongoose.model("Issue", IssueSchema);
exports.Issue = Issue;