const trunkTexture = new THREE.TextureLoader().load('./assets/trunk-texture.jpeg')
const treeTexture = new THREE.TextureLoader().load('./assets/tree-texture.jpeg')
const grassTexture = new THREE.TextureLoader().load('./assets/grass-texture.jpeg')

// function Fire(){
//     let img = document.createElement('img')
//     img.src = './fire.gif'
//     img.classList.add('fire')
//     document.body.appendChild(img)
//     return img
// }


function Wheel(){
    const wheel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(12,45,12),
        new THREE.MeshLambertMaterial({color: 0x333333})
    )
    wheel.position.z = 6
    return wheel;
}
function TruckWheel(length=55){
    const wheel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(12,length,12),
        new THREE.MeshLambertMaterial({color: 0x333333})
    )
    wheel.position.z = 6
    return wheel;
}

const trackRadius = 225;
const trackWidth = 45;
const innerTrackRadius = trackRadius - trackWidth;
const outerTrackRadius = trackRadius + trackWidth;

const arcAngle1 = (1/3) * Math.PI

const deltaY = Math.sin(arcAngle1) * innerTrackRadius
const arcAngle2 = Math.asin(deltaY/outerTrackRadius)

const arcCenterX = (
    (Math.cos(arcAngle1)) * innerTrackRadius +
    (Math.cos(arcAngle2)) * outerTrackRadius 
) /2;

const arcAngle3 = Math.acos(arcCenterX / innerTrackRadius)
const arcAngle4 = Math.acos(arcCenterX / outerTrackRadius)

function pickRandom(array){
    return array[Math.floor(Math.random()*array.length)]
}

function getCarFrontTexture(){
    const canvas = document.createElement("canvas")
    canvas.width = 64;
    canvas.height = 32; //more for resolution
    const context = canvas.getContext('2d')

    context.fillStyle = "#ffffff"
    context.fillRect(0,0,64,32);

    context.fillStyle = "#666666"
    context.fillRect(8,8,48,24);

    return new THREE.CanvasTexture(canvas)

}
function getCarSideTexture(){
    const canvas = document.createElement("canvas")
    canvas.width = 128;
    canvas.height = 32; //more for resolution
    const context = canvas.getContext('2d')

    context.fillStyle = "#ffffff"
    context.fillRect(0,0,128,32);

    context.fillStyle = "#666666"
    context.fillRect(10,8,38,24);
    context.fillRect(58,8,60,24);

    return new THREE.CanvasTexture(canvas)

}

function getTruckSideTexture(){
    const canvas = document.createElement("canvas")
    canvas.width = 128;
    canvas.height = 128; //more for resolution
    const context = canvas.getContext('2d')

    context.fillStyle = "#ffffff"
    context.fillRect(0,0,128,128);

    context.fillStyle = "#666666"
    context.fillRect(0,25,50,50);

    return new THREE.CanvasTexture(canvas)

}

function getTruckFrontTexture(){
    const canvas = document.createElement("canvas")
    canvas.width = 128;
    canvas.height = 128; //more for resolution
    const context = canvas.getContext('2d')

    context.fillStyle = "#ffffff"
    context.fillRect(0,0,128,128);

    context.fillStyle = "#666666"
    context.fillRect(0,48,128,50);

    return new THREE.CanvasTexture(canvas)

}

function Tree(height=8){
    
    const tree = new THREE.Group();
    const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(height,32,32),
        new THREE.MeshLambertMaterial({map: treeTexture})
    )
    leaves.position.z = height
    leaves.castShadow = true;
    leaves.receiveShadow = true;
    tree.add(leaves)


    const trunk = new THREE.Mesh(
        new THREE.BoxBufferGeometry( height/2, height, height/2 ),
        new THREE.MeshLambertMaterial({map: trunkTexture })
    )
    trunk.material.needsUpdate = true;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk)

    return tree;
}

