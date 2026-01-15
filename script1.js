console.log("Let's start scripting");

document.addEventListener("DOMContentLoaded", () => {
  main();
});

let currentAudio = null;

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
        const filename = element.href.split("/").pop();  // safer
        songs.push(filename);
    }
}


    // Show all songs in the playlist
    let songUL = document.querySelector(".songList ol");
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `
<li>
    <span style="font-size: 20px; gap:10px;">🎵</span>
    <div class="info">
    <div>Song Name</div>
    <div>Artist</div>
        <div>${decodeURIComponent(song)}</div>
        
    </div>
    <div class="playnow">
        <button class="playBtn">▶️</button>
        <button class="pauseBtn" style="display: none;">⏸</button>
    </div>
</li>`;

    }

    // Attach click event to each song
    Array.from(songUL.getElementsByTagName("li")).forEach(li => {
    const playBtn = li.querySelector(".playBtn");
    const pauseBtn = li.querySelector(".pauseBtn");

    playBtn.addEventListener("click", () => {
        const songName = li.querySelector(".info div").innerText.trim();
        playMusic(songName);

        // Show pause, hide play
        playBtn.style.display = "none";
        pauseBtn.style.display = "inline";
    });

    pauseBtn.addEventListener("click", () => {
        if (currentAudio) currentAudio.pause();

        // Show play, hide pause
        playBtn.style.display = "inline";
        pauseBtn.style.display = "none";
    });
});


    return songs;
}

function playMusic(songName) {
    let url = `/songs/${songName}`;
    if (currentAudio) currentAudio.pause();

    currentAudio = new Audio(url);
    currentAudio.play()
        .then(() => {
            console.log(`Playing: ${songName}`);
        })
        .catch(err => {
            console.error("Autoplay failed:", err);
        });

    currentAudio.addEventListener("loadedmetadata", () => {
        console.log(`Duration: ${currentAudio.duration}s`);
    });
}

async function main() {
    let songs = await getSongs();
    console.log("Song list:", songs);

    if (songs.length > 0) {
        // playMusic(songs[0]);
    }
}

main();
