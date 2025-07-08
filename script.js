document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const albumArt = document.getElementById('album-art');
    const playlistEl = document.getElementById('playlist');
    const fileInput = document.getElementById('file-input');
    const addBtn = document.getElementById('add-btn');
    const albumArtElement = document.querySelector('.album-art');

    // Sample playlist with song details
    let playlist = [
        {
            title: "On My Way",
            artist: "Alan Walker",
            src: "songs/song1.mp3",
            cover: "images/alanwalker.jpg"
        },
        {
            title: "My Love Is Gone",
            artist: "allu arjun",
            src: "songs/song2.mp3",
            cover: "images/allu.jpg"
        },
        {
            title: "Bhajare Bhajare Bhajarangi",
            artist: "Shankar Mahadevan",
            src: "songs/song3.mp3",
            cover: "images/shivanna.jpg"
        },
        {
            title: "O Kalala Kathala ",
            artist: "vijay",
            src: "songs/song4.mp3",
            cover: "images/dear comrade.jpg"
        }
    ];

    let currentSongIndex = 0;
    let isPlaying = false;

    function initPlayer() {
        renderPlaylist();
        loadSong(currentSongIndex);
    }

    function loadSong(index) {
        const song = playlist[index];
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        albumArt.src = song.cover;
        audio.src = song.src;
        
        const playlistItems = playlistEl.querySelectorAll('li');
        playlistItems.forEach(item => item.classList.remove('playing'));
        playlistItems[index].classList.add('playing');
    }

    function playSong() {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        audio.play();
        albumArtElement.style.animationPlayState = 'running';
    }

    function pauseSong() {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        audio.pause();
        albumArtElement.style.animationPlayState = 'paused';
    }

    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = playlist.length - 1;
        }
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }

    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex > playlist.length - 1) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }

    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        

        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
        
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
        

        if (durationSeconds) {
            durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
        }
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    }

    
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    
    function renderPlaylist() {
        playlistEl.innerHTML = '';
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = `${song.title} - ${song.artist}`;
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });
            playlistEl.appendChild(li);
        });
    }

    // Add song to playlist
    function addSongToPlaylist(file) {
        const songUrl = URL.createObjectURL(file);
        const newSong = {
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            artist: "Unknown Artist",
            src: songUrl,
            cover: "images/default.jpg" // You can add a default cover image
        };
        playlist.push(newSong);
        renderPlaylist();
    }

    
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    audio.addEventListener('loadedmetadata', () => {
        
        const durationMinutes = Math.floor(audio.duration / 60);
        let durationSeconds = Math.floor(audio.duration % 60);
        if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
        durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    });

    progressContainer.addEventListener('click', setProgress);

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
    });

    addBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            addSongToPlaylist(file);
        }
    });

    // Initialize player
    initPlayer();
});