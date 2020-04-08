const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
var XLSX = require("xlsx");

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/ReactDatabase";

MongoClient.connect(url, function(err, db) {
  var dbo = db.db("ReactDatabase");
  if (err) throw err;
  console.log("connected");

  //insert list of flows into FlowListCollection
  app.post("/insert/flows/flowList", (req, res) => {
    var flowName = req.body.data.name;
    var flowSteps = req.body.data.steps;
    dbo
      .collection("FlowListCollection")
      .insertOne({ name: flowName, steps: flowSteps }, function(err, res) {
        if (err) throw err;
      });
    res.send("inserted into flowlistcollection");
  });

  //get the flows List from db
  app.get("/get/flows/flowList", (req, res) => {
    dbo
      .collection("FlowListCollection")
      .find({})
      .toArray(function(err, flowlist) {
        if (err) throw err;
        res.send(flowlist);
      });
  });

  //insert steps into the respective flows
  app.put("/insert/flows/steps", (req, res) => {
    var flowName = req.body.data.flowName;
    var step = req.body.data.step;
    dbo
      .collection("FlowListCollection")
      .updateOne({ name: flowName }, { $push: { steps: step } }, function(
        err,
        res
      ) {
        if (err) throw err;
      });
    res.send("steps inserted");
  });

  //insert steps into the respective flows
  app.put("/delete/flows/steps", (req, res) => {
    var flowName = req.body.flowName;
    var step = req.body.step;
    dbo
      .collection("FlowListCollection")
      .updateOne({ name: flowName }, { $pull: { steps: step } }, function(
        err,
        res
      ) {
        if (err) throw err;
      });
    res.send("step deleted");
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
      .insertOne({ label: req.body.level1 }, function(err, res) {
        if (err) throw err;
      });
    res.send("Inserted into Level1");
  });

  //get the menu item from db
  app.get("/get/connectivity/item", (req, res) => {
    dbo
      .collection("PanelMenuCollection")
      .find({})
      .toArray(function(err, item) {
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
    console.log("level2", levelName);
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
        function(err, res) {
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
        function(err, res) {
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
    console.log(serverDetail);
    // dbo
    //   .collection("PanelMenuCollection")
    //   .find({ label: level1_Label })
    //   .toArray(function(err, result) {
    //     if (err) throw err;
    //     let level2 = result[0].Level2;
    //     level2.map(level => {
    //       console.log(level.label);
    //       if (level.label === req.body.level2) {
    //         let serverArray = [];
    //         if (level.Servers) {
    //           serverArray = level.Servers;
    //           serverArray.push(serverDetail);
    //         } else {
    //           serverArray.push(serverDetail);
    //         }
    //         console.log(serverArray);
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
        function(err, res) {
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
      .toArray(function(err, item) {
        if (err) throw err;
        res.send(item);
      });
  });

  //insert the first level panel menu into PanelMenuCollectionNew
  app.post("/insert/connectivity/level1/type2", (req, res) => {
    var Topid = { TopId: "000" };
    var label = { Label: req.body.level1 };
    var type = { Type: "level" };
    dbo
      .collection("PanelMenuCollectionNew")
      .countDocuments()
      .then(response => {
        var id = { ID: response + 1 };
        var insertDetails = Object.assign({}, Topid, id, label, type);
        dbo
          .collection("PanelMenuCollectionNew")
          .insertOne(insertDetails, function(err, res) {
            if (err) throw err;
          });
        res.send("inserted");
      });
  });

  //insert the second level panel menu into PanelMenuCollectionNew
  app.post("/insert/connectivity/level2/type2", (req, res) => {
    var Topid = { TopId: req.body.level1ID };
    var label = { Label: req.body.level2 };
    var type = { Type: "level" };
    dbo
      .collection("PanelMenuCollectionNew")
      .countDocuments()
      .then(response => {
        var id = { ID: response + 1 };
        var insertDetails = Object.assign({}, Topid, id, label, type);
        dbo
          .collection("PanelMenuCollectionNew")
          .insertOne(insertDetails, function(err, res) {
            if (err) throw err;
          });
        res.send("inserted");
      });
  });

  //insert Server into level1 panel menu
  app.post("/insert/connectivity/server/type2", (req, res) => {
    var Topid = { TopId: req.body.levelID };
    var label = { Label: req.body.server };
    var type = { Type: "Server" };
    dbo
      .collection("PanelMenuCollectionNew")
      .countDocuments()
      .then(response => {
        var id = { ID: response + 1 };
        var insertDetails = Object.assign({}, Topid, id, label, type);
        dbo
          .collection("PanelMenuCollectionNew")
          .insertOne(insertDetails, function(err, res) {
            if (err) throw err;
          });
        res.send("inserted");
      });
  });

  //delete document from PanelMenuCollection
  app.delete("/delete/connectivity", (req, res) => {
    console.log("req", req.body);
    var id = req.body.id;
    console.log("id", id);
    dbo
      .collection("PanelMenuCollectionNew")
      .deleteOne({ ID: id }, function(err, res) {
        if (err) throw err;
      });
    res.send("deleted");
  });

  //insert server details into database
  app.post("/insert/connectivity/server-details", (req, res) => {
    var request = req.body;
    dbo
      .collection("ServerDetailsCollection")
      .insertOne(request, function(err, res) {
        if (err) throw err;
      });
    res.send("Inserted into Server collection");
  });

  app.get("/get/connectivity/server-details", (req, res) => {
    dbo
      .collection("ServerDetailsCollection")
      .find({})
      .toArray(function(err, result) {
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
      .toArray(function(err, result) {
        if (err) throw err;
        var nodeTypeArray = [];
        nodeTypeArray = result[0].Node_Type;
        res.send(nodeTypeArray);
        nodeTypeArray.map(node => {
          if (node.Name === nodeType) {
            node.Node_Name.push(nodeName);
            console.log("updated node", nodeTypeArray);
            dbo
              .collection("ServerDetailsCollection")
              .updateOne(
                { Server_Name: serverName },
                { $set: { Node_Type: nodeTypeArray } },
                function(err, res) {
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
        Node_Type: req.body.Node_Type
      };
      request.push(req_Obj);
    });
    console.log(request);
    dbo.collection("NodeCollection").insertMany(request, function(err, res) {
      if (err) throw err;
    });
    res.send("Inserted into node collection");
  });

  //get node details from db
  app.get("/get/connectivity/node-details", (req, res) => {
    dbo
      .collection("NodeCollection")
      .find({})
      .toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
      });
  });

  //Excel Upload
  app.post("/insert/connectivity/excel-upload", (req, res) => {
    var get_file = req;
    console.log(get_file);
    var file = get_file["file"];
    var fileName = file["name"];
    var workbook = XLSX.readFile(fileName);
    var sheetList = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]]);
    dbo.collection("NodeCollection").insertMany(xlData, function(err, res) {
      if (err) throw err;
    });
    res.send("File uploaded successfully");
  });
});

app.listen(5001);
