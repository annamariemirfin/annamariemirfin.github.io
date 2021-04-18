import * as THREE from '/three/build/three.module.js';

import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

import Stats from '/three/examples/jsm/libs/stats.module.js';

import {PLYLoader} from '/three/examples/jsm/loaders/PLYLoader.js';
//import { Box3, Vector3 } from '/three/build/three.module';

let container, stats;

let camera, cameraTarget, scene, renderer, controls;

init();
animate();

function init(){
    container = document.getElementById('canvas');
    document.body.appendChild(container);

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(1280, 720);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    

    camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.01,1000);
    controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set(10, 0.15, 10);
    controls.update();
    cameraTarget = new THREE.Vector3(0, -0.1, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x72645b);
    //scene.fog = new THREE.Fog( 0x72645b, 2, 15 );

/*    const geometry = new THREE.BufferGeometry();

        const positions = [];
        const colors = [];

        const color = new THREE.Color();

        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        geometry.computeBoundingSphere();

        //

        const material = new THREE.PointsMaterial( { size: 15, vertexColors: true } );

        let points = new THREE.Points( geometry, material );
*/
        
        
        
        //const plane = new THREE.Mesh(new THREE.PlaneGeometry(40, 40),
        //                        new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 }));
       // plane.rotation.x = -Math.PI/2;
       // plane.position.y = -0.5;
        //scene.add(plane);

       // plane.recieveShadow = true;

        const loader = new PLYLoader();
        loader.load('/models/Anna_Marie_low_quality.ply', function(geometry){
            geometry.computeFaceNormals();
            var material = new THREE.PointsMaterial({vertexColors: THREE.VertexColors, size: .01});
            var object = new THREE.Points(geometry, material);
            var box3 = new THREE.Box3().setFromObject(object);
            var centroid = new THREE.Vector3();
            box3.getCenter(centroid);
            object.position.set(-centroid.x, -centroid.y, -centroid.z);
            scene.add(object);
        });

        scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
        
        addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
        addShadowedLight( 0.5, 1, - 1, 0xffaa00, 1 );

     

        //stats = new Stats();
        //container.appendChild(stats.dom);

        window.addEventListener('resize', onWindowResize);
}   

function addShadowedLight( x, y, z, color, intensity ) {

    const directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );

    directionalLight.castShadow = true;

    const d = 1;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    directionalLight.shadow.bias = - 0.001;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate(){
    requestAnimationFrame(animate);
    render();
    //stats.update();
}

function render(){
   // const timer = Date.now() * 0.0005;
 //   camera.position.x = Math.sin(timer)*2.5;
    //camera.position.z = Math.cos(timer)*2.5;
    camera.lookAt(cameraTarget);
    controls.update();
    renderer.render(scene, camera);
}