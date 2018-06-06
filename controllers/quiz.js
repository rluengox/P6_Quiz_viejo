const sequelize = require("sequelize");
const {models} = require("../models");
const operator = sequelize.Op;

exports.load = (req, res, next, quizId) => {

    models.quiz.findById(quizId)
        .then(quiz => {
            if (quiz) {
                req.quiz = quiz;
                next();
            } else {
                throw new Error('No existe un quiz asociado a esa id=' + quizId);
            }
        })
        .catch(error => next(error));
};


exports.index = (req, res, next) => {

    models.quiz.findAll()
        .then(quizzes => {
            res.render('quizzes/index.ejs', {quizzes});
        })
        .catch(error => next(error));
};


exports.show = (req, res, next) => {

    const {quiz} = req;

    res.render('quizzes/show', {quiz});
};


exports.new = (req, res, next) => {

    const quiz = {
        question: "",
        answer: ""
    };

    res.render('quizzes/new', {quiz});
};

exports.create = (req, res, next) => {

    const {question, answer} = req.body;

    const quiz = models.quiz.build({
        question,
        answer
    });

    quiz.save({fields: ["question", "answer"]})
        .then(quiz => {
            req.flash('success', 'Quiz creado satisfactoriamente.');
            res.redirect('/quizzes/' + quiz.id);
        })
        .catch(sequelize.ValidationError, error => {
            req.flash('error', 'Hay errores:');
            error.errors.forEach(({message}) => req.flash('error', message));
            res.render('quizzes/new', {quiz});
        })
        .catch(error => {
            req.flash('error', 'Error al crear el quiz: ' + error.message);
            next(error);
        });
};


exports.edit = (req, res, next) => {

    const {quiz} = req;

    res.render('quizzes/edit', {quiz});
};


exports.update = (req, res, next) => {

    const {quiz, body} = req;

    quiz.question = body.question;
    quiz.answer = body.answer;

    quiz.save({fields: ["question", "answer"]})
        .then(quiz => {
            req.flash('success', 'Edicion completada.');
            res.redirect('/quizzes/' + quiz.id);
        })
        .catch(sequelize.ValidationError, error => {
            req.flash('error', 'Hay errores:');
            error.errors.forEach(({message}) => req.flash('error', message));
            res.render('quizzes/edit', {quiz});
        })
        .catch(error => {
            req.flash('error', 'Edicion incompleta: ' + error.message);
            next(error);
        });
};


let availableQuizzes;

exports.randomplay = (req, res, next) => {
    if (!req.session.randomPlay) req.session.randomPlay = [];

    models.quiz.count({where: {id: {[sequelize.Op.notIn]: req.session.randomPlay}}})
        .then(count => {
            if (count === 0) {
                const score = req.session.randomPlay.length;
                req.session.randomPlay = [];
                res.render('quizzes/random_none', {
                    score: score
                });
            } else {
                models.quiz.findAll()
                    .then(quizzes => quizzes.map(quiz => quiz.id))
                    .then(ids => ids.filter(id => req.session.randomPlay.indexOf(id) === -1))
                    .then(ids => ids[Math.floor(Math.random() * ids.length)])
                    .then(id => models.quiz.findById(id)
                        .then(quiz => {
                            res.render('quizzes/random_play', {
                                    score: req.session.randomPlay.length,
                                    quiz: quiz
                                }
                            );
                        })).catch(err => console.log(err))
                    .catch(err => console.log(err));
            }
        })

};

exports.randomcheck = (req, res, next) => {

    const {quiz, query} = req;

    const answer = query.answer || "";
    const result = answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim();
    let lastScore = req.session.randomPlay.length;

    result ? req.session.randomPlay.push(quiz.id) : req.session.randomPlay = [];

    res.render('quizzes/random_result', {
        answer,
        quiz,
        result,
        score: result ? ++lastScore : lastScore
    });


};

exports.destroy = (req, res, next) => {

    req.quiz.destroy()
        .then(() => {
            req.flash('success', 'Quiz borrado.');
            res.redirect('/quizzes');
        })
        .catch(error => {
            req.flash('error', 'Error borrando el quiz: ' + error.message);
            next(error);
        });
};


exports.play = (req, res, next) => {

    const {quiz, query} = req;

    const answer = query.answer || '';

    res.render('quizzes/play', {
        quiz,
        answer
    });
};


exports.check = (req, res, next) => {

    const {quiz, query} = req;

    const answer = query.answer || "";
    const result = answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim();

    res.render('quizzes/result', {
        quiz,
        result,
        answer
    });
};

