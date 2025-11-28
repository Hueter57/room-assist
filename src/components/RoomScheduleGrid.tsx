import React from 'react';
import { TimeSlotCell } from './TimeSlotCell';

interface RoomScheduleGridProps {
  rooms: string[];
  dates: string[];
  data: any;
  isTransposed?: boolean;
}

export function RoomScheduleGrid({ rooms, dates, data, isTransposed = false }: RoomScheduleGridProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${month}/${day}(${weekday})`;
  };

  // 時間帯ラベルを生成（8:00から20:00まで）
  const timeLabels = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);

  // 転置表示の場合（日付が縦、部屋が横）
  if (isTransposed) {
    return (
      <div className="schedule-grid">
        <div className="schedule-grid-inner">
          {/* ヘッダー行 */}
          <div className="schedule-header-row">
            <div className="schedule-header-corner">
              <span className="schedule-header-text">日付 / 部屋</span>
            </div>
            {rooms.map((room) => (
              <div key={room} className="schedule-header-cell">
                <span className="schedule-header-text">{room}</span>
              </div>
            ))}
          </div>

          {/* 時間帯ラベル行 */}
          <div className="schedule-time-row">
            <div className="schedule-time-corner">
            </div>
            {rooms.map((room) => (
              <div key={`time-${room}`} className="schedule-time-cell">
                <div className="schedule-time-labels">
                  {timeLabels.map((time, index) => (
                    <div key={index} className="schedule-time-label">
                      {time.replace(':00', '')}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* データ行 */}
          {dates.map((date, dateIndex) => (
            <div
              key={date}
              className={`schedule-data-row ${dateIndex % 2 === 0 ? 'schedule-data-row-even' : 'schedule-data-row-odd'}`}
            >
              <div className="schedule-row-label">
                <span className="schedule-row-label-text">{formatDate(date)}</span>
              </div>
              {rooms.map((room) => (
                <div key={`${date}-${room}`} className="schedule-data-cell">
                  <TimeSlotCell
                    room={room}
                    date={date}
                    timeSlots={data[room][date]}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // デフォルト表示（部屋が縦、日付が横）
  return (
    <div className="schedule-grid">
      <div className="schedule-grid-inner">
        {/* ヘッダー行 */}
        <div className="schedule-header-row">
          <div className="schedule-header-corner">
            <span className="schedule-header-text">部屋 / 日付</span>
          </div>
          {dates.map((date) => (
            <div key={date} className="schedule-header-cell">
              <span className="schedule-header-text">{formatDate(date)}</span>
            </div>
          ))}
        </div>

        {/* 時間帯ラベル行 */}
        <div className="schedule-time-row">
          <div className="schedule-time-corner">
          </div>
          {dates.map((date) => (
            <div key={`time-${date}`} className="schedule-time-cell">
              <div className="schedule-time-labels">
                {timeLabels.map((time, index) => (
                  <div key={index} className="schedule-time-label">
                    {time.replace(':00', '')}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* データ行 */}
        {rooms.map((room, roomIndex) => (
          <div
            key={room}
            className={`schedule-data-row ${roomIndex % 2 === 0 ? 'schedule-data-row-even' : 'schedule-data-row-odd'}`}
          >
            <div className="schedule-row-label">
              <span className="schedule-row-label-text">{room}</span>
            </div>
            {dates.map((date) => (
              <div key={`${room}-${date}`} className="schedule-data-cell">
                <TimeSlotCell
                  room={room}
                  date={date}
                  timeSlots={data[room][date]}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
