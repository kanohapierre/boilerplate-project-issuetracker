/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
/*
var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
*/



var ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      let query   = {};
    
      if (req.query.issue_title) query.issue_title = req.query.issue_title;
      if (req.query.issue_text) query.issue_text = req.query.issue_text;
      if (req.query.created_by) query.created_by = req.query.created_by;
      if (req.query.assigned_to) query.assigned_to = req.query.assigned_to;
      if (req.query.status_text) query.status_text = req.query.status_text;
      if (req.query.open) query.open = JSON.parse(req.query.open) ;
      
      db.collection(project).find(query).toArray((err, issues) => {
        if(err){
          res.json(err);
        } else {
          res.json(issues);
        }
      })
    })
    
    .post(function (req, res){
      const project = req.params.project;
    
      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by){
        res.json({msg: "Missing required fields"});
      } else {
        
          db.collection(project).insertOne(
            {
              issue_title  : req.body.issue_title,
              issue_text   : req.body.issue_text,
              created_by   : req.body.created_by,
              assigned_to  : req.body.assigned_to || '',
              status_text  : req.body.status_text || '',
              created_on   : new Date(),
              updated_on   : new Date(),
              open         : true
           }, (err,data) => {
            if(data.insertedCount === 1){
              
              res.json({
                 issue_title : data.ops[0].issue_title,
                 issue_text  : data.ops[0].issue_text,
                 created_by  : data.ops[0].created_by,
                 assigned_to : data.ops[0].assigned_to,
                 status_text : data.ops[0].status_text,
                 created_on  : data.ops[0].created_on,
                 updated_on  : data.ops[0].updated_on,
                 open        : data.ops[0].open,
                 msg         : 'New issue created'
              })
              
              
            }
        })
      
      }
    })
    
    .put(function (req, res){
      
      var project = req.params.project;
      let updates = {};
    
      if (req.body.issue_title) updates.issue_title = req.body.issue_title;
      if (req.body.issue_text) updates.issue_text = req.body.issue_text;
      if (req.body.created_by) updates.created_by = req.body.created_by;
      if (req.body.assigned_to) updates.assigned_to = req.body.assigned_to;
      if (req.body.status_text) updates.status_text = req.body.status_text;
      if (req.body.open) updates.open = false ;
    
      if(!ObjectID.isValid(req.body._id)){
        res.json({msg: 'could not update '+req.body._id})
      } else if(Object.keys(updates).length === 0) {
        res.json({msg: 'no updated field sent'});
      } else {
        updates.updated_on = new Date();
        
        db.collection(project).findAndModify(
          {_id: ObjectID(req.body._id)},
          {},
          {$set: updates},
          (err,data) => {
            if(data.lastErrorObject.updatedExisting){
              res.json({msg: 'Successfully updated'})
            } else {
              res.json({msg: 'could not update '+req.body._id})
            }
          }
        );
      }
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      let id      = req.body._id;
      
      if(!ObjectID.isValid(id)){
        res.json({msg: '_id error'});
      } else {
        
        db.collection(project).findOneAndDelete({_id: ObjectID(id)},{}, (err, data) => {
        if(data.value){
          res.json({msg: 'deleted '+id})
        } else {
          res.json({msg: 'could not delete '+id})
        }
      })
      
      }
    });
    
};