import React, { useEffect, useRef } from 'react'
import { Bureau } from './Bureau'
import { CameraControls, Environment, Float, MeshReflectorMaterial, OrbitControls, RenderTexture, Stage, Text, useFont } from '@react-three/drei'
import { degToRad, lerp } from 'three/src/math/MathUtils.js'
import { Color } from 'three'
import { useAtom } from 'jotai'
import { currentPageAtom } from './UI'
import { useFrame } from '@react-three/fiber'

const bloomColor = new Color("#fff")
bloomColor.multiplyScalar(1.5)

function Experience() {
    const controls = useRef<any>()
    const textMaterials = useRef<any>()
    const meshFitCameraHome= useRef<any>()
    const meshFitCameraStore= useRef<any>()
    const [currentPage, setCurrentPage] = useAtom(currentPageAtom)

    useFrame((_, delta)=>{
      textMaterials.current.opacity = lerp(
        textMaterials.current.opacity,
        currentPage === "home" || currentPage === "intro" ? 1:0,
        delta * 1.5
      )
    })

    const intro = async()=>{
        controls.current.dolly(-22);
        controls.current.smoothTime = 1.6
        // controls.current.dolly(22, true)
        setTimeout(()=>{
          setCurrentPage("home")
        }, 1200)
        fitCamera()
    }

    const fitCamera = async ()=>{
      if(currentPage === "store"){
        controls.current.smoothTime = 0.8
        controls.current.fitToBox(meshFitCameraStore.current, true)
      }else{
        controls.current.smoothTime = 1.6
        controls.current.fitToBox(meshFitCameraHome.current, true)
      }
    }

    useEffect(()=>{
        intro();
    },[])

    useEffect(()=>{
      fitCamera()
      window.addEventListener("resize", fitCamera);
      return ()=> window.removeEventListener("resize", fitCamera)
    },[currentPage])
  return (
    <>
    <CameraControls ref={controls}/>
    <mesh ref={meshFitCameraHome} position-z={1.5} visible={false}>
      <boxGeometry args={[7.5,2,2]}/>
      <meshBasicMaterial color="orange" transparent opacity={0.5}/>
    </mesh>
  <Stage environment={"sunset"}>

    <Text 
        font={'fonts/Poppins-Black.ttf'} 
        position-x={-1.6} 
        position-y={-0.5} 
        position-z={1} 
        lineHeight={0.8} 
       
        textAlign='center' 
        rotation-y={degToRad(30)}
        anchorY="bottom"
    >
       MY LITTLE {"\n"}CAMPING
       <meshBasicMaterial color={bloomColor} toneMapped={false} ref={textMaterials}>
          <RenderTexture attach={"map"}>
            <color attach={"background"} args={["#fff"]}/>
            <Environment preset='sunset'/>
            <Float
              floatIntensity={4} 
              rotationIntensity={5} 
            >

              <Bureau
                scale={1.6}
                rotation-y={-degToRad(25)}
                rotation-x={degToRad(25)}
                position-y={-0.5}
              />
            </Float>
          </RenderTexture>
        </meshBasicMaterial>
    </Text>
    <group rotation-y={degToRad(-25)} position-x={3} position-y={-0.1}>
        <Bureau scale={0.6} />
        <mesh ref={meshFitCameraStore} visible={false}>
          <boxGeometry args={[2,1,2]}/>
          <meshBasicMaterial color={"red"} transparent opacity={0.5}/>
        </mesh>
    </group>
    <mesh position-y={-0.48} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
        mirror={0}
          blur={[100, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={10}
          roughness={1}
          depthScale={1}
          opacity={0.5}
          transparent
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#333"
          metalness={0.5}
        />
      </mesh>
  
  </Stage>
  
    </>
  )
}

export default Experience


useFont.preload("fonts/Poppins-Black.ttf")