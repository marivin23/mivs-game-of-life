import { extend } from 'react-three-fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import glsl from 'babel-plugin-glsl/macro'

const ColorShiftMaterial = shaderMaterial(
  { 
        u_time: {type:'f', value: 0}, 
        u_resolution: new THREE.Vector2(0,0), 
        color: new THREE.Color(0.2, 0.0, 0.1) 
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


uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 color;
varying vec2 vUv;

void main(){
  vec2 coord = vUv;
  vec3 color = vec3(0.0);
  vec2 translate = vec2(-0.5);
  coord += translate;

  color.r += abs(0.1 + length(coord) - 0.6 * abs(sin(u_time * 0.9 / 12.0)));
  color.g += abs(0.1 + length(coord) - 0.6 * abs(sin(u_time * 0.6 / 4.0)));
  color.b += abs(0.1 + length(coord) - 0.6 * abs(sin(u_time * 0.3 / 9.0)));

  gl_FragColor = vec4(0.1 / color, 1.0);


}
`
)

export default ColorShiftMaterial
