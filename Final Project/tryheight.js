    var canvas, engine, scene, camera;
    var airplane;
    document.addEventListener('DOMContentLoaded', function() {
        //get canvas
        canvas = document.getElementById('renderCanvas');
        
        //create babylon engine
        engine = new BABYLON.Engine(canvas, true);


        var createScene = function(){
        //create scene
          scene = new BABYLON.Scene(engine); //play scene

          scene.enablePhysics();

          scene.clearColor = new BABYLON.Color3(0.2, 0.5, 0.9);
          scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

          scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
          scene.fogDensity = 0.002;
          scene.fogColor = new BABYLON.Color3(0.9,0.9,0.9);

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
          camera.radius = 25;

          // The goal height of camera above local origin (centre) of target
          camera.heightOffset = 10;

          // The goal rotation of camera around local origin (centre) of target in x y plane
          camera.rotationOffset = 0;

          //Acceleration of camera in moving from current to goal position
          camera.cameraAcceleration = 0.5;

          //The speed at which acceleration is halted 
          camera.maxCameraSpeed = 100;

          // This attaches the camera to the canvas
          camera.attachControl(canvas, true);

          //music doo doo doo doo
          // var music = new BABYLON.Sound("Music", "baby-shark.mp3", scene, null, 
          //   { loop: true, autoplay: true });

        // create a basic light, aiming 0,8,0
        var light = new BABYLON.HemisphericLight('hlight', new BABYLON.Vector3(0,8,0), scene);

        var box = BABYLON.Mesh.CreateGroundFromHeightMap(
                'island',
                'island_heightmap.png',
                100, // width of the ground mesh (x axis)
                100, // depth of the ground mesh (z axis)
                40,  // number of subdivisions
                0,   // min height
                50,  // max height
                scene,
                function () {
                  ground.physicsImpostor = new BABYLON.PhysicsImpostor(
                    ground, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 });
                }
            );
        box.position = new BABYLON.Vector3(0,0,0);

      BABYLON.SceneLoader.ImportMesh("","","airplane1.babylon", scene, function(newMeshes){
        airplane = newMeshes[0];
        setup(airplane);
        camera.lockedTarget = airplane; //version 2.5 onwards
            scene.registerAfterRender(function() {
              airplane.position.z -=0.1 ;
            })
      });


        // simple wireframe material
        var material = new BABYLON.StandardMaterial('material', scene);
        material.diffuseTexture = new BABYLON.Texture('island_heightmap.png', scene);
        material.wireframe = true;
        box.material = material;

        return scene;
        }

        var scene = createScene();

       engine.runRenderLoop(function() {
            function movement(mesh){
              mesh.position.z = mesh.position.z+1;
            }
            scene.render();
        });

    });
    

      function setup(mesh){
        meshX = 0;
        meshY = 35;
        meshZ = 50;
        meshAdd = 1;

        mesh.scaling = new BABYLON.Vector3(1,1/16,1/8);
        mesh.position = new BABYLON.Vector3(meshX, meshY, meshZ);

        window.addEventListener('keydown',function(event){
         if(event.keyCode == 39 ){
           mesh.position = new BABYLON.Vector3(meshX-meshAdd,meshY,meshZ+meshAdd);
           meshX = meshX-meshAdd;
           meshZ = meshZ+meshAdd;
           //mesh.rotate(BABYLON.Axis.Y, Math.PI / 8, BABYLON.Space.WORLD); 
            // box.physicsImpostor.applyImpulse(new BABYLON.Vector3(-1,0,0), box.getAbsolutePosition());
         }
         if(event.keyCode == 37 ){
            mesh.position = new BABYLON.Vector3(meshX+meshAdd,meshY,meshZ+meshAdd);
            meshX = meshX+meshAdd;
            meshZ = meshZ+meshAdd;    
            //mesh.rotate(BABYLON.Axis.X, - Math.PI / 18, BABYLON.Space.LOCAL);  
            // box.physicsImpostor.applyImpulse(new BABYLON.Vector3(1,0,0), box.getAbsolutePosition());
         }
         // if(event.keyCode == 38 ){
         //    mesh.position = new BABYLON.Vector3(meshX,meshY,meshZ+meshAdd);
         //    meshZ = meshZ-meshAdd;
         //    // mesh.applyImpulse(new BABYLON.Vector3(0,0,1), mesh.getAbsolutePosition());
         // }
         // if(event.keyCode == 40 ){
         //    mesh.position = new BABYLON.Vector3(meshX,meshY,meshZ-meshAdd);
         //    meshZ = meshZ+meshAdd;            
         //    // box.physicsImpostor.applyImpulse(new BABYLON.Vector3(0,0,-1), box.getAbsolutePosition());
         // }
        })
      }