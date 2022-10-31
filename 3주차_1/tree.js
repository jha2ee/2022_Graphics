var gl;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
	/* leaves */
	var leaves = [
		vec2(0, 1), //v0
        vec2(-0.6, 0.5), //v1
        vec2(0.6, 0.5), //v2

        vec2(0.0, 0.5), //v3
        vec2(-0.6, 0.0), //v4
        vec2(0.6, 0.0), //v5

        vec2(0.0, 0.0), //v6 
		vec2(-0.6, -0.5), //v7
        vec2(0.6, -0.5), //v8
	];
	
	/* log */
	var log = [
		vec2(-0.2, -0.5), //v0
        vec2(-0.2, -1.0), //v1
        vec2(0.2, -1.0), //v2

        vec2(0.2, -1.0), //v3
        vec2(0.2, -0.5), //v4
        vec2(-0.2, -0.5), //v5
	];
	
	//  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	//var uColor = gl.getUniformLocation( program, "uColor" );

    // Load the data into the GPU
	/* leaf vertex buffer */
    var leavesBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, leavesBufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(leaves), gl.STATIC_DRAW );

	// Draw the leaves 
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	var uColor = gl.getUniformLocation( program, "uColor");
	gl.uniform4f( uColor, 0.0, 1.0, 0.0, 1.0 ); // color Green
	gl.drawArrays( gl.TRIANGLES, 0, 9);
	
	/* log vertex buffer */
	var logBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, logBufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(log), gl.STATIC_DRAW );

	// Draw the log
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	gl.uniform4f( uColor, 0.5, 0.25, 0.0, 1.0 ); // color Brown
	gl.drawArrays( gl.TRIANGLES, 0, 6);
};

/* 
function render() {
    gl.drawArrays( gl.TRIANGLES, 0, 6);
}
*/