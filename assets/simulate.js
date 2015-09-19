/**
 * This file makes simulating page
 */

$(document).ready(function(){
   
});

var gl; // A global variable for the WebGL context

function start() {
  var canvas = document.getElementById("glcanvas");

  gl = initWebGL(canvas);      // Initialize the GL context
  
  // Only continue if WebGL is available and working
  
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 0.5);                      // Set clear color to black, fully opaque
    gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
    gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
  }
  
  function initWebGL(canvas) {
	  gl = null;
	  
	  try {
	    // Try to grab the standard context. If it fails, fallback to experimental.
	    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	  }
	  catch(e) {}
	  
	  // If we don't have a GL context, give up now
	  if (!gl) {
	    alert("Unable to initialize WebGL. Your browser may not support it.");
	    gl = null;
	  }
	  else
		  alert("Success to initialize WebGL. Your browser support it.");
	  
	  return gl;
	}
    
     str="";
    for(var i = 0; i<inputArr.length;i++){
        str+=inputArr[i].text+" : ";

        for(var j=0;j<inputArr[i].length;j++){
            str+=inputArr[i].outputList[j].text+" / ";
        }
        str+="\n";
    }
    prompt(inputArr[0].getID());
}