import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as TWEEN from 'tween'

const earthSize = 10 * 0.9499;;



function Earth() {

    useEffect(() => {

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 1000000)

        const renderer = new THREE.WebGLRenderer({
          canvas: document.querySelector('#canvas')
        })
        
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(50);
        
        renderer.render(scene, camera);
        
        
   
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set(1, 1, 0)    
        
        scene.add(directionalLight);
        
    
        
        const grid = new THREE.GridHelper(10000, 100);
        scene.add(grid)
        
        const controls = new OrbitControls(camera, renderer.domElement);
        
        
        const venusTexture = new THREE.TextureLoader().load('venus.jpg');
        const venusClouds = new THREE.TextureLoader().load('venusclouds.jpg');
        
        const earth = new THREE.Mesh(
          new THREE.SphereGeometry(earthSize, 32, 32),
          new THREE.MeshStandardMaterial({
            map: venusTexture,
            bumpMap: venusClouds,
            fog:true,
            bumpScale: 0.1,
    
          })
        )

        
        scene.add(earth)
        
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
        
        controls.addEventListener( "change", event => {  
          let tween = new TWEEN.Tween(directionalLight.position);
          console.log( controls.object.position );
          lightNewPosition = controls.object.position;
          // Then tell the tween we want to animate the x property over 1000 milliseconds
          tween.to(controls.object.position, 1000);
          tween.easing(TWEEN.Easing.Quadratic.Out);
          tween.start();
        
        });
        
        function animate(){
          requestAnimationFrame(animate);
          earth.rotation.x += .0000001;
          earth.rotation.y += .001; 
        
          controls.update()
          TWEEN.update();
          renderer.render(scene, camera);
        }
        
        
        animate();
  
    }, []);
    
  return (
    <canvas id='canvas'>Earth</canvas>
  )
}

export default Earth