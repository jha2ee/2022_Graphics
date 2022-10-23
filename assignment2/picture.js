var gl;
var program;
var clickVBufferId;
var clickCBufferId;
var vBufferId;
var cBufferId;

var speed = 0.008;
var frame = 0;
var moving = true;
var direction = 1;
var day = true;
var loc = [];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    //Set the alpha value of a color to blend with other colors
    gl.enable(gl.BLEND);
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
  
    
    /* Create buffer to draw line */
    vBufferId = gl.createBuffer(); //좌표 지정
    /* Create buffer for color */
    cBufferId = gl.createBuffer(); // 색칠하기
    /* Create buffer for click */
    clickVBufferId = gl.createBuffer(); //클릭 좌표
    clickCBufferId = gl.createBuffer(); //클릭 색깔

    var playBtn = document.getElementById("play");
    playBtn.addEventListener("click",function(event){
        console.log(moving);
        if (!moving) {
            this.textContent = "Stop";
        }
        else this.textContent = "Play";
      moving = !moving;

    });

    var timeBtn = document.getElementById("time");
    timeBtn.addEventListener("click",function(event){
        day = !day;
    });

    var directionBtn = document.getElementById("direction");
    directionBtn.addEventListener("click",function(event){
        direction *= -1;
    });

    canvas.addEventListener("click", function(event) {
        // location is uniform value
        var location = vec4(2 * event.clientX / canvas.width - 1,
            2 * (canvas.height - event.clientY) / canvas.height - 1,
            0, 0);
        loc.push(location);

    });
    /* webgl-animation */
    requestAnimationFrame(drawScene);

};

function setObject(vBufferId, cBufferId, vertices, color, count, primitive, offset, program ) {
    /* Create buffer to draw line 
    Load the data into the GPU */
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var uOffset = gl.getUniformLocation(program, "uOffset");
    gl.uniform4fv(uOffset, offset);

    /* Create buffer for color */
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
  
    var vColor = gl.getAttribLocation(program, "vColor");
    if (typeof (color[0]) == 'object') { // When composed of multiple colors
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        gl.bufferData(gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW);
    }
    else { //For single color
        gl.disableVertexAttribArray(vColor);
        gl.vertexAttrib4fv(vColor, color);
    }

    gl.drawArrays(primitive, 0, count);
}

function drawScene() {
    /* 4) Define the color of background */
    if (day) {
        gl.clearColor( 0.292, 0.468, 0.750, 1.0 );
    }
    else {
        gl.clearColor( 0.015, 0.015, 0.015, 0.9 );
    }

    gl.clear(gl.COLOR_BUFFER_BIT);

    /* Draw 3 mountains */
    setObject(vBufferId, cBufferId, mtn, mtnColor, 9, gl.TRIANGLES, [0, 0, 0, 0], program);

    /* Draw water */
    setObject(vBufferId, cBufferId, water, waterColor, 4, gl.TRIANGLE_STRIP, [0, 0, 0, 0], program);
    
    /* Draw 3 clouds */
    var offset;
    if (direction) offset = [(frame * speed) % 6 - 0.8, 0, 0, 0];
    else offset = [(frame * speed) % 6 + 1, 0, 0, 0];

    if (moving) {
        frame += direction;
    }
    setObject(vBufferId, cBufferId, cld, cldColor, 30, gl.TRIANGLES, offset, program);    
    
    /* Draw bridge */
    setObject(vBufferId, cBufferId, bridge, brgColor, 4, gl.TRIANGLE_STRIP, [0, 0, 0, 0], program);
    setObject(vBufferId, cBufferId, bridge, brgColor, 4, gl.TRIANGLE_STRIP, [0, 0.05, 0, 0], program);
    for (var i = 0; i < 2; i += 0.33) {
        setObject(vBufferId, cBufferId, pillar, brgColor, 6, gl.TRIANGLES, [i, 0, 0, 0], program);
    }
    for (var i = 0; i < 2; i += 0.33) {
        setObject(vBufferId, cBufferId, lines, brgColor, 10, gl.LINE_STRIP, [-1 + i, 0, 0, 0], program);
    }

    /* Draw 3 lands */
    setObject(vBufferId, cBufferId, land, landColor, 9, gl.TRIANGLES, [0, 0, 0, 0], program);
    

    /* Draw 2 trees */
    setObject(vBufferId, cBufferId, tree, treeColor, 5, gl.TRIANGLE_FAN, [0, 0, 0, 0], program);
    setObject(vBufferId, cBufferId, tree2, treeColor2, 5, gl.TRIANGLE_FAN, [0, 0, 0, 0], program);
    setObject(vBufferId, cBufferId, log, logColor, 4, gl.TRIANGLE_STRIP, [0, 0, 0, 0], program);
    setObject(vBufferId, cBufferId, log2, logColor, 4, gl.TRIANGLE_STRIP, [0, 0, 0, 0], program);

    /* Draw bufferflies */
    for(var i=0; i < loc.length; i++) {
        setObject(clickVBufferId, clickCBufferId, bufferflies, bfColor, 6, gl.TRIANGLES, flatten(loc[i]), program);
    }
    
    window.requestAnimationFrame(drawScene);

}

