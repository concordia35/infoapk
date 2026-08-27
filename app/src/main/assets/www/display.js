const bundledImages = ["./slideshow/01.png", "./slideshow/02.png"];
const REMOTE_MANIFEST = "https://concordia35.github.io/infoapk/slideshow/billeder.json";
const REMOTE_BASE = "https://concordia35.github.io/infoapk/slideshow/";
const DB_NAME = "OddFellowImages";
const DB_STORE = "images";

function openImageDb(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE);
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}

async function dbPut(key,value){
  const db=await openImageDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(DB_STORE,"readwrite");
    tx.objectStore(DB_STORE).put(value,key);
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error);
  });
}

async function dbGetAll(){
  const db=await openImageDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(DB_STORE,"readonly");
    const store=tx.objectStore(DB_STORE);
    const keysReq=store.getAllKeys();
    const valsReq=store.getAll();
    tx.oncomplete=()=>{
      const pairs=keysReq.result.map((k,i)=>[k,valsReq.result[i]]);
      pairs.sort((a,b)=>String(a[0]).localeCompare(String(b[0])));
      resolve(pairs.map(p=>p[1]));
    };
    tx.onerror=()=>reject(tx.error);
  });
}

function blobToDataUrl(blob){
  return new Promise((resolve,reject)=>{
    const r=new FileReader();
    r.onload=()=>resolve(r.result);
    r.onerror=()=>reject(r.error);
    r.readAsDataURL(blob);
  });
}

async function syncRemoteImages(){
  if(!navigator.onLine) return;
  try{
    const r=await fetch(REMOTE_MANIFEST+"?ts="+Date.now(),{cache:"no-store"});
    if(!r.ok) return;
    const names=await r.json();
    for(const name of names){
      try{
        const ir=await fetch(REMOTE_BASE+encodeURIComponent(name),{cache:"no-store"});
        if(!ir.ok) continue;
        const data=await blobToDataUrl(await ir.blob());
        await dbPut(name,data);
      }catch(e){}
    }
    localStorage.setItem("remoteImageList",JSON.stringify(names));
  }catch(e){}
}

async function loadImages(){
  try{
    const cached=await dbGetAll();
    if(cached.length) return cached;
  }catch(e){}
  return bundledImages;
}
const fallbackImages = bundledImages;

const photo=document.querySelector(".photo");
const img=document.getElementById("slideImage");
const cap=document.getElementById("slideCaption");
const prog=document.getElementById("progress");
let si=0,sti=0,mi=0;
const DUR=8500;

function progress(){
  prog.style.transition="none";
  prog.style.width="0";
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    prog.style.transition=`width ${DUR}ms linear`;
    prog.style.width="100%";
  }));
}

loadImages().then(images=>{
  if(!images.length) return;
  img.src=images[0];
  progress();
  if(images.length>1){
    setInterval(()=>{
      si=(si+1)%images.length;
      photo.classList.add("changing");
      setTimeout(()=>{
        img.src=images[si];
        cap.textContent=captions[si%captions.length];
        photo.classList.remove("changing");
        progress();
      },550);
    },DUR);
  }
});

setInterval(()=>{
  sti=(sti+1)%stories.length;
  const s=stories[sti];
  const box=document.getElementById("story");
  box.classList.add("changing");
  setTimeout(()=>{
    document.getElementById("storyLabel").textContent=s.label;
    document.getElementById("storyTitle").innerHTML=s.title;
    document.getElementById("storyText").innerHTML=s.text;
    document.querySelector("#storyFact strong").textContent=s.factTitle;
    document.querySelector("#storyFact span").textContent=s.factText;
    box.classList.remove("changing");
  },450);
},12000);

setInterval(()=>{
  mi=(mi+1)%myths.length;
  document.getElementById("mythTitle").textContent=myths[mi][0];
  document.getElementById("mythTruth").textContent=myths[mi][1];
  document.getElementById("mythCount").textContent=`${mi+1} / ${myths.length}`;
},9500);

document.addEventListener("dblclick",async()=>{
  try{
    if(!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }catch(e){}
});


window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(() => {
      console.log("Odd Fellow infotavle er klar til offline brug.");
    });
  }
});



window.addEventListener("load", async ()=>{
  await syncRemoteImages();
});
setInterval(syncRemoteImages, 10 * 60 * 1000);
