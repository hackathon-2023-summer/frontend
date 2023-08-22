import dayjs from 'dayjs';
import { useEffect, useState } from "react";

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
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/recipes/?start_date=${startDateFormatted}&end_date=${endDateFormatted}`;
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


    return (<>
    </>)
}

export default Calender





// import dayjs from 'dayjs';
// import calendarStyle from "../styles/calendar.module.css";
// import { useEffect, useState } from 'react';

// interface CalenderProps {
//     year: number;
//     month: number;
// }
// interface Recipe {
//     category: string;
//     date: string;
//     id: number;
//     is_favorite: boolean;
//     photo: string;
//     recipename: string;
// }

// const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// const Calender: React.FC<CalenderProps> = ({ year, month }) => {
//     const [recipeData, setRecipeData] = useState<Recipe[] | null>(null);

//     const getCookie = (name: string): string | undefined => {
//         const value = `; ${document.cookie}`;
//         const parts: string[] = value.split(`; ${name}=`);
//         if (parts.length === 2) return parts.pop()?.split(';').shift();
//     }

//     // 今月の初日
//     const firstDateOfThisMonth = dayjs(new Date(year, month, 1))
//     // 今月の初日の曜日
//     const firstDayOfThisMonth = firstDateOfThisMonth.day();
//     // 今月の初日が日曜日ならそのまま、そうでない場合は先月の最終日曜日をカレンダー初日にする。
//     const startDate = firstDayOfThisMonth === 0
//         ? firstDateOfThisMonth
//         : firstDateOfThisMonth.subtract(firstDayOfThisMonth, 'day');

//     // 今月の末日
//     const lastDateOfThisMonth = dayjs(new Date(year, month + 1, 0))
//     // 今月の末日の曜日
//     const lastDayOfThisMonth = lastDateOfThisMonth.day();
//     // 今月の末日が土曜日ならそのまま、そうでない場合は来月の最初土曜日をカレンダー末日にする。
//     const endDate = lastDayOfThisMonth === 6
//         ? lastDateOfThisMonth
//         : lastDateOfThisMonth.add(6 - lastDayOfThisMonth, 'day');

//     const totalDays = endDate.diff(startDate, 'day') + 1;
//     const totalWeeks = Math.ceil(totalDays / 7);
//     const calendarWeeks = Math.max(4, Math.min(6, totalWeeks)); // 表示範囲は最低4週、最高6週になる。
//     const calendarDays: string[][] = [];
//     let currentDate = startDate;

//     // 表示用に7日*4〜6週の配列calenderDaysに格納
//     for (let week = 0; week < calendarWeeks; week++) {
//         const weekDays: string[] = [];
//         for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
//             weekDays.push(currentDate.format('YYYY-MM-DD'));
//             currentDate = currentDate.add(1, 'day');
//         }
//         calendarDays.push(weekDays);
//     }

//     useEffect(() => {
//         const startDateFormatted = startDate.format('YYYY-MM-DD');
//         const endDateFormatted = endDate.format('YYYY-MM-DD');
//         const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/fast/recipes/?start_date=${startDateFormatted}&end_date=${endDateFormatted}`;
//         const token = getCookie('userToken');
//         const headers = {
//             'accept': 'application/json',
//             'Authorization': `Bearer ${token}`
//         };

//         fetch(url, { headers })
//             .then(response => response.json())
//             .then((recipeData) => setRecipeData(recipeData))
//             .catch(error => console.error('バックエンドからのデータ取得に失敗:', error));
//     }, [year, month]);

//     return (
//         <div className={calendarStyle.tableCentering}>
//             <table className={calendarStyle.table}>
//                 <thead>
//                     <tr>
//                         {daysOfWeek.map((day) => (
//                             <th key={day} className={`${calendarStyle.tableheader} ${day === 'Sun' ? calendarStyle.sun : ''} ${day === 'Sat' ? calendarStyle.sat : ''}`}>{day}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {calendarDays.map((week, rowIndex) => (
//                         <tr key={rowIndex}>
//                             {week.map((dateStr, colIndex) => {
//                                 const day = dayjs(dateStr).date(); // 日付部分のみを取得
//                                 const recipe = recipeData?.find((recipe) => recipe.date === dateStr);
//                                 return (
//                                     <td key={colIndex} className={`${calendarStyle.td}`}>
//                                         <div className={calendarStyle.cell}>
//                                             <p className={`${colIndex === 0 ? calendarStyle.sun : ''}${colIndex === 6 ? calendarStyle.sat : ''}`}>
//                                                 {day} {/* 日付の表示 */}
//                                             </p>
//                                             {recipe?.photo && (
//                                                 <img
//                                                     src={recipe.photo}
//                                                     alt={recipe.recipename}
//                                                     className={calendarStyle.hideimage}
//                                                 />
//                                             )}
//                                         </div>
//                                     </td>
//                                 )
//                             })}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     )
// }
// export default Calender



