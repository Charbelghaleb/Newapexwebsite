import NodeNetwork from '../NodeNetwork'
import GridFloor from '../GridFloor'
import WireframePanel from '../WireframePanel'

interface Props { progress: number; nodeBase?: number }

export default function Scene7_About({ progress, nodeBase = 80 }: Props) {
  if (progress < 0.73 || progress > 0.90) return null
  const count = Math.round(nodeBase * 0.55)

  return (
    <group>
      <GridFloor y={-2.5} />
      {/* Large central wireframe panel */}
      <WireframePanel
        position={[0, 1, -3]}
        size={[6, 3.5]}
        color="plasma"
        opacity={0.18}
        floatAmplitude={0.04}
        floatSpeed={0.35}
        phaseOffset={0}
      />
      <NodeNetwork
        nodeCount={count}
        spread={[4, 2.5, 3]}
        center={[0, 1, 0]}
        kNeighbors={4}
        lineOpacity={0.10}
        lineTint={[1.0, 0.98, 0.92]}
        nodeColor={[1, 0.98, 0.92]}
        progress={1}
        animMode="pulse-bright"
        seed={7}
      />
    </group>
  )
}
