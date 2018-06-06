const path = require('path');

const Sequelize = require('sequelize');


const url = process.env.DATABASE_URL || "sqlite:quizzes.sqlite";

const sequelize = new Sequelize(url);


sequelize.import(path.join(__dirname, 'quiz'));


sequelize.import(path.join(__dirname,'sessions'));

sequelize.sync()
.then(() => console.log('Base de datos creada satisfactoriamente'))
.catch(error => {
    console.log("Error", error);
    process.exit(1);
});


module.exports = sequelize;
