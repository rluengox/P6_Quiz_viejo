

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('quiz',
        {
            question: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "El campo de la pregunta no puede estar vacio"}}
            },
            answer: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "El campo de la respuesta no puede estar vacio"}}
            }
        });
};
