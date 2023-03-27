"use strict";

function main()
{
  
  const gl = document.querySelector("canvas").getContext("webgl");
  //canvas.height = window.innerHeight;
  //canvas.width = window.innerWidth;
  

  if (!gl) {
    return;
  }
  
//   const sky_vs = `
//   attribute vec4 a_position;
//   varying vec4 v_position;
//   void main() {
//   v_position = a_position;
//   gl_Position = a_position;
//   gl_Position.z = 1.0;
//   }
//   `;
//   const sky_fs = `
//   precision mediump float;

//   uniform samplerCube u_skybox;
//   uniform mat4 u_viewDirectionProjectionInverse;

//   varying vec4 v_position;
//   void main() {
//   vec4 t = u_viewDirectionProjectionInverse * v_position;
//   gl_FragColor = textureCube(u_skybox, normalize(t.xyz / t.w));
//   }
//   `;


//   const env_vs = `
//   precision mediump float;
//   uniform mat4 projection;
//   uniform mat4 view;
//   uniform mat4 world;
  
//   attribute vec4 position;
//   attribute vec3 normal;
  
//   varying vec3 v_worldPosition;
//   varying vec3 v_worldNormal;

//   void main() {
//     gl_Position = projection * view * world * position;
//     v_worldPosition = (world * position).xyz;
//     v_worldNormal = mat3(world) * normal;
//   }
//   `;
//  const env_fs = `
 
//  precision mediump float;
//  varying vec3 v_worldNormal;
//  varying vec3 v_worldPosition;

// uniform samplerCube u_texture;
// uniform vec3 u_worldCameraPosition;

// void main() {
//   vec3 worldNormal = normalize(v_worldNormal);
//   vec3 eyeToSurfaceDir = normalize(v_worldPosition - u_worldCameraPosition);
//   vec3 direction = reflect(eyeToSurfaceDir,worldNormal);
//   gl_FragColor = textureCube(u_texture, direction);
//   }
//   `;

  // const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  // gl.shaderSource(vertexShader,vs);

  // gl.compileShader(vertexShader);
  // if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  //   throw new Error(gl.getShaderInfoLog(vertexShader))
  // };

  // const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  // gl.shaderSource(fragmentShader,fs);

  // gl.compileShader(fragmentShader);
  // if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  //   throw new Error(gl.getShaderInfoLog(fragmentShader))
  // };

  // const sky_program = gl.createProgram();
  // gl.attachShader(program, vertexShader);
  // gl.attachShader(program, fragmentShader);

  // gl.linkProgram(sky_program);
  // if (!gl.getProgramParameter(sky_program, gl.LINK_STATUS)) {
  //   throw new Error(gl.getProgramInfoLog(sky_program))
  // };





 var sky_program = webglUtils.createProgramInfo(gl, ["sky_vs", "sky_fs"]);
 var env_program = webglUtils.createProgramInfo(gl, ["env_vs", "env_fs"]);


 const cubeBufferInfo = primitives.createCubeBufferInfo(gl, 1);
 const quadBufferInfo = primitives.createXYQuadBufferInfo(gl);
 
 

  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

  const faceInfos = [
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-x.jpg',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-x.jpg',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-y.jpg',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-y.jpg',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-z.jpg',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-z.jpg',
    },
  ];
  faceInfos.forEach((faceInfo) => {
    const {target, url} = faceInfo;

    // Upload the canvas to the cubemap face.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 512;
    const height = 512;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;

    // setup each face so it's immediately renderable
    gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

    // Asynchronously load an image
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = url;
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(target, level, internalFormat, format, type, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    });
  });


  // var positionLocation = gl.getAttribLocation(program,"a_position");
  // //var normalLocation = gl.getAttribLocation(program,"normal");

  // var skyboxLocation = gl.getUniformLocation(program, "u_skybox");
  // var viewDirectionProjectionInverseLocation =
  // gl.getUniformLocation(program, "u_viewDirectionProjectionInverse");

//   var modelLocation = gl.getUniformLocation(program,"model");
//   var viewLocation = gl.getUniformLocation(program,"view");
//   var projectionLocation = gl.getUniformLocation(program,"projection");
//   var textureLocation = gl.getUniformLocation(program, "u_texture");
//   var worldCameraPositionLocation = gl.getUniformLocation(program, "u_worldCameraPosition");
  
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var fieldOfViewRadians = degToRad(60);
  var cameraYRotationRadians = degToRad(0);

  var spinCamera = true;
  const fpsElem = document.querySelector("#fps");
  var then = 0;

  requestAnimationFrame(drawScene);

  function drawScene(time) {
   
    time *= 0.001;
    
    var deltaTime = time - then;
 
    then = time;
    const fps = 1 / deltaTime;    
   // if(fpsElem){         // compute frames per second
    fpsElem.textContent = fps.toFixed(1);
    //}

    //webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

   
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

   
    var cameraPosition = [Math.cos(time * .1) * 2, 0, Math.sin(time * .1) * 2];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
   
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    var viewMatrix = m4.inverse(cameraMatrix);

    var worldMatrix = m4.xRotation(time * 0.11);

   
    var viewDirectionMatrix = m4.copy(viewMatrix);
    viewDirectionMatrix[12] = 0;
    viewDirectionMatrix[13] = 0;
    viewDirectionMatrix[14] = 0;

    var viewDirectionProjectionMatrix = m4.multiply(
        projectionMatrix, viewDirectionMatrix);
    var viewDirectionProjectionInverseMatrix =
        m4.inverse(viewDirectionProjectionMatrix);

    
    gl.depthFunc(gl.LESS); 
    gl.useProgram(env_program.program);
    webglUtils.setBuffersAndAttributes(gl, env_program, cubeBufferInfo);
    webglUtils.setUniforms(env_program, {
      u_world: worldMatrix,
      u_view: viewMatrix,
      u_projection: projectionMatrix,
      u_texture: texture,
      u_worldCameraPosition: cameraPosition,
    });
    webglUtils.drawBufferInfo(gl, cubeBufferInfo);

    // draw the skybox

    // let our quad pass the depth test at 1.0
    gl.depthFunc(gl.LEQUAL);

    gl.useProgram(sky_program.program);
    webglUtils.setBuffersAndAttributes(gl, sky_program, quadBufferInfo);
    webglUtils.setUniforms(sky_program, {
      u_viewDirectionProjectionInverse: viewDirectionProjectionInverseMatrix,
      u_skybox: texture,
    });
    webglUtils.drawBufferInfo(gl, quadBufferInfo);

    requestAnimationFrame(drawScene);
  }
}

main();
