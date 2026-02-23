"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/components/brand/BrandColors";

interface Node {
  id: string;
  label: string;
  symbol: string;
  x: number;
  y: number;
}

interface Edge {
  id: string;
  from: string;
  to: string;
  name: string;
  nameEN: string;
  formula: string;
  reliability: "high" | "medium" | "low";
  reliabilityLabel: string;
  explanation: string;
}

// Diamond layout: top, right, bottom, left
// SVG viewBox is 400x360
const NODES: Node[] = [
  { id: "inflation", label: "通膨差", symbol: "pi_d - pi_f", x: 200, y: 40 },
  { id: "forward", label: "遠期溢價", symbol: "(F-S)/S", x: 370, y: 170 },
  { id: "expected", label: "預期匯率變動", symbol: "E(dS/S)", x: 200, y: 300 },
  { id: "interest", label: "利率差", symbol: "i_d - i_f", x: 30, y: 170 },
];

const EDGES: Edge[] = [
  {
    id: "fisher",
    from: "inflation",
    to: "interest",
    name: "費雪效果",
    nameEN: "Fisher Effect",
    formula: "i_d - i_f = pi_d - pi_f",
    reliability: "medium",
    reliabilityLabel: "中度可靠 ~",
    explanation: "名目利率差異反映通膨預期差異。長期近似成立，短期受央行政策干擾。",
  },
  {
    id: "ppp",
    from: "inflation",
    to: "expected",
    name: "相對 PPP",
    nameEN: "Relative PPP",
    formula: "E(dS/S) = pi_d - pi_f",
    reliability: "medium",
    reliabilityLabel: "中度可靠 ~",
    explanation: "匯率變動反映兩國通膨差異。長期趨勢成立，短期偏差大。",
  },
  {
    id: "cip",
    from: "interest",
    to: "forward",
    name: "CIP 拋補利率平價",
    nameEN: "Covered Interest Parity",
    formula: "F/S = (1+i_d)/(1+i_f)",
    reliability: "high",
    reliabilityLabel: "高度可靠 !!",
    explanation: "有套利機制強制成立。遠期溢價等於利率差。實證驗證最強的平價條件。",
  },
  {
    id: "uip",
    from: "interest",
    to: "expected",
    name: "UIP / IFE",
    nameEN: "Uncovered Interest Parity",
    formula: "E(dS/S) = i_d - i_f",
    reliability: "low",
    reliabilityLabel: "不可靠 X",
    explanation: "利率高的貨幣預期貶值。實證常被拒絕，carry trade 的存在就是反例。",
  },
  {
    id: "unbiased",
    from: "forward",
    to: "expected",
    name: "遠期無偏假說",
    nameEN: "Forward Unbiased Hypothesis",
    formula: "F = E(S_t)",
    reliability: "medium",
    reliabilityLabel: "中度可靠 ~",
    explanation: "遠期匯率是未來即期匯率的無偏估計。存在風險溢酬時可能偏離。",
  },
  {
    id: "pppcip",
    from: "inflation",
    to: "forward",
    name: "PPP + CIP 推導",
    nameEN: "PPP + CIP Implied",
    formula: "(F-S)/S = pi_d - pi_f",
    reliability: "medium",
    reliabilityLabel: "中度可靠 ~",
    explanation: "由相對 PPP 和 CIP 聯合推導。遠期溢價反映通膨差異。",
  },
];

const RELIABILITY_COLORS: Record<string, string> = {
  high: BRAND.story,   // green
  medium: BRAND.accent, // amber/yellow
  low: BRAND.danger,    // red
};

function getNodePos(nodeId: string): { x: number; y: number } {
  const node = NODES.find((n) => n.id === nodeId);
  return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
}

// Calculate midpoint for edge labels and curved paths
function getMidpoint(from: { x: number; y: number }, to: { x: number; y: number }) {
  return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
}

