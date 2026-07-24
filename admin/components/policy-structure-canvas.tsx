"use client";

import { useRef } from "react";
import {
  GraphCanvas,
  type GraphCanvasRef,
  type GraphEdge,
  type GraphNode,
  type LayoutTypes,
  type Theme,
} from "reagraph";
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PolicyStructureCanvas({
  nodes,
  edges,
  theme,
  layoutType,
  animated,
  selections,
  actives,
  onNodeClick,
  onCanvasClick,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  theme: Theme;
  layoutType: LayoutTypes;
  animated: boolean;
  selections: string[];
  actives: string[];
  onNodeClick: (nodeId: string) => void;
  onCanvasClick: () => void;
}) {
  const graphRef = useRef<GraphCanvasRef | null>(null);

  function zoomIn() {
    graphRef.current?.zoomIn();
  }

  function zoomOut() {
    graphRef.current?.zoomOut();
  }

  function fitView() {
    graphRef.current?.fitNodesInView([], { animated });
  }

  return (
    <div className="relative h-full w-full">
      <div
        className="absolute right-2 top-2 z-10 flex gap-1 rounded-md border border-border bg-surface/95 p-1 shadow-sm"
        role="toolbar"
        aria-label="Graph zoom controls"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 cursor-pointer p-0"
          aria-label="Zoom in"
          title="Zoom in"
          onClick={zoomIn}
        >
          <ZoomIn className="h-4 w-4" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 cursor-pointer p-0"
          aria-label="Zoom out"
          title="Zoom out"
          onClick={zoomOut}
        >
          <ZoomOut className="h-4 w-4" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 cursor-pointer p-0"
          aria-label="Fit graph to view"
          title="Fit to view"
          onClick={fitView}
        >
          <Maximize2 className="h-4 w-4" aria-hidden />
        </Button>
      </div>
      <GraphCanvas
        ref={graphRef}
        nodes={nodes}
        edges={edges}
        theme={theme}
        layoutType={layoutType}
        cameraMode="pan"
        labelType="auto"
        layoutOverrides={
          layoutType === "hierarchicalTd"
            ? { nodeSeparation: 1.8, nodeSize: [80, 70] as [number, number] }
            : undefined
        }
        edgeArrowPosition="end"
        animated={animated}
        draggable={false}
        minZoom={0.5}
        maxZoom={8}
        selections={selections}
        actives={actives}
        onNodeClick={(node) => onNodeClick(node.id)}
        onCanvasClick={onCanvasClick}
      />
    </div>
  );
}