// import React, { useState, useEffect } from 'react';
// import calendarStyle from "../styles/calendar.module.css";
// import { RecipeData } from '../pages/api/getRecipeData';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCircleXmark, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
// import ReactHtmlParser from 'html-react-parser';
// import DOMPurify from 'dompurify';
// import { useRouter } from 'next/router';

// const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// // カレンダー関数、引数の型付け
// interface CalendarProps {
//     year: number;
//     month: number;
// }


// /*  カレンダー本体
//     main.tsxから渡されたyearとmonthを元に、カレンダーテーブルを生成。
//     year=本年、month=本月
// */
// const Calendar: React.FC<CalendarProps> = ({ year, month }) => {
//     const router = useRouter();
//     const firstDayOfThisMonth = new Date(year, month, 1);
//     const lastDayOfThisMonth = new Date(year, month + 1, 0);
//     const lastDayOfPreviousMonth = new Date(year, month, 0);
//     const daysInTHisMonth = lastDayOfThisMonth.getDate();
//     const startDayOfThisWeek = firstDayOfThisMonth.getDay();
//     const lastDateOfPreviousWeek = lastDayOfPreviousMonth.getDate();
//     const firstDateOfPreviousWeek = lastDateOfPreviousWeek - startDayOfThisWeek + 1;

//     const [filteredData, setFlteredData] = useState<RecipeData[]>([]);
//     const [selectedDetailData, setSelectedDetailData] = useState<RecipeData[]>([]);
//     const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
//     const [islVisible, setIsVisible] = useState(false);
//     const [currentImageIndex, setCurrentImageIndex] = useState<number | undefined>(
//         filteredData.length > 0 ? 0 : undefined
//     );


//     useEffect(() => {
//         // バッっクエンドで取得したRecipeテーブルAPIデータを取得
//         fetch('/api/getRecipeData')
//             .then(response => response.json())
//             .then((filteredData: RecipeData[]) => setFlteredData(filteredData))
//             .catch(error => console.error('バックエンドからのデータ取得に失敗:', error));
//     }, []);

//     // カレンダー配列
//     const calendarRows = [];
//     // 一時保存配列：週毎に値を格納する
//     let daysInRow = [];

//     for (let i = 0; i < startDayOfThisWeek; i++) {
//         daysInRow.push(firstDateOfPreviousWeek + i);
//     }

//     // 取得した1月の日付分繰り返す
//     for (let day = 1; day <= daysInTHisMonth; day++) {
//         daysInRow.push(day);
//         // 7日分を格納した後、calendarRows配列にdaysInRowを挿入、配列を初期化
//         if (daysInRow.length === 7) {
//             // カレンダー配列の作成
//             calendarRows.push(daysInRow);
//             daysInRow = [];
//         }
//     }
//     // 配列の中身に入れるものがなくなれば処理を終了する。
//     if (daysInRow.length > 0) {
//         calendarRows.push(daysInRow);
//     }
//     // 不足分を追加
//     for (let i=0; calendarRows[calendarRows.length-1].length < 7 ; i++) {
//         calendarRows[calendarRows.length-1].push(i+1);
//     }

//     const handleCellClick = (clickedDate: number, image_url:string) => {
//         const clickedDateData = filteredData.filter(item => {
//             const date = new Date(item.date);
//             return (
//                 date.getFullYear() === year &&
//                 date.getMonth() === month &&
//                 date.getDate() === clickedDate
//             );
//         });
//         setSelectedDetailData(clickedDateData);
//         setSelectedImage(image_url);

//         const clickedImageData = clickedDateData.find(item => item.imageUrl);

//         if (clickedImageData) {
//             setSelectedImage(clickedImageData.imageUrl);
//         } else {
//             setSelectedImage(undefined);
//         }

//         if (clickedImageData) {
//             setSelectedImage(clickedImageData.imageUrl);
//             setIsVisible(true);
//         } else {
//             setSelectedImage(undefined);
//             setIsVisible(false);
//         }
//     };

// // モーダル外がクリックされた場合、モーダルを閉じる
//     // const handleModalOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     //     const target = event.target as HTMLElement;
//     //     if (target.classList.contains("imageModal")) {
//     //         handleModalClose();
//     //     }
//     // };

//     const handleModalClose = () => {
//         setIsVisible(false);
//     };

// // スライドアクション
//     const handleSlideLeft = () => {
//         if(currentImageIndex === undefined){
//             return;
//         }
//         if (currentImageIndex > 0) {
//             setCurrentImageIndex(currentImageIndex - 1);
//         }
//     };

//     const handleSlideRight = () => {
//         if(currentImageIndex === undefined){
//             return;
//         }
//         if (currentImageIndex < selectedDetailData.length - 1) {
//             setCurrentImageIndex(currentImageIndex + 1);
//         }
//     };

