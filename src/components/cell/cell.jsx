import { useState, useRef, useMemo } from 'react'
import { extend, useFrame } from '@react-three/fiber'

import * as THREE from 'three'

const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif


uniform vec2 u_resolution;
uniform float u_time;
uniform float cell_x;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

void main() {
    vec3 color = vec3(0.0);

    float pct = abs(sin(u_time + cell_x));

    // Mix uses pct (a value from 0-1) to
    // mix the two colors
    color = mix(colorA, colorB, pct);

    gl_FragColor = vec4(color, 1.0);
}
`

// isAlive, position, size 
const Cell = (props) => {
    const ref = useRef()
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)

    let color = null
    const uniforms = {
        u_time: {type: 'float', value: 0},
        position: {type: 'vec2', value: 0},
        cell_x: {type: 'float', value: props.cell.x},
        cell_y: {type: 'float', value: props.cell.y}
    }
// from what i understand threejs doesent play well with changing uniforms so we need em memoized
    useFrame((state) => {
        if(props.cell.isAlive){
            ref.current.material.uniforms.u_time.value = state.clock.elapsedTime
            ref.current.material.uniforms.cell_x = props.cell.x
        }
    })
// <meshLambertMaterial color={(props.cell.isAlive ? color : 'black')}/>
    if(props.cell.neighbourSum === 3) color = 'red'
    if(props.cell.neighbourSum === 2) color = 'orangered'
    if(props.cell.neighbourSum < 2 || props.cell.neighbourSum > 3) color = 'tomato'
    
    //shader input variables basically 

    return <group>
        <mesh
            ref={ref}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}
            position={[props.position.x, props.position.y, props.position.z]}
        >
            <planeBufferGeometry args={[props.size,props.size]}/>

        {props.cell.isAlive && <shaderMaterial
                attach="material"
                args={[{
                    uniforms: uniforms,
                    fragmentShader: fragmentShader,
                }]}
            />}
        {!props.cell.isAlive && <meshLambertMaterial color={'black'}/>
}
        </mesh>
    </group>
}

export default Cell
