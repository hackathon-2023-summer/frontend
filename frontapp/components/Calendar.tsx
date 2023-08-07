import React from 'react';
import calendarStyle from "../styles/calendar.module.css";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// カレンダー関数、引数の型付け
interface CalendarProps {
    year: number;
    month: number;
}

/*  カレンダー本体
    main.tsxから渡されたyearとmonthを元に、カレンダーテーブルを生成。
    year=本年、month=本月
*/
const Calendar: React.FC<CalendarProps> = ({ year, month }) => {
    const firstDayOfThisMonth = new Date(year, month, 1);
    const lastDayOfThisMonth = new Date(year, month + 1, 0);
    const lastDayOfPreviousMonth = new Date(year, month, 0);
    const daysInTHisMonth = lastDayOfThisMonth.getDate();
    const startDayOfThisWeek = firstDayOfThisMonth.getDay();
    const lastDateOfPreviousWeek = lastDayOfPreviousMonth.getDate();
    const firstDateOfPreviousWeek = lastDateOfPreviousWeek - startDayOfThisWeek + 1;

    // カレンダー配列
    const calendarRows = [];
    // 一時保存配列：週毎に値を格納する
    let daysInRow = [];

    for (let i = 0; i < startDayOfThisWeek; i++) {
        daysInRow.push(firstDateOfPreviousWeek + i);
    }

    // 取得した1月の日付分繰り返す
    for (let day = 1; day <= daysInTHisMonth; day++) {
        daysInRow.push(day);
        // 7日分を格納した後、calendarRows配列にdaysInRowを挿入、配列を初期化
        if (daysInRow.length === 7) {
            // カレンダー配列の作成
            calendarRows.push(daysInRow);
            daysInRow = [];
        }
    }
    // 配列の中身に入れるものがなくなれば処理を終了する。
    if (daysInRow.length > 0) {
        calendarRows.push(daysInRow);
    }
    // 不足分を追加
    for (let i=0; calendarRows[calendarRows.length-1].length < 7 ; i++) {
        calendarRows[calendarRows.length-1].push(i+1);
    }

    const imageUrl = '/imgs/26649380_s.jpg';

    return (
        <div className={calendarStyle.tableCentering}>
            <table className={calendarStyle.table}>
            <thead>
                    <tr>
                        {daysOfWeek.map((day) => (
                            <th key={day} className={`${calendarStyle.tableheader} ${day === 'Sun' ? calendarStyle.sun : ''} ${day === 'Sat' ? calendarStyle.sat : ''}`}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {calendarRows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((day, dayIndex) => (
                                <td key={dayIndex} className={calendarStyle.tablebody}>
                                    <p className=
                                        {`
                                            ${dayIndex === 0 ? calendarStyle.sun :''}
                                            ${dayIndex === 6 ? calendarStyle.sat :''}
                                        `}
                                    >
                                        {day}
                                    </p>
                                    <div>
                                        {
                                            (rowIndex === 0 && day.toString().length === 2) ||
                                            (rowIndex === calendarRows.length-1 && day.toString().length === 1) ?
                                                    <
                                                        img
                                                        src={imageUrl}
                                                        alt="Recipe Image"
                                                        className={calendarStyle.hideimage}
                                                    /> :
                                                    <
                                                        img
                                                        src={imageUrl}
                                                        alt="Recipe Image"
                                                        className={calendarStyle.currentmonthimage}
                                                    />
                                        }
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Calendar;
