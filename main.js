import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';


// === SETUP ===
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const manager = new THREE.LoadingManager();

const progresBar = document.getElementById('progress-bar')

const container = document.querySelector('.container')

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	progresBar.value = (itemsLoaded/itemsTotal)*100
};

manager.onLoad = function(){
  container.style.display = 'none'
}

let intersectObject = '';
const intersectObjects = [];
const intersectObjectsNames = [
  "mesh_frontlid001_Material_0", "PS1Console", "PS1Controller", "Monitor", "Keyboard", "CPU",
  "FloppyDisk_Black_M_FloppyDisk_0", "FloppyDisk_Green_M_FloppyDisk_0", "FloppyDisk_Red_M_FloppyDisk_0",
  "RetroMouse_M_RetroKeyboardMouse_0", "BatmanFrame", "DPSFrame", "AMFrame"
];

const interactiveItems = {
  PS1Console_M_PS1_0: {
    title: "Hobbies and Interests",
    description: "I’m drawn to games that hit hard — the ones with weight, mood, and meaning. Titles like Red Dead Redemption 2, Elden Ring, and GTA San Andreas aren’t just entertainment to me — they’re creative fuel. I chase that same depth and immersion in everything I build."
  },
  Plane005: {
    title: "My Favourite Characters",
    description: "I’m drawn to characters who carry darkness like a weapon — Batman’s silent rage, Constantine’s bitter wit, and Wolverine’s feral instinct. Flawed, haunted, relentless — they fight for good in a world that rarely deserves it."
  },
  Plane007:{
    title:"Movies",
    description:"I'm deeply inspired by films that blend emotion with intensity — Dead Poets Society and The Batman (2022) hold a special place in my heart. And growing up, movies like Naran and Ghilli shaped my love for larger-than-life stories and unforgettable characters."
  },
  Plane008:{
    title:"Video Games",
    description:"Arthur Morgan and Red Dead Redemption 2 will always hold a special place in my heart. That game forever changed how I perceive storytelling in games — it was deeply emotional, heartbreakingly human, and profoundly insightful."
  },
  Keyboard:{
    title:"Contact Me",
    description:`Want to Connect with me ??<br>
    email : neeravvinod2k18@gmail.com <br>
    instagram: @neerav.vinod <br>
    linked-in: neerav-vinod <br>
    git-hub: neerav-vinod
    `,
    
  },
  RetroMouse_M_RetroKeyboardMouse_0:{
    title:"Carefull !!!",
    description:`
  <div style="position: relative; width: 100%; height: auto; font-family: 'Press Start 2P', monospace;">
    <!-- Retro Spinner -->
    <div id="video-spinner" style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      text-align: center;
      color: lime;
      font-size: 12px;
      background: black;
      border: 2px solid lime;
      padding: 10px;
      box-shadow: 0 0 10px lime;
    ">
      <div style="
        width: 24px;
        height: 24px;
        margin: 0 auto 8px;
        background: lime;
        animation: blink 0.6s steps(1) infinite;
      "></div>
      LOADING...
    </div>

    <!-- Video -->
    <center><video id="rickroll-video" 
      src="./rickroll.mp4"  
      autoplay  
      loop 
      playsinline 
      style="width: 60%; height:"70%" border-radius: 8px; display: block;">
    </video></center>
  </div>

  <style>
    @keyframes blink {
      50% { opacity: 0; }
    }

    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  </style>

`
  },
  FloppyDisk_Red_M_FloppyDisk_0:{
    title:"Heyyy Thanks !!!!!",
    description:`
    <center><img style="height:50%;" src="./cat-kiss.gif"/></center>
    <center>Thank You For Visiting My Site You are a Legend!!</center>
    `
  }

};

// === DOM Elements ===
const modal = document.querySelector('.modal_border');
const closeModal = document.querySelector('.close_btn');
const terminal = document.querySelector('.terminal')
const terminal_button = document.querySelector('.terminal_button')
const input = document.getElementById('terminal_input');
const terminalDisplay = document.querySelector('.terminal_window');

input.addEventListener("keydown", function(event){
  if(event.key == "Enter"){
    console.log('Input');
    
    const cmd = input.value
    appendCommandLine(cmd)
    processCommand(cmd)
     input.value = "";
  }
})

function appendCommandLine(text){
  const line = document.createElement('div')
  line.innerHTML = `C:\\NEERAV\\PORTFOLIO&gt; ${text}`;
  terminalDisplay.insertBefore(line, input.parentElement);
}