/* Vertex & Color */

//mountain
/* 
2) Render at least 10 primitives with at least three different geometries
3) Use more than 3 colors to set the colors of the primitives */
// [1] mountain 
var mtn = [
    vec2(-1.0, 0), 
    vec2(-0.5, 0.5),
    vec2(0, 0),

    vec2(0, 0),
    vec2(0.5, 0.5),
    vec2(1.0, 0),

    vec2(-0.5, 0),
    vec2(0, 0.7),
    vec2(0.5, 0),
]

var mtnColor = [
    vec4(0.853, 0.895, 0.980, 1), //v3
    vec4(0.442, 0.508, 0.640, 1), //v4
    vec4(0.400, 0.513, 0.740, 1), //v5

    vec4(0.853, 0.895, 0.980, 1), //v3
    vec4(0.442, 0.508, 0.640, 1), //v4
    vec4(0.400, 0.513, 0.740, 1), //v5

    vec4(0.331, 0.356, 0.580, 1), //v0
    vec4(0.650, 0.473, 0.403, 1), //v1
    vec4(0.442, 0.508, 0.640, 1), //v2

]

// [2] cloud
var cld = [
    //1
    vec2(-0.8, 0.5),
    vec2(-0.8, 0.35),
    vec2(-0.2, 0.5),
    vec2(-0.2, 0.5),
    vec2(-0.8, 0.35),
    vec2(-0.2, 0.35),
    
    vec2(-0.4, 0.6),
    vec2(-0.4, 0.5),
    vec2(-0.2, 0.6),
    vec2(-0.2, 0.6),
    vec2(-0.4, 0.5),
    vec2(-0.2, 0.5),

    //2
    vec2(0.25, 0.3),
    vec2(0.25, 0.2),        
    vec2(0.8, 0.3),
    vec2(0.8, 0.3),
    vec2(0.25, 0.2),
    vec2(0.8, 0.2),


    //3
    vec2(0.63, 0.7),
    vec2(0.63, 0.45),
    vec2(1.3, 0.7),
    vec2(1.3, 0.7),
    vec2(0.63, 0.45),
    vec2(1.3, 0.45),

    vec2(0.72, 0.7),
    vec2(1.0, 0.7),
    vec2(0.72, 0.8),
    vec2(0.72, 0.8),
    vec2(1.0, 0.7),
    vec2(1.0, 0.8),
]

var cldColor = [
    vec4(1, 1, 1, 1),
    vec4(0.970, 0.980, 1.00, 1),
    vec4(0.882, 0.915, 0.980, 0.7),
    vec4(0.672, 0.715, 0.800, 0.8),

    vec4(1, 1, 1, 1),
    vec4(0.970, 0.980, 1.00, 1),
    vec4(0.882, 0.915, 0.980, 0.7),
    vec4(0.672, 0.715, 0.800, 0.7),

    vec4(1, 1, 1, 1),
    vec4(0.970, 0.980, 1.00, 1),
    vec4(0.882, 0.915, 0.980, 0.7),
    vec4(0.672, 0.715, 0.800, 0.7),

    vec4(1, 1, 1, 1),
    vec4(0.970, 0.980, 1.00, 1),
    vec4(0.882, 0.915, 0.980, 0.7),
    vec4(0.672, 0.715, 0.800, 0.7),

    vec4(1, 1, 1, 1),
    vec4(0.563, 0.698, 0.970, 1),
    vec4(0.882, 0.915, 0.980, 0.7),
    vec4(0.672, 0.715, 0.800, 0.7),

    vec4(1, 1, 1, 1),
    vec4(0.970, 0.980, 1.00, 1),
    vec4(0.882, 0.915, 0.980, 0.7),
    vec4(0.970, 0.980, 1.00, 0.7),   
]