function Truck(color){
    const truck = new THREE.Group();
    const colors = ["green", "blue", "purple", "orange"]

    const frontWheel = TruckWheel(45)
    frontWheel.position.x = 50
    truck.add(frontWheel)
    
    const middleWheel = TruckWheel()
    middleWheel.position.x = -20
    truck.add(middleWheel)

    const backWheel = TruckWheel()
    backWheel.position.x = 26
    truck.add(backWheel)

    const truckColor = color ? color : pickRandom(colors)

    const main = new THREE.Mesh(
        new THREE.BoxBufferGeometry(80,55,30),
        new THREE.MeshLambertMaterial({color: truckColor})
    );

    main.position.z = 27
    main.castShadow = true;
    main.receiveShadow = true;
    truck.add(main)

    const truckFrontTexture = getTruckFrontTexture()
    truckFrontTexture.center = new THREE.Vector2(0.5,0.5)
    truckFrontTexture.rotation = Math.PI/2


    const truckRightSideTexture = getTruckSideTexture()
    const truckLeftSideTexture = getTruckSideTexture()
    truckLeftSideTexture.flipY = false;

    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(35,35,35), [
            new THREE.MeshLambertMaterial({color: 0xffffff}),
            new THREE.MeshLambertMaterial({map: truckFrontTexture}),
            new THREE.MeshLambertMaterial({map: truckLeftSideTexture}),
            new THREE.MeshLambertMaterial({map: truckRightSideTexture}),
            new THREE.MeshLambertMaterial({color: 0xffffff}), //top
            new THREE.MeshLambertMaterial({color: 0xffffff}), //bottom
        ]
    );
    cabin.position.x = 50
    cabin.position.z = 20;
    cabin.rotation.z = Math.PI
    truck.add(cabin)

    truck.rotation.z = -Math.PI/2;


    return truck

}

function Car(color){
    const car = new THREE.Group();
    const colors = ["green", "blue", "purple", "orange"]

    const backWheel = Wheel()
    backWheel.position.x = -18
    car.add(backWheel)

    const frontWheel = Wheel()
    frontWheel.position.x = 18
    car.add(frontWheel)

    const carColor = color ? color : pickRandom(colors)

    const main = new THREE.Mesh(
        new THREE.BoxBufferGeometry(60,35,15),
        new THREE.MeshLambertMaterial({color: carColor})
    );

    main.position.z = 12;
    main.castShadow = true;
    main.receiveShadow = true;
    car.add(main)

    const carFrontTexture = getCarFrontTexture()
    carFrontTexture.center = new THREE.Vector2(0.5,0.5)
    carFrontTexture.rotation = Math.PI/2

    const carBackTexture = getCarFrontTexture()
    carBackTexture.center = new THREE.Vector2(0.5,0.5)
    carBackTexture.rotation = -Math.PI/2

    const carRightSideTexture = getCarSideTexture()
    const carLeftSideTexture = getCarSideTexture()
    carLeftSideTexture.flipY = false;



    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(33,24,12), [
            new THREE.MeshLambertMaterial({map: carFrontTexture}),
            new THREE.MeshLambertMaterial({map: carBackTexture}),
            new THREE.MeshLambertMaterial({map: carLeftSideTexture}),
            new THREE.MeshLambertMaterial({map: carRightSideTexture}),
            new THREE.MeshLambertMaterial({color: 0xffffff}), //top
            new THREE.MeshLambertMaterial({color: 0xffffff}), //bottom
        ]
    );
    cabin.position.x = -6
    cabin.position.z = 25.5;
    car.add(cabin)


    return car
}

function getLineMarkings(mapWidth,mapHeight){
    const canvas = document.createElement("canvas")
    canvas.width = mapWidth
    canvas.height = mapHeight;
    const context = canvas.getContext("2d")

    context.fillStyle= '#546E90'
    context.fillRect(0,0, mapWidth,mapHeight)

    context.lineWidth = 2;
    context.strokeStyle = "#E0FFFF";
    context.setLineDash([10,14])

    //Left Circle
    context.beginPath()
    context.arc(
        mapWidth/2 - arcCenterX,
        mapHeight/2,
        trackRadius,
        0,
        Math.PI*2
    )
    context.stroke()

    //Right Circle:
    context.beginPath()
    context.arc(
        mapWidth/2 +arcCenterX,
        mapHeight/2,
        trackRadius,
        0,
        Math.PI*2
    )
    context.stroke()

    return new THREE.CanvasTexture(canvas)

}

