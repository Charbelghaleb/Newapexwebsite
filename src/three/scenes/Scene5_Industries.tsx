import NodeNetwork from '../NodeNetwork'

interface Props { progress: number; nodeBase?: number }

export default function Scene5_Industries({ progress, nodeBase = 80 }: Props) {
  if (progress < 0.48 || progress > 0.67) return null
  const count = Math.round(nodeBase * 1.3)

  return (
    <group>
      <NodeNetwork
        nodeCount={count}
        spread={[5, 3, 4]}
        center={[0, 1, 0]}
        kNeighbors={6}
        lineOpacity={0.065}
        lineTint={[1, 1, 1]}
        nodeColor={[1, 1, 1]}
        progress={1}
        animMode="static"
        seed={5}
        rotation={0.015}
      />
    </group>
  )
}