function appendOutput(text) {
  const output = document.createElement('div');
  output.className = 'terminal-output';
  output.innerHTML = text;
  terminalDisplay.insertBefore(output, input.parentElement);
}


function processCommand(cmd) {
  switch(cmd) {
    case 'help':
      appendOutput(`Available commands:
  abt     - About Me <br>
  skills  - My Skillset <br>
  res     - Download Resume <br>
  help    - Show available commands`);
      break;
    case 'abt':
      appendOutput("Hi, I’m Neerav Vinod. I’m a developer based in Trivandrum, Kerala. I work on both front-end and back-end parts of websites, and I also enjoy experimenting with simple game projects and 3D art in my free time.");
      break;
    case 'skills':
      appendOutput(`Skills:<br>
  - React <br>
  - Node Js, Express Js <br>
  - HTML, CSS, JavaScript,Three Js <br>
  - Game development (Godot) <br>
  - Content creation <br>
  - Blender`);
      break;
    case 'res':
      appendOutput("Downloading resume...");
      downloadResume();
      break;
    case '':
      break;
    default:
      appendOutput(`'${cmd}' is not recognized as a command. Type 'help' to see available commands.`);
  }
}

const title = document.querySelector('.modal_title');
const description = document.querySelector('.modal');
const siteAudio = new Audio('audio.mp3');
let walkmanPlaying = false;



function openModal(id) {
  const data = interactiveItems[id];
  if (data) {
    
    if (modal && title && description) {
      title.textContent = data.title;
      description.innerHTML = data.description;
      modal.classList.remove('util');
    }
  } 
  if(id == "Monitor"){
    terminal.classList.remove('util');
  }
  if (id == "mesh_frontlid001_Material_0_1"){
    if(walkmanPlaying == false){
      siteAudio.play();
      walkmanPlaying = true;
    }
    else{
      siteAudio.pause();
      walkmanPlaying=false;
    }
  }
  if(id == 'RetroMouse_M_RetroKeyboardMouse_0'){
    
    siteAudio.pause();
    walkmanPlaying=false;

    const vid = document.getElementById("rickroll-video");
const spinner = document.getElementById("video-spinner");

if (vid && spinner) {
  vid.addEventListener('canplaythrough', () => {
    spinner.style.display = 'none';
  });
}
  }
}



function modalClose() {
  intersectObject = '';
  description.innerHTML = ''
  modal.classList.toggle('util');

}

function terminalClose(){
  intersectObject = ''
  terminal.classList.toggle('util')
}

closeModal.addEventListener("click", modalClose);
terminal_button.addEventListener('click',terminalClose)

// === Scene & Renderer ===
RectAreaLightUniformsLib.init();
const scene = new THREE.Scene();
const canvas = document.getElementById("experience-canvas");
const sizes = { width: window.innerWidth, height: window.innerHeight };

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false;


// === Lights ===
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const roomLight = new THREE.RectAreaLight(0xffffff, 5, 3, 1);
roomLight.position.set(0, 2.5, 0);
roomLight.rotation.x = -Math.PI / 2;
scene.add(roomLight);

// === Camera ===
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0.8118, 1.4747, 0.2409);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0.19, 1.40, -0.074);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2; // 90 degrees – prevents camera from going under
controls.minPolarAngle = Math.PI / 4; // 45 degrees – prevents looking straight down
// controls.minAzimuthAngle = -Math.PI / 3;  // -60 degrees (left limit)
// controls.maxAzimuthAngle = Math.PI / 3;   // +60 degrees (right limit)
controls.minDistance = -4;
controls.maxDistance = 1;
controls.update();

// === Load 3D Model ===
const loader = new GLTFLoader(manager);
loader.load("./Portfolio Assets.glb", (glb) => {
  glb.scene.traverse(child => {
    if (intersectObjectsNames.includes(child.name)) {
      intersectObjects.push(child);
    }

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (!(child.material instanceof THREE.MeshStandardMaterial)) {
        child.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
      }
    }
  });

  scene.add(glb.scene);
}, undefined, (error) => {
  console.error(error);
});



// === Events ===
window.addEventListener("click", () => {
  if (intersectObject) {
    openModal(intersectObject);
  }
});

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
 
});

window.addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});


// === Animation Loop ===
renderer.setAnimationLoop(() => {
  controls.update();
  
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(intersectObjects);

  document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
  if (intersects.length > 0) {
    intersectObject = intersects[0].object.name;
    console.log(intersectObject);
  } else {
    intersectObject = '';
  }

  renderer.render(scene, camera);
});