function getLeftIsland(){
    const islandLeft = new THREE.Shape()

    islandLeft.absarc(
        -arcCenterX, //setting center relative to (0,0,0)
        0,
        innerTrackRadius,
        arcAngle1,
        -arcAngle1,
        false //counterclockwise
    )
    islandLeft.absarc(
        arcCenterX, //setting center relative to (0,0,0)
        0,
        outerTrackRadius,
        Math.PI+ arcAngle2,
        Math.PI- arcAngle2,
        true //clockwise
    )

    //these two arcs need to form a continuous path to form shape
    return islandLeft
}
function getMiddleIsland(){
    const islandMiddle = new THREE.Shape()

    islandMiddle.absarc(
        -arcCenterX, 
        0,
        innerTrackRadius,
        arcAngle3,
        -arcAngle3,
        true
    )
    islandMiddle.absarc(
        arcCenterX, 
        0,
        innerTrackRadius,
        Math.PI+ arcAngle3,
        Math.PI- arcAngle3,
        true
    )
    return islandMiddle
}
function getRightIsland(){
    const islandRight = new THREE.Shape()

    islandRight.absarc(
        arcCenterX, //setting center relative to (0,0,0)
        0,
        innerTrackRadius,
        Math.PI-arcAngle1,
        Math.PI+arcAngle1,
        true 
    )
    islandRight.absarc(
        -arcCenterX, //setting center relative to (0,0,0)
        0,
        outerTrackRadius,
        -arcAngle2,
        arcAngle2,
        false //clockwise
    )

    return islandRight
}
function getOuterField(mapWidth, mapHeight){
    const field = new THREE.Shape()

    field.moveTo(-mapWidth/2, -mapHeight/2)
    field.lineTo(0,-mapHeight/2);

    //implied vertical line up
    field.absarc(
        -arcCenterX, //setting center relative to (0,0,0)
        0,
        outerTrackRadius,
        -arcAngle4,
        arcAngle4,
        true //counterclockwise
    )
    field.absarc(
        arcCenterX, //setting center relative to (0,0,0)
        0,
        outerTrackRadius,
        Math.PI - arcAngle4,
        Math.PI + arcAngle4,
        true //clockwise
    )

    field.lineTo(0, -mapHeight/2) //back to bottom middle
    field.lineTo(mapWidth/2, -mapHeight/2) //to bottom right
    field.lineTo(mapWidth/2, mapHeight/2) // to top right
    field.lineTo(-mapWidth/2, mapHeight/2) //to top left
    //implied line back to bottom right

    return field
}

function renderMap(mapWidth, mapHeight){
    //Plane with line markings
    const lineMarkingsTexture = getLineMarkings(mapWidth, mapHeight)

    const planeGeometry = new THREE.PlaneBufferGeometry(mapWidth,mapHeight)
    const planeMaterial = new THREE.MeshLambertMaterial({
        map:lineMarkingsTexture
    })

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true
    scene.add(plane)

    //Extruded GEometry
    const islandLeft = getLeftIsland();
    const islandRight = getRightIsland();
    const islandMiddle = getMiddleIsland();
    const outerField = getOuterField(mapWidth, mapHeight);

    const fieldGeometry = new THREE.ExtrudeBufferGeometry(
        [islandLeft, islandMiddle, islandRight, outerField],
        {depth:10, bevelEnabled: false}
    )
    const fieldMesh = new THREE.Mesh(fieldGeometry, [
        new THREE.MeshLambertMaterial({color: 0x67c240})
    ])
    fieldMesh.receiveShadow = true;
    fieldMesh.castShadow = true;
    scene.add(fieldMesh)
}

