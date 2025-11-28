import React, { useState, useMemo } from 'react';
import { RoomScheduleGrid } from './components/RoomScheduleGrid';
import { FilterPanel } from './components/FilterPanel';
import './styles/app.css';

export default function App() {
  // 編集中のフィルター状態（一時的）
  const [tempShowAvailableOnly, setTempShowAvailableOnly] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [tempSelectedWeekdays, setTempSelectedWeekdays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  
  // 適用済みのフィルター状態（実際に表示に使われる）
  const [appliedShowAvailableOnly, setAppliedShowAvailableOnly] = useState(false);
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');
  const [appliedSelectedWeekdays, setAppliedSelectedWeekdays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  
  const [isTransposed, setIsTransposed] = useState(false); // 列と行の入れ替え状態

  // モックデータの生成（初回のみ、useMemoで固定）
  const { rooms, dates, data, reservableRooms } = useMemo(() => {
    const rooms = ['部屋1', '部屋2', '部屋3', '部屋4', '部屋5'];
    // 自分が予約可能な部屋を定義（部屋1, 3, 4のみ）
    const reservableRooms = ['部屋1', '部屋3', '部屋4'];
    const dates: string[] = [];
    const today = new Date();
    
    // 今日から14日間のデータを生成（フィルター用に多めに）
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const data: any = {};
    
    rooms.forEach(room => {
      data[room] = {};
      dates.forEach(date => {
        const timeSlots = [];
        for (let i = 0; i < 13; i++) {
          // ランダムに状態を生成
          const rand = Math.random();
          let status: 'available' | 'reserved-others' | 'reserved-self';
          let detail = '';
          
          if (rand < 0.5) {
            status = 'available';
            detail = '予約可能です';
          } else if (rand < 0.8) {
            status = 'reserved-others';
            detail = '山田太郎さんが予約中';
          } else {
            status = 'reserved-self';
            detail = 'あなたの予約';
          }
          
          timeSlots.push({
            id: i,
            status,
            startTime: `${8 + i}:00`,
            endTime: `${9 + i}:00`,
            detail
          });
        }
        data[room][date] = timeSlots;
      });
    });

    return { rooms, dates, data, reservableRooms };
  }, []); // 空の依存配列で初回のみ実行

  // デフォルトの日付範囲を設定（初回のみ）
  React.useEffect(() => {
    if (!tempStartDate && dates.length > 0) {
      setTempStartDate(dates[0]);
      setTempEndDate(dates[13]);
      setAppliedStartDate(dates[0]);
      setAppliedEndDate(dates[13]);
    }
  }, [dates, tempStartDate]);

  // フィルター適用（適用済みの状態を使用）
  const getFilteredData = () => {
    // 日付フィルター
    let filteredDates = dates.filter((date) => {
      const currentDate = new Date(date);
      const start = appliedStartDate ? new Date(appliedStartDate) : null;
      const end = appliedEndDate ? new Date(appliedEndDate) : null;

      if (start && currentDate < start) return false;
      if (end && currentDate > end) return false;

      // 曜日フィルター
      const weekday = currentDate.getDay();
      if (!appliedSelectedWeekdays.includes(weekday)) return false;

      return true;
    });

    // 部屋フィルター
    let filteredRooms = rooms;
    if (appliedShowAvailableOnly) {
      filteredRooms = rooms.filter((room) => {
        // 自分が予約できる部屋のみ表示
        return reservableRooms.includes(room);
      });
    }

    return { filteredRooms, filteredDates };
  };

  const { filteredRooms, filteredDates } = getFilteredData();

  // フィルターアプリケーションハンドラー
  const handleApplyFilters = () => {
    // 開始日と終了日の日数チェック
    if (tempStartDate && tempEndDate) {
      const start = new Date(tempStartDate);
      const end = new Date(tempEndDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 50) {
        alert('50日以上は同時に表示できません');
        return;
      }
    }
    
    setAppliedStartDate(tempStartDate);
    setAppliedEndDate(tempEndDate);
    setAppliedShowAvailableOnly(tempShowAvailableOnly);
    setAppliedSelectedWeekdays(tempSelectedWeekdays);
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <div className="app-header">
          <h1 className="app-title">部屋の空き情報</h1>
          <p className="app-description">各時間帯の状態を色で確認できます。詳細を見るには時間帯の上にカーソルを合わせてください。</p>
        </div>

        {/* フィルターパネル */}
        <FilterPanel
          showAvailableOnly={tempShowAvailableOnly}
          onShowAvailableOnlyChange={setTempShowAvailableOnly}
          startDate={tempStartDate}
          endDate={tempEndDate}
          onStartDateChange={setTempStartDate}
          onEndDateChange={setTempEndDate}
          selectedWeekdays={tempSelectedWeekdays}
          onWeekdaysChange={setTempSelectedWeekdays}
          isTransposed={isTransposed}
          onTransposedChange={setIsTransposed}
          onApplyFilters={handleApplyFilters}
        />

        <div className="grid-container">
          <div className="grid-legend">
            <div className="legend-item">
              <div className="legend-color legend-color-available"></div>
              <span className="legend-text">空室</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-color-reserved-others"></div>
              <span className="legend-text">他者が予約済み</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-color-reserved-self"></div>
              <span className="legend-text">自分が予約済み</span>
            </div>
          </div>

          <RoomScheduleGrid rooms={filteredRooms} dates={filteredDates} data={data} isTransposed={isTransposed} />
        </div>
      </div>
    </div>
  );
}