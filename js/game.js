var camera, scene, renderer, controls, controls1, loader;
var player;
var ySpeed = 0.1;
var xSpeed = 0.1;
var score = 0;
var scoreText;
var health = 100;
var healthText;
var width = window.innerWidth;
var height = window.innerHeight;
var maxenemy = 3;
var enemygrp = [];
var speed = 0.6;
var star_xpeed = 0.2;
var clock = new THREE.Clock();
var delta = 0;
var Missiles = [];
var plasmaBalls = [];speed *speed * delta; delta;speed * delta;
var stars = [];
var starspool = [];
var star_x = [];
var star_y = [];
var enemy_x = [];
var enemy_y = [];
var OverText;
var OverText1;
var enemyflg = [];
var enemyshoot = [];
var Fireballs =[];
var num_fireball = 0;
var missile_flag = [];
var fireball_flag = [];

var playerDirection = 0;//angles 0 - 2pi
var dVector;
var angularSpeed = 0.01;
var playerSpeed = 0.075;

var collide_sound;
var missile_sound;
var star_sound;
// initializing everything
function init()
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2( 0xf0fff0, 0.14);
    enemygrp = [];
    initMesh();
    initCamera();
    background();
    initLights();
    initRenderer();
    getControls();

    document.body.appendChild(renderer.domElement);
    document.addEventListener("keydown", onDocumentKeyDown, false);
    window.addEventListener('resize', onWindowResize, false);

    // HUD
    // Score
    scoreText = document.createElement('div');
	scoreText.style.position = 'absolute';
	scoreText.style.width = 100;
	scoreText.style.height = 100;
	scoreText.innerHTML = "Score: " + score.toString();
	scoreText.style.top = 10 + 'px';
	scoreText.style.left = 10 + 'px';
	document.body.appendChild(scoreText);

    // Health
    healthText = document.createElement('div');
	healthText.style.position = 'absolute';
	healthText.style.width = 100;
	healthText.style.height = 100;
	healthText.innerHTML = "Health: " + health.toString();
	healthText.style.top = 30 + 'px';
	healthText.style.left = 10 + 'px';
	document.body.appendChild(healthText);

    // Over text
    OverText = document.createElement('div');
    OverText.style.position = 'absolute';
    OverText.style.width = 100;
    OverText.style.height = 100;
    OverText.innerHTML = "";
    OverText.style.top = 100 + 'px';
    OverText.style.left = 100 + 'px';
    document.body.appendChild(OverText);

    // Over text 1
    // Over text
    OverText1 = document.createElement('div');
    OverText1.style.position = 'absolute';
    OverText1.style.width = 100;
    OverText1.style.height = 100;
    OverText1.innerHTML = "";
    OverText1.style.top = 150 + 'px';
    OverText1.style.left = 100 + 'px';
    document.body.appendChild(OverText1);

    // Sound
    collide_sound = document.createElement('audio');
    var src = document.createElement('source');
    src.src = './sound/collision.mp3';
    collide_sound.appendChild(src);

    missile_sound = document.createElement('audio');
    var src1 = document.createElement('source');
    src1.src = 'sound/Missile.mp3';
    missile_sound.appendChild(src1);

    star_sound = document.createElement('audio');
    var src2 = document.createElement('source');
    src2.src = 'sound/star.mp3';
    star_sound.appendChild(src2);
}

// resizing the window
function onWindowResize() {
	//resize & align
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}

// handling input
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // up
    if (keyCode == 38) {
        if ((player.position.y + ySpeed)<=1.7)
            player.position.y += ySpeed;
    }
    // down
    else if (keyCode == 40) {
        if ((player.position.y - ySpeed)>=-1.75)
            player.position.y -= ySpeed;
    }
    // left 
    else if (keyCode == 37) {
        if ((player.position.x + xSpeed)<=4.1)
        player.position.x += xSpeed;
    }
    // right 
    else if (keyCode == 39) {
        if ((player.position.x - xSpeed)>=-4.1)
        player.position.x -= xSpeed;
    }
    // space bar
    else if (keyCode == 32) {
        if(health>0)
        {
            initMissile(player.getWorldPosition(), Missiles.length);
            missile_sound.play();
        }
    }
    // s key
    else if (keyCode == 83) {
        document.location.reload();
    }
};

