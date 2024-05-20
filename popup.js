require('dotenv').config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

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

async function displayArtistInfo(artist) {
  const artistInfoDiv = document.getElementById('artistInfo');
  artistInfoDiv.innerHTML = `
    <img src="${artist.images[0]?.url}" alt="${artist.name}" class="artist-image">
    <div class="artist-name">${artist.name}</div>
    <div class="artist-followers">Followers: ${artist.followers.total.toLocaleString()}</div>
    <div class="artist-genres">Genres: ${artist.genres.join(', ')}</div>
    <div id="albums">Loading albums...</div>
    <div id="topTracks">Loading top tracks...</div>
  `;

  const token = await getAccessToken();
  const albums = await getArtistAlbums(token, artist.id);
  const albumsDiv = document.getElementById('albums');
  albumsDiv.innerHTML = '<h2>Albums</h2>';
  albums.forEach(album => {
    albumsDiv.innerHTML += `<div>${album.name}</div>`;
  });

  const topTracks = await getTopTracks(token, artist.id);
  const topTracksDiv = document.getElementById('topTracks');
  topTracksDiv.innerHTML = '<h2>Top Tracks</h2>';
  topTracks.slice(0, 10).forEach((track, index) => {
    topTracksDiv.innerHTML += `<div>${index + 1}. ${track.name}</div>`;
  });
}
async function getTopTracks(token, artistId) {
  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  const data = await response.json();
  return data.tracks;
}

async function getArtistAlbums(token, artistId) {
  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&limit=50`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  const data = await response.json();
  return data.items;
}