// [3] tree
var tree = [
    //1
    vec2(-0.6, 0.9),
    vec2(-0.7, -0.3),
    vec2(-0.65, -0.32),
    vec2(-0.55, -0.32),
    vec2(-0.5, -0.3),
]
var tree2 = [
    //2
    vec2(0.8, 2),
    vec2(0.6, -0.3),
    vec2(0.7, -0.32),
    vec2(0.9, -0.32),
    vec2(1.0, -0.3),
]

var treeColor = [
    vec4(0.360, 0.530, 0.377, 1),
    vec4(0.0108, 0.270, 0.0367, 1),
    vec4(0.211, 0.540, 0.244, 1),
    vec4(0.211, 0.540, 0.244, 1),
    vec4(0.211, 0.540, 0.244, 1),
]

var treeColor2 = [   
    vec4(0.360, 0.530, 0.377, 1),
    vec4(0.0108, 0.270, 0.0367, 1),
    vec4(0.211, 0.540, 0.244, 1),
    vec4(0.211, 0.540, 0.244, 1),
    vec4(0.211, 0.540, 0.244, 1),
]

var log = [
    vec2(-0.63, -0.32),
    vec2(-0.63, -0.5),
    vec2(-0.58, -0.32),
    vec2(-0.58, -0.5),
]

var log2 = [
    vec2(0.75, -0.32),
    vec2(0.75, -0.72),
    vec2(0.85, -0.32),
    vec2(0.85, -0.72),
]

var logColor = [
    vec4(0.280, 0.0280, 0.0322, 1),
    vec4(0.280, 0.0280, 0.0322, 1),
    vec4(0.280, 0.0280, 0.0322, 1),
    vec4(0.140, 0.0182, 0.0202, 1),
]

// [4] water
var water = [
    vec2(-1.0, 0),
    vec2(-1.0, -1.0),
    vec2(1,0, 0),
    vec2(1.0, -1.0),
]

var waterColor = [
    vec4(0.764, 0.883, 0.980, 1),
    vec4(0.120, 0.604, 1.00, 1),
    vec4(0.0672, 0.308, 0.480, 1),
    vec4(0.120, 0.604, 1.00, 1),
]

// [5] land
var land = [
    vec2(-1.0, 0),
    vec2(-0.4, -0.5),
    vec2(-1.0, -0.7),

    vec2(1.0, 0.13),
    vec2(0.25, 0),
    vec2(1.0, -0.36),

    vec2(1.0, -0.52),
    vec2(0.2, -1.0),
    vec2(1.0, -1.0),
]

var landColor = [
    vec4(0.535, 0.720, 0.238, 1),
    vec4(0.535, 0.720, 0.238, 1),
    vec4(0.304, 0.470, 0.0376, 1),

    vec4(0.0840, 0.560, 0.266, 1),
    vec4(0.0840, 0.560, 0.266, 1),
    vec4(0.228, 0.350, 0.274, 1),

    vec4(0.244, 0.530, 0.354, 1),
    vec4(0.244, 0.530, 0.354, 1),
    vec4(0.228, 0.350, 0.274, 1),
]

// [6] bridge
var bridge = [
    vec2(-1.0, 0.18),
    vec2(-1.0, 0.15),
    vec2(1.0, 0.18),
    vec2(1.0, 0.15),
]

var brgColor = vec4(0.730, 0.292, 0.292, 1)

var pillar = [
    vec2(-1.0, 0.15),
    vec2(-1.0, 0.0),
    vec2(-0.95, 0.15),

    vec2(-0.95, 0.15),
    vec2(-1.0, 0.0),
    vec2(-0.95, 0.0),
]

var lines = [
    vec2(-1.0, 0.1),
    vec2(-0.85, 0.15),

    vec2(-0.67, 0.1),
    vec2(-0.385, 0.15),

    vec2(-0.17, 0.1),
    vec2(0.0, 0.15),

    vec2(0.17, 0.1),
    vec2(0.385, 0.15),
    
    vec2(0.67, 0.1),
    vec2(0.85, 0.15),

]

var bufferflies = [
    vec2(0.0, 0.0),
    vec2(-0.03, 0.03),
    vec2(-0.03, -0.03),

    vec2(0.0, 0.0),
    vec2(0.03, -0.03),
    vec2(0.03, 0.03),
]

var bfColor = [
    vec4(1.00, 0.666, 0.0900), //tangerine
    vec4(1.00, 0.952, 0.0500, 1), //yellow
    vec4(0.860, 0.820, 0.0516, 1), //yellow2
    
    vec4(0.938, 0.528, 0.960, 1), //pink
    vec4(1.00, 0.952, 0.0500, 1), //yellow
    vec4(0.860, 0.820, 0.0516, 1), //yellow2
]
