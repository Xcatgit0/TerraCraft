// Main.js

window.onerror = function (message, source, lineno, colno, error) {
    alert(`Error: ${message}\nSource: ${source}\nLine: ${lineno}, Column: ${colno}\nStack Trace: ${error ? error.stack : 'N/A'}`);
    return true; // ป้องกันไม่ให้ข้อผิดพลาดถูกแสดงใน Console อีก
};



import { fpsAnimate, fpsCreate } from "./fpsCounter.js";
import { create, Player, updateCam, updatePos , move, updateMove} from "./Player.js";
// 1. สร้าง scene, camera, และ renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({antialias:true});
const clock = new THREE.Clock();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
//fpsCreate();
// 2. สร้างไฟ (แสง)
const light = new THREE.DirectionalLight(0xdddddd, 1);
light.position.set(10, 10, 10);
scene.add(light);

scene.background = new THREE.Color(0x5c9aff);

// 3. สร้างบล็อก
createBlocks(scene); // เรียกใช้ฟังก์ชันเพื่อสร้าง block
createProbe();

// 4. ตั้งค่ากล้องและการควบคุม
camera.position.y = 8;
camera.position.z = 10;

// 5. การควบคุมกล้อง
let isMouseDown = false;
let isPlacingBlock = false;
let prevMouseX = 0;
let prevMouseY = 0;
const maxRotationX = Math.PI / 2; // 90 องศา
const minRotationX = -Math.PI / 2; // -90 องศา

// ฟังก์ชันสำหรับการควบคุมกล้อง
const rotateCamera = (deltaX, deltaY) => {
    camera.rotation.y -= deltaX * 0.01;
    camera.rotation.x -= deltaY * 0.01;
    camera.rotation.x = Math.max(minRotationX, Math.min(maxRotationX, camera.rotation.x));
};

// การควบคุมด้วยเมาส์
document.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;

    if (event.button === 0) { // คลิกซ้าย
        isPlacingBlock = false; // ตั้งค่าว่าไม่ได้วางบล็อก
    } else if (event.button === 2) { // คลิกขวา
        isPlacingBlock = true; // ตั้งค่าว่าวางบล็อก
    }
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

document.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        const deltaX = event.clientX - prevMouseX;
        const deltaY = event.clientY - prevMouseY;
        rotateCamera(deltaX, deltaY);
        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }
});

// การควบคุมด้วยสัมผัส
document.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
        isMouseDown = true;
        prevMouseX = event.touches[0].clientX;
        prevMouseY = event.touches[0].clientY;
        isPlacingBlock = false; // กดค้างทุบบล็อก
    }
});

document.addEventListener('touchend', () => {
    isMouseDown = false;
});

// ป้องกันการเลื่อนหน้าเว็บเมื่อสัมผัส
const preventDefault = (event) => {
    event.preventDefault();
};

document.addEventListener('touchstart', preventDefault, { passive: false });
document.addEventListener('touchmove', preventDefault, { passive: false });

// 6. ระบบทุบและวางบล็อก
let selectedBlock = null;

// ฟังก์ชันตรวจสอบการชน
const checkIntersection = (event) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // คำนวณตำแหน่งของเมาส์
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const intersectedBlock = intersects[0].object;

        // ถ้าทุบบล็อก
        if (!isPlacingBlock && intersectedBlock.UserData.tags.breakable) {
            scene.remove(intersectedBlock);
            probeUpdate(intersectedBlock.UserData.name, String(intersectedBlock.UserData.id));
            selectedBlock = null; // รีเซ็ต selectedBlock หลังจากทุบ
        } else {
            selectedBlock = intersectedBlock; // 
            probeUpdate(intersectedBlock.UserData.name, String(intersectedBlock.UserData.id));
        }
    }
};

// ฟังก์ชันวางบล็อก
const placeBlock = (blockName) => {
    if (selectedBlock) {
        const position = selectedBlock.position.clone(); // ใช้ตำแหน่งของบล็อกที่เลือก
        const block = new Block(position.x, position.y, position.z, blockName);
        block.addToScene(scene);
        selectedBlock = null; // รีเซ็ต selectedBlock หลังจากวาง
    }
};

let TouchTime;
let ThreadholdTouch = 250;
const player = new Player(0,3,5,"player",camera);

function onTouchStart(event) {
    TouchTime = Date.now();
}
function onTouchEnd(event) {
    const Timehold = Date.now() - TouchTime;
    const touch = event.changedTouches[0];
    if (Timehold >= ThreadholdTouch) {
        //alert("Hold Detected!");
        isPlacingBlock = true;
        checkIntersection(touch);
    } else {
        //alert("shortTouch Detected!");
        isPlacingBlock = false;
        if (touch.clientX > window.innerWidth / 4) {
        checkIntersection(touch);
        } else {
            let direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            move(direction, player)
        }
        //console.log("at "+touch.clientX+" "+touch.clientY);
    }
}

window.addEventListener('touchstart', onTouchStart);
window.addEventListener('touchend', onTouchEnd,true);

var framePerSecound = 0;

// ฟังก์ชัน render
const animate = () => {
    requestAnimationFrame(animate);
    //fpsAnimate(clock);
    framePerSecound = framePerSecound + 1;
    updateMove(player, camera);
    updatePos(player,scene);
    updateCam(player,camera);
    renderer.render(scene, camera);
};
const showFPS = () => {
    const fps = framePerSecound;
    const element = document.getElementById("FPS");
    const Text = "FPS: "+String(fps);
    element.innerText = Text;
    framePerSecound = 0;
}

// เรียกใช้งานฟังก์ชันตรวจสอบการชนเมื่อมีการคลิก
window.addEventListener('mousedown', checkIntersection);
window.addEventListener('mouseup', checkIntersection);
window.addEventListener('contextmenu', (event) => {
    //event.preventDefault(); // ป้องกันเมนูบริบท
});

// วางบล็อกโดยใช้คีย์บอร์ด
window.addEventListener('keydown', (event) => {
    if (event.key === 'b' && isPlacingBlock) {
        console.log("placeing block");
        placeBlock('dirt'); // เปลี่ยนชื่อบล็อกที่ต้องการวางได้ตามต้องการ
    }
});

// การควบคุมมือถือ
window.addEventListener('touchmove', (event) => {
    if (isMouseDown) {
        const deltaX = event.touches[0].clientX - prevMouseX;
        const deltaY = event.touches[0].clientY - prevMouseY;
        rotateCamera(deltaX, 0);
        camera.rotation.x -= deltaY /200;
        //camera.rotation.x += deltaX;
        //camera.rotation.y += deltaY;
        prevMouseX = event.touches[0].clientX;
        prevMouseY = event.touches[0].clientY;
    }
});
const buttonUp = create();
// เตรียมการที่จะรัน
buttonUp.addEventListener('click', function() {
    const directionMove = new THREE.Vector3();
    camera.getWorldDirection(directionMove);
    move(directionMove, player);

});


// เรียกใช้ฟังก์ชัน render
//fpsCreate();

setInterval(showFPS, 1000);
animate();