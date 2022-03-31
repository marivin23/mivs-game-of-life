import { extend } from 'react-three-fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import glsl from 'babel-plugin-glsl/macro'

const ColorShiftMaterial = shaderMaterial(
  { 
        u_time: {type:'f', value: 0}, 
        u_resolution: {type:'vec2', value: new THREE.Vector2(0,0)},
        u_mouse: {type:'vec2', value: new THREE.Vector2(0,0)},
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

  

precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform bool u_is_hovered;
uniform bool u_is_selected;

varying vec2 vUv;

#define NUM_OCTAVES 10


mat3 rotX(float a) {
	float c = cos(a);
	float s = sin(a);
	return mat3(
		1, 0, 0,
		0, c, -s,
		0, s, c
	);
}
mat3 rotY(float a) {
	float c = cos(a);
	float s = sin(a);
	return mat3(
		c, 0, -s,
		0, 1, 0,
		s, 0, c
	);
}

float random(vec2 pos) {
	return fract(sin(dot(pos.xy, vec2(1399.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 pos) {
	vec2 i = floor(pos);
	vec2 f = fract(pos);
	float a = random(i + vec2(0.0, 0.0));
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 pos) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100.0);
	mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
	for (int i=0; i<NUM_OCTAVES; i++) {
		v += a * noise(pos);
		pos = rot * pos * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

void main(void) {
	vec2 p = (gl_FragCoord.xy * 3.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

	float t = 0.0, d;

	float time2 = 3.0 * u_time / 2.0;
    // we do hovered or not if 
    float hoveredFloat = 0.0;

    if(u_is_selected){
        hoveredFloat = 1.0;
    }
	vec2 q = vec2(0.0);
	q.x = fbm(p + 0.00 * time2);
	q.y = fbm(p + vec2(1.0));
	vec2 r = vec2(0.0);
	r.x = fbm(p + 1.0 * q + vec2(1.7, 9.2) + 0.15 * time2);
	r.y = fbm(p + 1.0 * q + vec2(8.3, 2.8) + 0.126 * time2);
	float f = fbm(p + r);
	vec3 color = mix(
		vec3(1.101961, 3.0, 2),
		vec3(.466667, 1.0, 0.666667),
		clamp((f * f) * 4.0, 0.0, 1.0)
	);

	color = mix(
		color,
		vec3(0.737, 0.188, 0.874),
		clamp(length(q), 0.0, 1.0)
	);

	color = mix(
		color,
		vec3(0.878, 1, 0.309),
		clamp(length(r.x), 1.0, hoveredFloat)
	);

	color = (f *f * f + 0.6 * f * f + 0.5 * f) * color;

	gl_FragColor = vec4(color, 1.0);
}


`)

export default ColorShiftMaterial
