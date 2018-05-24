    var canvas, engine, scene, camera;
    var airplane;
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
        //camera.setTarget(new BABYLON.Vector3(0,0,0));
        camera.setPosition(new BABYLON.Vector3(0,50,100));

        var cameraPosX = 0;
        var cameraPosY = 50;
        var cameraPosZ = 100;
        var cameraPosAdd = 1;

        window.addEventListener('keydown',function(event){
         if(event.keyCode == 39 ){
           camera.setPosition(new BABYLON.Vector3(cameraPosX-cameraPosAdd,cameraPosY,cameraPosZ));
           cameraPosX = cameraPosX-cameraPosAdd;
         }
         if(event.keyCode == 37 ){
            camera.setPosition(new BABYLON.Vector3(cameraPosX+cameraPosAdd,cameraPosY,cameraPosZ));
            cameraPosX = cameraPosX+cameraPosAdd;
         }
         if(event.keyCode == 38 ){
            camera.setPosition(new BABYLON.Vector3(cameraPosX,cameraPosY,cameraPosZ+cameraPosAdd));
            cameraPosZ = cameraPosZ-cameraPosAdd;
         }
         if(event.keyCode == 40 ){
            camera.setPosition(new BABYLON.Vector3(cameraPosX,cameraPosY,cameraPosZ-cameraPosAdd));
            cameraPosZ = cameraPosZ+cameraPosAdd;            
         }
        })

        // attach the camera to the canvas
       camera.attachControl(canvas,true);


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
                scene
            );
        box.position = new BABYLON.Vector3(0,0,0);
        
      BABYLON.SceneLoader.ImportMesh("","","airplane1.babylon", scene, function(newMeshes){
        airplane = newMeshes[0];
        setup(airplane);
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
           mesh.position = new BABYLON.Vector3(meshX-meshAdd,meshY,meshZ);
           meshX = meshX-meshAdd;
            // box.physicsImpostor.applyImpulse(new BABYLON.Vector3(-1,0,0), box.getAbsolutePosition());
         }
         if(event.keyCode == 37 ){
            mesh.position = new BABYLON.Vector3(meshX+meshAdd,meshY,meshZ);
            meshX = meshX+meshAdd;            
            // box.physicsImpostor.applyImpulse(new BABYLON.Vector3(1,0,0), box.getAbsolutePosition());
         }
         if(event.keyCode == 38 ){
            mesh.position = new BABYLON.Vector3(meshX,meshY,meshZ+meshAdd);
            meshZ = meshZ-meshAdd;            
            // box.physicsImpostor.applyImpulse(new BABYLON.Vector3(0,0,1), box.getAbsolutePosition());
         }
         if(event.keyCode == 40 ){
            mesh.position = new BABYLON.Vector3(meshX,meshY,meshZ-meshAdd);
            meshZ = meshZ+meshAdd;            
            // box.physicsImpostor.applyImpulse(new BABYLON.Vector3(0,0,-1), box.getAbsolutePosition());
         }
        })
      }

//      window.onkeydown = function(event)


        // simple wireframe material
        var material = new BABYLON.StandardMaterial('material', scene);
        material.diffuseTexture = new BABYLON.Texture("island_heightmap.jpg", scene);
        material.specularTexture = new BABYLON.Texture("island_heightmap.jpg", scene);
        material.emissiveTexture = new BABYLON.Texture("island_heightmap.jpg", scene);
        material.ambientTexture = new BABYLON.Texture("island_heightmap.jpg", scene);

        //material.wireframe = true;
        box.material = material;


       engine.runRenderLoop(function() {
            //box.position.x = box.position.x + 0.05;
           
                
            
            scene.render();
        });
    });

