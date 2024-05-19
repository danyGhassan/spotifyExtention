const clientId = 'YOUR_SPOTIFY_CLIENT_ID';
const redirectUri = chrome.identity.getRedirectURL('callback');
let accessToken = '';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'nextTrack') {
    controlSpotify('next');
  } else if (message.action === 'prevTrack') {
    controlSpotify('previous');
  }
});

function controlSpotify(action) {
  if (!accessToken) {
    authorizeSpotify(() => controlSpotify(action));
    return;
  }

  const url = `https://api.spotify.com/v1/me/player/${action}`;
  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }).then(response => {
    if (!response.ok) {
      console.error('Spotify API error', response);
    }
  }).catch(error => console.error('Network error', error));
}

function authorizeSpotify(callback) {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-modify-playback-state`;
  chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (redirectUri) => {
    if (chrome.runtime.lastError) {
      console.error('Auth error', chrome.runtime.lastError);
      return;
    }
    
    const params = new URLSearchParams(redirectUri.split('#')[1]);
    accessToken = params.get('access_token');
    callback();
  });
}
