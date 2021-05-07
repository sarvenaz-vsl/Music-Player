//  theme
let checkbox = document.querySelector('input[name = theme]');
checkbox.addEventListener('change', function() {
    if(this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})

// Music

let playlist = ["music-1", "music-2", "music-3", "music-4", "music-5", "music-6"];

let title = ["Cartoon - On & On" , "Slow" , "Sunlight","Everything","Last Heroes",
"Fearless"];

let artists = ["Daniel Levi", "Diviners-X-Riell","Nilka","Jone","AERYN","Chris Linton"];

let poster = ["img/1.jpg","img/2.jpg","img/3.jpg","img/4.jpg","img/5.jpg","img/6.jpg"]

playlist_index = 0;

let dir = "songs/";

let ext = ".mp3";

let agent = navigator.userAgent.toLowerCase();
if(agent.indexOf('firefox') != -1 || agent.indexOf('opera') != -1) { ext = ".ogg"; }

let playBtn = document.getElementById("playPauseBtn");
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");
let repeat = document.getElementById("repeatBtn");
let randomSong = document.getElementById("random");
let currentTimeText = document.getElementById("currentTimeText");
let durationTimeText = document.getElementById("durationTimeText");
let playlist_status = document.getElementById("playlist_status");
let playlist_artist = document.getElementById("playlist_artist");
let seekslider = document.querySelector("#seekslider");
let progress = document.querySelector(".progress");
let musicList = document.querySelector(".music-list");
let showMoreBtn = document.querySelector("#more-music");
let hideMusicBtn = document.querySelector(".fa-times");

var audio = new Audio();
audio.src = dir + playlist[0] + ext;
audio.loop = false;

playlist_status.innerHTML = title[playlist_index];
playlist_artist.innerHTML = artists[playlist_index];

window.addEventListener('load', () => { playingNow(); });
playBtn.addEventListener('click', playPause);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', seek);
audio.addEventListener('ended', function() { switchTrack(); });
repeat.addEventListener('click',loop);
randomSong.addEventListener('click',random);
showMoreBtn.addEventListener('click', () => { musicList.classList.toggle("show"); });
hideMusicBtn.addEventListener('click', () => { showMoreBtn.click(); });
progress.addEventListener('click', (e) => {
    let progressWidthval = progress.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = audio.duration;
    audio.currentTime = (clickedOffsetX / progressWidthval) * songDuration;
    if(audio.paused) {
        audio.play();
        document.querySelector(".playPause").classList.add("active");
        document.querySelector(".image").classList.add("play");
    }
});


// Functions

function fetchMusicDetail() {
    $("#image").attr("src", poster[playlist_index]);
    
    document.querySelector(".image").classList.add("play");

    playlist_status.innerHTML = title[playlist_index];
    playlist_artist.innerHTML = artists[playlist_index];

    audio.src = dir + playlist[playlist_index] + ext;
    audio.play();    
}

function getRandomNumber(min, max) {
    let step1 = max - min + 1;
    let step2 = Math.random() * step1;
    let result = Math.floor(step2) + min;
    return result;
}

function random() {
    let randomIndex = getRandomNumber(0, playlist.length - 1);
    playlist_index = randomIndex;
    fetchMusicDetail();
    document.querySelector(".playPause").classList.add("active");
    playingNow();
}

function loop() {
    if(audio.loop) {
        audio.loop = false;
        document.querySelector(".loop").classList.remove("active");
    } else {
        audio.loop = true;
        document.querySelector(".loop").classList.add("active");
    }
    playingNow();
}

function nextSong() {
    document.querySelector(".playPause").classList.add("active");
    playlist_index++;
    if(playlist_index > playlist.length - 1) {
        playlist_index = 0;
    }
    fetchMusicDetail();
    playingNow();
}

function prevSong() {
    document.querySelector(".playPause").classList.add("active");
    playlist_index--;
    if(playlist_index < 0) {
        playlist_index = playlist.length - 1;
    }
    fetchMusicDetail();
    playingNow();
}

function playPause() {
    if(audio.paused) {
        audio.play();
        document.querySelector(".playPause").classList.add("active");
        document.querySelector(".image").classList.add("play");
    } else {
        audio.pause();
        document.querySelector(".playPause").classList.remove("active");
        document.querySelector(".image").classList.remove("play");
    }
    playingNow();
}

function switchTrack() {
    if(playlist_index == (playlist.length - 1)) {
        playlist_index = 0;
    } else {
        playlist_index++;
    }
    fetchMusicDetail();
    playingNow();
}

function seek(e) {
    const {duration, currentTime} = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    seekslider.style.width = `${progressPercent}%`;
    seekTimeUpdate();
}

function seekTimeUpdate() {
    if(audio.duration) {       
        var curmins = Math.floor(audio.currentTime / 60); 
        var cursecs = Math.floor(audio.currentTime % 60); 
        var durmins = Math.floor(audio.duration / 60); 
        var dursecs = Math.floor(audio.duration % 60); 
        if(cursecs < 10) { cursecs = "0" + cursecs; }
        if(dursecs < 10) { dursecs = "0" + dursecs; }
        if(curmins < 10) { curmins = "0" + curmins; }
        if(durmins < 10) { durmins = "0" + durmins; }
        currentTimeText.innerHTML = curmins + ":" + cursecs;
        durationTimeText.innerHTML = durmins + ":" + dursecs;
    } else {
        currentTimeText.innerHTML = "00" + ":" + "00";
        durationTimeText.innerHTML = "00" + ":" + "00";
    }
}

const ulTag = document.querySelector("ul");
for(i = 0; i < playlist.length; i++) {
    
    let liTag = `<li li-index="${i}"}">
                    <div class="row">
                        <span>${title[i]}</span>
                        <p>${artists[i]}</p>
                    </div>
                    
                    <span class="audio-duration">
                        <div class="button-lg-list">
                            <i class="fas fa-play-circle fa-lg"></i>
                            <i class="fas fa-pause-circle fa-lg"></i>
                        </div>
                    </span>
                </li>`;

    ulTag.insertAdjacentHTML("beforeend", liTag);
}

const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
    for(j = 0; j < allLiTags.length; j++) {
        if(allLiTags[j].classList.contains("playing")) { allLiTags[j].classList.remove("playing"); }

        if(allLiTags[j].getAttribute("li-index") == playlist_index) { 
            allLiTags[j].classList.add("playing");
        } 
        
        allLiTags[j].setAttribute("onclick", "clicked(this)")
    }
}

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    playlist_index = getLiIndex;
    fetchMusicDetail();
    playPause();
    if(audio.paused) {
        audio.play();
        document.querySelector(".playPause").classList.add("active");
        document.querySelector(".image").classList.add("play");
    }
    playingNow();
}