var express = require('express');
var router = express.Router();
var cities = require('../cities');
var feedparser = require('feedparser-promised');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/cities', function(req, res, next) {
  res.json(cities);
});


router.get('/search-cities', function(req, res, next) {
  var query = req.query.query;
  var cityList = req.query.cityList.split(',');
  
  console.log('Searching...');
  console.log('query', query);
  console.log('cityList length', cityList.length);
  
  //res.json({ok: 'OK'});
  
  var citySearchList = cityList.map(function(c){
    return {
      city: c,
      query: query
    }
  });  
  
  var results = [];
  
  async.eachLimit(citySearchList, 30, function iteratee(cityObj, callback) {
    var url = createRssUrl(cityObj.city, cityObj.query);
    console.log('Search URL', url);
    feedparser.parse(url).then(function (items) {
      console.log('Items found:', items.length);
      callback(null, items);
      results = results.concat(items);
    }).catch(function (error) {
      console.log('error: ', error);
      callback(null, []);
    });
  }, function done(err, data) {
    console.log('Tot results', results.length);
    console.log('Data', data);
    res.json({results: results});
  });  

});


router.get('/search', function(req, res, next) {
  var query = req.query.query;
  
  cities = cities.slice(1,35);
  
  //console.log(cities);
  var citySearchList = cities.map(function(c){
    return {
      city: c,
      query: query
    }
  });  
  
  var results = [];
  
  async.eachLimit(citySearchList, 100, function iteratee(cityObj, callback) {
    var url = createRssUrl(cityObj.city, cityObj.query);
    console.log('Search URL', url);
    feedparser.parse(url).then(function (items) {
      console.log('Items found:', items.length);
      callback(null, items);
      results = results.concat(items);
    }).catch(function (error) {
      console.log('error: ', error);
      callback(null, []);
    });
  }, function done(err, data) {
    console.log('Tot results', results.length);
    console.log('Data', data);
    res.render('results', {results: results});
  });  

});



function createRssUrl(city, query){
  return "https://" + city + ".craigslist.org/search/sof?format=rss&query=" + query + "&is_telecommuting=1";
}





module.exports = router;
