var canvas, engine, scene, airplane, camera, physicsEngine, scoreText, timerText;
var score = 0;
var torus;
var timer = 0, timeleft = 60;
const gravity = new BABYLON.Vector3(0, -9.81, 0);

document.addEventListener('DOMContentLoaded', function () {
    //get canvas
    canvas = document.getElementById('renderCanvas');

    //create babylon engine
    engine = new BABYLON.Engine(canvas, true);

    physicsEngine = new BABYLON.CannonJSPlugin();
    scene = new BABYLON.Scene(engine); //play scene
    scene.enablePhysics(physicsEngine);

    createScene();
    createCamera();
    createLand();
    createAirplane();
    createScoreboard();
    createTimer();
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
        500, // width of the ground mesh (x axis)
        100, // depth of the ground mesh (z axis)
        40,  // number of subdivisions
        0,   // min height
        10,  // max height
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
    mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.MeshImpostor, {
        mass: 1,
        restitution: 0.9,
        friction: 0.2
    }, scene);

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
        setTimeout(() => {
            airplane.position.z -= 0.1;
        }, 5000);

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



