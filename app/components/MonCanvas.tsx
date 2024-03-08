"use client"
import { Canvas } from '@react-three/fiber'
import React, { Suspense } from 'react'
import Experience from './Experience'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import UI from './UI'

function MonCanvas() {
  return (
    <>
      <Canvas  
            shadows  
            camera={{ 
                position: [0, 0, 8], 
                fov:40
            }}
        > 
          <color attach="background" args={["#171720"]}/>
          <fog attach={"fog"} args={["#171720", 5, 30]}/>
          <Suspense>
            <Experience/>
          </Suspense>
          <EffectComposer>
            <Bloom mipmapBlur intensity={1.2}/>
          </EffectComposer>
      </Canvas>
      <UI/>
    </>
  )
}

export default MonCanvas