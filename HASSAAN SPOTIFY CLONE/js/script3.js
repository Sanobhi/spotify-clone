let Currsong = new Audio()
let songs;
let currFolder;

function secoundsToMinutesSeconds(seconds) {
    // Get the minutes
    let mins = Math.floor(seconds / 60);
    // Get the remaining seconds
    let secs = Math.floor(seconds % 60);

    // Pad with leading zeros if needed
    let minutesStr = mins < 10 ? "0" + mins : "" + mins;
    let secondsStr = secs < 10 ? "0" + secs : "" + secs;

    return `${minutesStr}:${secondsStr}`;
}




async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response

    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])

        }

    }

    //  Get all the songs and display in the playlist

    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
         
                            <img class = "invert" src="image/music.svg" alt="">
                            <div class="info">
                              
                                <div>${decodeURIComponent(song)}</div>
                                <div>SANO</div>

                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="play.svg" alt="">
                            </div>
                        
        
       </li>`

    }

    // Play all the music

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            e.querySelector(".info").firstElementChild.innerHTML
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
           

        });
    });
    return songs;
}
getSongs()


playMusic = (track, pause = false) => {
    Currsong.src = `/${currFolder}/` + track
    if (!pause) {
        Currsong.play()
        play.src = "image/pause.svg"

    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"


}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    // console.log(anchors)

    let cardContainer = document.querySelector(".cardContainer")

    // console.log(cardContainer)
    let array = Array.from(anchors)
    // console.log(array)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/") && !e.href.endsWith(".mp3")) {
            let folder = e.href.split("/").pop()
            // console.log(folder)
            // Get the meta-data of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json()
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">

                        <div class="play">

                            <svg width="70" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                Green Circle 
                        <circle cx="50" cy="50" r="50" fill="#1DB954" />

                                 Play Triangle
                        <polygon points="40,30 70,50 40,70" fill="white" />
                            </svg>
                        </div> 


                        <img src="/songs/${folder}/image.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>


                    </div>`


        }


    }

    // load list whenever card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
             playMusic(songs[0])


        })

    });
}


async function main() {

    songs = await getSongs("songs/ncs")
    playMusic(songs[0], true)
    // console.log(songs)
    displayAlbums()




    // Attach listener to play

    play.addEventListener("click", () => {
        if (Currsong.paused) {
            Currsong.play()
            play.src = "image/pause.svg"
        }
        else {
            Currsong.pause()
            play.src = "image/play.svg"
        }
    })

    // attach listener to  timeupdate

    Currsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secoundsToMinutesSeconds(Currsong.currentTime)}/${secoundsToMinutesSeconds(Currsong.duration)}`
        document.querySelector(".circle").style.left = (Currsong.currentTime) / (Currsong.duration) * 100 + "%"
        // document.querySelector(".circle").style.left = (Currsong.currentTime) / (Currsong.duration) * 100 + "%"

    })

    // Attach listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100

        Currsong.currentTime = ((Currsong.duration) * percent) / 100

    })

    // Attach istener to previous and previous
    previous.addEventListener("click", () => {
        let index = songs.indexOf(Currsong.src.split("/").pop())
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])

        }

    })

    // Attach istener to previous and next
    next.addEventListener("click", () => {
        let index = songs.indexOf(Currsong.src.split("/").pop())
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])

        }

    })

    //    Attach listener to hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"

    })
    //    Attach listener to close

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"

    })
    // Attach an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        Currsong.volume = parseInt(e.target.value) / 100
    })



    // Add an event listener to mute the track
    document.querySelector(".volume > img").addEventListener("click", e => {

        if (e.target.src.includes("volume.svg")) {

            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            Currsong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }

        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            Currsong.volume = .10
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
    })





}






main()