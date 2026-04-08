import { remap } from '../../utils/mathUtils'
import NodeNetwork from '../NodeNetwork'
import GridFloor from '../GridFloor'
import WireframePanel from '../WireframePanel'

interface Props { progress: number }

export default function Scene2_Problem({ progress }: Props) {
  if (progress < 0.08 || progress > 0.23) return null
  const local = remap(progress, 0.10, 0.20)

  return (
    <group>
      <GridFloor y={-2.5} distortion={local * 0.4} />
      {/* Four small wireframe panels on the left at different depths */}
      <WireframePanel position={[-3.5, 2.2, -1]} size={[2.2, 1.4]} color="plasma" opacity={0.15 + local * 0.05} phaseOffset={0} />
      <WireframePanel position={[-3.5, 0.8, -2]} size={[2.2, 1.4]} color="plasma" opacity={0.15 + local * 0.05} phaseOffset={1} />
      <WireframePanel position={[-3.5, -0.5, -1.5]} size={[2.2, 1.4]} color="plasma" opacity={0.15 + local * 0.05} phaseOffset={2} />
      <WireframePanel position={[-3.5, -1.8, -2.5]} size={[2.2, 1.4]} color="plasma" opacity={0.15 + local * 0.05} phaseOffset={3} />
      <NodeNetwork
        nodeCount={28}
        spread={[3, 2, 2]}
        center={[0, 1, 0]}
        kNeighbors={5}
        lineOpacity={0.07}
        progress={local}
        animMode="fragment"
        seed={2}
      />
    </group>
  )
}
