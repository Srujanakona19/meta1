import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll, Text, Float } from '@react-three/drei'
import * as THREE from 'three'

const NUM_PARTICLES = 1000
const NUM_PIPELINES = 7

// Pre-calculate target positions for different phases
function calculatePhases() {
  const phase0 = new Float32Array(NUM_PARTICLES * 3) // Sphere + incoming flow
  const phase1 = new Float32Array(NUM_PARTICLES * 3) // Feature Cloud
  const phase2 = new Float32Array(NUM_PARTICLES * 3) // Similarity Map (Grid/Plane)
  const phase3 = new Float32Array(NUM_PARTICLES * 3) // Branches
  const phase4 = new Float32Array(NUM_PARTICLES * 3) // Converged Pipeline

  for (let i = 0; i < NUM_PARTICLES; i++) {
    const i3 = i * 3

    // Phase 0: Sphere core (first 100) and orbiting data (rest)
    if (i < 100) {
      const phi = Math.acos(-1 + (2 * i) / 100)
      const theta = Math.sqrt(100 * Math.PI) * phi
      phase0[i3] = 2 * Math.cos(theta) * Math.sin(phi) + 3 // Offset X to right
      phase0[i3 + 1] = 2 * Math.sin(theta) * Math.sin(phi)
      phase0[i3 + 2] = 2 * Math.cos(phi)
    } else {
      const r = 4 + Math.random() * 5
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      phase0[i3] = r * Math.cos(theta) * Math.sin(phi) + 3
      phase0[i3 + 1] = r * Math.sin(theta) * Math.sin(phi)
      phase0[i3 + 2] = r * Math.cos(phi)
    }

    // Phase 1: Feature Cloud (large random volume)
    phase1[i3] = (Math.random() - 0.5) * 15 + 2
    phase1[i3 + 1] = (Math.random() - 0.5) * 15
    phase1[i3 + 2] = (Math.random() - 0.5) * 15 - 5

    // Phase 2: Similarity Map (Flat hexagonal or grid-like map)
    const gridSize = Math.ceil(Math.sqrt(NUM_PARTICLES))
    const row = Math.floor(i / gridSize)
    const col = i % gridSize
    phase2[i3] = (col - gridSize / 2) * 0.4 - 2 // Move left
    phase2[i3 + 1] = (row - gridSize / 2) * 0.4
    phase2[i3 + 2] = (Math.random() - 0.5) * 0.5 - 2

    // Phase 3: Pipeline Branches (7 distinct lines)
    const branch = i % NUM_PIPELINES
    const progress = (i / NUM_PARTICLES) * 10
    phase3[i3] = (branch - NUM_PIPELINES / 2) * 1.5 // Spread X
    phase3[i3 + 1] = progress - 5 // Spread Y
    phase3[i3 + 2] = (Math.random() - 0.5) * 0.2 // Tight Z

    // Phase 4: Convergence (Single tight line)
    // Only branch 3 (center) survives, others fall away
    if (branch === 3) {
      phase4[i3] = 0 // Center X
      phase4[i3 + 1] = progress - 5
      phase4[i3 + 2] = 0
    } else {
      phase4[i3] = phase3[i3] + (Math.random() - 0.5) * 10 // Explode outwards
      phase4[i3 + 1] = phase3[i3 + 1] - Math.random() * 10 // Fall down
      phase4[i3 + 2] = phase3[i3 + 2] + (Math.random() - 0.5) * 10
    }
  }

  return [phase0, phase1, phase2, phase3, phase4]
}

function DatasetCard({ position, text, rows, features, newDataset }) {
  return (
    <Float floatIntensity={2} speed={2}>
      <group position={position}>
        <mesh>
          <planeGeometry args={[1.5, 1]} />
          <meshBasicMaterial color={newDataset ? "#00f0ff" : "#1a1a2e"} transparent opacity={0.8} />
        </mesh>
        <Text position={[0, 0.2, 0.01]} fontSize={0.15} color="white" anchorX="center">
          {text}
        </Text>
        <Text position={[0, -0.1, 0.01]} fontSize={0.1} color="#aaa" anchorX="center">
          Rows: {rows}
        </Text>
        <Text position={[0, -0.3, 0.01]} fontSize={0.1} color="#aaa" anchorX="center">
          Features: {features}
        </Text>
        {newDataset && (
          <Text position={[0, 0.4, 0.01]} fontSize={0.12} color="#00f0ff" anchorX="center">
            NEW DATASET
          </Text>
        )}
      </group>
    </Float>
  )
}

