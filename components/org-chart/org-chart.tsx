"use client";

import React, { useState, useMemo } from "react";
import { OrgChartNode } from "./org-chart-node";
import { ChatModal } from "./chat-modal";
import { SettingsModal } from "./settings-modal";
import { OrgMember } from "@/types/org-chart";
import { useLocalStorage } from "@/hooks/use-local-storage";

/**
 * Constants controlling node sizes and spacing.
 */
const NODE_WIDTH = 280;
const NODE_HEIGHT = 140;
const VERTICAL_SPACING = 120;
const HORIZONTAL_GAP = 200;

interface OrgChartProps {
  members: OrgMember[];
  rootId?: string;
}

export function OrgChart({ members: initialMembers, rootId = "1" }: OrgChartProps) {
  // Persist or retrieve members from localStorage
  const [members] = useLocalStorage<OrgMember[]>("org-members", initialMembers);

  // For Chat & Settings modals
  const [selectedMember, setSelectedMember] = useState<OrgMember | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  /**
   * Handler: open chat modal for a given memberId
   */
  const handleChatClick = (memberId: string) => {
    const m = members.find((member) => member.id === memberId);
    if (m) {
      setSelectedMember(m);
      setIsChatOpen(true);
    }
  };

  /**
   * Handler: open settings modal for a given memberId
   */
  const handleSettingsClick = (memberId: string) => {
    const m = members.find((member) => member.id === memberId);
    if (m) {
      setSelectedMember(m);
      setIsSettingsOpen(true);
    }
  };

  /**
   * BFS-based approach: 
   * 1. Start from root node (e.g. CEO).
   * 2. Collect child levels in a queue, track each node's (x, y).
   * 3. We'll line up each level horizontally, centered on a chosen container width.
   */
  const nodePositions = useMemo(() => {
    const root = members.find((m) => m.id === rootId);
    if (!root) return [];

    // Build a map of children for each member
    const childrenMap: Record<string, OrgMember[]> = {};
    members.forEach((m) => {
      if (!m.managerId) return; // no manager
      if (!childrenMap[m.managerId]) {
        childrenMap[m.managerId] = [];
      }
      childrenMap[m.managerId].push(m);
    });

    // BFS queue
    const queue: Array<{ member: OrgMember; level: number }> = [{ member: root, level: 0 }];
    const nodes: Array<{
      member: OrgMember;
      x: number;
      y: number;
      level: number;
    }> = [];

    // Track how many nodes per level
    const levelMap: Record<number, OrgMember[]> = {};

    while (queue.length > 0) {
      const { member, level } = queue.shift()!;

      // Add to levelMap
      if (!levelMap[level]) {
        levelMap[level] = [];
      }
      levelMap[level].push(member);

      // Push children
      const kids = childrenMap[member.id] || [];
      kids.forEach((child) => {
        queue.push({ member: child, level: level + 1 });
      });
    }

    // Now compute x,y positions for each level
    // We'll pick a containerWidth to be 1600 for now to bring things closer
    const containerWidth = 1600;
    const centerX = containerWidth / 2;

    Object.keys(levelMap).forEach((lvlKey) => {
      const lvl = parseInt(lvlKey);
      const rowMembers = levelMap[lvl];

      // For VPs (level 1), add extra spacing
      const isVPLevel = lvl === 1;
      const gap = isVPLevel ? HORIZONTAL_GAP * 2 : HORIZONTAL_GAP;
      
      // total width needed for row
      const totalRowWidth = rowMembers.length * NODE_WIDTH + (rowMembers.length - 1) * gap;
      // starting x so row is centered
      let startX = centerX - totalRowWidth / 2;

      rowMembers.forEach((m, idx) => {
        nodes.push({
          member: m,
          x: startX,
          y: lvl * (NODE_HEIGHT + VERTICAL_SPACING),
          level: lvl
        });
        // increment for next node in same row
        startX += NODE_WIDTH + gap;
      });
    });

    return nodes;
  }, [members, rootId]);

  // If we can't find the root, we show nothing
  if (!nodePositions.length) {
    return <div className="text-zinc-100">No root member found.</div>;
  }

  /**
   * We'll draw lines from each node to its manager's node.
   * 1. Build a quick lookup from memberId -> (x,y).
   */
  const lines = useMemo(() => {
    const posMap: Record<string, { x: number; y: number }> = {};
    nodePositions.forEach((n) => {
      posMap[n.member.id] = { x: n.x, y: n.y };
    });

    const pathList: Array<{ key: string; d: string }> = [];
    nodePositions.forEach((n) => {
      if (n.member.managerId) {
        const parentPos = posMap[n.member.managerId];
        if (parentPos) {
          const childX = n.x + NODE_WIDTH / 2;
          const childY = n.y;
          const parentX = parentPos.x + NODE_WIDTH / 2;
          const parentY = parentPos.y + NODE_HEIGHT;

          // Simple straight lines with a single midpoint
          const midY = (parentY + childY) / 2;

          const d = `
            M ${parentX} ${parentY}
            L ${parentX} ${midY}
            L ${childX} ${midY}
            L ${childX} ${childY}
          `;
          pathList.push({ key: `${n.member.id}-path`, d });
        }
      }
    });
    return pathList;
  }, [nodePositions]);

  return (
    <div className="w-full h-full bg-black overflow-auto relative pl-[300px]">
      {/* SVG lines */}
      <svg className="absolute inset-0 pointer-events-none" style={{ left: '300px' }}>
        {lines.map(({ key, d }) => (
          <path
            key={key}
            d={d}
            stroke="rgb(115 115 115 / 0.2)"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </svg>

      {/* Node Divs */}
      {nodePositions.map(({ member, x, y }) => (
        <div
          key={member.id}
          className="absolute transition-transform duration-300"
          style={{
            transform: `translate(${x + 300}px, ${y}px)`,
            width: NODE_WIDTH,
            height: NODE_HEIGHT
          }}
        >
          <OrgChartNode
            member={member}
            onChatClick={handleChatClick}
            onSettingsClick={handleSettingsClick}
          />
        </div>
      ))}

      {/* Chat & Settings Modals */}
      {selectedMember && (
        <>
          <ChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            member={selectedMember}
          />
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            member={selectedMember}
            onUpdate={() => {
              // For now, no direct setMembers call,
              // but you can adapt if you want to update local storage
            }}
          />
        </>
      )}
    </div>
  );
}
