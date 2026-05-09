import dagre from "dagre"

const nodeWidth = 280
const nodeHeight = 160

/**
 *
 * @param nodes
 * @param edges
 * @desc Hàm này sử dụng thư viện dagre để tự động sắp xếp vị trí của các node và edge trong sơ đồ. Bạn chỉ cần truyền vào mảng nodes và edges, hàm sẽ trả về một object mới với các node đã được gán vị trí x, y phù hợp để hiển thị trên sơ đồ.
 * @returns
 */

export const getLayoutElements = (nodes: any[], edges: any[]) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 70, ranksep: 100 })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id)
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      }
    }),
    edges,
  }
}
