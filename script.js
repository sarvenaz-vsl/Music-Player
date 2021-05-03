let seekto;

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
let dir = "songs/";

let playlist = ["Cartoon - On & On" , "Diviners-X-Riell-Slow" , "InfiNoise-Sunlight","Jone - Everything",
"Last Heroes x TwoWorldsApart - Eclipse","Lost Sky - Fearless pt.II"]

let title = ["Cartoon - On & On" , "Slow" , "Sunlight","Everything","Last Heroes",
"Fearless"]
let poster = ["img/1.jpg","img/2.jpg","img/3.jpg","img/4.jpg","img/5.jpg","img/6.jpg"]
let artists = ["Daniel Levi", "Diviners-X-Riell","Nilka","Jone","AERYN","Chris Linton"]

playlist_index = 0;

let ext = ".mp3";

let agent = navigator.userAgent.toLowerCase();
if(agent.indexOf('firefox') != -1 || agent.indexOf('opera') != -1) {
    ext = ".ogg";
}

let playBtn = document.getElementById("playPauseBtn");
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");
let repeat = document.getElementById("repeatBtn");
let randomSong = document.getElementById("random");
let seekslider = document.getElementById("seekslider");
let currentTimeText = document.getElementById("currentTimeText");
let durationTimeText = document.getElementById("durationTimeText");
let playlist_status = document.getElementById("playlist_status");
let playlist_artist = document.getElementById("playlist_artist");

var audio = new Audio();
audio.src = dir + playlist[0] + ext;
audio.loop = false;

playlist_status.innerHTML = title[playlist_index];
playlist_artist.innerHTML = artists[playlist_index];

playBtn.addEventListener('click', playPause);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
seekslider.addEventListener('click', setSeek);
audio.addEventListener('timeupdate', function() { seekTimeUpdate(); })
audio.addEventListener('ended', function() { switchTrack(); })
repeat.addEventListener('click',loop);
randomSong.addEventListener('click',random);

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
}

function loop() {
    if(audio.loop) {
        audio.loop = false;
        document.querySelector(".loop").classList.remove("active");
    } else {
        audio.loop = true;
        document.querySelector(".loop").classList.add("active");
    }
}

function nextSong() {
    document.querySelector(".playPause").classList.add("active");
    playlist_index++;
    if(playlist_index > playlist.length - 1) {
        playlist_index = 0;
    }
    fetchMusicDetail();
}

function prevSong() {
    document.querySelector(".playPause").classList.add("active");
    playlist_index--;
    if(playlist_index < 0) {
        playlist_index = playlist.length - 1;
    }
    fetchMusicDetail();
}

function playPause() {
    if(audio.paused) {
        audio.play();
        document.querySelector(".playPause").classList.add("active");
        document.querySelector(".image").classList.add("play");
    } else {
        audio.pause();
        document.querySelector(".playPause").classList.remove("active");
        document.querySelector("#image").classList.remove("play");
    }
}

function switchTrack() {
    if(playlist_index == (playlist.length - 1)) {
        playlist_index = 0;
    } else {
        playlist_index++;
    }
    fetchMusicDetail();
}

function seek(e) {
    const {duration, currentTime} = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    seekslider.style.width = `${progressPercent}%`;
}

function setSeek(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function seekTimeUpdate() {
    if(audio.duration) {
        var nt = audio.currentTime * (100 / audio.duration);
        seekslider.value = nt;
        var curmins = Math.floor(audio.currentTime / 60); 
        var cursecs = Math.floor(audio.currentTime - curmins * 60); 
        var durmins = Math.floor(audio.duration / 60); 
        var dursecs = Math.floor(audio.duration - durmins * 60); 
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