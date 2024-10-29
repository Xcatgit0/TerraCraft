// fpsCounter.js

let fpsCounterDiv;
let frameCount = 0;
//let clock = new THREE.Clock();

// ฟังก์ชันสำหรับสร้าง FPS counter
function fpsCreate() {
    // สร้าง <div> สำหรับแสดง FPS
    fpsCounterDiv = document.createElement('div');
    fpsCounterDiv.style.position = 'absolute';
    fpsCounterDiv.style.top = '10px';
    fpsCounterDiv.style.left = '10px';
    fpsCounterDiv.style.color = 'white';
    fpsCounterDiv.style.fontSize = '24px';
    fpsCounterDiv.style.pointerEvents = 'none'; // ไม่ให้ <div> นี้ตอบสนองต่อการคลิก
    fpsCounterDiv.style.zIndex = '1000';
    document.body.appendChild(fpsCounterDiv);
}

// ฟังก์ชันสำหรับอัปเดตและแสดง FPS
function fpsAnimate(clock) {
    const delta = clock.getDelta(); // เวลาในการเรนเดอร์ในวินาที
    frameCount++;
    if (delta > 1) { // ทุก ๆ 1 วินาที
        const fps = frameCount;
        frameCount = 0;

        // อัปเดตข้อความ FPS ใน <div>
        if (fpsCounterDiv) {
            fpsCounterDiv.innerText = `FPS: ${fps}`;
        }
    }
}

// ส่งออกฟังก์ชันเพื่อใช้ในไฟล์อื่น
export { fpsCreate, fpsAnimate };
