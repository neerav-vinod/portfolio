import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

// === LOADING SCREEN SETUP ===
let totalAssets = 0;
let loadedAssets = 0;
let isAllLoaded = false;

// Create loading screen elements
const loadingScreen = document.createElement('div');
loadingScreen.id = 'loading-screen';
loadingScreen.innerHTML = `
  <div class="loading-container">
    <div class="loading-logo">
      <h1>NEERAV VINOD</h1>
      <p>Loading Portfolio...</p>
    </div>
    <div class="loading-bar-container">
      <div class="loading-bar" id="loading-bar"></div>
    </div>
    <div class="loading-percentage" id="loading-percentage">0%</div>
    <div class="loading-text" id="loading-text">Initializing...</div>
  </div>
`;

// Add loading screen styles
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
  #loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    font-family: 'Courier New', monospace;
    color: #00ff00;
  }

  .loading-container {
    text-align: center;
    max-width: 400px;
    width: 90%;
  }

  .loading-logo h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
    text-shadow: 0 0 10px #00ff00;
    animation: pulse 2s infinite;
  }

  .loading-logo p {
    font-size: 1.2em;
    margin-bottom: 30px;
    opacity: 0.8;
  }

  .loading-bar-container {
    width: 100%;
    height: 6px;
    background: #333;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 20px;
    border: 1px solid #00ff00;
  }

  .loading-bar {
    height: 100%;
    background: linear-gradient(90deg, #00ff00, #00cc00);
    width: 0%;
    transition: width 0.3s ease;
    box-shadow: 0 0 10px #00ff00;
  }

  .loading-percentage {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 10px;
    text-shadow: 0 0 5px #00ff00;
  }

  .loading-text {
    font-size: 1em;
    opacity: 0.7;
    animation: dots 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes dots {
    0%, 20% { content: ''; }
    40% { content: '.'; }
    60% { content: '..'; }
    80%, 100% { content: '...'; }
  }

  .loading-screen-fade-out {
    opacity: 0;
    transition: opacity 1s ease-out;
  }
`;

document.head.appendChild(loadingStyles);
document.body.appendChild(loadingScreen);

// Loading screen update functions
function updateLoadingProgress() {
  const progress = (loadedAssets / totalAssets) * 100;
  const progressBar = document.getElementById('loading-bar');
  const percentageText = document.getElementById('loading-percentage');
  
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (percentageText) percentageText.textContent = `${Math.round(progress)}%`;
}

function updateLoadingText(text) {
  const loadingText = document.getElementById('loading-text');
  if (loadingText) loadingText.textContent = text;
}

function assetLoaded(assetName) {
  loadedAssets++;
  updateLoadingText(`Loading ${assetName}...`);
  updateLoadingProgress();
  
  if (loadedAssets >= totalAssets && !isAllLoaded) {
    isAllLoaded = true;
    setTimeout(() => {
      updateLoadingText('Complete! Click to enter...');
      loadingScreen.style.cursor = 'pointer';
      loadingScreen.addEventListener('click', hideLoadingScreen);
    }, 500);
  }
}

function hideLoadingScreen() {
  loadingScreen.classList.add('loading-screen-fade-out');
  setTimeout(() => {
    loadingScreen.remove();
    // Start the animation loop only after loading is complete
    startAnimationLoop();
  }, 1000);
}

// === SETUP ===
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Enhanced Loading Manager
const manager = new THREE.LoadingManager();

manager.onLoad = function() {
  console.log('All 3D assets loaded');
  assetLoaded('3D Model');
};

manager.onProgress = function(url, itemsLoaded, itemsTotal) {
  console.log(`Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
  updateLoadingText(`Loading 3D assets... ${itemsLoaded}/${itemsTotal}`);
};

manager.onError = function(url) {
  console.error(`Failed to load: ${url}`);
  updateLoadingText(`Error loading: ${url}`);
};

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
    description: "I'm drawn to games that hit hard — the ones with weight, mood, and meaning. Titles like Red Dead Redemption 2, Elden Ring, and GTA San Andreas aren't just entertainment to me — they're creative fuel. I chase that same depth and immersion in everything I build."
  },
  Plane005: {
    title: "My Favourite Characters",
    description: "I'm drawn to characters who carry darkness like a weapon — Batman's silent rage, Constantine's bitter wit, and Wolverine's feral instinct. Flawed, haunted, relentless — they fight for good in a world that rarely deserves it."
  },
  Plane007: {
    title: "Movies",
    description: "I'm deeply inspired by films that blend emotion with intensity — Dead Poets Society and The Batman (2022) hold a special place in my heart. And growing up, movies like Naran and Ghilli shaped my love for larger-than-life stories and unforgettable characters."
  },
  Plane008: {
    title: "Video Games",
    description: "Arthur Morgan and Red Dead Redemption 2 will always hold a special place in my heart. That game forever changed how I perceive storytelling in games — it was deeply emotional, heartbreakingly human, and profoundly insightful."
  },
  Keyboard: {
    title: "Contact Me",
    description: `Want to Connect with me ??<br>
    email : neeravvinod2k18@gmail.com <br>
    instagram: @neerav.vinod <br>
    linked-in: neerav-vinod <br>
    git-hub: neerav-vinod
    `,
  },
  RetroMouse_M_RetroKeyboardMouse_0: {
    title: "Carefull !!!",
    description: `
          <video 
  src="./rickroll.mp4"  
  autoplay 
  playsinline 
  loop 
  style="width:99%; height:99%; border-radius:8px;">
</video>
        `
  },
  FloppyDisk_Red_M_FloppyDisk_0: {
    title: "Heyyy Thanks !!!!!",
    description: `
    <center><img style="height:50%;" src="./cat-kiss.gif"/></center>
    <center>Thank You For Visiting My Site You are a Legend!!</center>
    `
  }
};

