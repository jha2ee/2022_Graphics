

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    //var vertices = new Float32Array([vec2(-1, -1), vec2(0, 1), vec2(1, -1)]);
	  // var vertices = [ vec2(-1,-1), vec2(0,1), vec2(1,-1)];
    //  Configure WebGL
    var hexagonVertices = [
        vec2(-0.3, 0.6), //v0
        vec2(-0.4, 0.8), //v1
        vec2(-0.6, 0.8), //v2
        vec2(-0.7, 0.6), //v3
        vec2(-0.6, 0.4), //v4
        vec2(-0.4, 0.4), //v5
        vec2(-0.3, 0.6), //v6   
    ];
    
    var triangleVertices = [
        vec2(0.3, 0.4), //v0
        vec2(0.7, 0.4), //v1
        vec2(0.5, 0.8), //v2
    ];
    
    var colors = [
        vec4(1.0, 0.0, 0.0, 1.0), //v0
        vec4(0.0, 1.0, 0.0, 1.0), //v1
        vec4(0.0, 0.0, 1.0, 1.0), //v2
    ];
    
    var stripVertices = [
        vec2(-0.5, 0.2), //v0
        vec2(-0.4, 0.0), //v1
        vec2(-0.3, 0.2), //v2
        vec2(-0.2, 0.0), //v3
        vec2(-0.1, 0.2), //v4
        vec2(0.0, 0.0), //v5
        vec2(0.1, 0.2), //v6
        vec2(0.2, 0.0), //v7
        vec2(0.3, 0.2), //v8
        vec2(0.4, 0.0), //v9
        vec2(0.5, 0.2), //v10
        //start second strip
    
        vec2(-0.5, -0.3), //v0
        vec2(-0.4, -0.5), //v1
        vec2(-0.3, -0.3), //v2
        vec2(-0.2, -0.5), //v3
        vec2(-0.1, -0.3), //v4
        vec2(0.0, -0.5), //v5
        vec2(0.1, -0.3), //v6
        vec2(0.2, -0.5), //v7
        vec2(0.3, -0.3), //v8
        vec2(0.4, -0.5), //v9
        vec2(0.5, -0.3), //v10
    
    ]

    //Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    var vColor = gl.getAttribLocation(program, "vColor");


    // Load the data into the GPU
    // hexagon vertex buffer
    var hexagonBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, hexagonBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(hexagonVertices), gl.STATIC_DRAW );

    // Draw the hexagon
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays(gl.LINE_STRIP, 0, 7);

    // triangle vertex buffer
	var triangleBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, triangleBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(triangleVertices), gl.STATIC_DRAW );

	var triangleColorBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, triangleColorBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBufferId);
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBufferId);
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );

    gl.enableVertexAttribArray( vPosition );
    gl.enableVertexAttribArray( vColor );
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    /////////////////
    // strip vertex buffer
    var stripBUfferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, stripBUfferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(stripVertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, stripBUfferId);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.disableVertexAttribArray(vColor);
    gl.vertexAttrib4f(vColor, 1.0, 1.0, 0.0, 1.0);

    // draw triangle-strip filled with yellow
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 11);
    // draw triangle-strip with line of black
    gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.LINE_STRIP, 0, 11);

    // draw another triangle-strip
    gl.drawArrays(gl.LINE_STRIP, 11, 11);

    
    //render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
}
