import { checkCollision, checkCollisionRaycaster } from "./Collision.js";

function create() {
    const element = document.getElementById("control");
    const buttonUp = document.createElement("button");
    buttonUp.innerText = "^";
    buttonUp.id = "mUp";
    //buttonUp.style.top = posx;
    

    element.appendChild(buttonUp);
    return buttonUp;
    
}
function Player(x,y,z,name,camera) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.z = z;
    
}
const gravity = 0.01;
var velocityY = 0;
function updatePos(P,scene) {
    var x = P.x;
    var y = P.y;
    var z = P.z;
    const direction = new THREE.Vector3(0,1,0);
    var falldown = checkCollision(x,y,z,scene);
    if (checkCollisionRaycaster(x,y,z,direction,scene)) {
        P.y += 1;
    }
    if (falldown) {
        velocityY = 0;
    } else {
        velocityY -= gravity;
    }
    
    P.y += velocityY;
    
}
var movetoggle = false;
var toggleVelocity = new THREE.Vector3();
function move(direction,P) {
    const moveDirection = direction.clone().multiplyScalar(0.2);
    P.x += moveDirection.x;
    //P.y += moveDirection.y;
    P.z += moveDirection.z;
    if (!movetoggle) {
        movetoggle = true;
        toggleVelocity = moveDirection;
    } else {
        movetoggle = false;
        toggleVelocity = new THREE.Vector3();
    }
}
function updateMove(P,camera) {
    toggleVelocity = new THREE.Vector3();
    camera.getWorldDirection(toggleVelocity);
    toggleVelocity = toggleVelocity.clone().multiplyScalar(0.2);
    if (movetoggle) {
        P.x += toggleVelocity.x;
        P.z += toggleVelocity.z;
    }
}
function updateCam(Player, camera) {
    var x = Player.x;
    var y = Player.y;
    var z = Player.z;
    camera.position.x = x;
    camera.position.y = y+1;
    camera.position.z = z;
}
export { create, Player, updateCam, updatePos , move, updateMove};