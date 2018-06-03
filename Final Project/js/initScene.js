var canvas, engine, scene, camera, airplane;
document.addEventListener('DOMContentLoaded', function () {
    //get canvas
    canvas = document.getElementById('renderCanvas');

    //create babylon engine
    engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        //create scene
        scene = new BABYLON.Scene(engine); //play scene

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

        // Parameters: name, position, scene
        var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);

        //The goal distance of camera from target
        camera.radius = 30;

        // The goal height of camera above local origin (centre) of target
        camera.heightOffset = 20;

        // The goal rotation of camera around local origin (centre) of target in x y plane
        camera.rotationOffset = 0;

        //Acceleration of camera in moving from current to goal position
        camera.cameraAcceleration = 0.005

        //The speed at which acceleration is halted
        camera.maxCameraSpeed = 10

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // NOTE:: SET CAMERA TARGET AFTER THE TARGET'S CREATION AND NOTE CHANGE FROM BABYLONJS V 2.5
        //targetMesh created here

        // create a basic light, aiming 0,8,0
        var light = new BABYLON.HemisphericLight('hlight', new BABYLON.Vector3(0, 8, 0), scene);

        var land = BABYLON.Mesh.CreateGroundFromHeightMap(
            'island',
            'island_heightmap.png',
            100, // width of the ground mesh (x axis)
            100, // depth of the ground mesh (z axis)
            40,  // number of subdivisions
            0,   // min height
            50,  // max height
            scene
        );
        land.position = new BABYLON.Vector3(0, 0, 0);

        BABYLON.SceneLoader.ImportMesh("", "", "airplane1.babylon", scene, function (newMeshes) {
            airplane = newMeshes[0];
            setup(airplane);
            camera.lockedTarget = airplane; //version 2.5 onwards

        });

        // simple wireframe material
        var material = new BABYLON.StandardMaterial('material', scene);
        material.wireframe = true;
        land.material = material;


        return scene;
    }

    var scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });
});


function setup(mesh) {
    meshX = 0;
    meshY = 35;
    meshZ = 50;
    meshAdd = 1;

    mesh.scaling = new BABYLON.Vector3(1, 1 / 16, 1 / 8);
    mesh.position = new BABYLON.Vector3(meshX, meshY, meshZ);

    window.addEventListener('keydown', function (event) {
        if (event.keyCode == 39) {
            mesh.position = new BABYLON.Vector3(meshX - meshAdd, meshY, meshZ);
            meshX = meshX - meshAdd;
        }
        if (event.keyCode == 37) {
            mesh.position = new BABYLON.Vector3(meshX + meshAdd, meshY, meshZ);
            meshX = meshX + meshAdd;
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