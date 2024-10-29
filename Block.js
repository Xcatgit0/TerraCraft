// Block.js

// สร้างตัวแปรสำหรับ texture mapper
const textureMapper = {
    'grass': {
        top: 'textures/grass_top.png',
        bottom: 'textures/dirt.png',
        left: 'textures/grass_left.png',
        right: 'textures/grass_right.png',
        front: 'textures/grass_front.png',
        back: 'textures/grass_back.png',
    },
    'dirt': {
        top: 'textures/dirt.png',
        bottom: 'textures/dirt.png',
        left: 'textures/dirt.png',
        right: 'textures/dirt.png',
        front: 'textures/dirt.png',
        back: 'textures/dirt.png',
    },
    'stone': {
        top: 'textures/stone.png',
        bottom: 'textures/stone.png',
        left: 'textures/stone.png',
        right: 'textures/stone.png',
        front: 'textures/stone.png',
        back: 'textures/stone.png',
    },
    'wood': {
        top: 'textures/wood_top.png',
        bottom: 'textures/wood_bottom.png',
        left: 'textures/wood_left.png',
        right: 'textures/wood_right.png',
        front: 'textures/wood_front.png',
        back: 'textures/wood_back.png',
    }
};
// id mapper
const idmapper = {
    'grass': 1,
    'dirt': 2,
    'stone':3
}
// ฟังก์ชันสำหรับโหลด texture
function loadTexture(name) {
    const textureLoader = new THREE.TextureLoader();
    const texturePath = textureMapper[name];
    let texs = {
        top: textureLoader.load(texturePath.top, undefined,undefined,() => texs.top = textureLoader.load("/textures/unknow.png")),
        bottom: textureLoader.load(texturePath.bottom),
        left: textureLoader.load(texturePath.left),
        right: textureLoader.load(texturePath.right),
        front: textureLoader.load(texturePath.front),
        back: textureLoader.load(texturePath.back),
    };
    return texs;
}

// คลาส Block
function Block(x, y, z, name,mapcolor) {
    this.name = name;
    this.textures = loadTexture(name);
    Object.keys(this.textures).forEach(key => {
        const texture = this.textures[key];
        if (texture) {
            texture.minFilter = THREE.NearestFilter;
            texture.magFilter = THREE.NearestFilter;
        }
    });
    if (mapcolor!=null) {
        this.createMesh(x, y, z, mapcolor);
    } else {
        this.createMesh(x, y, z,0xffffff);
    }
    this.mesh.UserData = {
        id: idmapper[name],
        name: name,
        tags: {
            breakable: true,
        }
    }
}

Block.prototype.createMesh = function (x, y, z, mapcolor) {
    const geometry = new THREE.BoxGeometry(1, 1, 1); // ขนาดของบล็อก
    
    // ใช้ texture ที่แตกต่างกันสำหรับแต่ละด้าน
    const materials = [
        new THREE.MeshBasicMaterial({ map: this.textures.right }),
        new THREE.MeshBasicMaterial({ map: this.textures.left }),
        new THREE.MeshBasicMaterial({ map: this.textures.top,color: mapcolor }),
        new THREE.MeshBasicMaterial({ map: this.textures.bottom }),
        new THREE.MeshBasicMaterial({ map: this.textures.front }),
        new THREE.MeshBasicMaterial({ map: this.textures.back }),
    ];

    this.mesh = new THREE.Mesh(geometry, materials);
    this.mesh.position.set(x, y, z);
};

Block.prototype.addToScene = function (scene) {
    scene.add(this.mesh);
};

// ฟังก์ชันสำหรับสร้างบล็อกเบื้องต้น
function createBlocks(scene) {
    // ตัวอย่างการสร้างบล็อก
    const block1 = new Block(0, 3, 0, 'grass'); // ใช้ texture ที่แตกต่างกัน
    block1.addToScene(scene);

    const block2 = new Block(1, 3, 0, 'dirt'); // ใช้ texture ที่แตกต่างกัน
    block2.addToScene(scene);

    const block3 = new Block(2, 3, 0, 'stone'); // ใช้ texture ที่แตกต่างกัน
    block3.addToScene(scene);
    for (let i = -10;i<10;i++) {
        for (let j = -10;j<10;j++) {
            const blockg = new Block(i,2,j,'grass');
            const blockd = new Block(i,1,j,'dirt');
            const blocks = new Block(i,0,j,'stone');
            blockg.addToScene(scene);
            blockd.addToScene(scene);
            blocks.addToScene(scene);
            
        }
    }

}
function createProbe() {
    const probes = document.getElementById("probe");
    const probeName = document.createElement("p");
    const probeId = document.createElement("p");
    probes.style.right = "40px";
    probes.style.position = "absolute"
    probes.style.top = "10px";
    probes.style.fontFamily = "monospace";
    probes.style.color = "while";
    probes.style.fontSize = "24px";
    probeId.style.top = "10px";
    probeName.id = "probeName";
    probeId.id = "probeId";
    probes.appendChild(probeName);
    probes.appendChild(probeId);
}
function probeUpdate(name,id) {
    const pName = document.getElementById("probeName");
    const pId = document.getElementById("probeId");

    pName.innerText = "Name: "+String(name);
    pId.innerText = "Id: "+String(id);
}

// ให้ export ฟังก์ชัน createBlocks เพื่อให้สามารถเรียกใช้ได้
window.createBlocks = createBlocks;
window.createProbe = createProbe;
window.probeUpdate = probeUpdate;
window.Block = Block;

