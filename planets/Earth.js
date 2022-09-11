import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as TWEEN from 'tween'



const earthSize = 10;

const planets = [
  {name: 'mercury', size: earthSize / 3, positionX: -200, texture: 'mercury.jpg', zoom: 30},
  {name: 'venus', size: earthSize * 0.944, positionX: -100, texture: 'venus.jpg'},
  {name: 'earth', size: earthSize, positionX: 0, texture: 'earth.jpg'},
  {name: 'mars', size: earthSize / 2, positionX: 100, texture: 'mars.jpg'},
  {name: 'jupiter', size: earthSize * 11, positionX: 300, texture: 'jupiter.jpg', zoom: 400},
  {name: 'saturn', size: earthSize * 9, positionX: 600, texture: 'saturn.jpg', zoom: 400},
  {name: 'uranus', size: earthSize * 4, positionX: 800, texture: 'uranus.jpg', zoom: 200},
  {name: 'neptune', size: earthSize * 3, positionX: 950, texture: 'neptune.jpg', zoom: 200},
]

function Earth() {

    useEffect(() => {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 10000)
        const renderer = new THREE.WebGLRenderer({
          canvas: document.querySelector('#canvas'),
          antialias: true
        })
        
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(50);
        
        renderer.render(scene, camera);
        
        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(-100, 0, 0 )
        
        scene.add( pointLight );
        
        const lightHelper = new THREE.PointLightHelper(pointLight)
        
        const grid = new THREE.GridHelper(10000, 100);
        scene.add(lightHelper, grid)
        
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const newPlanet = (name, size, texture, positionX, zoom) => {
          
          let planetTexture = new THREE.TextureLoader().load(`${texture}`);

          const planet3D = new THREE.Mesh(
            new THREE.SphereGeometry(size, 32, 32),
            new THREE.MeshStandardMaterial({
              map: planetTexture
            })
          );

          planet3D.name = name

          planet3D.zoom = zoom

          planet3D.position.set(positionX, 0, 0);

          scene.add(planet3D);
        
        }



        for(let i = 0; i < planets.length; i++){

          let planetName = planets[i].name
          let planetSize = planets[i].size
          let planetTexture = planets[i].texture
          let planetPosition =  planets[i].positionX
          // default zoom = 40
          let planetZoom =  planets[i].zoom ? planets[i].zoom : 40
      
          newPlanet(planetName, planetSize, planetTexture, planetPosition, planetZoom)

        }

        const earthClouds = new THREE.TextureLoader().load('clouds.jpg');
        
        const earthCloudsScene = new THREE.Mesh(
          new THREE.SphereGeometry(10.1, 32, 32),
          new THREE.MeshStandardMaterial({
            map: earthClouds, alphaMap: earthClouds,   transparent: 1 })
        )
        
        scene.add(earthCloudsScene);
        
        // const loader = new GLTFLoader();
        // loader.load( 'scene.gltf', function ( gltf ) { 
        //         gltf.scene.scale.set(1, 1, 1); 
        //         const root = gltf.scene;
        //         scene.add(root);
        //  }, undefined, function ( error ) { console.error( error ); } );
        
        // function addStar(){
        //   const geometry = new THREE.SphereGeometry( .15, 12, 4 );
        //   const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        //   const star = new THREE.Mesh( geometry, material );
        //   const [x,y,z]  = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100) )
        //   star.position.set(x, y, z)
        //   scene.add( star ); 
        // }
        // Array(200).fill().forEach(addStar);
        let lightNewPosition;

        let buttons = document.getElementsByClassName('navbtns');
        // buttons navs
        for(let i = 0; i < buttons.length; i++) {
          buttons[i].addEventListener('click', (event) => {
  
              let chosenPlanet = event.target.id;
          
              updatePositionForCamera(50, eval(chosenPlanet), 0)
          })
        }
       
       
        controls.addEventListener( "change", event => {  
         
          let tween = new TWEEN.Tween(pointLight.position);
   
          lightNewPosition = controls.object.position;
          // Then tell the tween we want to animate the x property over 1000 milliseconds
          tween.to(controls.object.position, 200);
          tween.easing(TWEEN.Easing.Quadratic.Out);
          tween.start();
  
        });

        function updatePositionForCamera(zoom, object) {
            // fixed distance from camera to the object
            // later in this code
        
            object = planetsObjects.filter(obj => Object.keys(obj).some(name => obj[name] == object.id))[0].object;
         
            let from = camera.position.clone()
            oldobject = oldobject ? oldobject : object

            let to = {x: oldobject.position.x, y: oldobject.position.y, z: 500};
            let to2 = {x: object.position.x, y: object.position.y, z: object.zoom};
            let A = new TWEEN.Tween(from)
                .to(to, 1500)
                .easing(TWEEN.Easing.
                    Exponential.InOut)
                .onUpdate( function(){
                camera.position.copy(this);
                controls.update(); // update of controls is here now
                })
                .onComplete(() => {
                    oldobject = object
                    let tween = new TWEEN.Tween(controls.target);

        
                    // Then tell the tween we want to animate the x property over 1000 milliseconds
                    tween.to(new THREE.Vector3(object.position.x, 0, 0), 1000);
                    tween.easing(TWEEN.Easing.Quadratic.Out);
                    tween.start();

                    let B = new TWEEN.Tween(from)
                    .to(to2, 1500)
                    .easing(TWEEN.Easing.Cubic.InOut)
                    .onUpdate( function(){
                    camera.position.copy(this);
                    controls.update(); // update of controls is here now
                    }).start()
                })
                .start()    
            
            controls.update();    
        }
     


        let planetsObjects = [];
        for(let i = 0; i < scene.children.length; i++){

          let potentialPlanet = scene.children[i];

          if(potentialPlanet.name){
            let actualPlanet = potentialPlanet
            planetsObjects.push(
            
            {
              object: actualPlanet,
              planet: actualPlanet.name
            }
          
            )
        
          }
        }   

        let oldobject = planetsObjects.filter(obj => Object.keys(obj).some(name => obj[name] == 'earth'))[0].object;
        
        console.log(planetsObjects)
        function animate(){
          
          requestAnimationFrame(animate);

          
          for(let i = 0; i < planetsObjects.length; i++){
         
            if(planetsObjects[i].planet){
             planetsObjects[i].object.rotation.x += .0000001
             planetsObjects[i].object.rotation.y += .001; 
            }
          }
        
          earthCloudsScene.rotation.x += .0008;
          earthCloudsScene.rotation.y += .001; 
        
        
          controls.update()
          TWEEN.update();
          renderer.render(scene, camera);
        }
        
        
        animate();
  
    }, []);
    
  return (
    <>
    <canvas id='canvas'>Earth</canvas>
    <div className='fixed w-full h-[20vh] bottom-0 bg-white'>
        <button id='venus' className='navbtns'>Venus</button>
        <button id='mercury' className='navbtns'>Mercury</button>
        <button id='earth' className='navbtns'>earth</button>
        <button id='mars' className='navbtns'>Mars</button>
        <button id='jupiter' className='navbtns'>Jupiter</button>
        <button id='saturn' className='navbtns'>Saturn</button>
        <button id='uranus' className='navbtns'>Uranus</button>
        <button id='neptune' className='navbtns'>Neptune</button>
    </div>

    </>
  )
}

export default Earth