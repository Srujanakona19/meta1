import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function MetaLearningSpace3D({ nearestDatasets }) {
  const pointsRef = useRef();
  const newDatasetRef = useRef();
  const labelRef = useRef();

  // Generate a random latent space for historical datasets
  const historicalPoints = useMemo(() => {
    const points = [];
    // 500 historical datasets
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, []);

  const positions = useMemo(() => {
    const arr = new Float32Array(historicalPoints.length * 3);
    historicalPoints.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [historicalPoints]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.05;
    }
    if (newDatasetRef.current) {
      newDatasetRef.current.position.y = Math.sin(t * 2) * 0.2;
    }
    if (labelRef.current) {
      labelRef.current.position.y = 0.5 + Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <group position={[0, -1, -3]}>
      {/* Historical Dataset Point Cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.05} 
          color="#00f0ff" 
          transparent 
          opacity={0.3} 
          sizeAttenuation 
        />
      </points>

      {/* Target Dataset (Shifted) */}
      <group>
        {/* Draw lines to nearest neighbors */}
        {nearestDatasets.map((ds, i) => {
          // Fake neighbor positions close to the origin
          const end = [
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ];
          return (
            <line key={i}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([0, 0, 0, end[0], end[1], end[2]])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#7000ff" transparent opacity={0.5} />
            </line>
          );
        })}

        <mesh ref={newDatasetRef}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={2} />
        </mesh>
        <Text ref={labelRef} position={[0, 0.5, 0]} fontSize={0.2} color="white" outlineWidth={0.02} outlineColor="#000">
          Target Dataset
        </Text>
      </group>
    </group>
  );
}