// Initializing the camera
function initCamera() {
    camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    camera.position.set(0, 0, -3);
    dVector = scene.position;
    camera.lookAt(scene.position);
}

// Initializing the renderer
function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;//enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Specify the size of the canvas
    renderer.setSize(width, height);
}

// Initializing the controls
function getControls() {
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.zoomSpeed = 0.4;
    controls.panSpeed = 0.4;
    controls1 = new THREE.OrbitControls( camera, renderer.domElement );
}

// Initializing the lights
function initLights() {
    var light = new THREE.PointLight(0xffffff, 1, 0);
    light.position.set(1, 1, 1);
    // light.color.setHex( 0xff0000 );
    scene.add(light);
    var Amlight = new THREE.AmbientLight(0x111111);
    scene.add(Amlight);
}

// Initializing the Meshes
function initMesh() {
    loader = new THREE.OBJLoader();
    initPLayer();
    var enemy;
    enemyflg.push(1);
    enemyflg.push(0);
    enemyflg.push(1);
    enemyflg.push(1);
    enemyflg.push(0);
    for( var i=0; i<maxenemy; i++){
        enemy_x.push(i*0.8);
        enemy_y.push(i*0.5+4);
        enemyshoot.push(0);
        initEnemy(i*0.8, i*0.5+4, i);
    }
    for( var i=1; i<maxenemy; i++){
        enemy_x.push(-1*(i*0.8));
        enemy_y.push(i*0.5+4);
        enemyshoot.push(0);
        initEnemy(-1*(i*0.8),i*0.5+4, i+maxenemy-1);
    }
    y = 4;
    star_x.push(-0.5);
    star_x.push(1);
    star_x.push(-1.3);
    star_x.push(-1);
    star_x.push(1.5);
    star_y.push(1+y);
    star_y.push(1+y);
    star_y.push(0.5 +y);
    star_y.push(1.5 + y);
    star_y.push(1.2 +y);
    for(var i=0;i <5;i++)
    {
        initStar(star_x[i], star_y[i], i);
    }
    console.log(starspool.length);
    console.log(starspool);
    console.log(stars);
}

// Player Mesh
function initPLayer() {
    var textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load('./objects/rafale.jpeg');
    var material = new THREE.MeshPhongMaterial({map: map});
    var objLoader = new THREE.OBJLoader();
    objLoader.load('./objects/rafale.obj', function(object) {
        player = object;
        object.traverse( function ( node ) {

            if ( node.isMesh ) node.material = material;
        
          } );
        object.scale.set(0.2, 0.2, 0.2);
        object.position.set(0, -1.7, 0);
        scene.add(object);
    });
}

// Enemy Mesh
function initEnemy(x, y, j) {
    var textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load('./objects/enemy.jpeg');
    var material = new THREE.MeshPhongMaterial({map: map});
    loader.load('./objects/enemy.obj', function(object) {
        enemygrp[j] = object;
        object.traverse( function ( node ) {

            if ( node.isMesh ) node.material = material;
        
          } );
        object.scale.set(0.1, 0.1, 0.1);
        object.position.set(x, y, 0);
        scene.add(object);
    });
}

// Missile Mesh
function initMissile(a, j) {
    missile_flag.push(0);
    loader.load('./objects/Missile.obj', function(object) {
        Missiles[j] = object;
        object.traverse( function (obj) {
            if (obj.isMesh){
                obj.material.color.set(0xFFB6C1);
              }
          } );
        object.position.copy(a);
        object.scale.set(0.05, 0.05, 0.05);
        scene.add(object);
    })
}

// Star Mesh
function initStar(x, y, j) {
    var textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load('./objects/index.png');
    var material = new THREE.MeshPhongMaterial({map: map});
    loader.load('./objects/star.obj', function(object) {
        starspool[j] = object;
        object.traverse( function (node) {
                if ( node.isMesh ) node.material = material;
          } );
        object.scale.set(0.5, 0.5, 0.5);
        object.position.set(x, y, 0);
        scene.add(object);
    });
}

// Fireball Mesh
function initFireball(a, j) {
    fireball_flag.push(0);
    loader.load('./objects/Fireball.obj', function(object) {
        Fireballs[j] = object;
        object.traverse( function (obj) {
            if (obj.isMesh){
                obj.material.color.set(0xFFB6C1);
              }
          } );
        object.position.copy(a);
        object.scale.set(0.05, 0.05, 0.05);
        scene.add(object);
    })
}

