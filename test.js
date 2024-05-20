const axios = require('axios');
const qs = require('qs');

var client_id = 'dfc28855a0614ada8457d5d64e9873ed';
var client_secret = 'ee853425fdd14c13907b5a18ca600d04';

var authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
        grant_type: 'client_credentials'
    })
};

axios(authOptions)
    .then(response => {
        if (response.status === 200) {
            var token = response.data.access_token;
            console.log('Access token:', token);
            // Utiliser le token pour rechercher un artiste
            searchArtist(token, 'Travis Scott');
        }
    })
    .catch(error => {
        console.error('Failed to get access token:', error.response ? error.response.data : error.message);
    });

function searchArtist(token, artistName) {
    var searchOptions = {
        method: 'get',
        url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    axios(searchOptions)
        .then(response => {
            if (response.status === 200) {
                var artists = response.data.artists.items;
                if (artists.length > 0) {
                    var firstArtist = artists[0];
                    console.log('First artist found:', firstArtist);
                } else {
                    console.log('No artists found');
                }
            }
        })
        .catch(error => {
            console.error('Failed to search artist:', error.response ? error.response.data : error.message);
        });
}
