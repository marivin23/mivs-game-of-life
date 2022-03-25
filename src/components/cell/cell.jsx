import { useState, useEffect, useRef } from 'react'
// isAlive, position, size 
const Cell = (props) => {
    const ref = useRef()
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)

    return <mesh
        ref={ref}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}
        position={[props.position.x, props.position.y, props.position.z]} 
    >
        <boxGeometry attach="geometry" args={[props.size,props.size]}/>
        <meshStandardMaterial attach="material" color={hovered ? (clicked ? 'red' :'yellow') : (props.isAlive ? 'orangered' : 'black')}/>
    </mesh>
    
}

export default Cell