// calculating distance between two objects
function calculateDistance(X, Y) {
    var d = X -Y;
    return Math.sqrt(d*d);
}

// collisions
function collisions() {
    // between player and star
    for(var i=0; i<starspool.length; i++)
    {
        var ps_x = calculateDistance(player.position.x, starspool[i].position.x);
        if(ps_x < 0.45)
        {
            var ps_y = calculateDistance(player.position.y, starspool[i].position.y);
            if(ps_y< 0.3)
            {
                score += 5;
                scoreText.innerHTML = "Score: " + score.toString();
                starspool[i].position.y = star_y[i];
                starspool[i].position.x = star_x[i];
                star_sound.play();
            }
        }
    }

    // between enemy and missile 
    indexs = [];
    for(var i=0; i<Missiles.length; i++)
    {
        if(missile_flag[i] == 0)
        {
            for(var j=0; j<enemygrp.length; j++)
            {
                var me_x = calculateDistance(Missiles[i].position.x, enemygrp[j].position.x);
                if(me_x < 0.18)
                {
                    var me_y = calculateDistance(Missiles[i].position.y, enemygrp[j].position.y);
                    if(me_y <0.2)
                    {
                        missile_flag[i] = 1;
                        scene.remove(Missiles[i]);
                        // indexs.push(i);
                        score += 10;
                        scoreText.innerHTML = "Score: " + score.toString();
                        enemygrp[j].position.y = enemy_y[j]+1;
                        enemygrp[j].position.x = enemy_x[j];
                        collide_sound.play();
                        break;
                    }
                }
            }
        }
    }
    // Missiles = Missiles.filter(function(value, index) {
    //     return indexs.indexOf(index) == -1;
    // // })
    // for(var i=indexs.length-1; i>=0; i--)
    // {
        
    //     Missiles.splice(indexs[i],1);
    // }

    // between enemy and player
    for(var j=0; j<enemygrp.length; j++)
    {
        var pe_x = calculateDistance(player.position.x, enemygrp[j].position.x);
        if(pe_x < 0.4)
        {
            var pe_y = calculateDistance(player.position.y, enemygrp[j].position.y);
            if(pe_y < 0.3)
            {
                if(health -10 >0)
                {
                    health -= 10;
                }
                else
                {
                    health = 0;
                }
                collide_sound.play();
                healthText.innerHTML = "Health: " + health.toString();
                enemygrp[j].position.y = enemy_y[j]+1;
                enemygrp[j].position.x = enemy_x[j];
            } 
        }
    }

    // between player and fireball
    firetoremove = [];
    for(var i=0; i<Fireballs.length; i++)
    {
        if(fireball_flag[i] == 0)
        {
            var pf_x = calculateDistance(player.position.x, Fireballs[i].position.x);
            if(pf_x <0.4)
            {
                var pf_y = calculateDistance(player.position.y, Fireballs[i].position.y);
                if(pf_y<0.3)
                {
                    scene.remove(Fireballs[i]);
                    fireball_flag[i] = 1;
                    // firetoremove.push(i);
                    if(health - 5>0)
                    {
                        health -= 5;
                    }
                    else
                    {
                        health = 0;
                    }
                    healthText.innerHTML = "Health: " + health.toString();
                }
            }
        }
    }
    // Fireballs = Fireballs.filter(function(value, index) {
    //     return firetoremove.indexOf(index) == -1;
    // })
    // for(var i=firetoremove.length-1; i>=0; i--)
    // {
        
    //     Fireballs.splice(firetoremove[i],1);
    // }
}

// Initializing the background
function background() {
    starGeo = new THREE.Geometry();
    for(let i=0;i<6000;i++) {
        let star = new THREE.Vector3(
            Math.random() * 600 - 300,
            Math.random() * 600 - 300,
            Math.random() * 600 - 300
        );
        star.velocity = 0;
        star.acceleration = 0.02;
        starGeo.vertices.push(star);
    }

    let sprite = new THREE.TextureLoader().load('./objects/star.png');
    let starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.7,
        map: sprite
    });
    stars = new THREE.Points(starGeo,starMaterial);
    scene.add(stars);
}

