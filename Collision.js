const raycaster = new THREE.Raycaster();
function checkCollision(x,y,z,scene) {
    const playerPosition = new THREE.Vector3(x,y,z);
    const playerSize = 0.5; // ปรับตามขนาดของตัวผู้เล่น
    const playerBox = new THREE.Box3(
        new THREE.Vector3(playerPosition.x - playerSize / 2, playerPosition.y - playerSize / 2, playerPosition.z - playerSize / 2),
        new THREE.Vector3(playerPosition.x + playerSize / 2, playerPosition.y + playerSize / 2, playerPosition.z + playerSize / 2)
    );
    let foundCollision = false;
    scene.traverse((object) => {
        if (object.isMesh) {
            // ตรวจสอบว่าบล็อกอยู่ด้านล่างของผู้เล่นหรือไม่ (y ต่ำกว่าผู้เล่น)
            if (object.position.y < playerPosition.y) {
                // สร้าง Bounding Box ของบล็อก
                const blockBox = new THREE.Box3().setFromObject(object);
    
                // ตรวจสอบว่ามีการทับซ้อนระหว่าง Bounding Box ของผู้เล่นและบล็อกด้านล่างหรือไม่
                if (playerBox.intersectsBox(blockBox)) {
                    foundCollision = true;
      //              console.log("พบการชนกับบล็อกด้านล่าง:", object);
                }
            }
        }
    });
    return foundCollision;
}   
function checkCollisionRaycaster(x,y,z, direction, scene) {
    const raycasterUp = new THREE.Raycaster();
    const raycasterDown = new THREE.Raycaster();
    raycasterDown.set(new THREE.Vector3(x,y,z), new THREE.Vector3(0,-1,0));
    const intersectsDown = raycasterDown.intersectObjects(scene.children, true);
    raycasterUp.set(new THREE.Vector3(x,y-1,z), new THREE.Vector3(0,1,0));
    const intersectsUp = raycasterUp.intersectObjects(scene.children, true);
    var collision = false;
    if (intersectsDown.length > 0) {
        if (intersectsUp.length >= 1) {
            collision = true;
            //console.log("ผู้เล่นเด้งขึ้นหนึ่งบล็อก");
        }
    }
    document.getElementById("debug").innerText = String(intersectsUp.length)+"\n"+String(intersectsDown.length);
    return collision;
}
export { checkCollision, checkCollisionRaycaster };
