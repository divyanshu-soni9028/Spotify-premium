console.log('lets write javascript');
let currentSong = new Audio();
let songs;
// ek global variable banadia
let currfolder;


async function getsongs(folder) {
  // let a = await fetch("http://127.0.0.1:3000/songs/");
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = [];
  // songs already ek global variable h
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      // songs.push(element.href.split("/songs/")[1])
      songs.push(element.href.split(`/${folder}/`)[1])
      // ye split issliye use kia taaki jo naam aara tha bada sa usme hum /songs/ ke baad waala part le saken...issliye [1] likha
    }

  }

  



  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

  // document.querySelector(".songList")-
  // Finds the first element in the document with the class songList.
  // .getElementsByTagName("ul")-
  // Returns a live HTMLCollection of all <ul> elements inside the .songList element.
  // [0]-
  // Grabs the first <ul> from that collection.

  songUL.innerHTML = "";
  // ye issliye kia kyuki jab naya folder kholre the toh purana songs me hi naya folder add hojara tha...toh pehle khali kia

  // here we used for of loop bcoz we need songs from the array
  for (const song of songs) {
    songUL.innerHTML += `<li><img width="20px" class="invert" src="img/music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ").replaceAll("%D1%84%D1%80%D0%BE%D0%B7%D0%B8", " ").replaceAll("(Official Audio)", " ").replaceAll("(Official Video)", " ").replaceAll("(official video)", " ").replaceAll("(Lyrics)", " ").replaceAll("aa%E2%9D%A4", " ")}</div>
                            <div></div>
                        </div>
                    
                    <div class="playnow">
                        <span>PlayNow</span>
                        <svg width="15" height="10" viewBox="0 0 100 100" fill="white" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="48" stroke="white" stroke-width="4" fill="none"/>
  <polygon points="40,30 70,50 40,70" fill="white"/>
                    </div></li>`;
    // replace unnecessary words from the link to finally show the name
    // <li> ${song.replaceAll("%20" ," ").replaceAll("%D1%84%D1%80%D0%BE%D0%B7%D0%B8"," ").replaceAll(".mp3","").replaceAll("(Official Audio)"," ").replaceAll("(Official Video)"," ").replaceAll("(official video)"," ").replaceAll("(Lyrics)"," ")} </li>`

  }
  // attach an event listener to each song 

  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
    //array from use kia taaki songlist ke saare list array me aajayen....and for each(element) lagaya hrr ek element k liye ussi array ke
    e.addEventListener("click", element => {
      // hrr ek element p click event lagaya
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      // ye bss console me song ka name dekhne k liye..info ke first element (div) ka innerhtml dikhayega 
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
      //playmusic function banaya aur ussme ye songa ka innerhtml daldia...taaki ye ek particular song ko access krr sake
      // fir wo div ka innerhtml issme jayega aur usski link m bss hum /songs/(folder)aur.mp3 add krenge taaki link shi hojaye
    })
  });


  // attach an event listener to play,next and previous

  return songs;
}

const playMusic = (track, pause = false) => {

  //   let audio= new Audio("/songs/"+track+".mp3");
  //  audio.play();
  // issme dikkt ye h ki dusre p play dabayo toh do gaane sath me bajj jaare...issliye ek currentsong ka variable banalia


  // currentSong.play();
  // ab jisspe click krenge whi chalega baaki band
  // currentSong.src="/songs/"+track;
  currentSong.src = `/${currfolder}/` + track;
  document.querySelector(".songinfo").innerHTML = decodeURI(track).replaceAll(".mp3", "");
  // decode issliye kiya kyuuki song name url code ke format me aara tha...to humne decode krke usse normal name banadia
  // ye replace issliye lagaya kyuki songinfo div me jo songname display hora hai ussme bhi .mp3 aajara hai
  document.querySelector(".songtime").innerHTML = "00:00/00:00";

  if (!pause) {
    // currentSong.src="/songs/"+track;
    play.src = "img/pause.svg";
    currentSong.play();
    // document.querySelector(".songinfo").innerHTML = decodeURI(track);
  }
}


