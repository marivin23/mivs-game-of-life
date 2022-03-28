import { useState, useRef } from 'react'
// isAlive, position, size 
const Cell = (props) => {
    const ref = useRef()
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)

    return <group>
        <mesh
            ref={ref}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}
            position={[props.position.x, props.position.y, props.position.z]}
        >
            <planeBufferGeometry args={[props.size,props.size]}/>
            <meshLambertMaterial color={hovered ? (clicked ? 'red' :'yellow') : (props.isAlive ? 'orangered' : 'darkgrey')}/>
            <pointLight color='orangered' intensity={1} position={[ref.position.x,ref.position.y, ref.position.z -3]}/>
        </mesh>
    </group>
}

export default Cell