const scene = new THREE.Scene()

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight(0xffffff,0.6);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.left = -400;
dirLight.shadow.camera.right = 350;
dirLight.shadow.camera.top = 400;
dirLight.shadow.camera.bottom = -300;
dirLight.shadow.camera.near = 100;
dirLight.shadow.camera.far = 1200;
dirLight.position.set(200,-300,300);
scene.add(dirLight)

//Camera
const aspectRatio = window.innerWidth/window.innerHeight;
const cameraWidth = 960;
const cameraHeight = cameraWidth/aspectRatio

const camera = new THREE.OrthographicCamera(
    cameraWidth/-2, //left
    cameraWidth/2, //right
    cameraHeight/2, //top
    cameraHeight/-2, //bottom
    0, //near plane
    10000 //far plane
);
camera.position.set(20,-210,300);
camera.lookAt(0,0,0)

renderMap(cameraWidth, cameraHeight*2)

//Renderer
const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)
document.body.appendChild(renderer.domElement)

//Resize Handler
window.addEventListener("resize", () => {
    console.log("resize", window.innerWidth, window.innerHeight);
  
    // Adjust camera
    const newAspectRatio = window.innerWidth / window.innerHeight;
    const adjustedCameraHeight = cameraWidth / newAspectRatio;
  
    camera.top = adjustedCameraHeight / 2;
    camera.bottom = adjustedCameraHeight / -2;
    camera.updateProjectionMatrix(); // Must be called after change

  
    // Reset renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  });

//Initial setup of Game Variables and Functions
let ready;
let playerAngleMoved;
let score;
let level = 1;
const scoreElement = document.getElementById("score")
let otherVehicles = [];
let lastTimestamp;
const playerCar = Car("red");
scene.add(playerCar)
const playerAngleInitial = Math.PI;
const speed = 0.0017
let currentPlayerSpeed = 0.0017;
let accelerate = false;
let decelerate = false;

// let fireImg = Fire();

// let test = Truck()
// test.position.set(100,100,100)
// test.rotation.z = -Math.PI/4
// scene.add(test)


populateTrees()

reset()


function populateTrees(){
    heights = [7,8,9,10]

    let xyz = [
        //left
        [-200,120,6],
        [-140,80,6],
        [-160,-100, 6],

        [0,0,6],
        [150,40,6],
        [220,-110,6],

        [-390,185, 6],
        [20, 285,6],
        [-240,-300,6],
        [110,-300,6],

    ]
    for(let i = 0;i<xyz.length;i++){
        let tree = Tree(pickRandom(heights));
        tree.position.set(xyz[i][0], xyz[i][1], xyz[i][2])
        tree.rotation.x = -Math.PI/6;
        tree.scale.setScalar(4)
        scene.add(tree)
    }
    setTimeout(function(){renderer.render(scene, camera)}, 300)
}

function reset(){
    renderer.setAnimationLoop(null)
    //reset position and score
    playerAngleMoved = 0;
    movePlayerCar(0);
    score = 0;
    level = 1;
    scoreElement.innerText = score;
    lastTimestamp = undefined;

    //remove other vehicles
    otherVehicles.forEach((vehicle) => {
        scene.remove(vehicle.mesh)
    })
    otherVehicles = []

    renderer.render(scene, camera);
    ready = true;
    document.getElementById('level').innerHTML = level;
}

function startGame(){
    if(ready){
        ready = false;
        document.querySelector('.instructions').style.display = "none";
        renderer.setAnimationLoop(animation)
    }
}

//Game Controls!

window.addEventListener("keydown", (event) => {
    if(event.key=="ArrowUp"){
        startGame();
        accelerate = true;
        document.querySelector('.button.up').classList.add('active')
        return
    }
    if(event.key=="ArrowDown"){
        decelerate = true;
        document.querySelector('.button.down').classList.add('active')
        return;
    }
    if(event.key=="R" || event.key == "r"){
        reset()
        document.querySelector('.overlay').style.display = "none"
        // document.querySelector('.fire').style.display = "none"
        document.querySelector('.instructions').style.display = "block"
        return
    }
    if(event.key=='p'){
        renderer.setAnimationLoop(null)
    }
})
window.addEventListener("keyup", (event) => {
    if(event.key=="ArrowUp"){
        startGame();
        accelerate=false;
        document.querySelector('.button.up').classList.remove('active')
        return
    }
    if(event.key=="ArrowDown"){
        decelerate=false;
        document.querySelector('.button.down').classList.remove('active')
        return;
    }
})

//Animation
function animation(timestamp){
    if(!lastTimestamp){
        lastTimestamp = timestamp;
        return;
    }

    const timeDelta = timestamp - lastTimestamp;

    movePlayerCar(timeDelta)

    const laps = Math.floor(Math.abs(playerAngleMoved)/(Math.PI *2))

    //Update score if changed
    if(laps != score){
        score = laps;
        scoreElement.innerText = score
    }

    //Add a new vehicle at start and with every 5th lap
    if(otherVehicles.length< (laps+1)/2) addVehicle();
    hitDetection()
    moveOtherVehicles(timeDelta);

    

    renderer.render(scene, camera);
    lastTimestamp = timestamp
}


//Moving Car
function movePlayerCar(timeDelta){
    const playerSpeed = getPlayerSpeed();
    playerAngleMoved -= playerSpeed * timeDelta;

    const totalPlayerAngle = playerAngleInitial + playerAngleMoved;

    const playerX = Math.cos(totalPlayerAngle) * trackRadius - arcCenterX
    const playerY = Math.sin(totalPlayerAngle) * trackRadius
    playerCar.position.x = playerX
    playerCar.position.y = playerY

    playerCar.rotation.z = totalPlayerAngle - Math.PI/2

}

function getPlayerSpeed(){
    if(accelerate){
        currentPlayerSpeed += (speed/30)
        if (currentPlayerSpeed >= (speed * 2)){
            currentPlayerSpeed = speed*2
        }
        return currentPlayerSpeed
    } 
    if(decelerate){ 
        currentPlayerSpeed -= (speed/30)
        if (currentPlayerSpeed <= (speed * 0.5)){
            currentPlayerSpeed = speed*0.5
        }
        return currentPlayerSpeed
    } 
    currentPlayerSpeed -= (currentPlayerSpeed - speed)/30
    return currentPlayerSpeed
}

//New Vehicles
function addVehicle(){
    const vehicleTypes = ["car", "truck"];
    const type = pickRandom(vehicleTypes);
    const mesh = type == "car" ? Car() : Truck()
    scene.add(mesh)
    
    const clockwise = Math.random() >= 0.5;
    const angle = clockwise ? Math.PI/2 : -Math.PI /2

    const speed = getVehicleSpeed(type)

    otherVehicles.push({mesh, type, clockwise, angle, speed})

    if(otherVehicles.length > 1) level++
    document.getElementById('level').innerHTML = level
}

function getVehicleSpeed(type){
    if(type == "car"){
        const minimumSpeed = 1;
        const maximumSpeed = 2;
        return minimumSpeed + Math.random() * (maximumSpeed - minimumSpeed);
    }
    if(type == "truck"){
        const minimumSpeed = 0.6;
        const maximumSpeed = 1.4;
        return minimumSpeed + Math.random() * (maximumSpeed - minimumSpeed);
    }
}

function moveOtherVehicles(timeDelta){
    otherVehicles.forEach((vehicle) => {
        if(vehicle.clockwise){
            vehicle.angle -= speed * timeDelta * vehicle.speed;
        }else{
            vehicle.angle += speed * timeDelta * vehicle.speed;
        }
        const vehicleX = Math.cos(vehicle.angle) * trackRadius + arcCenterX
        const vehicleY = Math.sin(vehicle.angle) * trackRadius 
        const rotation = vehicle.angle + (vehicle.clockwise ? -Math.PI/2 : Math.PI/2);

        vehicle.mesh.position.x = vehicleX
        vehicle.mesh.position.y = vehicleY
        vehicle.mesh.rotation.z = rotation
    })
}

//Hit detection

function getHitZonePosition(center, angle, clockwise, distance){
    const directionAngle = angle + (clockwise ? -Math.PI/2: +Math.PI/2);
    return {
        x: center.x + Math.cos(directionAngle) * distance,
        y: center.y + Math.sin(directionAngle) * distance,
        
    }
}


function hitDetection(){
    const playerHitZone1 = getHitZonePosition(
        playerCar.position,
        playerAngleInitial + playerAngleMoved,
        true,
        20
    )
    const playerHitZone2 = getHitZonePosition(
        playerCar.position,
        playerAngleInitial + playerAngleMoved,
        true,
        -20
    )

    const hit = otherVehicles.some((vehicle) => {
        if(vehicle.type == "car"){
            const vehicleHitZone1 = getHitZonePosition(
                vehicle.mesh.position,
                vehicle.angle,
                vehicle.clockwise,
                20
            );
            const vehicleHitZone2 = getHitZonePosition(
                vehicle.mesh.position,
                vehicle.angle,
                vehicle.clockwise,
                -20
            );

            //player hits another vehicle
            if(getDistance(playerHitZone1, vehicleHitZone1)<40) return true
            if(getDistance(playerHitZone1, vehicleHitZone2)<40) return true

            //vehicle hits player
            if(getDistance(playerHitZone2, vehicleHitZone1)<40) return true

        }
        if(vehicle.type == "truck"){
            const vehicleHitZone1 = getHitZonePosition(
                vehicle.mesh.position,
                vehicle.angle,
                vehicle.clockwise,
                35
            );
            const vehicleHitZone2 = getHitZonePosition(
                vehicle.mesh.position,
                vehicle.angle,
                vehicle.clockwise,
                -35
            );
            const vehicleHitZone3 = getHitZonePosition(
                vehicle.mesh.position,
                vehicle.angle,
                vehicle.clockwise,
                0
            );

            //player hits another vehicle
            if(getDistance(playerHitZone1, vehicleHitZone1)<55) return true
            if(getDistance(playerHitZone1, vehicleHitZone2)<55) return true
            if(getDistance(playerHitZone1, vehicleHitZone3)<55) return true

            //vehicle hits player
            if(getDistance(playerHitZone2, vehicleHitZone1)<55) return true

        }
    })
    if (hit){
        renderer.setAnimationLoop(null) //stop animation loop
        gameOver()
    } 
}

function getDistance(coord1, coord2){
    let dist =  Math.sqrt(
        (coord2.x - coord1.x)**2 + (coord2.y-coord1.y)**2
    )
    return dist

}

document.querySelector('.button.up').addEventListener('mousedown', () => {
    startGame()
    window.dispatchEvent(new Event('keydown', {keyCode: 'ArrowUp'}))
    accelerate = true;
})

document.querySelector('.button.down').addEventListener('mousedown', () => {
    window.dispatchEvent(new Event('keydown', {keyCode: 'ArrowDown'}))
    decelerate = true;
})

document.querySelector('.button.up').addEventListener('mouseup', () => {
    document.dispatchEvent(new Event('keyup', {keyCode: 'ArrowUp'}))
    accelerate = false;
})

document.querySelector('.button.down').addEventListener('mouseup', () => {
    document.dispatchEvent(new Event('keyup', {keyCode: 'ArrowDown'}))
    decelerate = false;
})



function gameOver(){
    let blood = document.createElement('span')
    blood.classList.add('blood')
    blood.style.left = "50%"
    blood.style.top = "50%"
    document.body.appendChild(blood)
    setTimeout(function(){document.body.removeChild(blood)}, 5000)

    document.querySelector('.overlay').style.display = "block"
    document.getElementById('finalScore').innerHTML = score;
    document.getElementById('finalLevel').innerHTML = level;

    // fireImg.style.display = "block";
    // let ratio = window.innerWidth/cameraWidth
    // fireImg.style.left = (window.innerWidth/2) + playerCar.position.x*ratio + "px"
    // fireImg.style.top = window.innerHeight/2 - playerCar.position.y*ratio + "px"

    
}

/*To Do: 
- leaderboard
- truck
- new characters

*/