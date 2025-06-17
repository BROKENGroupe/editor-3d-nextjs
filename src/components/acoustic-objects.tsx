import { useRef } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'

export function Speaker({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null)
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.5, 0.8, 0.5]} />
      <meshStandardMaterial color="#ff4040" />
    </mesh>
  )
}

export function Microphone({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.1, 0.2, 0.4]} />
      <meshStandardMaterial color="#4040ff" />
    </mesh>
  )
}