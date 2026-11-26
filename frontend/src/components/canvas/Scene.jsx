import { useMemo } from 'react'
import { Environment, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { StoryManager } from './StoryManager'

export function Scene() {
  return (
    <>
      <color attach="background" args={['#020204']} />
      <fog attach="fog" args={['#020204', 5, 20]} />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#00f0ff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#7000ff" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00f0ff" distance={10} />

      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      <StoryManager />

      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9} 
          intensity={1.5} 
          mipmapBlur 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  )
}
