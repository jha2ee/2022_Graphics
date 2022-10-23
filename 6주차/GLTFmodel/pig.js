
window.onload = function init()
{
	const canvas = document.getElementById( "gl-canvas" );
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.setSize(canvas.width,canvas.height);

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xff80bf);

	camera = new THREE.PerspectiveCamera(75,canvas.width / canvas.height,0.1, 1000);
	camera.rotation.y = 45/180*Math.PI;
	camera.position.x = 0;
	camera.position.y = -150;
	camera.position.z = 100;

	const controls = new THREE.OrbitControls(camera, renderer.domElement);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(-3000, -3000, 0);
	scene.add(directionalLight);

	light = new THREE.PointLight(0xc4c4c4,1);
	light.position.set(0,3000,5000);
	scene.add(light);

	light2 = new THREE.PointLight(0xc4c4c4,0.5);
	light2.position.set(5000,1000,0);
	scene.add(light2);

	light3 = new THREE.PointLight(0xc4c4c4,0.8);
	light3.position.set(0,1000,-5000);
	scene.add(light3);

	light4 = new THREE.PointLight(0xc4c4c4,2);
	light4.position.set(-5000,3000,5000);
	scene.add(light4);

	const loader = new THREE.GLTFLoader();
	loader.load('./pig/scene.gltf', function(gltf){
	  pig = gltf.scene.children[0];
	  pig.scale.set(1.5,1.5,1.5);
	  scene.add(gltf.scene);
	  animate();
	  
	}, undefined, function (error) {
		console.error(error);
	});

	function animate(time) {

		time *= 0.001;  // convert time to seconds

      	const speed = 1 * .3;
      	const rot = time * speed;
      	pig.rotation.x = rot;
      	//pig.rotation.y = rot;

	   renderer.render(scene,camera);
	   requestAnimationFrame(animate);
	   //requestAnimationFrame(render);
	}

}


