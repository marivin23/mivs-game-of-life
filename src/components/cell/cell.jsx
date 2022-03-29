import { useState, useRef } from 'react'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import glsl from 'glslify'


const WaveShaderMaterial = shaderMaterial(
    // Uniform 
    {},
    // Vertex Shader 
    glsl``,
    // Fragment Shader
    glsl``
)

extend({ WaveShaderMaterial });

// isAlive, position, size 
const Cell = (props) => {
    const ref = useRef()
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    
    let color = null

    if(props.cell.neighbourSum === 3) color = 'red'
    if(props.cell.neighbourSum === 2) color = 'orangered'
    if(props.cell.neighbourSum < 2 || props.cell.neighbourSum > 3) color = 'tomato'
// <meshLambertMaterial color={(props.cell.isAlive ? color : 'black')}/>
    return <group>
        <mesh
            ref={ref}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}
            position={[props.position.x, props.position.y, props.position.z]}
        >
            <WaveShaderMaterial/>
            <planeBufferGeometry args={[props.size,props.size]}/>
        </mesh>
    </group>
}

export default Cell
