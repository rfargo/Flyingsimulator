var canvas, engine, scene, airplane, camera, physicsEngine, scoreText, timerText, bgmMusic, torus;
var score = 0, timer = 0, timeleft = 10;

var airSpeed = -10; // units per second
var turnSpeed = 20.0; // degrees per second
var lastFrame = -1; // keep track of the last time movement was processed, in microseconds

var keysDown = {};

// keypress listeners
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function handleKeyDown(event) {
    keysDown[event.keyCode] = true;
}

function handleKeyUp(event) {
    keysDown[event.keyCode] = false;
}

document.addEventListener('DOMContentLoaded', function () {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine); //play scene

    bgmMusic = new BABYLON.Sound("Music", "sound/ENGINE.wav", scene, null,
        {loop: true, autoplay: true});

    createScene();
    createCamera();
    createAirplane();
    createRing();

    showTimer();
    showScoreboard();
    showSpeedometer();
    showInstructions();
});

function createScene() {
    scene.clearColor = new BABYLON.Color3(0.2, 0.5, 0.9);
    scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.0005;
    scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.9);

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("texture/TropicalSunnyDay/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;


    var light = new BABYLON.HemisphericLight('hlight', new BABYLON.Vector3(0, 8, 0), scene);
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
}

function createAirplane() {
    BABYLON.SceneLoader.ImportMesh("", "", "model/airplane1.babylon", scene, function (newMeshes) {
        airplane = newMeshes[0];
        airplane.scaling = new BABYLON.Vector3(1, 1 / 16, 1 / 8);
        airplane.position = new BABYLON.Vector3(0, 35, 50);
        camera.lockedTarget = airplane; //version 2.5 onwards
        setTimeout(() => {
            startTimer(timeleft-1);
        }, 5000);
        logicForAirplane();
    });
}

function logicForAirplane() {
    scene.registerBeforeRender(function () {
        if (torus.intersectsMesh(airplane, false)) {
            var hitTorus = new BABYLON.Sound("hit", "sound/SUCCESS.wav", scene,
                function () {
                    hitTorus.play();
                });

            score += 1;
            createRing();
        }
        scoreText.text = "Score = " + score;
        speedText.text = "Speed = " + (-airSpeed);
        animate();
    })
}

function createRing() {
    if (torus == undefined) {
        torus = BABYLON.MeshBuilder.CreateTorus("torus", {thickness: 0.2, diameter: 7, tessellation: 50}, scene);
        torus.position = new BABYLON.Vector3(0, 35, 30);
        torus.rotation.x = Math.PI / 2;
    }
    else {
        var posX = airplane.position.x + Math.floor((Math.random() * 21) - 10);
        var posY = airplane.position.y + Math.floor((Math.random() * 21) - 10);
        var posZ = airplane.position.z - 30;

        if (posY < -5) {
            posY = posY + 5;
        }
        else if (posY > 100) {
            posY = posY - 5;
        }

        torus.position = new BABYLON.Vector3(posX, posY, posZ);
        torus.rotation.x = Math.PI / 2;
    }

    var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
    myMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
    torus.material = myMaterial;
}

function showTimer() {
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    timerText = new BABYLON.GUI.TextBlock();
    timerText.text = "Timer = " + timeleft;
    timerText.color = "black";
    timerText.fontSize = 24;
    timerText.left = '9%';
    timerText.top = '-45%';

    advancedTexture.addControl(timerText);
}

function showScoreboard() {
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    scoreText = new BABYLON.GUI.TextBlock();
    scoreText.text = "Score = " + score;
    scoreText.color = "black";
    scoreText.fontSize = 24;
    scoreText.left = "-1%";
    scoreText.top = '-45%';

    advancedTexture.addControl(scoreText);
}

function showSpeedometer() {
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    speedText = new BABYLON.GUI.TextBlock();
    speedText.text = "Speed = " + (-airSpeed);
    speedText.color = "black";
    speedText.fontSize = 24;
    speedText.left = '-11%';
    speedText.top = '-45%';

    advancedTexture.addControl(speedText);
}

