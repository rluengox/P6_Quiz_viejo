const express = require('express');
const router = express.Router();

const quizController = require('../controllers/quiz');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/author', (req, res, next) => {
    res.render('author');
});


router.param('quizId', quizController.load);


router.get('/quizzes',                     quizController.index);
router.get('/quizzes/:quizId(\\d+)',       quizController.show);
router.get('/quizzes/new',                 quizController.new);
router.post('/quizzes',                    quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',  quizController.edit);
router.put('/quizzes/:quizId(\\d+)',       quizController.update);
router.delete('/quizzes/:quizId(\\d+)',    quizController.destroy);

router.get('/quizzes/:quizId(\\d+)/play',  quizController.play);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);

router.get('/quizzes/randomplay', quizController.randomplay);
router.get('/quizzes/randomcheck/:quizId(\\d+)', quizController.randomcheck);

module.exports = router;