export default function ParityWebDiagram() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  function handleNodeClick(nodeId: string) {
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    } else {
      setSelectedNode(nodeId);
      setSelectedEdge(null);
    }
  }

  function handleEdgeClick(edgeId: string) {
    if (selectedEdge === edgeId) {
      setSelectedEdge(null);
    } else {
      setSelectedEdge(edgeId);
      setSelectedNode(null);
    }
  }

  function isEdgeHighlighted(edge: Edge): boolean {
    if (selectedNode) {
      return edge.from === selectedNode || edge.to === selectedNode;
    }
    if (selectedEdge) {
      return edge.id === selectedEdge;
    }
    return true; // all visible when nothing selected
  }

  const selectedEdgeData = selectedEdge
    ? EDGES.find((e) => e.id === selectedEdge)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h4
        className="text-center font-bold text-lg mb-1"
        style={{ color: BRAND.primary }}
      >
        國際平價條件網
      </h4>
      <p className="text-center text-xs text-gray-500 mb-2">
        點擊節點或連線查看詳細說明
      </p>

      {/* 圖例 */}
      <div className="flex justify-center gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1">
          <div
            className="w-3 h-1 rounded"
            style={{ backgroundColor: BRAND.story }}
          />
          <span className="text-gray-600">高度可靠</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-3 h-1 rounded"
            style={{ backgroundColor: BRAND.accent }}
          />
          <span className="text-gray-600">中度可靠</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-3 h-1 rounded"
            style={{ backgroundColor: BRAND.danger }}
          />
          <span className="text-gray-600">不可靠</span>
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="w-full" style={{ maxWidth: 420, margin: "0 auto" }}>
        <svg viewBox="0 0 400 340" className="w-full h-auto">
          {/* Edges */}
          {EDGES.map((edge) => {
            const from = getNodePos(edge.from);
            const to = getNodePos(edge.to);
            const mid = getMidpoint(from, to);
            const highlighted = isEdgeHighlighted(edge);
            const color = RELIABILITY_COLORS[edge.reliability];
            const opacity = highlighted ? 1 : 0.15;

            return (
              <g key={edge.id}>
                {/* Clickable wider invisible line for easier clicking */}
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="transparent"
                  strokeWidth={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEdgeClick(edge.id)}
                />
                {/* Visible line */}
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={color}
                  strokeWidth={highlighted ? 2.5 : 1.5}
                  strokeOpacity={opacity}
                  strokeDasharray={
                    edge.reliability === "low" ? "6 3" : undefined
                  }
                  style={{ cursor: "pointer", transition: "all 0.3s" }}
                  onClick={() => handleEdgeClick(edge.id)}
                />
                {/* Edge label */}
                <text
                  x={mid.x}
                  y={mid.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={9}
                  fill={color}
                  opacity={opacity}
                  style={{ cursor: "pointer", transition: "all 0.3s" }}
                  onClick={() => handleEdgeClick(edge.id)}
                >
                  <tspan
                    dx={
                      // Offset labels to avoid overlapping center
                      edge.id === "cip" ? 0 :
                      edge.id === "uip" ? 0 :
                      edge.id === "fisher" ? -8 :
                      edge.id === "ppp" ? 8 :
                      edge.id === "unbiased" ? 8 :
                      edge.id === "pppcip" ? -8 : 0
                    }
                    dy={
                      edge.id === "cip" ? -10 :
                      edge.id === "uip" ? 10 :
                      edge.id === "fisher" ? -8 :
                      edge.id === "ppp" ? -8 :
                      edge.id === "unbiased" ? 8 :
                      edge.id === "pppcip" ? 8 : 0
                    }
                  >
                    {edge.name}
                  </tspan>
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map((node, i) => {
            const isSelected = selectedNode === node.id;
            const isConnected =
              selectedNode &&
              EDGES.some(
                (e) =>
                  (e.from === selectedNode && e.to === node.id) ||
                  (e.to === selectedNode && e.from === node.id)
              );
            const dimmed =
              selectedNode !== null && !isSelected && !isConnected;
            const nodeOpacity = dimmed ? 0.25 : 1;

            return (
              <g
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                style={{ cursor: "pointer" }}
              >
                {/* Node background circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 36 : 32}
                  fill="#fff"
                  stroke={isSelected ? BRAND.primary : "#d1d5db"}
                  strokeWidth={isSelected ? 3 : 1.5}
                  opacity={nodeOpacity}
                  style={{ transition: "all 0.3s" }}
                />
                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y - 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fontWeight="bold"
                  fill={BRAND.primary}
                  opacity={nodeOpacity}
                  style={{ transition: "all 0.3s" }}
                >
                  {node.label}
                </text>
                {/* Node symbol */}
                <text
                  x={node.x}
                  y={node.y + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={9}
                  fill="#6b7280"
                  opacity={nodeOpacity}
                  style={{ transition: "all 0.3s" }}
                >
                  {node.symbol}
                </text>
                {/* Animated entrance ring */}
                {i >= 0 && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={32}
                    fill="none"
                    stroke={BRAND.primary}
                    strokeWidth={1}
                    opacity={0}
                  >
                    <animate
                      attributeName="r"
                      from="32"
                      to="44"
                      dur="0.6s"
                      begin={`${i * 0.15}s`}
                      fill="freeze"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="0.6s"
                      begin={`${i * 0.15}s`}
                      fill="freeze"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Edge detail tooltip */}
      <AnimatePresence>
        {selectedEdgeData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 p-4 rounded-lg border text-sm"
            style={{
              borderColor: RELIABILITY_COLORS[selectedEdgeData.reliability],
              backgroundColor: `${RELIABILITY_COLORS[selectedEdgeData.reliability]}08`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span
                  className="font-bold"
                  style={{
                    color: RELIABILITY_COLORS[selectedEdgeData.reliability],
                  }}
                >
                  {selectedEdgeData.name}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {selectedEdgeData.nameEN}
                </span>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${RELIABILITY_COLORS[selectedEdgeData.reliability]}20`,
                  color: RELIABILITY_COLORS[selectedEdgeData.reliability],
                }}
              >
                {selectedEdgeData.reliabilityLabel}
              </span>
            </div>
            <div
              className="text-center text-sm font-mono p-2 rounded mb-2"
              style={{ backgroundColor: `${BRAND.primary}08` }}
            >
              {selectedEdgeData.formula}
            </div>
            <p className="text-xs text-gray-600">{selectedEdgeData.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt when nothing selected */}
      {!selectedNode && !selectedEdge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-gray-400 mt-3"
        >
          點擊節點查看相關連線 | 點擊連線查看平價條件詳情
        </motion.div>
      )}

      {/* 核心結論 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center text-sm p-3 rounded-lg mt-4"
        style={{ backgroundColor: `${BRAND.accent}15`, color: "#374151" }}
      >
        <span className="font-bold" style={{ color: BRAND.accent }}>
          核心洞察：
        </span>{" "}
        六條平價關係中，只有{" "}
        <span className="font-bold" style={{ color: BRAND.story }}>
          CIP
        </span>{" "}
        因套利機制而高度可靠；其餘皆需「長期」或「風險中性」等假設才成立
      </motion.div>
    </motion.div>
  );
}