export function StoryManager() {
  const meshRef = useRef()
  const scroll = useScroll()
  const { viewport } = useThree()
  const isMobile = viewport.width < 5

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const phases = useMemo(() => calculatePhases(), [])
  const color = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const offset = scroll.offset // 0 to 1

    // Determine current and next phase based on scroll offset
    // 5 phases means 4 transitions:
    // 0.00 - 0.25 -> Phase 0 to 1
    // 0.25 - 0.50 -> Phase 1 to 2
    // 0.50 - 0.75 -> Phase 2 to 3
    // 0.75 - 1.00 -> Phase 3 to 4
    
    let currentPhase = 0
    let nextPhase = 1
    let lerpFactor = 0

    if (offset < 0.2) {
      currentPhase = 0
      nextPhase = 1
      lerpFactor = offset / 0.2
    } else if (offset < 0.4) {
      currentPhase = 1
      nextPhase = 2
      lerpFactor = (offset - 0.2) / 0.2
    } else if (offset < 0.6) {
      currentPhase = 2
      nextPhase = 3
      lerpFactor = (offset - 0.4) / 0.2
    } else if (offset < 0.8) {
      currentPhase = 3
      nextPhase = 4
      lerpFactor = (offset - 0.6) / 0.2
    } else {
      currentPhase = 4
      nextPhase = 4
      lerpFactor = 1
    }

    // Easing function for smoother transitions
    const ease = (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    const t = ease(lerpFactor)

    const pA = phases[currentPhase]
    const pB = phases[nextPhase]

    // Move camera based on scroll
    // Move slightly right and zoom in during phase 2, then center for phase 4
    const targetCamX = offset < 0.4 ? offset * 5 : (offset < 0.8 ? 0 : -3)
    const targetCamZ = offset < 0.2 ? 10 : 8
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, 0.05)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, 0.05)
    state.camera.lookAt(0, 0, 0)

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const i3 = i * 3
      let x = THREE.MathUtils.lerp(pA[i3], pB[i3], t)
      let y = THREE.MathUtils.lerp(pA[i3 + 1], pB[i3 + 1], t)
      let z = THREE.MathUtils.lerp(pA[i3 + 2], pB[i3 + 2], t)

      // Add ambient noise
      if (currentPhase === 0) {
        // Orbiting effect
        const radius = Math.sqrt(x*x + y*y)
        const angle = Math.atan2(y, x) + time * (i % 2 === 0 ? 0.2 : -0.2)
        if (i >= 100) {
          x = Math.cos(angle) * radius + 3
          y = Math.sin(angle) * radius
        } else {
          // pulsing core
          const scale = 1 + Math.sin(time * 2 + i) * 0.1
          x = (x - 3) * scale + 3
          y *= scale
          z *= scale
        }
      }

      dummy.position.set(x, y, z)
      
      // Node colors based on phase and state
      if (currentPhase === 4 && i % NUM_PIPELINES !== 3) {
        // Failing nodes turn red and fade
        color.set('#ff0055')
      } else if (currentPhase === 4) {
        // Successful pipeline glows brightly
        color.set('#00f0ff')
      } else if (currentPhase === 0 && i < 100) {
        // Core
        color.set('#7000ff')
      } else {
        color.set('#4da8da')
      }

      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, color)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  // Fade out dataset cards when scrolling past phase 0
  const cardOpacity = Math.max(0, 1 - scroll.offset * 5)

  return (
    <group>
      <instancedMesh ref={meshRef} args={[null, null, NUM_PARTICLES]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* Hero Dataset Cards */}
      <group visible={scroll.offset < 0.25} position={[3, 0, 0]}>
        <DatasetCard position={[-2.5, 2, -1]} text="Dataset #104" rows="12.4K" features="42" />
        <DatasetCard position={[1.5, -2, -2]} text="Dataset #087" rows="8.7K" features="31" />
        <DatasetCard position={[2, 1.5, 0]} text="Dataset #121" rows="25.1K" features="56" />
        {/* New Dataset Flowing into Center */}
        <DatasetCard position={[0, 0, 2]} text="New Dataset" rows="15.2K" features="48" newDataset />
      </group>
    </group>
  )
}
