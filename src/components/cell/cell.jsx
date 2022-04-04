import { useState, useRef, useMemo, useEffect } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import ColorShiftMaterial from './CostumShaderMaterial'
import * as THREE from 'three'
import { animated } from "@react-spring/three";
import { useTransition, useSpring, config } from "@react-spring/core"
extend({ ColorShiftMaterial })

// isAlive, position, size 
const Cell = (props) => {
    const ref = useRef()
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    const [show, setShow] = useState(false)

// use a state, pass the cycle time via props, change state via timer in useEffect so it animates before changing the cell   
    const fadeStyles = useSpring({
        config: { ...config.stiff },
        from: { scale: 0 },
        to: {
            scale: show ? 1 : 0
        },
    });

    useEffect(() => {
        setShow(true)
        setTimeout(()=> {
            setShow(false)
        }, props.lifetime - props.lifetime/4)
        click(false)
    }, [props.cell])

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
    })
    return <animated.mesh
            ref={ref}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}
            position={[props.position.x, props.position.y, props.cell.isAlive ? props.position.z + 1 : props.position.z]}
            scale={fadeStyles.scale}
    >
        <planeBufferGeometry attach="geometry" args={[props.size,props.size]}/>

        {props.cell.isAlive && <colorShiftMaterial attach="material" /> }
        {!props.cell.isAlive && <meshBasicMaterial attach="material" opacity={0} transparent/>} 
        </animated.mesh> 
        
    
}

export default Cell
