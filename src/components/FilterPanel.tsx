import React from 'react';

interface FilterPanelProps {
  showAvailableOnly: boolean;
  onShowAvailableOnlyChange: (value: boolean) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  selectedWeekdays: number[];
  onWeekdaysChange: (weekdays: number[]) => void;
  isTransposed: boolean;
  onTransposedChange: (value: boolean) => void;
  onApplyFilters: () => void;
}

export function FilterPanel({
  showAvailableOnly,
  onShowAvailableOnlyChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectedWeekdays,
  onWeekdaysChange,
  isTransposed,
  onTransposedChange,
  onApplyFilters,
}: FilterPanelProps) {
  const weekdays = [
    { value: 0, label: '日' },
    { value: 1, label: '月' },
    { value: 2, label: '火' },
    { value: 3, label: '水' },
    { value: 4, label: '木' },
    { value: 5, label: '金' },
    { value: 6, label: '土' },
  ];

  const handleWeekdayToggle = (weekdayValue: number) => {
    if (selectedWeekdays.includes(weekdayValue)) {
      onWeekdaysChange(selectedWeekdays.filter((w) => w !== weekdayValue));
    } else {
      onWeekdaysChange([...selectedWeekdays, weekdayValue]);
    }
  };

  return (
    <div className="filter-panel">
      {/* 部屋フィルター */}
      <div className="filter-section">
        <h3 className="filter-title">部屋</h3>
        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) => onShowAvailableOnlyChange(e.target.checked)}
            className="filter-checkbox"
          />
          <span className="filter-checkbox-text">自分が予約可能な部屋のみ表示</span>
        </label>
      </div>

      {/* 時間フィルター */}
      <div className="filter-section">
        <h3 className="filter-title">時間</h3>
        <div className="filter-time-section">
          {/* 日付範囲 */}
          <div className="filter-date-row">
            <div className="filter-date-group">
              <label className="filter-label">開始日:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="filter-date-input"
              />
            </div>
            <div className="filter-date-group">
              <label className="filter-label">終了日:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="filter-date-input"
              />
            </div>
          </div>

          {/* 曜日選択 */}
          <div className="filter-weekday-group">
            <label className="filter-weekday-label">曜日:</label>
            <div className="filter-weekday-checkboxes">
              {weekdays.map((weekday) => (
                <label
                  key={weekday.value}
                  className="filter-weekday-item"
                >
                  <input
                    type="checkbox"
                    checked={selectedWeekdays.includes(weekday.value)}
                    onChange={() => handleWeekdayToggle(weekday.value)}
                    className="filter-checkbox"
                  />
                  <span className="filter-checkbox-text">{weekday.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ボタン */}
      <div className="filter-buttons">
        <button
          onClick={onApplyFilters}
          className="filter-apply-button"
        >
          更新
        </button>

        <button
          onClick={() => onTransposedChange(!isTransposed)}
          className="filter-transpose-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <polyline points="15 14 12 17 15 20" />
            <polyline points="9 4 12 7 9 10" />
          </svg>
          <span>列と行を入れ替え</span>
        </button>
      </div>
    </div>
  );
}
