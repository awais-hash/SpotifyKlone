
 let currentSong = new Audio();
let cardContainer = document.querySelector(".cards");

let Songs;
let currFolder;
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}


// const result = formatTime(125); 



 async function gettingSongs(folder){
    currFolder = folder;
    let res = await fetch(`http://127.0.0.1:3000/${folder}/`);
    response= await res.text();
   
    let div = document.createElement("div");
    div.innerHTML = response;
let as = div.querySelectorAll("a");

 Songs = []
for(a of as){
    if (a.href.endsWith(".mp3"))
       Songs.push(a.href.split(`http://127.0.0.1:3000/${folder}/`)[1]);
 

}
let SongsUL= document.querySelector(".songs-list");
SongsUL.innerHTML ="";
for (let  Song of Songs) {
    SongsUL.innerHTML =  SongsUL.innerHTML+`<li> 
    
     
                    <div class="songName">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
                            <circle cx="6.5" cy="18.5" r="3.5" stroke="currentColor" stroke-width="1.5" />
                            <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.5" />
                            <path d="M10 18.5L10 7C10 6.07655 10 5.61483 10.2635 5.32794C10.5269 5.04106 11.0175 4.9992 11.9986 4.91549C16.022 4.57222 18.909 3.26005 20.3553 2.40978C20.6508 2.236 20.7986 2.14912 20.8993 2.20672C21 2.26432 21 2.4315 21 2.76587V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10 10C15.8667 10 19.7778 7.66667 21 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p class="p-song">${Song.replaceAll("%20", " ")}</p>

                    </div>
                    <div class="songPlay">
                        <p>Play</p>
                        <img src="images/play.svg" alt="">
                    </div>
                
    
    
     </li>`;
    
}

Array.from(document.querySelector(".songs-list").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",(element)=>{
       
        playMusic(e.querySelector(".p-song").innerHTML.trim())
    })
     
})
return Songs

 }
 const playMusic = (track, pause=false)=>{


currentSong.src =`/${currFolder}/`+track;
if (!pause){
    currentSong.play();
    play.src ="images/pause.svg";
}

document.querySelector(".info").innerHTML = decodeURI(track);
document.querySelector(".time").innerHTML ="00/00";

 }
async function displayAlbums(){
    let res = await fetch(`http://127.0.0.1:3000/songs/`);
    response= await res.text();
   
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors =div.querySelectorAll("a");
    // console.log(anchors)
   let arry = Array.from(anchors)
    for (let index = 0; index < arry.length; index++) {
        let e= arry[index];
        
    
if(e.href.includes("/songs")){
let folder =(e.href.split("/").slice(-2)[0]);
let res = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
response= await res.json();
console.log(response);
cardContainer.innerHTML= cardContainer.innerHTML + `<div class="card"  data-folder="${folder}">
    <img src="/songs/${folder}/cover.jpeg"  width ="170px" height="170px" alt="Pritam">
    <h4>${response.title}</h4>
    <p>Artist</p>
    <button class="flex"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="black">
        <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="0.1" stroke-linejoin="round" />
    </svg></button>
</div>`

}
    }
    
    Array.from(document.querySelectorAll(".card")).forEach((e)=>{
        e.addEventListener("click", async(item)=>{
        
             Songs = await gettingSongs(`songs/${item.currentTarget.dataset.folder}`)
             playMusic(Songs[0]);
        })
        
        })
}
    



 
 async function PlaySongs(){
   
     await gettingSongs("songs/ncs")
   
    playMusic(Songs[0], true)

    displayAlbums();

play.addEventListener('click',()=>{
    if (currentSong.paused){
        currentSong.play();
        play.src ="images/pause.svg";
    }
    else{
        currentSong.pause()
        play.src ="images/play.svg";
    }
})


currentSong.addEventListener('timeupdate',()=>{

document.querySelector(".time").innerHTML =`${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
document.querySelector(".circle").style.left=(currentSong.currentTime / currentSong.duration) * 100 + "%";

})

document.querySelector(".seekbar").addEventListener("click",(e)=>{
    let percent = ( e.offsetX/e.target.getBoundingClientRect().width ) * 100 ;
   document.querySelector(".circle").style.left= percent + "%";
   currentSong.currentTime = ((currentSong.duration)* percent)/ 100;
})


previous.addEventListener("click",()=>{
   
  
   let index = Songs.indexOf( currentSong.src.split("/").slice(-1) [0])
 
   if((index-1) >= 0){
    playMusic(Songs[index-1])
   }
})
next.addEventListener("click",()=>{
 
    let index = Songs.indexOf( currentSong.src.split("/").slice(-1) [0])
   
   if((index+1) < Songs.length ){
    playMusic(Songs[index+1])
   }
  
})
document.querySelector(".vol").addEventListener("change",  (e)=>{

currentSong.volume = parseInt(e.target.value)/100

})


document.querySelector(".volume>img").addEventListener("click",(e)=>{
if(e.target.src.includes("vol.svg")){
    e.target.src = e.target.src.replace("vol.svg", "mute.svg")
    currentSong.volume =0;
    document.querySelector(".vol").value =0;
}
else{
    e.target.src = e.target.src.replace("mute.svg", "vol.svg")
    currentSong.volume =0.1; 
    document.querySelector(".vol").value =0.1;
}
})
 }
 

 PlaySongs();