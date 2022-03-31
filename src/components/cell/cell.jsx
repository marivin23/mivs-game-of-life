import { useState, useRef, useMemo } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import ColorShiftMaterial from './CostumShaderMaterial'

import * as THREE from 'three'

extend({ ColorShiftMaterial })

// isAlive, position, size 
const Cell = (props) => {
    const ref = useRef()
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)

// from what i understand threejs doesent play well with changing uniforms so we need em memoized
    useFrame((state) => {
        if(props.cell.isAlive){
            ref.current.material.uniforms.u_time.value = state.clock.elapsedTime; 
            ref.current.material.uniforms.u_resolution.value = new THREE.Vector2(props.screenW, props.screenH)
            ref.current.material.uniforms.u_mouse.value = state.mouse
            ref.current.material.uniforms.u_is_hovered.value = hovered
            ref.current.material.uniforms.u_is_selected.value = clicked
        }
    })

// <meshLambertMaterial color={(props.cell.isAlive ? color : 'black')}/>

    let color = null
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

        {props.cell.isAlive && <colorShiftMaterial attach="material" color="red" /> }

        {!props.cell.isAlive && <meshLambertMaterial color={'black'}/>
}
        </mesh>
    </group>
}

export default Cell
