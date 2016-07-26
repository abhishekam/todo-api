var express = require("express");
var _ = require("underscore");
var bodyParser = require("body-parser");
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoItemId = 1;

app.use(bodyParser.json());

app.get('/todos', function(req, res){
    var queryParams = req.query;
    var where = {};

    if(queryParams.hasOwnProperty("completed")){
        if(queryParams.completed === "true"){
            where.completed = true;
        }else if(queryParams.completed === "false"){
            where.completed = false;
        }
    }
    if(queryParams.hasOwnProperty("q") && !_.isEmpty(queryParams.q)){
        where.description = {
            $like: '%'+queryParams.q+'%'
        };
    }
    db.Todo.findAll({
        'where': where
    }).then(function(todos){
        return res.json(todos);
    }).catch(function(e){
        return res.status(500).send();
    });
});

app.post('/todos', function(req, res){
    var body = _.pick(req.body,'description', 'completed');
    db.Todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }).catch(function(e){
        res.status(400).json(e);
    });
});

app.delete('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    db.Todo.destroy({ where: {id: todoId}}).then(function(rows){
        if(rows === 0){
            return res.status(404).send();
        }
        return res.status(204).send();
    }).catch(function(e){
        return res.status(500).send();
    });
});

app.put('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    var body = _.pick(req.body,'description', 'completed');
    var attributes = {};

    if(body.hasOwnProperty("completed")){
        attributes.completed = body.completed;
    }
    if(body.hasOwnProperty("description")){
        attributes.description = body.description;
    }

    db.Todo.findById(todoId).then(function(todo){
        if(todo){
            return todo.update(attributes);
        }else{
            return new Promise(function(resolve, reject){
                reject("Not found");
            });
        }
    }, function(e){
        res.status(500).send();
    }).then(function(todo){
        res.json(todo.toJSON());
    }, function(e){
        res.status(400).json(e);
    });
});

app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    db.Todo.findById(todoId).then(function(todo){
        if(todo){
            return res.json(todo.toJSON());
        }else{
            return res.status(404).send();
        }
    }).catch(function(e){
        res.status(500).send();
    });
});

app.get('/', function(req, res){
    res.send("At Todo API Root!");
});

db.sequelize.sync({force: false}).then(function(){
    app.listen(PORT, function(){
        console.log("Listening on PORT "+PORT+" ...");
    });
});

// app.listen(PORT, function(){
//     console.log("Listening on PORT "+PORT+" ...");
// });
