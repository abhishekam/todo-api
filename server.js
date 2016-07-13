var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoItemId = 1;

app.use(bodyParser.json());

app.get('/todos', function(req, res){
    res.json(todos);
});

app.post('/todos', function(req, res){
    var body = req.body;
    body.id = todoItemId;
    todoItemId++;

    todos.push(body);

    res.json(body);
});

app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    var todoItem = null;

    for(var i = 0; i<todos.length; i++){
        if(todos[i].id === todoId){
            todoItem = todos[i];
        }
    }
    if(todoItem){
        res.json(todoItem);
    }else{
        res.status(404).send();
    }
});

app.get('/', function(req, res){
    res.send("At Todo API Root!");
});

app.listen(PORT, function(){
    console.log("Listening on PORT "+PORT+" ...");
});
