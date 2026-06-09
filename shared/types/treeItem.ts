export type NodeType = 'pillar' | 'buildingBlock' | 'construct' | 'subconstruct'

export interface PillarTreeItem {
  symbol: string
  name: string
  order: number
  type: NodeType
  parentSymbol?: string
}
