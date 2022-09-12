import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as TWEEN from 'tween'
import Image from 'next/image';


const earthSize = 10;

const planets = [
  {name: 'mercury', size: earthSize / 3, positionX: -400, texture: 'mercury.jpg', zoom: 15},
  {name: 'venus', size: earthSize * 0.944, positionX: -200, texture: 'venus.jpg'},
  {name: 'earth', size: earthSize, positionX: 0, texture: 'earth.jpg'},
  {name: 'mars', size: earthSize / 2, positionX: 200, texture: 'mars.jpg'},
  {name: 'jupiter', size: earthSize * 11, positionX: 500, texture: 'jupiter.jpg', zoom: 400},
  {name: 'saturn', size: 1, positionX: 1000, texture: 'earth.jpg', zoom: 400},
  {name: 'uranus', size: earthSize * 4, positionX: 1500, texture: 'uranus.jpg', zoom: 200},
  {name: 'neptune', size: earthSize * 3, positionX: 1800, texture: 'neptune.jpg', zoom: 200},
]

const planetsArray = planets.map((planet) => planet.name);

function Earth() {

  const [currentPlanet, setCurrentPlanet] = useState('earth');
  const [isActive, setIsActive] = useState(false);

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

        let saturnmodel;
  
        new GLTFLoader().load('/saturn.glb', (gltf) => {
          gltf.scene.scale.set(0.12, 0.12, 0.12); 
          gltf.scene.position.set(1000, 0, 0); 
          const root = gltf.scene;
          root.name = 'saturngltf'
          saturnmodel = root;
          scene.add(root);
          if (saturnmodel) saturnmodel.rotation.x = 0.2;

        })
  

          // loader.load( '/saturn.glb', function ( gltf ) {

          //   gltf.scene.scale.set(0.12, 0.12, 0.12); 
          //   const root = gltf.scene;
          //   root.name = 'saturngltf'
          //   scene.add(root);
            
          // }, undefined, function ( error ) {

          //   console.error( error );

          // } );

        console.log(scene.children)
        let oldobject = planetsObjects.filter(obj => Object.keys(obj).some(name => obj[name] == 'earth'))[0].object;
        
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
 
          if (saturnmodel) saturnmodel.rotation.y += 0.001;
        
          controls.update()
          TWEEN.update();
          renderer.render(scene, camera);
        }
      
        animate();
  
    }, []);

    const nextValue = planetsArray.indexOf(currentPlanet) < planetsArray.length - 1 ? planetsArray[planetsArray.indexOf(currentPlanet) + 1] : currentPlanet;
    const backValue =  planetsArray.indexOf(currentPlanet) != 0 ? planetsArray[planetsArray.indexOf(currentPlanet) - 1] : currentPlanet;
    
  return (
    <>
    <div className={`${isActive ? 'translate-y-[0vh]' : 'translate-y-[-100vh]'} w-[100vw] h-[100vh] fixed z-50 bg-black duration-700 transition-all`}>
          <div className='w-full h-full flex flex-col justify-center items-center'>
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-1 w-[80%] lg:gap-5 lg:w-[50%] mx-auto text-white mb-5'>
            {planets.map((planet) => 
            
                  <button onClick={() => {setCurrentPlanet(planet.name); setIsActive(false);}} id={planet.name} className='navbtns text-white relative flex flex-col jusitfy-center items-center'>
                    <div className='relative w-24 h-24'>
                      <Image id={planet.name} layout='fill' src={`/${planet.name}icon.svg`} />
                    </div>
                    <p className={planet.name == currentPlanet ? 'text-white font-bold' : 'text-gray-400' +  ` text-white w-full`}>{planet.name}</p>
                  </button>
        
              )}
              <div className='w-full text-center col-span-full mt-5'>
                <a href={ '/about'} className='inline mr-3 underline'>About</a>
                <a target={'_blank'} href={'https://github.com/moe03'} className='inline ml-3 underline'>Github</a>
                
                <button className='block text-center mx-auto mt-5'>Designed and developed my <span className=' underline'>Moe</span></button>
              </div>
    
            </div>
          </div>

   
    </div>
    <div className='relative'>
          <div className='fixed w-full bg-white z-20 items-center justify-center hidden lg:flex'>
            {planets.map((planet) => 
                <button onClick={() => setCurrentPlanet(planet.name)} id={planet.name} className={`${planet.name == currentPlanet ? 'text-black': 'text-gray-500'} navbtns mx-2 px-2 py-2 hover:shadow hover:bg-gray-200`}>{planet.name}</button>
     
            )}
              
                    <button className='relative w-6 h-6' onClick={() => setIsActive(true)}><Image layout='fill' src='/menu.svg'/></button>
         
          </div>
          <button onClick={() => setIsActive(true)} className='fixed flex items-center justify-center w-[3rem] h-[3rem] bg-white z-20 right-0 mt-3 mr-3 lg:hidden rounded-full'>
            <button className='relative w-6 h-6' ><Image layout='fill' src='/menu.svg'/></button>
          </button>
        <div className='fixed flex items-center justify-center h-[5rem] z-20 bottom-0 w-full lg:hidden'>
          <div className='bg-white w-[50%] mx-auto flex items-center justify-center'>
               <button id={backValue} className='navbtns' onClick={() => setCurrentPlanet(backValue)}>BACK</button> <span className='mx-4'>{currentPlanet}</span> 
               <button id={nextValue} className='navbtns' onClick={() => setCurrentPlanet(nextValue)}>NEXT</button>
          </div>
        </div>
        <canvas style={{position: 'fixed'}} id='canvas'></canvas>
    </div>
    

    </>
  )
}

export default Earth