// var ground = BABYLON.Mesh.CreateGroundFromHeightMap(
//     'island',
//     'island_heightmap.png',
//     100, // width of the ground mesh (x axis)
//     100, // depth of the ground mesh (z axis)
//     40,  // number of subdivisions
//     0,   // min height
//     50,  // max height
//     scene,
//     false, // updateable?
//     null // callback when mesh is ready
// );

// var material = new BABYLON.StandardMaterial('ground-material', scene);
// material.wireframe = true;
// ground.material = material;

// engine.runRenderLoop(function() {

//              scene.render();
//         });






        //create a FreeCamera, and set its position to (x:0, y:4, z:-10)
        // camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 50,100), scene);


        // camera.keysUp.push(38);
        // camera.keysDown.push(40);
        // camera.keysRight.push(39);
        // camera.keysLeft.push(37);


        // camera = new BABYLON.ArcRotateCamera("Camera",0,0,10, new BABYLON.Vector3(0,0,0),scene);

        // //target the camera to scene origin
        // camera.setTarget(new BABYLON.Vector3(0,0,0));
        // camera.setPosition(new BABYLON.Vector3(0,50,100));

        // var cameraPosX = 0;
        // var cameraPosY = 50;
        // var cameraPosZ = 100;
        // var cameraPosAdd = 1;

        // window.addEventListener('keydown',function(event){
        //  if(event.keyCode == 39 ){
        //    camera.setPosition(new BABYLON.Vector3(cameraPosX-cameraPosAdd,cameraPosY,cameraPosZ));
        //    cameraPosX = cameraPosX-cameraPosAdd;
        //  }
        //  if(event.keyCode == 37 ){
        //     camera.setPosition(new BABYLON.Vector3(cameraPosX+cameraPosAdd,cameraPosY,cameraPosZ));
        //     cameraPosX = cameraPosX+cameraPosAdd;
        //  }
        //  if(event.keyCode == 38 ){
        //     camera.setPosition(new BABYLON.Vector3(cameraPosX,cameraPosY,cameraPosZ+cameraPosAdd));
        //     cameraPosZ = cameraPosZ-cameraPosAdd;
        //  }
        //  if(event.keyCode == 40 ){
        //     camera.setPosition(new BABYLON.Vector3(cameraPosX,cameraPosY,cameraPosZ-cameraPosAdd));
        //     cameraPosZ = cameraPosZ+cameraPosAdd;            
        //  }
        // })

        // attach the camera to the canvas
       // camera.attachControl(canvas,true);