//     const showSelectedImage = (item: RecipeData) => {
//         // setCurrentImageIndex(2);
//         return (
//             <div key={item.id} className={calendarStyle.activeImage}>
//                 <img src={item.imageUrl} alt="完成画像" />
//             </div>
//         );
//     }

//     return (
//         <div>
//             {/* <pre>
//                 <code>{JSON.stringify(data, null, 2)}</code>
//             </pre> */}
//             <table className={calendarStyle.table}>
//                 <thead>
//                     <tr>
//                         {daysOfWeek.map((day) => (
//                             <th key={day} className={`${calendarStyle.tableheader} ${day === 'Sun' ? calendarStyle.sun : ''} ${day === 'Sat' ? calendarStyle.sat : ''}`}>{day}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {calendarRows.map((row, rowIndex) => (
//                         <tr key={rowIndex}>
//                             {row.map((day, dayIndex) => (
//                                 <td key={dayIndex} className={calendarStyle.td}>
//                                     <div className={calendarStyle.cell} onClick={() => {
//                                             let image_url = '';
//                                             const clickedDateData = filteredData.filter(item => {
//                                                 const date = new Date(item.date);
//                                                 image_url = item.imageUrl;

//                                                 return (
//                                                     date.getFullYear() === year &&
//                                                     date.getMonth() === month &&
//                                                     date.getDate() === day
//                                                 );
//                                             });
//                                             if (clickedDateData.length === 0) {
//                                                 router.push('/submitRecipe');
//                                             } else {
//                                                 handleCellClick(day, image_url)
//                                             }
//                                         }}
//                                     >
//                                         <p className={`${dayIndex === 0 ? calendarStyle.sun :''} ${dayIndex === 6 ? calendarStyle.sat :''}`}>
//                                             {day}
//                                         </p>
//                                         {/* filteredData の内容を表示 */}
//                                         {filteredData.map((item) => {
//                                             const isMatchingDate =
//                                                 year === Number(item.date.slice(0, 4)) &&
//                                                 month === Number(item.date.slice(5, 7)) - 1 &&
//                                                 day === Number(item.date.slice(-2));

//                                             const isUnMatchingMonth =
//                                                 (rowIndex === 0 && day.toString().length === 2) ||
//                                                 (rowIndex === calendarRows.length-1 && day.toString().length === 1);

//                                                 if (isMatchingDate && isUnMatchingMonth && item.imageUrl) {
//                                                     return (
//                                                         <img
//                                                             key={item.id}
//                                                             src={item.imageUrl}
//                                                             alt="Recipe Image"
//                                                             className={calendarStyle.hideimage}
//                                                         />
//                                                     );
//                                                 }

//                                                 if (isMatchingDate && !isUnMatchingMonth && item.imageUrl) {
//                                                     return (
//                                                         <img
//                                                             key={item.id}
//                                                             src={item.imageUrl}
//                                                             alt="Recipe Image"
//                                                             className={calendarStyle.currentmonthimage}
//                                                         />
//                                                     );
//                                                 }

//                                                 return null;
//                                         })}
//                                     </div>
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             {islVisible && (
//                 <div className={calendarStyle.detailContainer}>
//                         {selectedDetailData.map(item => (
//                             <div key={item.id}>
//                                 <div className={calendarStyle.recipeTitleBox}>
//                                     <p className={calendarStyle.recipeTitle}>{item.recipename}</p>
//                                     <p className={calendarStyle.createDate}>作成日: {item.date}</p>
//                                 </div>
//                                 <div className={calendarStyle.detailBtnBox}>
//                                     <p className={calendarStyle.category}>カテゴリ: {item.category}</p>
//                                     <button>詳細を表示</button>
//                                 </div>
//                                 <div className={calendarStyle.overviewBox}>
//                                     {ReactHtmlParser(DOMPurify.sanitize(item.overview))}
//                                 </div>
//                             </div>
//                         ))}
//                 </div>
//             )}
//             {islVisible && (
//                 <div className={calendarStyle.imageModal}>
//                     <FontAwesomeIcon icon={faCircleXmark} onClick={handleModalClose} className={calendarStyle.closeIcon}/>
//                     <div className={calendarStyle.showPreviousBox} onClick={handleSlideLeft}>
//                         <FontAwesomeIcon icon={faAngleLeft} className={calendarStyle.showNext}/>
//                     </div>
//                     {filteredData.filter(item => item.imageUrl).map((item, index) => (
//                         selectedImage === item.imageUrl ?
//                             showSelectedImage(item)
//                         :
//                             <div key={item.id} className={calendarStyle.hiddenImage}>
//                                 <img src={item.imageUrl} alt="完成画像" />
//                             </div>
//                     ))}
//                     {/* {selectedImage && <img src={selectedImage} alt="完成画像" />} */}
//                     <div className={calendarStyle.showNextBox} onClick={handleSlideRight}>
//                         <FontAwesomeIcon icon={faAngleRight} className={calendarStyle.showNext}/>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Calendar;