async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  console.log(div);
  // issme hume ek td me jaake mila a href ke andar mila /songs/vibe wla folder
  let anchors = div.getElementsByTagName("a");
  let cardcontainer = document.querySelector(".cardcontainer")

  let array = Array.from(anchors);
  // Array.from(anchors).forEach(async (e)=>{
  for (let index = 0; index < array.length; index++) {
    const e = array[index];


    if (e.href.includes("/songs")) {
      console.log(e.href.split("/").splice(-2)[0]);
      let folder = e.href.split("/").splice(-2)[0];
      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);
      cardcontainer.innerHTML += `<div data-folder="${folder}" class="card">
                        <div class="play"><svg width="150" height="150" viewBox="0 0 100 100"
     xmlns="http://www.w3.org/2000/svg">
    <!-- Green circular background -->
    <circle cx="50" cy="50" r="50" fill="#1DB954" />
    <!-- Black play triangle -->
    <polygon points="40,30 70,50 40,70" fill="black" />
</svg>
</div>
                        <img src="/songs/${folder}/cover.jpg" alt="llllllllll">
                        <h1>${response.title}</h1>
                        <p> ${response.description}</p>
                    </div>`
    }
  };
  // load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    console.log(e);
    // ye console log ye check krne k lia kia tha ki saare cards aa bhi rahe ki nahi
    // doc.getelements ek collection deta hai ussme foreach nhi lgta....array p lagta hai
    e.addEventListener("click", async item => {
      console.log(item, item.currentTarget.dataset.folder);
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      //current target issliye use kia kyuki pehle target kuch bhi bnnjara tha (for eg- pic,heading,para)...current target se card hi target hoga

      playMusic(songs[0]);
    })
  }
  );
}

displayAlbums();
async function main() {
  await getsongs("songs/vibe");
  // currentSong.src="songs[0]";
  playMusic(songs[0], true)
  console.log(songs);

  await displayAlbums;
  // display all the album on the page


  // let currentSong;
  // shows all the songs in the playlist

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    }
    else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  }
  )
  // play the songs

  // var audio = new Audio(songs[0]);
  // audio.play();
  // audio.pause();

  // audio.addEventListener("ontimeupdate",()=>{
  //     // let duration = audio.duration;
  //     console.log(audio.duration,audio.currentSrc,audio.currentTime);
  // })
  // }      
  // // html audio element mdn reference


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

  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`

    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    //   circle.style.transform = `translateX(${(currentSong.currentTime/currentSong.duration)*100}%)`;

  }
  )

  // adding an event listener to seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    console.log(e);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    //   yaha e.target seekbar hai
    currentSong.currentTime = ((currentSong.duration) * percent) / 100;
  }
  )
  // e.offsetX
  // Refers to the X-coordinate of the mouse relative to the target element (e.target) when the event was fired.
  // For example, if you click 30 pixels from the left inside a div, e.offsetX will be 30.

  // e.target.getBoundingClientRect().width
  // e.target is the element on which the event occurred.
  // .getBoundingClientRect() returns an object with the size and position of that element relative to the viewport.
  // .width gives the visible width of the element in pixels.

  // adding an event listener for hamburgir

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  })
  // adding an event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = -110 + "%";
  }
  )

  // adding an event listener to previous and next buttons
  previous.addEventListener("click", () => {
    let index = songs.indexOf((currentSong.src.split("/").splice(-1))[0]);
    console.log(songs, index);
    if ((index - 1) >= 0) {
      // bcoz aakhri song me next nhi hojana chaiye
      playMusic(songs[index - 1])
    }
  })

  next.addEventListener("click", () => {
    console.log('next clicked');

    console.log(currentSong);
    console.log(currentSong.src);
    console.log(currentSong.src.split("/").splice(-1)[0]);

    console.log(songs);
    currentSong.pause();
    // waise iske bina bhi pause hoke agla chall hi jaar tha
    let index = songs.indexOf((currentSong.src.split("/").splice(-1))[0]);
    console.log(songs, index);
    if ((index + 1) < songs.length) {
      // bcoz aakhri song me next nhi hojana chaiye
      playMusic(songs[index + 1])
    }
  })


  // adding an event for volume button\

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log(e, e.target, e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;
    //jo e.target.value hai wo rage deta hai kaha click kia 1 to 100
    // aur jo .volume function hai ussme value bss 0 to 1 daalskte issliye divide by 100 kia 
  })

  // adding an event listener to mute the volume button
  document.querySelector(".volume>img").addEventListener("click",(e) => {
    console.log(e.target);
    if(e.target.src.includes("img/volume.svg")){
      // e.target.src="mute.svg";
      e.target.src=e.target.src.replace("img/volume.svg","img/mute.svg");
      currentSong.volume=0;
      document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
      currentSong.volume=1;
      // e.target.src="volume.svg";
      e.target.src= e.target.src.replace("img/mute.svg","img/volume.svg");
       document.querySelector(".range").getElementsByTagName("input")[0].value=100;
    }
  }
  )
}
main();  

// <!-- JavaScript to hide loader -->
  
   window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("main-content").style.display = "block";
  }, 1500); // 👈 show loader for at least 1.5 seconds
});
