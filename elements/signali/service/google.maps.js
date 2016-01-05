import GoogleMapsLoader from 'google-maps';
GoogleMapsLoader.LIBRARIES = ['places'];

export default {
    load: function(callback) {
        GoogleMapsLoader.load(function(google) {
            callback(google.maps)
        });
    }
}