const express = require("express");
const router = express.Router();
const path = require('path');
const request = require('request');
const pdf = require('pdfkit');

function getJSON(data, callback) {
  var options = {
    url: 'https://api.jdoodle.com/v1/execute',
    method: "POST",
    json: data
  }
  request(options, function (err, res, body) {
    if (err)
      return callback(err);
    try {
      callback(null, body);
    } catch (ex) {
      callback(ex);
    }
  });
}

router.use(express.static('uploads'));

router.post('/download', function (req, res, next) {
  filepath = path.join(__dirname, '../uploads') + '/' + req.body.filename;
  res.sendFile(filepath);
});

router.post('/code', function (req, res, next) {
  var program = {
    script: req.body.script,
    stdin: req.body.stdin,
    language: req.body.language,
    versionIndex: req.body.versionIndex,
    clientId: "52f1423574032070cefc1f3ec9f4e58b",
    clientSecret: "9a5f4e4cd9f2b705cdb9745ff5d6820dd76dd70e9948688c34dac3f95be2d435"
  };

  getJSON(program, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500);
    }
    res.send(result);
  });
});

router.post('/code-download', function (req, res, next) {
  var mydoc = new pdf;
  res.setHeader('Content-disposition', 'attachment; filename="Nodes1.pdf"')
  res.setHeader('Content-type', 'application/pdf')
  mydoc.fontSize(18);
  mydoc.font('Times-Bold');
  mydoc.text(`Lab : ${req.body.lab}`, {
    align: 'center'
  }).fontSize(16);
  mydoc.moveDown();
  mydoc.text(req.body.question, {
    align: 'left'
  }).fontSize(16).font("Times-Roman");
  mydoc.moveDown();
  mydoc.text(req.body.code, {
    align: 'left'
  }).fontSize(18).font('Times-Bold');
  mydoc.moveDown(4);
  mydoc.text('Output: ').font('Times-Roman').fontSize(16);
  mydoc.moveDown();
  mydoc.text(req.body.output, {
    align: 'left'
  });
  mydoc.pipe(res);
  mydoc.end();
  var filepath = path.join(__dirname, '../') + 'Nodes1.pdf';
  res.sendFile(filepath);
})

module.exports = router;

