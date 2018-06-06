var canvas, engine, scene, airplane, camera, physicsEngine, scoreText;
var score = 0;
var torus;

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
                { loop: true, autoplay: true });


}
function createLand(){
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
    material.diffuseTexture = new BABYLON.Texture('island_heightmap.png', scene);
    material.wireframe = true;
    land.material = material;
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
    camera.attachControl(canvas, true);
}
function createAirplane() {
    BABYLON.SceneLoader.ImportMesh("", "", "airplane1.babylon", scene, function (newMeshes) {
        airplane = newMeshes[0];
        setupAirplane(airplane);
        camera.lockedTarget = airplane; //version 2.5 onwards
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


    airplane.animations = []; //for animation

    window.addEventListener('keydown', function (event) {
        if (event.keyCode == 39) {
            airplane.animations.push(yRot1);
            airplane.animations.push(zRot1);
            scene.beginAnimation(airplane, 0, 10, false);
            airplane.animations.pop();
            airplane.animations.pop();
        }
        if (event.keyCode == 37) {
            airplane.animations.push(yRot2);
            airplane.animations.push(zRot2);
            scene.beginAnimation(airplane, 0, 10, false);
            airplane.animations.pop();
            airplane.animations.pop();
        }
        if (event.keyCode == 38) {
            airplane.animations.push(xRot);
            scene.beginAnimation(airplane, 0, 10, false);
            airplane.animations.pop();
        }
        if (event.keyCode == 40) {
            airplane.animations.push(xRot1);
            scene.beginAnimation(airplane, 0, 10, false);
            airplane.animations.pop();
        }
    })

    //animation for going right
    var yRot1 = new BABYLON.Animation("yRot", "rotation.y",
        10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keyFramesR = [];
    keyFramesR.push({
        frame: 0,
        value: 0
    });
    keyFramesR.push({
        frame: 1,
        value: Math.PI / 8
    });
    keyFramesR.push({
        frame: 5,
        value: 0
    });
    yRot1.setKeys(keyFramesR);

    var zRot1 = new BABYLON.Animation("zRot", "rotation.z",
        10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keyFramesZ = [];
    keyFramesZ.push({
        frame: 0,
        value: -Math.PI / 2
    });
    keyFramesZ.push({
        frame: 1,
        value: -Math.PI / 4
    });
    keyFramesZ.push({
        frame: 5,
        value: -Math.PI / 2
    });
    zRot1.setKeys(keyFramesZ);

    //animation for going left
    var yRot2 = new BABYLON.Animation("yRot", "rotation.y",
        10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keyFramesR1 = [];
    keyFramesR1.push({
        frame: 0,
        value: 0
    });
    keyFramesR1.push({
        frame: 1,
        value: -Math.PI / 8
    });
    keyFramesR1.push({
        frame: 5,
        value: 0
    });
    yRot2.setKeys(keyFramesR1);

    var zRot2 = new BABYLON.Animation("zRot", "rotation.z",
        10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keyFramesZ1 = [];
    keyFramesZ1.push({
        frame: 0,
        value: -Math.PI / 2
    });
    keyFramesZ1.push({
        frame: 1,
        value: -3 * Math.PI / 4
    });
    keyFramesZ1.push({
        frame: 5,
        value: -Math.PI / 2
    });
    zRot2.setKeys(keyFramesZ1);

    //animation for move up
    var xRot = new BABYLON.Animation("xRot", "rotation.x",
        10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keyFramesX = [];
    keyFramesX.push({
        frame: 0,
        value: 0
    });
    keyFramesX.push({
        frame: 1,
        value: Math.PI / 4
    });
    keyFramesX.push({
        frame: 5,
        value: 0
    });
    xRot.setKeys(keyFramesX);

    //animation for move down
    var xRot1 = new BABYLON.Animation("xRot", "rotation.x",
        10, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keyFramesX1 = [];
    keyFramesX1.push({
        frame: 0,
        value: 0
    });
    keyFramesX1.push({
        frame: 1,
        value: -Math.PI / 4
    });
    keyFramesX1.push({
        frame: 5,
        value: 0
    });
    xRot1.setKeys(keyFramesX1);

    window.addEventListener('keydown', function (event) {
        if (event.keyCode == 39) {
            mesh.position = new BABYLON.Vector3(meshX - meshAdd, meshY, meshZ - meshAdd);
            meshX = meshX - meshAdd;
            meshZ = meshZ - meshAdd;
            mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(10, 0, 0), mesh.getAbsolutePosition());

        }
        if (event.keyCode == 37) {
            mesh.position = new BABYLON.Vector3(meshX + meshAdd, meshY, meshZ - meshAdd);
            meshX = meshX + meshAdd;
            meshZ = meshZ - meshAdd;
        }
        if (event.keyCode == 38) {
            mesh.position = new BABYLON.Vector3(meshX, meshY, meshZ + meshAdd);
            meshZ = meshZ - meshAdd;
        }
        if (event.keyCode == 40) {
            mesh.position = new BABYLON.Vector3(meshX, meshY, meshZ - meshAdd);
            meshZ = meshZ + meshAdd;
        }
    })

}

function createLoop() {
    var newTorus = new BABYLON.Sound("new", "sound/COINS.wav", scene,
                   function () {newTorus.play();});

    if(torus == undefined) {
        torus = BABYLON.MeshBuilder.CreateTorus("torus", {thickness: 0.2, diameter: 5}, scene);
        torus.position = new BABYLON.Vector3(0, 35, 30);
        torus.rotation.x = Math.PI / 2;
    }
    else {
        torus = BABYLON.MeshBuilder.CreateTorus("torus", {thickness: 0.2, diameter: 5}, scene);
        torus.position = new BABYLON.Vector3(airplane.position.x + Math.floor((Math.random()* 21) - 10), airplane.position.y + Math.floor((Math.random()* 21) - 10), airplane.position.z - 20);
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
    scoreText.right = '10%';
    scoreText.top = '-45%'

    advancedTexture.addControl(scoreText);
}

function logicForAirplane(){
    scene.registerBeforeRender(function() {
        setTimeout(() => {
            airplane.position.z -= 0.1;
        },5000);

        if (torus.intersectsMesh(airplane, false)) {
            var hitTorus = new BABYLON.Sound("hit", "sound/SUCCESS.wav", scene,
                            function () {hitTorus.play();});
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
    });
}
