import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import * as TWEEN from 'tween'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Image from 'next/image';
import Menu from '../planets/Menu'

// Links
const portfolioLink = 'https://moecodes.vercel.app';
const github = 'https://github.com/moe03';

// Constants
const earthSize = 10;
const defaultZoom = 40

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

function Main() {

  const [currentPlanet, setCurrentPlanet] = useState('earth');
  const [isActive, setIsActive] = useState(false);

  const planetsArray = planets.map((planet) => planet.name);

    useEffect(() => {

      let buttons = document.getElementsByClassName('navbtns');

        // buttons navs
      for(let i = 0; i < buttons.length; i++) {
          buttons[i].addEventListener('click', (event) => {
  
              let chosenPlanet = event.target.id;
          
              updatePositionForCamera(50, eval(chosenPlanet), 0)
          })
      }

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 10000)
      const renderer = new THREE.WebGLRenderer({
          canvas: document.querySelector('#canvas'),
          antialias: false
        })
        
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(defaultZoom);
        renderer.render(scene, camera);
        
        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(-100, 0, 0 )
        scene.add( pointLight );
        
        // helpers

        // const lightHelper = new THREE.PointLightHelper(pointLight)
        
        // const grid = new THREE.GridHelper(10000, 100);
        // scene.add(lightHelper, grid)

        // end helpers
        
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

        const addAllPlanets = () => {
          for(let i = 0; i < planets.length; i++){
            let planetName = planets[i].name
            let planetSize = planets[i].size
            let planetTexture = planets[i].texture
            let planetPosition =  planets[i].positionX
            // default zoom = 40
            let planetZoom =  planets[i].zoom ? planets[i].zoom : 40
        
            newPlanet(planetName, planetSize, planetTexture, planetPosition, planetZoom)
          }
        }
       
        addAllPlanets()
    
        // special objects and planets:

        const earthClouds = new THREE.TextureLoader().load('clouds.jpg');
        const earthCloudsScene = new THREE.Mesh(
          new THREE.SphereGeometry(10.1, 32, 32),
          new THREE.MeshStandardMaterial({
            map: earthClouds, alphaMap: earthClouds,   transparent: 1 })
        )
        scene.add(earthCloudsScene);

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

        function updatePositionForCamera(zoom, object) {
        
            object = planetsObjects.filter(obj => Object.keys(obj).some(name => obj[name] == object.id))[0].object;
         
            let from = camera.position.clone();
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
            planetsObjects.push({
              object: actualPlanet,
              planet: actualPlanet.name
            })
          }
        }     
      
        let oldobject = planetsObjects.filter(obj => Object.keys(obj).some(name => obj[name] == 'earth'))[0].object;
        
        function animate(){
          
          requestAnimationFrame(animate);

          // Rotating all planets
          for(let i = 0; i < planetsObjects.length; i++){
            if(planetsObjects[i].planet){
             planetsObjects[i].object.rotation.x += .0000001
             planetsObjects[i].object.rotation.y += .001; 
            }
          }

          // Rotating all planet objects
          earthCloudsScene.rotation.x += .0008;
          earthCloudsScene.rotation.y += .001; 
          if (saturnmodel) saturnmodel.rotation.y += 0.001;

          // Keeping light position in sync with camera.
          let orbitPosition = controls.object.position;
          pointLight.position.set(orbitPosition.x,orbitPosition.y,orbitPosition.z);
          
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
    <Menu setCurrentPlanet={setCurrentPlanet} currentPlanet={currentPlanet} planets={planets} setIsActive={setIsActive} isActive={isActive} />
    
    <div className='relative'>
          <div className='fixed w-full bg-white z-20 items-center justify-center hidden lg:flex'>
            {planets.map((planet) => 
                <button onClick={() => setCurrentPlanet(planet.name)} id={planet.name} className={`${planet.name == currentPlanet ? 'text-black': 'text-gray-500'} navbtns mx-2 px-2 py-2 hover:shadow hover:bg-gray-200`}>{planet.name}</button>
     
            )}
            <button className='relative w-6 h-6' onClick={() => setIsActive(true)}><Image layout='fill' src='/menu.svg'/></button>
          </div>
          <button onClick={() => setIsActive(true)} className='fixed flex items-center justify-center w-[3rem] h-[3rem] bg-white z-20 right-0 mt-3 mr-3 lg:hidden rounded-full'>
            <div className='relative w-6 h-6' ><Image layout='fill' src='/menu.svg'/></div>
          </button>
        <div className='fixed flex items-center justify-center h-[7rem] z-20 bottom-0 w-full lg:hidden'>
          <div className='bg-white rounded-full w-[50%] lg:w-[30%] mx-auto flex items-center justify-center'>
               <button id={backValue} className='navbtns relative w-6 h-6 rounded-full ' onClick={() => setCurrentPlanet(backValue)}><Image id={backValue} layout='fill' src={'/back.svg'} /></button> 
               <span className='mx-4 text-3xl tracking-wide shadow-lg'>{currentPlanet}</span> 
               <button id={nextValue} className='navbtns relative w-6 h-6 rounded-full' onClick={() => setCurrentPlanet(nextValue)}><Image id={nextValue} layout='fill' src={'/next.svg'} /></button> 
          </div>
        </div>

        <canvas style={{position: 'fixed'}} id='canvas'></canvas>
    </div>


    </>
  )
}

export default Main