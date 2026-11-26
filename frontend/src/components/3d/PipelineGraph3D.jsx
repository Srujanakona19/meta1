import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

export function PipelineGraph3D({ nodes }) {
  // Simple layout logic: place nodes horizontally
  const nodeSpacing = 3;
  const startX = -((nodes.length - 1) * nodeSpacing) / 2;

  return (
    <group position={[0, 0, -2]}>
      {nodes.map((node, i) => {
        const x = startX + i * nodeSpacing;
        const isModel = node.type === 'model';
        const nextX = i < nodes.length - 1 ? startX + (i + 1) * nodeSpacing : null;

        return (
          <group key={node.id}>
            {/* Draw connection line to next node */}
            {nextX !== null && (
              <AnimatedLine start={[x, 0, 0]} end={[nextX, 0, 0]} />
            )}
            
            <Float floatIntensity={2} speed={3} rotationIntensity={0.2}>
              <group position={[x, 0, 0]}>
                {/* Node Box */}
                <mesh>
                  <boxGeometry args={isModel ? [1.5, 1.5, 1.5] : [1.2, 1.2, 1.2]} />
                  <meshStandardMaterial 
                    color={isModel ? '#7000ff' : '#00f0ff'} 
                    wireframe 
                    emissive={isModel ? '#7000ff' : '#00f0ff'}
                    emissiveIntensity={0.5}
                  />
                </mesh>
                
                {/* Glass Inner Core */}
                <mesh>
                  <boxGeometry args={isModel ? [1.3, 1.3, 1.3] : [1, 1, 1]} />
                  <meshPhysicalMaterial 
                    color="black"
                    transmission={0.9}
                    opacity={0.5}
                    transparent
                    roughness={0.1}
                  />
                </mesh>

                {/* Text Label */}
                <Text 
                  position={[0, -1.2, 0]} 
                  fontSize={0.2} 
                  color="white" 
                  anchorX="center"
                  outlineWidth={0.02}
                  outlineColor="#000"
                >
                  {node.name}
                </Text>
                <Text 
                  position={[0, -1.5, 0]} 
                  fontSize={0.12} 
                  color="#aaa" 
                  anchorX="center"
                >
                  {node.type.toUpperCase()}
                </Text>
              </group>
            </Float>
          </group>
        );
      })}
    </group>
  );
}

function AnimatedLine({ start, end }) {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.dashOffset -= 0.02;
    }
  });

  return (
    <Line
      points={[start, end]}
      color="#00f0ff"
      lineWidth={2}
      dashed
      dashSize={0.2}
      dashScale={1}
      dashOffset={0}
      ref={materialRef}
    />
  );
}
