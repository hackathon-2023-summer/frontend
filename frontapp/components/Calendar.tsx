import dayjs from 'dayjs';
import calendarStyle from "../styles/calendar.module.css";
import { useEffect, useState } from 'react';

interface CalenderProps {
    year: number;
    month: number;
}
interface Recipe {
    category: string;
    date: string;
    id: number;
    is_favorite: boolean;
    photo: string;
    recipename: string;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calender: React.FC<CalenderProps> = ({ year, month }) => {
    const [recipeData, setRecipeData] = useState<Recipe[] | null>(null);

    const getCookie = (name: string): string | undefined => {
        const value = `; ${document.cookie}`;
        const parts: string[] = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    }

    // 今月の初日
    const firstDateOfThisMonth = dayjs(new Date(year, month, 1))
    // 今月の初日の曜日
    const firstDayOfThisMonth = firstDateOfThisMonth.day();
    // 今月の初日が日曜日ならそのまま、そうでない場合は先月の最終日曜日をカレンダー初日にする。
    const startDate = firstDayOfThisMonth === 0
        ? firstDateOfThisMonth
        : firstDateOfThisMonth.subtract(firstDayOfThisMonth, 'day');

    // 今月の末日
    const lastDateOfThisMonth = dayjs(new Date(year, month + 1, 0))
    // 今月の末日の曜日
    const lastDayOfThisMonth = lastDateOfThisMonth.day();
    // 今月の末日が土曜日ならそのまま、そうでない場合は来月の最初土曜日をカレンダー末日にする。
    const endDate = lastDayOfThisMonth === 6
        ? lastDateOfThisMonth
        : lastDateOfThisMonth.add(6 - lastDayOfThisMonth, 'day');

    const totalDays = endDate.diff(startDate, 'day') + 1;
    const totalWeeks = Math.ceil(totalDays / 7);
    const calendarWeeks = Math.max(4, Math.min(6, totalWeeks)); // 表示範囲は最低4週、最高6週になる。
    const calendarDays: string[][] = [];
    let currentDate = startDate;

    // 表示用に7日*4〜6週の配列calenderDaysに格納
    for (let week = 0; week < calendarWeeks; week++) {
        const weekDays: string[] = [];
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            weekDays.push(currentDate.format('YYYY-MM-DD'));
            currentDate = currentDate.add(1, 'day');
        }
        calendarDays.push(weekDays);
    }

    useEffect(() => {
        const startDateFormatted = startDate.format('YYYY-MM-DD');
        const endDateFormatted = endDate.format('YYYY-MM-DD');
        const url = `http://localhost/fast/recipes/?start_date=${startDateFormatted}&end_date=${endDateFormatted}`;
        const token = getCookie('userToken');
        const headers = {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        fetch(url, { headers })
            .then(response => response.json())
            .then((recipeData) => setRecipeData(recipeData))
            .catch(error => console.error('バックエンドからのデータ取得に失敗:', error));
    }, [year, month]);

    console.log(recipeData)

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
                    {calendarDays.map((week, rowIndex) => (
                        <tr key={rowIndex}>
                            {week.map((dateStr, colIndex) => {
                                const day = dayjs(dateStr).date(); // 日付部分のみを取得
                                const recipe = recipeData?.find((recipe) => recipe.date === dateStr);
                                return (
                                    <td key={colIndex} className={`${calendarStyle.td}`}>
                                        <div className={calendarStyle.cell}>
                                            <p className={`${colIndex === 0 ? calendarStyle.sun : ''}${colIndex === 6 ? calendarStyle.sat : ''}`}>
                                                {day} {/* 日付の表示 */}
                                            </p>
                                            {recipe?.photo && (
                                                <img
                                                    src={recipe.photo}
                                                    alt={recipe.recipename}
                                                    className={calendarStyle.hideimage}
                                                />
                                            )}
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default Calender
