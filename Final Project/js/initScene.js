var canvas, engine, scene, airplane, camera, physicsEngine, scoreText, timerText;
var score = 0;
var torus;
var timer = 0, timeleft = 60;
var keysDown = {};
// units per second
var airSpeed = -10;


// degrees per second
var turnSpeed = 20.0;

// keep track of the last time movement was processed, in microseconds
var lastFrame = -1;

// keypress listeners
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

document.addEventListener('DOMContentLoaded', function () {
    //get canvas
    canvas = document.getElementById('renderCanvas');

    //create babylon engine
    engine = new BABYLON.Engine(canvas, true);

   
    scene = new BABYLON.Scene(engine); //play scene

    createScene();
    createCamera();
    createLand();
    createAirplane();
    createScoreboard();
    createTimer();
    createSpeedometer();
    createLoop();
});


function createScene() {
    //create scene
    scene.clearColor = new BABYLON.Color3(0.2, 0.5, 0.9);
    scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.002;
    scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.9);

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("TropicalSunnyDay/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    // create a basic light, aiming 0,8,0
    var light = new BABYLON.HemisphericLight('hlight', new BABYLON.Vector3(0, 8, 0), scene);

    var bgmMusic = new BABYLON.Sound("Music", "sound/ENGINE.wav", scene, null,
        {loop: true, autoplay: true});
}

function createLand() {
    var land = BABYLON.Mesh.CreateGroundFromHeightMap(
        'island',
        'island_heightmap.png',
        1000, // width of the ground mesh (x axis)
        1000, // depth of the ground mesh (z axis)
        40,  // number of subdivisions
        0,   // min height
        20,  // max height
        scene
    );
    land.position = new BABYLON.Vector3(0, 0, 0);

    // simple wireframe material
    var material = new BABYLON.StandardMaterial('material', scene);
    material.diffuseTexture = new BABYLON.Texture('land.jpg', scene);
    material.specularPower = 100000000;

    //material.wireframe = true;
    land.material = material;
    //var gr = createGrass();
}

function createCamera() {
    // Parameters: name, position, scene
    camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);

    //The goal distance of airplane from target
    camera.radius = 20;

    // The goal height of airplane above local origin (centre) of target
    camera.heightOffset = 10;

    // The goal rotation of airplane around local origin (centre) of target in x y plane
    camera.rotationOffset = 0;

    //Acceleration of airplane in moving from current to goal position
    camera.cameraAcceleration = 0.005;

    //The speed at which acceleration is halted
    camera.maxCameraSpeed = 10;

    // This attaches the airplane to the canvas
    //camera.attachControl(canvas, true);
}

function createAirplane() {
    BABYLON.SceneLoader.ImportMesh("", "", "airplane1.babylon", scene, function (newMeshes) {
        airplane = newMeshes[0];
        setupAirplane(airplane);
        camera.lockedTarget = airplane; //version 2.5 onwards
        setTimeout(() => {
            startTimer(59);
        }, 5000);
        logicForAirplane();
    });
}


function setupAirplane(mesh) {
    meshX = 0;
    meshY = 35;
    meshZ = 50;
    meshAdd = 1;

    mesh.scaling = new BABYLON.Vector3(1, 1 / 16, 1 / 8);
    mesh.position = new BABYLON.Vector3(meshX, meshY, meshZ);

    //enable physics

}

