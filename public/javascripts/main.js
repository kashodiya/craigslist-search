$(function(){
  console.log('Started');
  var cities = [];
  var resultTemplate;
  
  init();
  
  function init(){
    getCities();

    Handlebars.registerHelper('text', function(obj) {
      return new Handlebars.SafeString(obj['#']);
    });    

    resultTemplate = Handlebars.compile($("#result-template").html());    
    
      
  }
  
  function render(){
    
  }
  
  function search(e){
    var total = 0;
    e.preventDefault();
    $('#resultList').empty();

    var query = $('#query').val();
    
    $('#searchMsg').html('Searching...' + query);
    
    console.log('Searching...', query);
    var cityBatch = listToMatrix(cities, 10);
    //console.log('cityBatch =', cityBatch);
    var cityList = cityBatch.map(function(c){
      return c.join(',');
    });
    
    //console.log('cityList =', cityList);
    
    // var ajaxList = [];
    
    // ajaxList = cityList.map(function(aCityList){
    //   console.log('aCityList =', aCityList);
    //   $.get({
    //     url: '/search-cities',
    //     data: {
    //       query: query,
    //       cityList: aCityList
    //     }
    //   });
    // });
    
    
    var results = [];
    async.eachLimit(cityBatch, 100, function iteratee(aCityList, callback) {
      $.get({
        url: '/search-cities',
        data: {
          query: query,
          cityList: aCityList.join(',')
        }
      }).done(function(data) {
        console.log('Data', data);
        results = results.concat(data.results);
        if(data.results.length > 0){
          var html = resultTemplate(data);
          //console.log(html);
          $('#resultList').append(html);
          total = total + data.results.length;
          $('#searchMsg').html('Found...' + total);
        }else{
          console.log('NO Results!');
        }
        callback(null, []);
      }).fail(function(err){
        console.log('Err', err);
        callback(null, []);
      });
    
    }, function done(err, data) {
      //console.log('Data', data);
      //console.log('Results', results);
      $('#searchMsg').html('Done: Found ' + total);
    });  
    

    

    // $.each(cityList, function(i, aCityList){
    //   console.log('aCityList =', aCityList);
    //   $.get({
    //     url: '/search-cities',
    //     data: {
    //       query: query,
    //       cityList: aCityList
    //     }
    //   });
    // });
    

  }
  
  function getCities(){
    $.get('/cities').done(function(data){
      console.log('Got cities. Count = ', data.length);
      cities = data;
      $('#searchForm').submit(search);
    }).fail(function(err){
      console.log('Error while getting cities', err);
    });
  }
  


  function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;
    for (i = 0, k = -1; i < list.length; i++) {
      if (i % elementsPerSubArray === 0) {
        k++;
        matrix[k] = [];
      }
      matrix[k].push(list[i]);
    }
    return matrix;
  }

  
  
});