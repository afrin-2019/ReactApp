const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
var XLSX = require("xlsx");
var fileupload = require("express-fileupload");
app.use(fileupload());
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwt = require("jsonwebtoken");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY,
};

const strategy = new JwtStrategy(opts, (payload, next) => {
  const user = null;
  next(null, user);
});
passport.use(strategy);
app.use(passport.initialize());

var MongoClient = require("mongodb").MongoClient;
// var url =
//   "mongodb://DevApp1:DevWisdomCircle2019@52.14.168.40:27017/ReactDatabase";
var url = "mongodb://localhost:27017/ReactDatabase";
MongoClient.connect(url, function (err, db) {
  var dbo = db.db("ReactDatabase");
  if (err) throw err;
  //console.log("connected");

  //insert list of flows into FlowListCollection
  app.post("/insert/flows/flowList", (req, res) => {
    var flowName = req.body.data.name;
    var flowSteps = req.body.data.steps;
    dbo
      .collection("FlowListCollection")
      .insertOne({ name: flowName, steps: flowSteps }, function (err, res) {
        if (err) throw err;
      });
    res.send("inserted into flowlistcollection");
  });

  //get the flows List from db
  app.get("/get/flows/flowList", (req, res) => {
    dbo
      .collection("FlowListCollection")
      .find({})
      .toArray(function (err, flowlist) {
        if (err) throw err;
        res.send(flowlist);
      });
  });

  //get the flows content from db
  app.get("/get/flows/flowContent", (req, res) => {
    dbo
      .collection("FlowContent")
      .find({})
      .toArray(function (err, flowcontent) {
        if (err) throw err;
        res.send(flowcontent);
      });
  });

  //insert steps into the respective flows
  app.put("/insert/flows/steps", (req, res) => {
    var flowName = req.body.data.flowName;
    var step = req.body.data.step;
    //console.log(step);
    dbo
      .collection("FlowListCollection")
      .updateOne({ name: flowName }, { $push: { steps: step } }, function (
        err,
        res
      ) {
        if (err) throw err;
      });
    res.send("steps inserted");
  });

  app.put("/update/flows/steps/axis", (req, res) => {
    //console.log(req.body);
    var flowName = req.body.data.flowName;
    var step = req.body.data.step;
    var oldaxis = req.body.data.oldAxis;
    var newaxis = req.body.data.newAxis;
    var newaxis1 = req.body.data.newAxis1;
    var value = { name: step, axis: oldaxis };
    var newValue = { name: step, axis: newaxis };

    dbo.collection("FlowListCollection").updateMany(
      { name: flowName, steps: { $elemMatch: { name: step } } },
      { $set: { "steps.$.axis": newaxis, "steps.$.axis1": newaxis1 } },

      function (err, res) {
        if (err) throw err;
      }
    );
    res.send("updated");
  });

  //insert steps into the respective flows
  app.put("/delete/flows/steps", (req, res) => {
    var flowName = req.body.flowName;
    var step = req.body.step;
    dbo
      .collection("FlowListCollection")
      .updateOne(
        { name: flowName },
        { $pull: { steps: { name: step } } },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.send("step deleted");
  });

  app.delete("/delete/flowcontent", (req, res) => {
    //console.log("del flow content", req.body);
    dbo
      .collection("FlowContent")
      .deleteOne({ Flow: req.body.flowName, Step: req.body.step }, function (
        err,
        res
      ) {
        if (err) throw err;
      });
    res.send("deleted from flowcontent");
  });

  //delete flowList from FlowListCollection
  app.delete("/delete/flows/flowList", (req, res) => {
    //console.log("req", req.body);
    var flowname = req.body.flowName;

    dbo
      .collection("FlowListCollection")
      .deleteMany({ name: flowname }, function (err, res) {
        if (err) throw err;
      });
    dbo
      .collection("FlowContent")
      .deleteMany({ Flow: flowname }, function (err, res) {
        if (err) throw err;
      });
    dbo
      .collection("PathCollection")
      .deleteMany({ flowname: flowname }, function (err, res) {
        if (err) throw err;
      });

    res.send("deleted");
  });

  app.delete("/delete/flows/path", (req, res) => {
    var id = req.body.pathid;
    //console.log("id", id);
    dbo
      .collection("PathCollection")
      .deleteOne({ flowname: req.body.flowName, pathid: id }, function (
        err,
        res
      ) {
        if (err) throw err;
      });
    res.send("path deleted");
  });

  //delete path when the complete step is deleted
  app.delete("/delete/flows/path/stepDelete", (req, res) => {
    dbo
      .collection("PathCollection")
      .deleteMany(
        { flowname: req.body.flowName, endstep: req.body.step },
        function (err, res) {
          if (err) throw err;
          ////console.log(res);
        }
      );
    dbo
      .collection("PathCollection")
      .deleteMany(
        { flowname: req.body.flowName, startStep: req.body.step },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.send("path deleted ");
  });

  app.put("/flows/duplicate", (req, res) => {
    var flowName = req.body.flow_to_duplicate;
    var newFlow = req.body.new_flowName;
    dbo
      .collection("FlowListCollection")
      .find({ name: flowName })
      .forEach(function (doc) {
        var newDoc = doc;
        //console.log("doc", newDoc);
        delete newDoc._id;
        newDoc.name = newFlow;
        dbo
          .collection("FlowListCollection")
          .insertOne(newDoc, function (err, res) {
            if (err) throw err;
          });
      });
    //....................................
    dbo
      .collection("FlowContent")
      .find({ Flow: flowName })
      .forEach(function (doc) {
        var newDoc = doc;
        //console.log("doc", newDoc);
        delete newDoc._id;
        newDoc.Flow = newFlow;
        dbo.collection("FlowContent").insertOne(newDoc, function (err, res) {
          if (err) throw err;
        });
      });
    //....................................
    dbo
      .collection("PathCollection")
      .find({ flowname: flowName })
      .forEach(function (doc) {
        var newDoc = doc;
        //console.log("doc", newDoc);
        delete newDoc._id;
        newDoc.flowname = newFlow;
        dbo.collection("PathCollection").insertOne(newDoc, function (err, res) {
          if (err) throw err;
        });
      });

    res.send("dup");
  });

  app.post("/insert/flows/pathInfo", (req, res) => {
    var flowName = req.body.data.flowName;
    var path = req.body.data.path;
    var pathName = req.body.data.pathname;
    var endStep = req.body.data.endStep;
    var pathid = req.body.data.pathid;
    dbo.collection("PathCollection").insertOne(
      {
        flowname: flowName,
        pathid: pathid,
        path: path,
        pathname: pathName,
        startStep: req.body.data.startStep,
        endstep: endStep,
        condition: req.body.data.condition,
      },
      function (err, res) {
        if (err) throw err;
      }
    );
    res.send("inserted into path collection");
  });

  // app.get("/get/flows/pathInfo", (req, res) => {
  //   var flowName = req.query.flowName;
  //   //console.log("path", flowName);
  //   dbo
  //     .collection("PathCollection")
  //     .find({ flowname: flowName })
  //     .toArray(function (err, pathDetails) {
  //       if (err) throw err;
  //       res.send(pathDetails);
  //     });
  // });

  app.get("/get/flows/pathInfo", (req, res) => {
    dbo
      .collection("PathCollection")
      .find({})
      .toArray(function (err, pathDetails) {
        if (err) throw err;
        res.send(pathDetails);
      });
  });
  //get the path info for a particular flow
  app.get("/get/flows/pathInfo", (req, res) => {
    var flowname = req.query.flowName;
    dbo
      .collection("PathCollection")
      .find({ flowname: flowname })
      .toArray(function (err, pathDetails) {
        if (err) throw err;
        res.send(pathDetails);
      });
  });

  app.put("/update/flows/pathInfo", (req, res) => {
    var flowName = req.body.data.flowName;
    var path = req.body.data.path;
    var pathName = req.body.data.pathname;
    //console.log(req.body.data);
    dbo
      .collection("PathCollection")
      .updateOne(
        { flowname: flowName, pathname: pathName },
        { $set: { path: path } },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.send("path updated");
  });

  app.put("/update/flows/pathname", (req, res) => {
    var flowName = req.body.data.flowName;
    var pathName = req.body.data.pathname;
    var newpathname = req.body.data.newpathname;
    //console.log(req.body.data);
    dbo
      .collection("PathCollection")
      .updateOne(
        { flowname: flowName, pathname: pathName },
        { $set: { pathname: newpathname, path: req.body.data.updatedPath } },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.send("path updated");
  });

  //post the editor content into db
  app.post("/post/editorContent", (req, res) => {
    dbo.collection("EditorContent").insertOne(
      {
        EditorId: req.body.data.EditorId,
        FlowName: req.body.data.flowName,
        step: req.body.data.stepNo,
        content: req.body.data.content,
        result: [],
      },
      function (err, res) {
        if (err) throw err;
      }
    );
    res.send("inserted into editor content");
  });

  //get the editor content from db
  app.get("/get/flows/editorContent", (req, res) => {
    dbo
      .collection("EditorContent")
      .find({})
      .toArray(function (err, content) {
        if (err) throw err;
        res.send(content);
      });
  });

  //get the editor content from db based on id
  app.get("/get/flows/editorContent/id", (req, res) => {
    var id = req.query.editorId;
    //console.log(id);
    dbo
      .collection("EditorContent")
      .find({ EditorId: id })
      .toArray(function (err, content) {
        if (err) throw err;
        res.send(content);
      });
  });

  //post result into editor content
  app.put("/update/flows/editorContent", (req, res) => {
    var result = req.body.data.result;
    var content = req.body.data.content;
    //console.log(req.body);
    dbo
      .collection("EditorContent")
      .updateOne(
        { EditorId: req.body.data.editorId },
        { $push: { result: result } },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.send("result updated");
  });
  //update output variable
  app.put("/update/flows/editorContent/result", (req, res) => {
    var result = req.body.data.result;
    var output = req.body.data.output;
    //console.log(req.body);
    dbo
      .collection("EditorContent")
      .updateOne(
        { EditorId: req.body.data.editorId, result: result },
        { $set: { "result.$.outputVar": output } },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.send("output variable updated");
  });

  //update alignment option
  app.put("/update/flows/editorContent/alignment", (req, res) => {
    var result = req.body.data.result;
    var alignment = req.body.data.alignment;
    //console.log(req.body);
    dbo
      .collection("EditorContent")
      .updateOne(
        { EditorId: req.body.data.editorId, result: result },
        { $set: { "result.$.alignment": alignment } },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.send("alignment option updated");
  });

  //update endLineValue
  app.put("/update/flows/editorContent/endLineValue", (req, res) => {
    var result = req.body.data.result;
    var value = req.body.data.value;
    var endline = req.body.data.endLine;
    dbo.collection("EditorContent").updateMany(
      { EditorId: req.body.data.editorId, result: result },
      {
        $set: { "result.$.endLineValue": value, "result.$.endLine": endline },
      },
      function (err, res) {
        if (err) throw err;
      }
    );
    res.send("end line value updated");
  });

  //update filter value,delimiter and wordposition
  app.put("/update/flows/editorContent/filterValue", (req, res) => {
    var result = req.body.data.result;
    var filterText = req.body.data.filterText;
    var delimiter = req.body.data.delimiter;
    var wordPosition = req.body.data.wordPosition;

    dbo.collection("EditorContent").updateMany(
      { EditorId: req.body.data.editorId, result: result },
      {
        $set: {
          "result.$.filterText": filterText,
          "result.$.delimiter": delimiter,
          "result.$.wordPosition": wordPosition,
        },
      },
      function (err, res) {
        if (err) throw err;
      }
    );
    res.send("filter text updated");
  });

  //delete editor content
  app.delete("/delete/flows/editorContent", (req, res) => {
    var id = req.body.editorId;
    dbo
      .collection("EditorContent")
      .deleteOne(
        { FlowName: req.body.flowName, step: req.body.step, EditorId: id },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.send("editor deleted");
  });

  app.delete("/delete/flows/editorresult", (req, res) => {
    var id = req.body.editorId;
    var result = req.body.result;
    ////console.log(req.body);
    dbo
      .collection("EditorContent")
      .updateOne({ EditorId: id }, { $pull: { result: result } }, function (
        err,
        res
      ) {
        if (err) throw err;
      });

    res.send("deleted from result");
  });

  // app.put("/update-after-delete/flows/steps", (req, res) => {
  //   var newStep = req.body.updatedStep;
  //   var oldStep = req.body.step;
  //   //var index = req.body.index;
  //   var flowName = req.body.flowName;
  //   dbo
  //     .collection("FlowListCollection")
  //     .updateOne(
  //        events: {$elemMatch : {name: flowName , steps: oldStep}} ,{ $set: { steps: newStep } },
  //       function(err, res) {
  //         if (err) throw err;
  //       }
  //     );
  //   res.send("step updated");
  // });

  // -----------------------------------------------
  //            CONNECTIVITY
  // -----------------------------------------------

  //insert the first level panel menu into PanelMenuCollection
  app.post("/insert/connectivity/level1", (req, res) => {
    let Level1 = [];
    var levelName = {};
    levelName["label"] = req.body.level1;
    //levelName["Level2"] = [];
    Level1.push(levelName);
    dbo
      .collection("PanelMenuCollection")
      .insertOne({ label: req.body.level1 }, function (err, res) {
        if (err) throw err;
      });
    res.send("Inserted into Level1");
  });

  //get the menu item from db
  app.get("/get/connectivity/item", (req, res) => {
    dbo
      .collection("PanelMenuCollection")
      .find({})
      .toArray(function (err, item) {
        if (err) throw err;
        res.send(item);
      });
  });

  //insert the second level panel menu into PanelMenuCollection
  app.put("/insert/connectivity/level2", (req, res) => {
    let level1 = {};
    level1["label"] = req.body.level1;
    let level2 = [];
    let levelName = {};
    levelName["label"] = req.body.level2;
    level2.push(levelName);
    ////console.log("level2", levelName);
    // dbo
    //   .collection("PanelMenuCollection")
    //   .updateOne(
    //     { Level1: level1 },
    //     { $push: { "Level1.$.Level2": { label: "south" } } },
    //     function(err, res) {
    //       if (err) throw err;
    //     }
    //   );
    dbo
      .collection("PanelMenuCollection")
      .updateOne(
        { label: req.body.level1 },
        { $push: { Level2: levelName } },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.send("level2 added");
  });

  //insert Server into level1
  app.put("/insert/connectivity/level1/server", (req, res) => {
    var itemLabel = req.body.label;
    var serverDetail = req.body.serverDetail;
    dbo
      .collection("PanelMenuCollection")
      .updateOne(
        { label: itemLabel },
        { $push: { Servers: serverDetail } },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.send("Server added successfully in Level1");
  });

  //insert Server into level2
  app.put("/insert/connectivity/level2/server", (req, res) => {
    var level1_Label = req.body.level1;
    var level2_Label = {};
    level2_Label["label"] = req.body.level2;
    var serverDetail = req.body.serverDetail;
    ////console.log(serverDetail);
    // dbo
    //   .collection("PanelMenuCollection")
    //   .find({ label: level1_Label })
    //   .toArray(function(err, result) {
    //     if (err) throw err;
    //     let level2 = result[0].Level2;
    //     level2.map(level => {
    //       //console.log(level.label);
    //       if (level.label === req.body.level2) {
    //         let serverArray = [];
    //         if (level.Servers) {
    //           serverArray = level.Servers;
    //           serverArray.push(serverDetail);
    //         } else {
    //           serverArray.push(serverDetail);
    //         }
    //         //console.log(serverArray);
    //         dbo
    //           .collection("PanelMenuCollection")
    //           .updateMany(
    //             { label: level1_Label, Level2: level2_Label },
    //             { $set: { Servers: serverArray } },
    //             function(err, resp) {
    //               if (err) throw err;
    //               res.send(resp);
    //             }
    //           );
    //       }
    //     });
    //   });
    dbo
      .collection("PanelMenuCollection")
      .updateOne(
        { label: level1_Label, Level2: level2_Label },
        { $push: { "Level2.$.Servers": serverDetail } },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.send("Server added successfully in Level2");
  });

  // ......................................................
  //            Connectivity - Type2
  // ......................................................

  // get the panelMenuCollectionNew details
  app.get("/get/connectivity/newpanelmenu", (req, res) => {
    dbo
      .collection("PanelMenuCollectionNew")
      .find({})
      .toArray(function (err, item) {
        if (err) throw err;
        res.send(item);
      });
  });

  //insert the first level panel menu into PanelMenuCollectionNew
  // app.post("/insert/connectivity/level1/type2", (req, res) => {
  //   var Topid = { TopId: "000" };
  //   var label = { Label: req.body.level1 };
  //   var type = { Type: "level" };
  //   dbo
  //     .collection("PanelMenuCollectionNew")
  //     .countDocuments()
  //     .then(response => {
  //       var id = { ID: response + 1 };
  //       var insertDetails = Object.assign({}, Topid, id, label, type);
  //       dbo
  //         .collection("PanelMenuCollectionNew")
  //         .insertOne(insertDetails, function(err, res) {
  //           if (err) throw err;
  //         });
  //       res.send("inserted");
  //     });
  // });

  // //insert the first level panel menu into PanelMenuCollectionNew
  app.post("/insert/connectivity/level1/type2", (req, res) => {
    //console.log("req", req.body);
    var Topid = { TopId: "000" };
    var label = { Label: req.body.level1 };
    var type = { Type: "level" };
    dbo
      .collection("PanelMenuCollectionNew")
      .find({})
      .toArray(function (err, result) {
        //console.log(result);
        if (err) throw err;
        var i = result.length;
        var lastDoc = result[i - 1];
        //console.log(lastDoc);
        var id = { ID: lastDoc.ID + 1 };
        //console.log("id", id);
        var insertDetails = Object.assign({}, Topid, id, label, type);
        dbo
          .collection("PanelMenuCollectionNew")
          .insertOne(insertDetails, function (err, res) {
            if (err) throw err;
          });
      });
    res.send("inserted");
  });

  //insert the second level panel menu into PanelMenuCollectionNew
  app.post("/insert/connectivity/level2/type2", (req, res) => {
    var Topid = { TopId: req.body.level1ID };
    var label = { Label: req.body.level2 };
    var type = { Type: "level" };
    dbo
      .collection("PanelMenuCollectionNew")
      .find({})
      .toArray(function (err, result) {
        //console.log(result);
        if (err) throw err;
        var i = result.length;
        var lastDoc = result[i - 1];
        //console.log(lastDoc);
        var id = { ID: lastDoc.ID + 1 };
        //console.log("id", id);
        var insertDetails = Object.assign({}, Topid, id, label, type);
        dbo
          .collection("PanelMenuCollectionNew")
          .insertOne(insertDetails, function (err, res) {
            if (err) throw err;
          });
      });
    res.send("inserted");
  });

  //insert Server into level1 panel menu
  app.post("/insert/connectivity/server/type2", (req, res) => {
    var Topid = { TopId: req.body.levelID };
    var label = { Label: req.body.server };
    var type = { Type: "Server" };
    dbo
      .collection("PanelMenuCollectionNew")
      .find({})
      .toArray(function (err, result) {
        //console.log(result);
        if (err) throw err;
        var i = result.length;
        var lastDoc = result[i - 1];
        //console.log(lastDoc);
        var id = { ID: lastDoc.ID + 1 };
        //console.log("id", id);
        var insertDetails = Object.assign({}, Topid, id, label, type);
        dbo
          .collection("PanelMenuCollectionNew")
          .insertOne(insertDetails, function (err, res) {
            if (err) throw err;
          });
      });
    res.send("inserted");
  });

  //delete document from PanelMenuCollection
  app.delete("/delete/connectivity", (req, res) => {
    //console.log("req", req.body);
    var id = req.body.id;
    //console.log("id", id);
    dbo
      .collection("PanelMenuCollectionNew")
      .deleteOne({ ID: id }, function (err, res) {
        if (err) throw err;
      });

    res.send("deleted");
  });

  //delete document from ServerDetail collection
  app.delete("/delete/connectivity/server", (req, res) => {
    //console.log("req", req.body);
    var id = req.body.id;
    dbo
      .collection("ServerDetailsCollection")
      .deleteOne({ Server_Id: id.toString() }, function (err, res) {
        if (err) throw err;
      });
    res.send("deleted from server collection");
  });

  //delete document from ServerDetail collection
  app.delete("/delete/connectivity/node", (req, res) => {
    //console.log("req", req.body);
    var id = req.body.id;
    dbo
      .collection("NodeCollection")
      .deleteMany({ Server_Id: id }, function (err, res) {
        if (err) throw err;
      });
    res.send("deleted from node collection");
  });

  app.delete("/delete/connectivity/multiple", (req, res) => {
    var request = req.body.value;
    //console.log(request);
    dbo
      .collection("PanelMenuCollectionNew")
      .deleteMany({ ID: { $in: request } }, function (err, res) {
        if (err) throw err;
        dbo
          .collection("ServerDetailsCollection")
          .deleteMany({ Server_Id: { $in: request } }, function (err, res) {
            if (err) throw err;
            dbo
              .collection("NodeCollection")
              .deleteMany({ Server_Id: { $in: request } }, function (err, res) {
                if (err) throw err;
              });
          });
      });
    res.send("deleted");
  });

  //insert server details into database
  app.post("/insert/connectivity/server-details", (req, res) => {
    var request = req.body;
    dbo
      .collection("ServerDetailsCollection")
      .insertOne(request, function (err, res) {
        if (err) throw err;
      });
    res.send("Inserted into Server collection");
  });

  app.get("/get/connectivity/server-details", (req, res) => {
    dbo
      .collection("ServerDetailsCollection")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
      });
  });

  app.put("/update/connectivity/server-details/nodename", (req, res) => {
    var nodeName = req.body.nodename;
    var serverName = req.body.servername;
    var nodeType = req.body.nodetype;
    dbo
      .collection("ServerDetailsCollection")
      .find({ Server_Name: serverName })
      .toArray(function (err, result) {
        if (err) throw err;
        var nodeTypeArray = [];
        nodeTypeArray = result[0].Node_Type;
        res.send(nodeTypeArray);
        nodeTypeArray.map((node) => {
          if (node.Name === nodeType) {
            node.Node_Name.push(nodeName);
            //console.log("updated node", nodeTypeArray);
            dbo
              .collection("ServerDetailsCollection")
              .updateOne(
                { Server_Name: serverName },
                { $set: { Node_Type: nodeTypeArray } },
                function (err, res) {
                  if (err) throw err;
                }
              );
          }
        });
      });
    // res.send("node name inserted ");
  });

  //insert node details into database
  app.post("/insert/connectivity/node-details", (req, res) => {
    var request = [];
    var req_Obj = {};
    req.body.Node_Name.map((nodename, index) => {
      req_Obj = {
        Server_Id: req.body.Server_Id,
        Node_Name: nodename,
        Node_Type: req.body.Node_Type,
        Vendor: req.body.Vendor,
      };
      request.push(req_Obj);
    });
    dbo
      .collection("NodeCollection")
      .createIndex({ Node_Name: 1 }, { unique: true }, function (err, resp) {
        if (err) throw err;
      });
    //console.log(request);
    dbo.collection("NodeCollection").insertMany(request, function (err, res) {
      if (err) throw err;
    });
    res.send("Inserted into node collection");
  });

  //get node details from db
  app.get("/get/connectivity/node-details", (req, res) => {
    dbo
      .collection("NodeCollection")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
      });
  });

  //Excel Upload
  app.post("/insert/connectivity/excel-upload", (req, res) => {
    var fileName = req.body.fileName;
    //console.log(fileName);
    var workbook = XLSX.readFile(fileName);
    var sheetList = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]]);
    dbo.collection("NodeCollection").insertMany(xlData, function (err, res) {
      if (err) throw err;
    });
    res.send("File uploaded successfully");
  });

  //post action details - "Run a command" into db
  app.get("/flow/content/action", (req, res) => {
    var flowname = req.query.flowName;
    var stepno = req.query.stepNo;
    var type = req.query.type;
    var editor = req.query.EditorId;
    dbo
      .collection("FlowContent")
      .find({ Flow: flowname, Step: stepno })
      .toArray(function (err, result) {
        if (err) throw err;
        var reqObj = {},
          actionObj = {};
        let action = [];
        if (type === "Run a Command") {
          actionObj = {
            Type: type,
            Command: req.query.command,
            id: req.query.id,
          };
        } else if (type === "Find NodeDetails") {
          actionObj = {
            Type: type,
            id: req.query.id,
          };
        } else if (type === "Connect") {
          actionObj = {
            Type: type,
            id: req.query.id,
          };
        } else if (type === "Receive Variable") {
          actionObj = {
            Type: type,
            variable: [req.query.variable],
            id: req.query.id,
          };
        } else if (type === "Add Text Message") {
          actionObj = {
            Type: type,
            message: req.query.message,
            id: req.query.id,
          };
        } else if (type === "Add Json Object") {
          actionObj = {
            Type: type,
            message: req.query.objMessage,
            id: req.query.id,
          };
        } else {
          actionObj = {
            Type: type,
            File: req.query.file,
            id: req.query.id,
            EditorId: editor,
          };
        }
        if (result.length == 0) {
          action.push(actionObj);
          reqObj = {
            Flow: flowname,
            Step: stepno,
            Link: [],
            Action: action,
          };
          dbo.collection("FlowContent").insertOne(reqObj, function (err, res) {
            if (err) throw err;
          });
        } else {
          dbo
            .collection("FlowContent")
            .updateOne(
              { Flow: flowname, Step: stepno },
              { $push: { Action: actionObj } },
              function (err, res) {
                if (err) throw err;
              }
            );
        }
        res.send("inserted successfully");
      });
  });

  //update the saved content
  app.put("/update/content/action", (req, res) => {
    let flowname = req.body.flowName;
    let step = req.body.stepNo;
    let type = req.body.type;
    let id = req.body.id;
    let message = req.body.message;
    dbo
      .collection("FlowContent")
      .find({ Flow: flowname, Step: step })
      .toArray(function (err, result) {
        if (err) throw err;
        let actionObj = {};
        result[0].Action.map((action, index) => {
          if (action.Type === type && action.id === id) {
            if (type === "Add Text Message") {
              actionObj = {
                Type: action.Type,
                message: message,
                id: action.id,
              };
            } else if (type === "Add Json Object") {
              actionObj = {
                Type: action.Type,
                message: req.body.objMessage,
                id: action.id,
              };
            } else if (type === "Receive Variable") {
              actionObj = {
                Type: action.Type,
                variable: [req.body.variable],
                id: action.id,
              };
            } else if (type === "Run a Command") {
              actionObj = {
                Type: action.Type,
                Command: req.body.command,
                id: action.id,
              };
            }
            //console.log("actionobj", actionObj);
            dbo
              .collection("FlowContent")
              .updateOne(
                { Flow: flowname, Step: step },
                { $set: { ["Action." + index]: actionObj } },
                function (err, res) {
                  if (err) throw err;
                }
              );
          }
        });
      });
    res.send("updated");
  });

  app.put("/flow/update/add-receive-variable", (req, res) => {
    var flowname = req.body.flowName;
    var step = req.body.stepNo;
    var id = req.body.id;
    var actionType = req.body.actionType;
    var variable = req.body.variable;
    dbo
      .collection("FlowContent")
      .find({ Flow: flowname, Step: step })
      .toArray(function (err, result) {
        if (err) throw err;
        result[0].Action.map((action, index) => {
          if (action.Type === actionType && action.id === id) {
            dbo.collection("FlowContent").updateOne(
              { Flow: flowname, Step: step },
              {
                $push: { ["Action." + index + ".variable"]: variable },
              },
              function (err, res) {
                if (err) throw err;
              }
            );
          }
        });
      });
    res.send("receive variable added");
  });

  app.put("/flow/edit/add-receive-variable", (req, res) => {
    //console.log("in edit", req.body);
    var flowname = req.body.flowName;
    var step = req.body.stepNo;
    var id = req.body.id;
    var actionType = req.body.actionType;
    var oldvariable = req.body.oldvariable;
    var newvariable = req.body.newvariable;
    var varIndex = req.body.varIndex;
    dbo
      .collection("FlowContent")
      .find({ Flow: flowname, Step: step })
      .toArray(function (err, result) {
        if (err) throw err;
        result[0].Action.map((action, index) => {
          if (action.Type === actionType && action.id === id) {
            action.variable.map((actionVar, index1) => {
              if (actionVar === oldvariable) {
                dbo.collection("FlowContent").updateOne(
                  { Flow: flowname, Step: step },
                  {
                    $set: {
                      ["Action." + index + ".variable." + index1]: newvariable,
                    },
                  },
                  function (err, res) {
                    if (err) throw err;
                  }
                );
              }
            });
          }
        });
      });
    res.send("receive variable added");
  });

  app.put("/flow/delete/add-receive-variable", (req, res) => {
    var flowname = req.body.flowName;
    var step = req.body.stepNo;
    var id = req.body.id;
    var actionType = req.body.actionType;
    var variable = req.body.variable;
    var varIndex = req.body.varIndex;
    dbo
      .collection("FlowContent")
      .find({ Flow: flowname, Step: step })
      .toArray(function (err, result) {
        if (err) throw err;
        result[0].Action.map((action, index) => {
          if (action.Type === actionType && action.id === id) {
            dbo.collection("FlowContent").updateOne(
              { Flow: flowname, Step: step },
              {
                $pull: {
                  ["Action." + index + ".variable"]: variable,
                },
              },
              function (err, res) {
                if (err) throw err;
              }
            );
          }
        });
      });
    res.send("receive variable deleted");
  });

  //store receive variable

  app.post("/insert/receivevariable", (req, res) => {
    let flowname = req.body.data.flowName;
    let stepno = req.body.data.step;
    let variable = req.body.data.variable;
    let varObj = {
      id: req.body.data.id,
      variable: variable,
    };
    dbo
      .collection("ReceiveVariable")
      .find({ flowName: flowname })
      .toArray(function (err, result) {
        if (result.length == 0) {
          let varArray = [];
          //varArray.push(variable);

          varArray.push(varObj);
          let insertObj = {
            flowName: flowname,
            //step: stepno,
            variable: varArray,
          };
          dbo
            .collection("ReceiveVariable")
            .insertOne(insertObj, function (err, res) {
              if (err) throw err;
            });
        } else {
          dbo
            .collection("ReceiveVariable")
            .updateOne({ flowName: flowname }, { $push: { variable: varObj } });
        }
      });

    res.send("Inserted into receive variable");
  });

  // get received variable
  app.get("/get/receivevariable", (req, res) => {
    dbo
      .collection("ReceiveVariable")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
      });
  });

  //delete receive variable
  app.delete("/delete/receivevariable", (req, res) => {
    //console.log(req.body.id);
    dbo
      .collection("ReceiveVariable")
      .find({ flowName: req.body.flowName })
      .toArray(function (err, result) {
        if (err) throw err;
        if (result.length != 0) {
          result[0].variable.forEach((vari, index) => {
            if (vari.id === req.body.id) {
              //console.log("equal");
              result[0].variable.splice(index, 1);
            }
          });
          dbo
            .collection("ReceiveVariable")
            .updateOne(
              { flowName: req.body.flowName },
              { $set: { variable: result[0].variable } }
            );
        }

        res.send(result[0].variable);
      });
    //res.send("deleted from node collection");
  });

  //post link details into db
  app.get("/flow/content/link", (req, res) => {
    var flowname = req.query.flowName;
    var stepno = req.query.stepNo;
    dbo
      .collection("FlowContent")
      .find({ Flow: flowname, Step: stepno })
      .toArray(function (err, result) {
        if (err) throw err;
        var reqObj = {},
          linkObj = {};
        let link = [];
        linkObj = {
          Condition: req.query.condition,
          NextStep: { path: req.query.path, name: req.query.nextStep },
        };
        if (result.length == 0) {
          link.push(linkObj);
          reqObj = {
            Flow: flowname,
            Step: stepno,
            Link: link,
            Action: [],
          };
          dbo.collection("FlowContent").insertOne(reqObj, function (err, res) {
            if (err) throw err;
          });
        } else {
          // //console.log("condition", result[0].Link);
          // result[0].Link.map(link => {
          //   if(link.Condition === req.query.oldcondition){
          //     dbo
          //     .collection("FlowContent")
          //     .updateOne(
          //       { Flow: flowname, Step: stepno },
          //       { $set: { "Link.$.Condition": linkObj } },
          //       function (err, res) {
          //         if (err) throw err;
          //       }
          //     );
          //   }
          // })
          let i = req.query.index;
          //console.log("index", i);
          if (i >= 0) {
            result[0].Link.map((link, index) => {
              //console.log("index inside", index);
              if (index == i) {
                //console.log("index to change", link);
                dbo.collection("FlowContent").updateOne(
                  { Flow: flowname, Step: stepno },
                  {
                    $set: {
                      ["Link." + index]: linkObj,
                      // "Link.$.Condition": req.query.condition,
                      // "Link.$.NextStep": {
                      //   path: req.query.path,
                      //   name: req.query.nextStep,
                      // },
                    },
                  },
                  function (err, res) {
                    if (err) throw err;
                  }
                );
              }
            });
          } else {
            dbo
              .collection("FlowContent")
              .updateOne(
                { Flow: flowname, Step: stepno },
                { $push: { Link: linkObj } },
                function (err, res) {
                  if (err) throw err;
                }
              );
          }
        }
        res.send("inserted successfully");
      });
  });

  //update flow content link

  app.put("/update/flow/link", (req, res) => {
    let flowname = req.body.flowName;
    let stepno = req.body.stepno;
    let condition = req.body.condition;
    let nextstep = req.body.nextstep;
    //console.log(req.body);
    dbo
      .collection("FlowContent")
      .find({ Flow: flowname, Step: stepno })
      .toArray(function (err, result) {
        //console.log("result", result);
        if (result.length !== 0) {
          result[0].Link.map((link, index) => {
            if (link.Condition === condition) {
              let linkObj = {
                Condition: link.Condition,
                NextStep: { path: link.NextStep["path"], name: nextstep },
              };
              dbo.collection("FlowContent").updateOne(
                { Flow: flowname, Step: stepno },
                {
                  $set: {
                    ["Link." + index]: linkObj,
                  },
                },
                function (err, res) {
                  if (err) throw err;
                  //res.send(linkObj);
                }
              );
            }
          });
        }
      });
    res.send("updated");
  });

  //update path in flowcontent
  // app.update("/update/flow/path/flowcontent",(req,res) =>{

  //   var flowname = req.body.data.flowname;
  //   var stepno = req.body.data.stepno;
  //   var condition = req.body.data.condition;
  //   dbo.collection("FlowContent").updateOne({Flow:flowname,Step:stepno , "Link.$.Condition":condition} , $set:{})
  // })

  //delete action details from FLowContent
  app.delete("/delete/flow/action", (req, res) => {
    //console.log("req", req.body);
    let type = req.body.Type;
    let delObj = {};

    // if (type === "Run a Command")
    //   delObj = {
    //     Type: type,
    //     //Command: req.body.Command,
    //     id:req.body.id
    //   };
    // if (type === "Parse the Output")
    //   delObj = {
    //     Type: type,
    //     //File: req.body.File,
    //     id:req.body.id
    //   };

    delObj = {
      Type: type,
      id: req.body.id,
    };
    dbo
      .collection("FlowContent")
      .updateOne(
        { Flow: req.body.flowname, Step: req.body.stepNo },
        { $pull: { Action: delObj } },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.send("deleted");
  });

  //delete link details from FLowContent
  app.delete("/delete/flow/link", (req, res) => {
    //console.log("req", req.body);
    let delObj = {};
    delObj = {
      Condition: req.body.condition,
      //NextStep: req.body.step,
    };
    dbo
      .collection("FlowContent")
      .updateOne(
        { Flow: req.body.flowname, Step: req.body.stepNo },
        { $pull: { Link: delObj } },
        function (err, res) {
          if (err) throw err;
        }
      );
    res.send("deleted");
  });

  // check login credentials

  app.post("/login", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    dbo
      .collection("UserCollection")
      .find({ Username: username, Password: password })
      .toArray(function (err, result) {
        if (err) throw err;
        if (result.length !== 0) {
          res.send("valid");
        } else {
          res.send("invalid");
        }
      });
  });
  // Generate User token
  app.post("/generate-token", (req, res) => {
    // if (!req.body.Username || !req.body.Password) {
    //   return res.status(500).send("No fields");
    // }
    try {
      dbo
        .collection("UserCollection")
        .find({
          Username: req.body.username,
          Password: req.body.password,
        })
        .toArray(function (err, result) {
          if (err) throw err;

          if (result.length != 0) {
            const payload = { id: req.body.username };
            //console.log(payload);
            const token = jwt.sign(payload, process.env.SECRET_OR_KEY);

            dbo
              .collection("TokenCollection")
              .insertOne(
                { Username: req.body.username, Token: token },
                function (err, res) {
                  if (err) throw err;
                }
              );
            res.send({ Token: token });
          } else {
            res.send("Invalid");
          }
        });
    } catch (err) {
      res.status(500).send("Can't read property");
    }
  });
});

app.listen(5001);