function showInstructions() {
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var instructions = new BABYLON.GUI.TextBlock();
    instructions.text = "INSTRUCTION\n" +
        "W = UP\n" +
        "S = DOWN\n" +
        "A = TILT LEFT\n" +
        "D = TILT RIGHT\n" +
        "Q = YAW LEFT\n" +
        "E = YAW RIGHT\n" +
        "↑ = SPEED UP\n" +
        "↓ = SPEED DOWN";
    instructions.color = "black";

    instructions.fontSize = 18;
    instructions.left = '-43%';
    instructions.top = '35%';

    advancedTexture.addControl(instructions);
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
    if (keysDown[83]) {
        // W, rotate in the negative direction about the x axis
        yRot -= elapsed * turnSpeed;
    }
    else if (keysDown[87]) {
        // S, rotate in the positive direction about the x axis
        yRot += elapsed * turnSpeed;
    }
    else if (keysDown[65]) {
        // A, rotate in the negative direction about the z axis
        zRot -= elapsed * turnSpeed;
    }
    else if (keysDown[68]) {
        // D, rotate in the positive direction about the z axis
        zRot += elapsed * turnSpeed;
    }
    else if (keysDown[81]) {
        // Q, rotate left
        xRot += elapsed * turnSpeed;
    }
    else if (keysDown[69]) {
        // E, rotate right
        xRot -= elapsed * turnSpeed;
    }
    else if (keysDown[38]) {
        // z, speed up
        airSpeed = airSpeed - 1;
    }
    else if (keysDown[40]) {
        // x, speed down
        if (airSpeed < 0) {
            airSpeed = airSpeed + 1;
        }
    }

    setTimeout(() => {
        airplane.translate(BABYLON.Axis.Z, elapsed + airSpeed / 10, BABYLON.Space.LOCAL);
    }, 5000)

    airplane.rotate(BABYLON.Axis.X, xRot / 10, BABYLON.Space.LOCAL);
    airplane.rotate(BABYLON.Axis.Y, yRot / 10, BABYLON.Space.LOCAL);
    airplane.rotate(BABYLON.Axis.Z, zRot / 10, BABYLON.Space.LOCAL);
}

function startGame() {
    engine.runRenderLoop(function () {
        scene.render();
        if (timeleft === 0) {
            endGame();
        }
    });
}

function endGame() {
    engine.stopRenderLoop();
    bgmMusic.stop();
    let e1 = document.getElementById("ingame");
    e1.style.display = "none";

    let element = document.getElementById("end");
    element.style.display = "block";

    $("#end h2").html("Game Over");
    $("#end h3").html("Score: " + score);

    var leaderboard = JSON.parse(localStorage.getItem('highscore'));
    var data;

    if (leaderboard[0].name === '-') {
        $("#end h2").html("New Highscore!");
        data = getNewHighscoreData();
        leaderboard[0] = data;
    }
    else if (leaderboard.length < 10) {
        $("#end h2").html("New Highscore!");
        data = getNewHighscoreData();
        leaderboard.push(data);
    }
    else if (leaderboard.length == 10 && score > leaderboard[leaderboard.length - 1].score) {
        $("#end h2").html("New Highscore!");
        data = getNewHighscoreData();
        leaderboard[leaderboard.length - 1] = data;
    }

    leaderboard.sort(function (a, b) {
        return parseFloat(b.score) - parseFloat(a.score);
    });

    localStorage.setItem('highscore', JSON.stringify(leaderboard));
}

function getNewHighscoreData() {
    var name = prompt("What's your name?");
    var person = {
        name: name,
        score: score
    }
    return person;
}

function startTimer(duration) {
    timer = duration;
    var seconds;
    setInterval(function () {
        seconds = parseInt(timer % 60);

        timeleft = seconds;
        timerText.text = "Timer = " + timeleft;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}
