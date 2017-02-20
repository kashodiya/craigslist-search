var cities = require('./cities');

function createRssUrl(city){
  return "https://" + city + ".craigslist.org/search/sof?format=rss&query=Java&is_telecommuting=1";
}

var feedparser = require('feedparser-promised');
var url = createRssUrl('sfbay')

feedparser.parse(url).then(function (items) {
  items.forEach(function (item) {
    console.log('title: ', item.title);
  });
}).catch(function (error) {
  console.log('error: ', error);
});


function clSearch(){
      
}

module.exports.clSearch = clSearch;
