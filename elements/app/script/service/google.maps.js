var GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.LIBRARIES = ['places'];

module.exports = {
    load: function(callback) {
        GoogleMapsLoader.load(function(google) {
            callback(google.maps)
        });
    }
}