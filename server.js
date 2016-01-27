var express = require('express');
var body_parser = require('body-parser');
var app = express();
var sqlite3 = require('sqlite3')
var db = new sqlite3.Database('whiteboard.db')

db.run('create table if not exists text_tbl (x int, y int, size int, text text, id text not null primary key)');

app.use(express.static(__dirname + '/public'));
app.use(body_parser.json());
app.get('/text', function(req, res) {
  db.all('select * from text_tbl', function (err, data) {
    if (err) {
      console.error(err);
      return res.send([]);
    }
    console.log(data);
    res.send(data);
  })
})

var update_delete = db.prepare('delete from text_tbl where id = ?');
var update_insert = db.prepare('insert into text_tbl (x, y, size, text, id) values (?, ?, ?, ?, ?)');
app.post('/update', function(req, res) {
  res.sendStatus(200);
  console.log(req.body)
  db.serialize(function () {
    update_delete.run(req.body.id);
    update_insert.run(req.body.x, req.body.y, req.body.size, req.body.text, req.body.id);
  });
})

app.listen(3001, function(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('whiteboard listening on port 3001')
})
