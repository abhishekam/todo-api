var Sequelize = require("sequelize");
var sqlite = require("sqlite3");
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sql.sqlite'
});

var Todo = sequelize.define('todo',{
    description:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            len: [1,256]
        }
    },
    completed:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

sequelize.sync({
    force:false
}).then(function(){
    console.log("Everything is synced");
    Todo.findById(1).then(function(todo){
        if(todo){
            console.log(todo.toJSON());
        }else{
            console.log("Todo could not be found!");
        }
    }).catch(function(e){
        console.log(e);
    });
    // Todo.create({
    //     description: "Walk the dog"
    // }).then(function(todo){
    //     return Todo.create({
    //         description:"Take out the trash",
    //         completed: true
    //     });
    // }).then(function(todo){
    //     return Todo.findAll({
    //         where:{
    //             completed: true
    //         }
    //     });
    // }).then(function(todos){
    //     todos.forEach(function(todo){
    //         console.log(todo);
    //     });
    // }).catch(function(e){
    //     console.log(e);
    // });
});
