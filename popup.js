document.getElementById('searchButton').addEventListener('click', function() {
  const artistName = document.getElementById('artistName').value;
  if (artistName) {
    getAccessToken().then(token => {
      searchArtist(token, artistName).then(artist => {
        if (artist) {
          displayArtistInfo(artist);
        } else {
          document.getElementById('artistInfo').innerText = 'Artist not found';
        }
      }).catch(error => {
        console.error('Error searching artist:', error);
        document.getElementById('artistInfo').innerText = 'Error searching artist';
      });
    }).catch(error => {
      console.error('Error getting access token:', error);
      document.getElementById('artistInfo').innerText = 'Error getting access token';
    });
  }
});

async function getAccessToken() {
  const client_id = 'dfc28855a0614ada8457d5d64e9873ed';
  const client_secret = 'ee853425fdd14c13907b5a18ca600d04';
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const data = await response.json();
  return data.access_token;
}

async function searchArtist(token, artistName) {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  const data = await response.json();
  return data.artists.items[0];
}

function displayArtistInfo(artist) {
  const artistInfoDiv = document.getElementById('artistInfo');
  artistInfoDiv.innerHTML = `
    <img src="${artist.images[0]?.url}" alt="${artist.name}" class="artist-image">
    <div class="artist-name">${artist.name}</div>
    <div class="artist-followers">Followers: ${artist.followers.total.toLocaleString()}</div>
    <div class="artist-genres">Genres: ${artist.genres.join(', ')}</div>
  `;
}
