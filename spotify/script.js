
console.log('Lets write JavaScript');
let audio = new Audio();
let songs;
async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/songs/")

    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])

        }
    }

    return songs

}




const playmusic = (track, pause = false) => {
    // Pause the currently playing audio (if any)
    audio.pause();

    // Set the source of the audio element to the new track
    audio.src = "/songs/" + track;

    // Play the new track if not paused
    if (!pause) {
        audio.play();
        play.src = "pause.svg";
    }

    // Update song information
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}






async function main() {
    // get the song list
    songs = await getSongs()
    playmusic(songs[0], true)
    function secondsToMinutesSeconds(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return "00:00";
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    //show all the songs in playlist

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="music.svg" alt="">
        <div class="info">
         <div>${song.replace("(PagalWorld)", "")}</div>
         <div>Pawan singh</div>
        </div>
        <div class="playnow">
         <span>Play now</span>
         <img class="invert" src="playbutton.svg" alt="">
        </div> </li>`



    }

    //attach an eventlistner to each song

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            const songTitleElement = e.querySelector(".info").firstElementChild;
            if (songTitleElement) {
                const songTitle = songTitleElement.innerHTML;
                console.log("Clicked song:", songTitle);
                // Construct the URL for the song based on the song title
                const modifiedSongTitle = songTitle.replace('.mp3', '(PagalWorld).mp3');
                const songUrl = `${modifiedSongTitle}`;
                console.log("Song URL:", songUrl);
                playmusic(songUrl); // Play the music using the constructed URL
            } else {
                console.error("Could not find song title element");
            }
        });
    });

    //attach an eventlistner play,next and previous

    play.addEventListener("click", () => {
        if (audio.paused) {
            audio.play()
            play.src = "pause.svg"
        }
        else {
            audio.pause()
            play.src = "playbutton.svg"
        }
    })
    // Listen for timeupdate event

    audio.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(audio.currentTime)} / ${secondsToMinutesSeconds(audio.duration)}`
        document.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 100 + "%";
    })

    // add event to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        audio.currentTime = ((audio.duration) * percent) / 100
    })

    // add event listner to hamburger//

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add event listner to close buttom//

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    // Add an event listener to previous


    previous.addEventListener("click", () => {
        audio.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(audio.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    // Add an event listener to next


    next.addEventListener("click", () => {
        audio.pause()
        console.log("Next clicked")

        let index = songs.indexOf(audio.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })

    // add evenrlistner to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("click", (e) => {
        // console.log("settin up to",e.target.value)z
        console.log(e)
        audio.volume=parseInt(e.target.value)/100;

    })

}

main()


