


console.log("Let's write some js")


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

// Example usage:
// console.log(secoundsToMinutesSeconds(0));     // "00:00"
// console.log(secoundsToMinutesSeconds(65));    // "01:05"
// console.log(secoundsToMinutesSeconds(3600));  // "60:00"




async function getSong(folder) {
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
        //  Get all the songs in playlist

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
     songUL.innerHTML = ""
    
    // console.log(songUL)
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
         
                            <img class = "invert" src="music.svg" alt="">
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


    //Attach Listen to all the songs in playlist

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            e.querySelector(".info").firstElementChild.innerHTML
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
        })

    });

    return songs
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    Currsong.src = `/${currFolder}/` + track
    if (!pause) {
        Currsong.play()
        play.src = "pause.svg"

    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}


async function main() {
     await getSong("songs/ncs")
    console.log(songs)

    // playMusic(songs[0], true)




    // Attach Listen to play

    play.addEventListener("click", () => {
        if (Currsong.paused) {
            Currsong.play()
            play.src = "pause.svg"
        }
        else {
            Currsong.pause()
            play.src = "play.svg"
        }
    })


    // Listen to live update

    Currsong.addEventListener("timeupdate", () => {
        // console.log(Currsong.currentTime,Currsong.duration)
        document.querySelector(".songtime").innerHTML = `${secoundsToMinutesSeconds(Currsong.currentTime)}/${secoundsToMinutesSeconds(Currsong.duration)}`
        document.querySelector(".circle").style.left = (Currsong.currentTime) / (Currsong.duration) * 100 + "%"
    })

    // Listen to seekbar

    document.querySelector(".seekbar").addEventListener("click", (e) => {

        percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100

        document.querySelector(".circle").style.left = percent + "%"


        //  VERY IMPORTANT
        Currsong.currentTime = ((Currsong.duration) * percent) / 100

    })

    // Add an event listener to previous

    previous.addEventListener("click", () => {
        let index = songs.indexOf(Currsong.src.split("/").pop())
        // console.log(index)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        let index = songs.indexOf(Currsong.src.split("/").pop())
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    // Listener to hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        console.log(document.querySelector(".hamburger"))
        document.querySelector(".left").style.left = "0%"
    })
    // Listener to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Listener to volume


    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        Currsong.volume = parseInt(e.target.value) / 100
    })

    //    load the playlist when card is clicked


    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item=>{
        songs = await getSong(`songs/${item.currentTarget.dataset.folder}`)
           
        })
        
    });












}
main()