// === PRELOAD ASSETS ===
function preloadAssets() {
  // Count total assets to load
  totalAssets = 3; // 3D model, audio, video
  
  // Preload audio
  updateLoadingText('Loading audio...');
  const audioPromise = new Promise((resolve) => {
    const audio = new Audio('audio.mp3');
    audio.addEventListener('canplaythrough', () => {
      assetLoaded('Audio');
      resolve();
    });
    audio.addEventListener('error', () => {
      console.error('Audio loading failed');
      assetLoaded('Audio (failed)');
      resolve();
    });
    audio.preload = 'auto';
  });

  // Preload video
  updateLoadingText('Loading video...');
  const videoPromise = new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = './rickroll.mp4';
    video.addEventListener('canplaythrough', () => {
      assetLoaded('Video');
      resolve();
    });
    video.addEventListener('error', () => {
      console.error('Video loading failed');
      assetLoaded('Video (failed)');
      resolve();
    });
    video.preload = 'auto';
  });

  // Load 3D model (this will trigger the manager callbacks)
  updateLoadingText('Loading 3D model...');
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
    assetLoaded('3D Model (failed)');
  });
}

// === DOM Elements ===
const modal = document.querySelector('.modal_border');
const closeModal = document.querySelector('.close_btn');
const terminal = document.querySelector('.terminal');
const terminal_button = document.querySelector('.terminal_button');
const input = document.getElementById('terminal_input');
const terminalDisplay = document.querySelector('.terminal_window');

// Terminal functionality
input.addEventListener("keydown", function(event) {
  if (event.key == "Enter") {
    console.log('Input');
    const cmd = input.value;
    appendCommandLine(cmd);
    processCommand(cmd);
    input.value = "";
  }
});

function appendCommandLine(text) {
  const line = document.createElement('div');
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
      appendOutput("Hi, I'm Neerav Vinod. I'm a developer based in Trivandrum, Kerala. I work on both front-end and back-end parts of websites, and I also enjoy experimenting with simple game projects and 3D art in my free time.");
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
  if (id == "Monitor") {
    terminal.classList.remove('util');
  }
  if (id == "mesh_frontlid001_Material_0_1") {
    if (walkmanPlaying == false) {
      siteAudio.play();
      walkmanPlaying = true;
    } else {
      siteAudio.pause();
      walkmanPlaying = false;
    }
  }
  if (id == 'RetroMouse_M_RetroKeyboardMouse_0') {
    siteAudio.pause();
    walkmanPlaying = false;
  }
}

function modalClose() {
  intersectObject = '';
  description.innerHTML = '';
  modal.classList.toggle('util');
}

function terminalClose() {
  intersectObject = '';
  terminal.classList.toggle('util');
}

closeModal.addEventListener("click", modalClose);
terminal_button.addEventListener('click', terminalClose);

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
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 4;
controls.minDistance = -4;
controls.maxDistance = 1;
controls.update();

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
function startAnimationLoop() {
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
}

// === Initialize Loading ===
preloadAssets();