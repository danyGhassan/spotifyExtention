document.getElementById('next').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'nextTrack' });
  });
  
  document.getElementById('prev').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'prevTrack' });
  });
  