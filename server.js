var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
    description:'Have Dinner',
    id:1,
    completed: false
},{
    description:'Finish Udemy Course',
    id:2,
    completed: true
}];

app.get('/todos', function(req, res){
    res.json(todos);
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
