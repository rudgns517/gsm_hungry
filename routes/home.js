// routes/home.js

var express = require('express');
var router = express.Router();
var passport = require('../config/passport'); // 1
const school = require('school-info');

// Home
router.get('/', function(req, res){
  res.render('home/welcome');
});


// Login // 2
router.get('/login', function (req,res) {
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('home/login', {
    username:username,
    errors:errors
  });
});

// Post Login // 3
router.post('/login',
  function(req,res,next){
    var errors = {};
    var isValid = true;

    if(!req.body.username){
      isValid = false;
      errors.username = 'Username is required!';
    }
    if(!req.body.password){
      isValid = false;
      errors.password = 'Password is required!';
    }

    if(isValid){
      next();
    }
    else {
      req.flash('errors',errors);
      res.redirect('/login');
    }
  },
  passport.authenticate('local-login', {
    successRedirect : '/posts',
    failureRedirect : '/login'
  }
));

// meal1
router.get('/search/:name', function(req, res) {
  // 오늘을 기준으로 날짜를 담음
  const date = new Date()
  let YMD = ''
  // getFullYear 년도를 불러옴
  YMD += date.getFullYear()
  // getMonth 달을 불러옴(자바스크립트에서 달은 0부터 시작해서 1을 더해줌)
  YMD += ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1))
  // getDate 일을 불러옴
  YMD += (date.getDate() > 9 ? date.getDate() : '0' + date.getDate())
  
  school.search({
    SCHUL_NM: req.params.name
  }).then(res1 => {
    console.log('SEARCH:', res1[0])
  
    school.meal({
      ATPT_OFCDC_SC_CODE: res1[0].ATPT_OFCDC_SC_CODE,
      SD_SCHUL_CODE: res1[0].SD_SCHUL_CODE,
      MLSV_YMD: YMD,
    })
      .then(res2 => {
        let first, second, third
        res2.forEach(e => {
          if (e.MMEAL_SC_NM == '조식') first = e.DDISH_NM
          else if (e.MMEAL_SC_NM == '중식') second = e.DDISH_NM
          else if (e.MMEAL_SC_NM == '석식') third = e.DDISH_NM
        });

        res.send({
          first: first ? first.replace( /<br\/>/gi, '\n') : null,
          second: second ? second.replace( /<br\/>/gi, '\n') : null,
          third: third ? third.replace( /<br\/>/gi, '\n') : null,
          y: date.getFullYear(),
          m: date.getMonth() + 1,
          d: date.getDate(),
        })
      })
      .catch(error => {
        res.send({
          first: null,
          second: null,
          third: null,
          y: date.getFullYear(),
          m: date.getMonth() + 1,
          d: date.getDate(),
        })
      })
    })
});


// meal2
router.get('/meal/:name', function(req, res) {
  // 오늘을 기준으로 날짜를 담음
  const date = new Date()
  let YMD = ''
  // getFullYear 년도를 불러옴
  YMD += date.getFullYear()
  // getMonth 달을 불러옴(자바스크립트에서 달은 0부터 시작해서 1을 더해줌)
  YMD += ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1))
  // getDate 일을 불러옴
  YMD += (date.getDate() > 9 ? date.getDate() : '0' + date.getDate())
  
  school.search({
    SCHUL_NM: req.params.name
  }).then(res1 => {
    console.log('SEARCH:', res1[0])
  
    school.meal({
      ATPT_OFCDC_SC_CODE: res1[0].ATPT_OFCDC_SC_CODE,
      SD_SCHUL_CODE: res1[0].SD_SCHUL_CODE,
      MLSV_YMD: YMD,
    })
      .then(res2 => {
        let first, second, third
        res2.forEach(e => {
          if (e.MMEAL_SC_NM == '조식') first = e.DDISH_NM
          else if (e.MMEAL_SC_NM == '중식') second = e.DDISH_NM
          else if (e.MMEAL_SC_NM == '석식') third = e.DDISH_NM
        });

        res.render('home/meal', {
          first: first ? first.replace( /<br\/>/gi, '\n') : null,
          second: second ? second.replace( /<br\/>/gi, '\n') : null,
          third: third ? third.replace( /<br\/>/gi, '\n') : null,
          y: date.getFullYear(),
          m: date.getMonth() + 1,
          d: date.getDate(),
        })
      })
      .catch(error => {
        res.render('home/meal', {
          first: null,
          second: null,
          third: null,
          y: date.getFullYear(),
          m: date.getMonth() + 1,
          d: date.getDate(),
        })
      })
    })
});

// Logout // 4
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;