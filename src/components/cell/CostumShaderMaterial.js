import { extend } from 'react-three-fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import glsl from 'babel-plugin-glsl/macro'

const ColorShiftMaterial = shaderMaterial(
  { 
        u_time: {type:'f', value: 0.0}, 
        u_resolution: {type:'vec2', value: new THREE.Vector2(0,0)},
        u_mouse: {type:'vec2', value: new THREE.Vector2(0,0)},
        u_speed: {type:'vec2', value: new THREE.Vector2(0,0)},
        u_shift: {type:'f', value: 0.0},
        u_is_hovered: {type:'bool', value: false},
        u_is_selected: {type:'bool', value: false}
    },
  // vertex shader
  glsl`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  glsl`

  

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform bool u_is_hovered;
uniform bool u_is_selected;
uniform vec2 u_speed;
uniform float shift;
varying vec2 vUv;


float rand(vec2 n) {
    return fract(cos(dot(n, vec2(2.9898, 20.1414))) * 5.5453);
}

float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.000002), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}
  
float fbm(vec2 n){
    float total=0.,amplitude=2.5;
    for(int i=0;i<18;i++){
        total+=noise(n)*amplitude;
        n+=n;
        amplitude*=.45;
    }
	return total;
}
  
        
void main(void){
    
    vec3 oneTrueColor = vec3(188./255.,48./255.,223./255.);
   
    if(u_is_selected) {
        oneTrueColor = vec3(224./255.,255./255.,79./255.);
    }
    // the weights to calculate the colors based on THE *wait for it* ONE TRUE COLOR *the crowd gasps*
    vec3 dark = vec3(0.3,0.3,0.3);
    vec3 dark2 = vec3(0.1,0.1,0.1);
    vec3 normal = vec3(0.5,0.5,0.5);
    vec3 light = vec3(0.6,0.6,0.6);
    vec3 light2 = vec3(0.7,0.7,0.7);
    vec3 enhance_brightness = vec3(1.3,1.3,1.3);
    // the colors used in the shader 
    vec3 original = oneTrueColor * normal;
    vec3 darkened = oneTrueColor * dark;
    vec3 darkened2 = oneTrueColor * dark2;
    vec3 lighter = original * light;
    vec3 lighter2 = oneTrueColor * light2;


    vec3 c;

    vec2 p=gl_FragCoord.xy*10./u_resolution.xx;
    float q=fbm(p-u_time*0.3);
    vec2 r=vec2(fbm(p+q+u_time*u_speed.x-p.x-p.y),fbm(p+q-u_time*u_speed.y));
    
    if(u_is_selected){
        c=mix(lighter,lighter2,fbm(p+r))+mix(lighter,darkened,r.x);
    }else{
        c=mix(original,lighter,fbm(p+r))+mix(lighter,darkened,r.x);
    }
    // if its the active color we brighten it a bit so it glows 

    float grad=gl_FragCoord.y/u_resolution.y;
    gl_FragColor=vec4(c*cos(shift*gl_FragCoord.y/u_resolution.y),333.5);
    gl_FragColor.xyz*=1.30-grad;
}


`)

export default ColorShiftMaterial
