import { remap } from '../../utils/mathUtils'
import NodeNetwork from '../NodeNetwork'
import GridFloor from '../GridFloor'
import WireframePanel from '../WireframePanel'

interface Props { progress: number }

export default function Scene1_Hero({ progress }: Props) {
  if (progress < 0 || progress > 0.13) return null
  const local = remap(progress, 0, 0.10)

  return (
    <group>
      <GridFloor y={-2.5} />
      <WireframePanel
        position={[0, 1.5, -3]}
        size={[4, 2.5]}
        color="plasma"
        opacity={0.22}
        floatAmplitude={0.06}
        floatSpeed={0.4}
        phaseOffset={0}
      />
      <NodeNetwork
        nodeCount={28}
        spread={[3, 2, 2]}
        center={[0, 1, 0]}
        kNeighbors={4}
        lineOpacity={0.07}
        progress={local}
        animMode="draw-in"
        seed={1}
        rotation={0.02}
      />
    </group>
  )
}
