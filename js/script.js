console.log('lets write javascript');
let currentSong = new Audio();
let songs = [];
let currfolder = "";
const playBtn = document.getElementById("play");
const previousBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");

const base = window.location.pathname.split("/").length > 2
  ? "/" + window.location.pathname.split("/")[1]
  : "";

// Highlight format seconds → mm:ss
function secondsToMMSS(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${m}:${s}`;
}

// Update seekbar & time
currentSong.addEventListener("timeupdate", () => {
  document.querySelector(".songtime").innerText =
    `${secondsToMMSS(currentSong.currentTime)}/${secondsToMMSS(currentSong.duration)}`;

  const pct = (currentSong.currentTime / currentSong.duration) * 100;
  document.querySelector(".circle").style.left = pct + "%";
});

// Seek when seekbar clicked
document.querySelector(".seekbar").addEventListener("click", e => {
  const pct = (e.offsetX / e.target.getBoundingClientRect().width);
  currentSong.currentTime = currentSong.duration * pct;
});

// Volume controls
const volumeInput = document.querySelector(".range input");
volumeInput.addEventListener("change", e => {
  currentSong.volume = e.target.value / 100;
});
document.querySelector(".volume > img").addEventListener("click", e => {
  if (e.target.src.includes("volume.svg")) {
    e.target.src = e.target.src.replace("volume.svg", "mute.svg");
    currentSong.volume = 0;
    volumeInput.value = 0;
  } else {
    e.target.src = e.target.src.replace("mute.svg", "volume.svg");
    currentSong.volume = 1;
    volumeInput.value = 100;
  }
});

// Play/pause toggle
playBtn.addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    playBtn.src = "img/pause.svg";
  } else {
    currentSong.pause();
    playBtn.src = "img/play.svg";
  }
});

// Prev/Next
previousBtn.addEventListener("click", () => {
  const current = currentSong.src.split("/").pop();
  const index = songs.indexOf(current);
  if (index > 0) playMusic(songs[index - 1]);
});
nextBtn.addEventListener("click", () => {
  const current = currentSong.src.split("/").pop();
  const index = songs.indexOf(current);
  if (index < songs.length - 1) playMusic(songs[index + 1]);
});

// Play a track
function playMusic(track, pause = false) {
  currentSong.src = `${base}/${currfolder}/${track}`;
  document.querySelector(".songinfo").innerText = track.replace(".mp3", "");
  document.querySelector(".songtime").innerText = "00:00/00:00";

  if (!pause) {
    playBtn.src = "img/pause.svg";
    currentSong.play();
  }
}

// Load songs array & populate UI
async function getSongs(folder) {
  currfolder = folder;
  const res = await fetch(`${base}/${folder}/info.json`);
  const info = await res.json();
  songs = info.songs;
  
  const ul = document.querySelector(".songList ul");
  ul.innerHTML = "";

  songs.forEach(song => {
    const name = decodeURI(song).replace(".mp3", "").replaceAll("%20", " ");
    const li = document.createElement("li");
    li.innerHTML = `
      <img width="20px" class="invert" src="img/music.svg" alt="">
      <div class="info"><div>${name}</div><div></div></div>
      <div class="playnow"><span>Play Now</span>
        <svg width="15" height="10" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" stroke="white" stroke-width="4" fill="none"/><polygon points="40,30 70,50 40,70" fill="white"/></svg>
      </div>`;
    
    li.addEventListener("click", () => playMusic(song));
    ul.appendChild(li);
  });

  return songs;
}

// Load and display album cards
async function displayAlbums() {
  const folders = ["vibe", "Heartbeats", "Old Vibes", "loveyaa","Uss"]; // your actual folders
  const container = document.querySelector(".cardcontainer");
  container.innerHTML = "";

  for (const folder of folders) {
    try {
      const res = await fetch(`${base}/songs/${folder}/info.json`);
      const info = await res.json();

      const div = document.createElement("div");
      div.className = "card";
      div.dataset.folder = `songs/${folder}`;
      div.innerHTML = `
        <div class="play"><svg width="150" height="150" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1DB954"/><polygon points="40,30 70,50 40,70" fill="black"/></svg></div>
        <div><img src="${base}/songs/${folder}/${info.cover}" alt="cover"></div>
        <h1>${info.title}</h1><p>${info.description}</p>`;
      
      div.addEventListener("click", async () => {
        await getSongs(div.dataset.folder);
        playMusic(songs[0], true);
      });

      container.appendChild(div);
    } catch (err) {
      console.warn(`Album '${folder}' not found or JSON missing.`);
    }
  }
}

// Init UI
async function main() {
  await getSongs("songs/vibe");
  playMusic(songs[0], true);
  await displayAlbums();
  
  document.getElementById("loader").style.display = "none";
  document.getElementById("main-content").style.display = "block";
}

window.addEventListener("load", main);

