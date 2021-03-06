var Sequelize = require("sequelize");
var sqlite = require("sqlite3");
var env = process.env.NODE_ENV || "development";

var sequelize = null;
if(env === "production"){
    sequelize = new Sequelize(process.env.DATABASE_URL,{
        'dialect': 'postgres'
    });
}else{
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-todo-api.sqlite'
    });
}


var db = {};
db.Todo = sequelize.import(__dirname+'/models/todo.js');
db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;
