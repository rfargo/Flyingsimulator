 var canvas, engine, scene, camera;
    document.addEventListener('DOMContentLoaded', function() {
        //get canvas
        canvas = document.getElementById('renderCanvas');
        
        //create babylon engine
        engine = new BABYLON.Engine(canvas, true);

        //create scene
        scene = new BABYLON.Scene(engine);

        // create a FreeCamera, and set its position to (x:0, y:4, z:-10)
        //camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 4,-10), scene);

        camera = new BABYLON.ArcRotateCamera("Camera",0,0,10, new BABYLON.Vector3(0,0,0),scene);

        // target the camera to scene origin
        camera.setTarget(new BABYLON.Vector3(0,0,0));
        // camera.setPosition(new BABYLON.Vector3(0,0,0));

        // attach the camera to the canvas
        camera.attachControl(canvas,true);

        // create a basic light, aiming 0,8,0
        var light = new BABYLON.HemisphericLight('hlight', new BABYLON.Vector3(0,0,0), scene);


        var ground = BABYLON.Mesh.CreateGroundFromHeightMap(
        'island',
        'island_heightmap.png',
        100, // width of the ground mesh (x axis)
        100, // depth of the ground mesh (z axis)
        40,  // number of subdivisions
        0,   // min height
        50,  // max height
        scene,
        false, // updateable?
        successCallback // callback when mesh is ready
    );

        var material = new BABYLON.StandardMaterial('ground-material', scene);
        material.wireframe = true;
        ground.material = material;

        engine.runRenderLoop(function() {

                     scene.render();
                });

            });