function handleKeyDown(event) {
        keysDown[event.keyCode] = true;
    }

    function handleKeyUp(event) {
        keysDown[event.keyCode] = false;
    }

    // Converts from degrees to radians.
    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }


    function animate() {
        var current = new Date().getTime();
        if (lastFrame == -1) {
            lastFrame = current;
        }

        // we want the time in seconds for simplicity
        var elapsed = (current - lastFrame) / 1000.0;
        lastFrame = current;


        var zRot = 0;
        var yRot = 0;
        var xRot = 0;


        // handle keys here
        if(keysDown[87]) {
            // W, rotate in the negative direction about the x axis
           yRot -= elapsed * turnSpeed;
        }

        if(keysDown[83]) {
            // S, rotate in the positive direction about the x axis
           
            yRot += elapsed * turnSpeed;
            
        }

        if(keysDown[65]) {
            // A, rotate in the negative direction about the z axis
            zRot -= elapsed * turnSpeed;
        }

        if(keysDown[68]) {
            // D, rotate in the positive direction about the z axis
            zRot += elapsed * turnSpeed;
            
        }

        if(keysDown[81]) {
            // Q, rotate left  
            xRot += elapsed * turnSpeed;
        }

        if(keysDown[69]) {
            // E, rotate right 
            xRot -= elapsed * turnSpeed;
        }

        if(keysDown[90]) {
            // z, speed up 
            airSpeed = airSpeed - 1;
        
           
        }

        if(keysDown[88]) {
            // x, speed down 
            if (airSpeed<0){
                airSpeed = airSpeed + 1;
                
            }
            
        }

        // =============================================================================

        airplane.translate(BABYLON.Axis.Z, elapsed + airSpeed/10, BABYLON.Space.LOCAL);

        airplane.rotate(BABYLON.Axis.X, xRot/10, BABYLON.Space.LOCAL);
        airplane.rotate(BABYLON.Axis.Y, yRot/10, BABYLON.Space.LOCAL);
        airplane.rotate(BABYLON.Axis.Z, zRot/10, BABYLON.Space.LOCAL);

        // =============================================================================
     

    }

function createLoop() {
    var newTorus = new BABYLON.Sound("new", "sound/COINS.wav", scene,
        function () {
            newTorus.play();
        });

    if (torus == undefined) {
        torus = BABYLON.MeshBuilder.CreateTorus("torus", {thickness: 0.2, diameter: 5}, scene);
        torus.position = new BABYLON.Vector3(0, 35, 30);
        torus.rotation.x = Math.PI / 2;
    }
    else {
        torus = BABYLON.MeshBuilder.CreateTorus("torus", {thickness: 0.2, diameter: 5}, scene);

        var posX = airplane.position.x + Math.floor((Math.random() * 21) - 10);
        var posY = airplane.position.y + Math.floor((Math.random() * 21) - 10);
        var posZ = airplane.position.z - 20;

        if (posY < 10) {
            posY = posY + Math.floor((Math.random() * 10) + 1);
        }

        torus.position = new BABYLON.Vector3(posX, posY, posZ);
        torus.rotation.x = Math.PI / 2;
    }
    var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
    myMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
    torus.material = myMaterial;
}

function createScoreboard() {
    //score board
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    scoreText = new BABYLON.GUI.TextBlock();
    scoreText.text = "Score = " + score;
    scoreText.color = "black";
    scoreText.fontSize = 24;
    scoreText.left = -100;
    scoreText.top = '-45%';

    advancedTexture.addControl(scoreText);
}


function logicForAirplane() {
    scene.registerBeforeRender(function () {
        

        if (torus.intersectsMesh(airplane, false)) {
            var hitTorus = new BABYLON.Sound("hit", "sound/SUCCESS.wav", scene,
                function () {
                    hitTorus.play();
                });
            torus.dispose();
            score += 1;
            createLoop();
        }
        scoreText.text = "Score = " + score;
        speedText.text = "Speed = " + (-airSpeed);
        animate();
    })
}

function _render() {
    engine.runRenderLoop(function () {
        scene.render();
        if (timeleft === 0) {
            engine.stopRenderLoop();
            let e1 = document.getElementById("ingame");
            e1.style.display = "none";

            let element = document.getElementById("end");
            element.style.display = "block";
            $("#end h3").html("Score: " + score);
        }
    });
}


function createTimer() {
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    timerText = new BABYLON.GUI.TextBlock();
    timerText.text = "Timer = " + timeleft;
    timerText.color = "black";
    timerText.fontSize = 24;
    timerText.left = '5%';
    timerText.top = '-45%';

    advancedTexture.addControl(timerText);
}

function createSpeedometer() {
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    speedText = new BABYLON.GUI.TextBlock();
    speedText.text = "Speed = " + (-airSpeed);
    speedText.color = "black";
    speedText.fontSize = 24;
    speedText.left = '17%';
    speedText.top = '-45%';

    advancedTexture.addControl(speedText);
}


function startTimer(duration) {
    timer = duration;
    var seconds;
    setInterval(function () {
        seconds = parseInt(timer % 60);
        console.log(seconds);

        timeleft = seconds;
        timerText.text = "Timer = " + timeleft;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}



