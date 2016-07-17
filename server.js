var express = require("express");
var _ = require("underscore");
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
    var body = _.pick(req.body,'description', 'completed');
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        return res.status(400).send();
    }
    body.description = body.description.trim();
    body.id = todoItemId++;
    todos.push(body);

    res.json(body);
});

app.delete('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    var todoItem = _.findWhere(todos, {id: todoId});

    if(todoItem){
        todos = _.without(todos, todoItem);
        return res.json(todoItem);
    }else{
        return res.status(404).send();
    }

});

app.put('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    var todoItem = _.findWhere(todos, {id: todoId});
    var validAttributes = {};

    if(!todoItem){
        return res.status(404).send();
    }

    if(req.body.hasOwnProperty("completed")){
        if(_.isBoolean(req.body.completed)){
            validAttributes.completed = req.body.completed;
        }else{
            return res.status(400).send();
        }
    }
    if(req.body.hasOwnProperty("description")){
        if(_.isString(req.body.description) && req.body.description.trim().length >  0){
            validAttributes.description = req.body.description.trim();
        }else{
            return res.status(400).send();
        }
    }
    _.extend(todoItem, validAttributes);
    res.json(todoItem);
});

app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    var todoItem = _.findWhere(todos, {id: todoId});
    if(todoItem){
        res.json(todoItem);
    }else{
        return res.status(404).send();
    }
});

app.get('/', function(req, res){
    res.send("At Todo API Root!");
});

app.listen(PORT, function(){
    console.log("Listening on PORT "+PORT+" ...");
});
