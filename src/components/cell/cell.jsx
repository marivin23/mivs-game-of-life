import { useState, useRef, useMemo, useEffect } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import ColorShiftMaterial from './CostumShaderMaterial'
import * as THREE from 'three'
import { animated } from "@react-spring/three";
import { useTransition, config } from "@react-spring/core"
extend({ ColorShiftMaterial })

// isAlive, position, size 
const Cell = (props) => {
    const ref = useRef()
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    const [isMounted, setIsMounted] = useState(false)


    const transition = useTransition(isMounted, {
        from: { scale: 0 }, 
        enter: { scale: 1 },
        leave: { scale: 0 },
        reverse: isMounted,
        delay: 100,
        onRest: () => setIsMounted(!isMounted),
        config: config.molasses,
  })
    useEffect(() => {
        // on mount
        setIsMounted(!isMounted)
    }, [props.cell, isMounted])

   // from what i understand threejs doesent play well with changing uniforms so we need em memoized
    useFrame((state) => {
        if(ref.current?.material && props.cell.isAlive){
            ref.current.material.uniforms.u_time.value = state.clock.elapsedTime; 
            ref.current.material.uniforms.u_resolution.value = new THREE.Vector2(props.screenW, props.screenH)
            ref.current.material.uniforms.u_mouse.value = state.mouse
            ref.current.material.uniforms.u_is_hovered.value = hovered
            ref.current.material.uniforms.u_is_selected.value = clicked
            ref.current.material.uniforms.u_speed.value = new THREE.Vector2(0.2,0.2)
            ref.current.material.uniforms.u_shift.value = 3.0
        }

        // scale the cell based on passed time 
        if (state.clock.elapsedTime % 4 > 3){
            //ref.current.scale.set(ref.current.scale - new THREE.Vector3(0.000001,0.000001,0.000001))
        }
    })
    return transition((style, item) => item && <animated.mesh
            ref={ref}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}
            position={[props.position.x, props.position.y, props.cell.isAlive ? props.position.z + 1 : props.position.z]}
            scale={style.scale}
    >
            <planeBufferGeometry attach="geometry" args={[props.size,props.size]}/>

        {props.cell.isAlive && <colorShiftMaterial attach="material" color="red" /> }

        {!props.cell.isAlive && <meshLambertMaterial color={'black'}/>}
        </animated.mesh> 
        
        )
    
}

export default Cell
