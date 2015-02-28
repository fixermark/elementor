var http = require('http');
var q = require('q');
var request = require('request');

describe('HTTP', function() {

  var encode = function(command) {
    return 'http://localhost:13000/testSelector?popupInput=' +
        encodeURIComponent(command);
  };

  var callElementor = function(command) {
    var deferred = q.defer();

    var url = encode(command);
    request(url, function(error, response, body) {
      if (error) {
        console.log("Got error: " + error);
        return deferred.reject(error);
      }
      deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
  };

  it('should navigate to protractor website', function(done) {
    var url = 'browser.get(\'http://angular.github.io/protractor/#/api\')';

    // Given that you navigate to the protractor website.
    callElementor(url).then(function() {
      // When you get the current URL.
      return callElementor('browser.getCurrentUrl()');
    }).then(function(response) {
      // Then ensure the URL has changed.
      expect(response).toEqual({
        results: {
          'browser.getCurrentUrl()': 'http://angular.github.io/protractor/#/api'
        }
      });
      done();
    });
  });

  it('should transform by input into count expression', function(done) {
    // When you select by css.
    callElementor('by.css(\'#title\')').then(function(response) {
      // Then ensure the input is turned into count expression.
      expect(response).toEqual({
        results: {
          'element.all(by.css(\'#title\')).count()': 1
        }
      });
      done();
    });
  });

  it('should get element text', function(done) {
    // When you get an element's text.
    callElementor('element.all(by.css(\'.navbar li\')).first().getText()')
        .then(function(response) {
          expect(response).toEqual({
            results: {
              'element.all(by.css(\'.navbar li\')).first().getText()': 'Home'
            }
          });
          done();
        });
  });
});