// Rendering the scene
function render() {
    starGeo.vertices.forEach(p => {
        p.velocity += p.acceleration
        p.y -= p.velocity;
        
        if (p.y < -200) {
          p.y = 200;
          p.velocity = 0;
        }
    });
    starGeo.verticesNeedUpdate = true; 
    stars.rotation.y +=0.002;

    delta = clock.getDelta();
    if(health > 0)
    {
        // Movement of Missiles
        indexs = [];
        for(var i =0; i<Missiles.length; i++)
        {
            if( missile_flag[i] == 0)
            {
                if(Missiles[i].position.y + speed * delta <2.1)
                {
                    Missiles[i].position.y +=speed * delta;
                }
                else
                {
                    // indexs.push(i);
                    missile_flag[i] = 1;
                    scene.remove(Missiles[i]);
                }
            }
        }
        // Missiles = Missiles.filter(function(value, index) {
        //     return indexs.indexOf(index) == -1;
        // })
        // for(var i=indexs.length-1 ; i>=0; i--)
        // {
        //     Missiles.splice(indexs[i],1);
        // }

        // Movements of stars
        for(var i =0; i<starspool.length; i++)
        {
            if((starspool[i].position.y - speed*delta)>=-2)
            {
                starspool[i].position.y -= speed * delta;
                starspool[i].position.x += star_xpeed * delta;
            }
            else
            {
                starspool[i].position.y = star_y[i];
                starspool[i].position.x = star_x[i];
            }
        }

        // Movement of enemies
        for(var i=0; i<enemygrp.length; i++)
        {
            if((enemygrp[i].position.y - speed*delta)>=-2)
            {
                enemygrp[i].position.y -= speed*delta;
            }
            else
            {
                enemygrp[i].position.y = enemy_y[i];
                enemygrp[i].position.x = enemy_x[i];
            }
            var abc = enemyflg[i];
            if (abc == 1) // go left
            {
                if((enemygrp[i].position.x + speed*delta)>=4.1)
                {
                    enemygrp[i].position.x -= speed*delta;
                    enemyflg[i] =0;
                }
                else
                {
                    enemygrp[i].position.x += speed*delta;
                }
            }
            else
            {
                if((enemygrp[i].position.x - speed*delta)<=-4.1)
                {
                    enemygrp[i].position.x += speed*delta;
                    enemyflg[i] =1;
                }
                else
                {
                    enemygrp[i].position.x -= speed*delta;
                }
            }
        }
        star_xpeed = star_xpeed*(-1);

        // Creating Fireball
        for(var i=0; i<enemygrp.length; i++)
        {
            if(enemygrp[i].position.y>=-2)
            {
                if(enemygrp[i].position.y<=2)
                {
                    enemyshoot[i] += 1;
                    if((enemyshoot[i]%75)==0)
                    {
                        enemyshoot[i] = 0;
                        initFireball(enemygrp[i].getWorldPosition(), Fireballs.length);
                    }
                }
                else
                {
                    enemyshoot[i] = 0;
                }
            }
            else
            {
                enemyshoot[i] = 0;
            }
        }
        // Movement of Fireballs
        firetoremove = [];
        for(var i =0; i<Fireballs.length; i++)
        {
            if(fireball_flag[i]==0)
            {
                if((Fireballs[i].position.y - speed*delta) >=-2.1)
                {
                    Fireballs[i].position.y -= speed * delta;
                }
                else
                {
                    fireball_flag[i] = 1;
                    // firetoremove.push(i);
                    scene.remove(Fireballs[i]);
                }
            }
        }
        // Fireballs = Fireballs.filter(function(value, index) {
        //     return firetoremove.indexOf(index) == -1;
        // })
        // for(var i=firetoremove.length-1; i>=0; i--)
        // {
        //     console.log(Fireballs[firetoremove[i]] ,Fireballs,firetoremove);
        //     Fireballs.splice(firetoremove[i],1);
        // }
        collisions();
    }
    else
    {
        OverText.innerHTML = ("GAME OVER").fontsize(20);
        OverText1.innerHTML = ("Press s to restart").fontsize(4);
    }
    width = window.innerWidth;
    height = window.innerHeight;
    console.log(width, height);
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
    controls1.update();
}
init();
render();