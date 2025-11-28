import React, { useState } from 'react';

interface TimeSlot {
  id: number;
  status: 'available' | 'reserved-others' | 'reserved-self';
  startTime: string;
  endTime: string;
  detail: string;
}

interface TimeSlotGroup {
  status: 'available' | 'reserved-others' | 'reserved-self';
  startTime: string;
  endTime: string;
  detail: string;
  slotCount: number;
  firstSlotId: number;
}

interface TimeSlotCellProps {
  room: string;
  date: string;
  timeSlots: TimeSlot[];
}

export function TimeSlotCell({ room, date, timeSlots }: TimeSlotCellProps) {
  const [hoveredGroupId, setHoveredGroupId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const cellRef = React.useRef<HTMLDivElement>(null);

  // 隣接する同じ状態のタイムスロットをグループ化
  const groupedSlots: TimeSlotGroup[] = React.useMemo(() => {
    const groups: TimeSlotGroup[] = [];
    let currentGroup: TimeSlotGroup | null = null;

    timeSlots.forEach((slot, index) => {
      if (!currentGroup || currentGroup.status !== slot.status) {
        // 新しいグループを開始
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          status: slot.status,
          startTime: slot.startTime,
          endTime: slot.endTime,
          detail: slot.detail,
          slotCount: 1,
          firstSlotId: slot.id,
        };
      } else {
        // 既存のグループを拡張
        currentGroup.endTime = slot.endTime;
        currentGroup.slotCount++;
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  }, [timeSlots]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'timeslot-group-available';
      case 'reserved-others':
        return 'timeslot-group-reserved-others';
      case 'reserved-self':
        return 'timeslot-group-reserved-self';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return '空室';
      case 'reserved-others':
        return '他者が予約済み';
      case 'reserved-self':
        return '自分が予約済み';
      default:
        return '不明';
    }
  };

  const activeGroupId = selectedGroupId !== null ? selectedGroupId : hoveredGroupId;
  const activeGroup = activeGroupId !== null ? groupedSlots[activeGroupId] : null;

  // ツールチップの位置を計算
  const calculateTooltipPosition = () => {
    if (cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const tooltipHeight = 180; // ツールチップの概算の高さ
      const tooltipWidth = 200; // ツールチップの幅
      
      let top = rect.bottom + 8; // デフォルトは下側
      let left = rect.left;
      
      // 下側に表示すると画面外に出る場合は上側に表示
      if (rect.bottom + tooltipHeight > windowHeight) {
        top = rect.top - tooltipHeight - 8;
      }
      
      // 左側に表示すると画面外に出る場合は調整
      if (left + tooltipWidth > windowWidth) {
        left = windowWidth - tooltipWidth - 16;
      }
      
      // 上側に表示しても画面外に出る場合は、画面内に収める
      if (top < 0) {
        top = 8;
      }
      
      setTooltipStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
      });
    }
  };

  const handleMouseEnter = (groupId: number) => {
    setHoveredGroupId(groupId);
    calculateTooltipPosition();
  };

  const handleClick = (groupId: number) => {
    const newSelectedGroupId = selectedGroupId === groupId ? null : groupId;
    setSelectedGroupId(newSelectedGroupId);
    if (newSelectedGroupId !== null) {
      calculateTooltipPosition();
    }
  };

  return (
    <div className="timeslot-container" ref={cellRef}>
      <div className="timeslot-groups">
        {groupedSlots.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className={`timeslot-group ${getStatusColor(group.status)} ${
              activeGroupId === groupIndex ? 'timeslot-group-active' : ''
            }`}
            style={{ width: `${group.slotCount * 20}px` }}
            onMouseEnter={() => handleMouseEnter(groupIndex)}
            onMouseLeave={() => setHoveredGroupId(null)}
            onClick={() => handleClick(groupIndex)}
            title={`${group.startTime} - ${group.endTime}: ${getStatusText(group.status)}`}
          />
        ))}
      </div>

      {/* 詳細情報パネル */}
      {activeGroup !== null && (
        <div 
          style={tooltipStyle}
          className="timeslot-tooltip"
        >
          <div className="timeslot-tooltip-content">
            <div className="timeslot-tooltip-row">
              <span className="timeslot-tooltip-label">部屋:</span>
              <span className="timeslot-tooltip-value">{room}</span>
            </div>
            <div className="timeslot-tooltip-row">
              <span className="timeslot-tooltip-label">日付:</span>
              <span className="timeslot-tooltip-value">{date}</span>
            </div>
            <div className="timeslot-tooltip-row">
              <span className="timeslot-tooltip-label">時間:</span>
              <span className="timeslot-tooltip-value">
                {activeGroup.startTime} - {activeGroup.endTime}
              </span>
            </div>
            <div className="timeslot-tooltip-row">
              <span className="timeslot-tooltip-label">状態:</span>
              <span className="timeslot-tooltip-value">{getStatusText(activeGroup.status)}</span>
            </div>
            <div className="timeslot-tooltip-row">
              <span className="timeslot-tooltip-label">詳細:</span>
              <span className="timeslot-tooltip-value">{activeGroup.detail}</span>
            </div>
          </div>
          {selectedGroupId !== null && (
            <div className="timeslot-tooltip-close">
              <button
                onClick={() => setSelectedGroupId(null)}
                className="timeslot-tooltip-button"
              >
                閉じる
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
