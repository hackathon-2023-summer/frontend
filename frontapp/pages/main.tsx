import Link from "next/link";
import { useRouter } from 'next/router';
import Layout from "../components/mainLayout/Layout";
import React,{ useState } from 'react';
import Calendar from '../components/Calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import generalStyle from "../styles/generalStyle.module.css";
import calendarStyle from "../styles/calendar.module.css";

// メインページ
const Main: React.FC = () => {
    // 現在の日付から、現在の年（4桁）と現在の月のインデックス（0-11）を取得する。
    // 生成された数値は引数としてCalendar関数に渡される。
    const router = useRouter();
    const [ monthCounter, setMonthCounter ]= useState<number>(0);
    const [ yearCounter, setYearCounter ]= useState<number>(0);
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    const selectedYear = thisYear - yearCounter;
    // monthCounter(0-11)
    let selectedMonthIndex = thisMonth - monthCounter;

    // 年度を下跨ぎする場合の処理
    if(selectedYear !== thisYear){
        selectedMonthIndex = 11 - monthCounter;
    }

    const currentMonth = selectedMonthIndex + 1;

    // <減算のためのカウンターを制御>
    // 前月を選択した場合はmonthCounterをselectedMonthIndexから減算する。
    // 1月に達した場合はmonthCounterを初期値に戻す。
    const handleIncrementMonth = () => {
        setMonthCounter(monthCounter + 1);
        if(selectedMonthIndex === 0){
            setYearCounter(yearCounter + 1);
            setMonthCounter(0);
        }
    }

    // <加算のためのカウンターを制御>
    // 翌月を選択した場合はmonthCounterをselectedMonthIndexへ加算する。
    // 11月に達した場合はmmonthCounterをMax値（11）にする。
    const handleDecrementMonth = () => {
        // <本月よりも後の月を選べないよう制御>
        setMonthCounter(monthCounter - 1);
        if(selectedYear === thisYear && selectedMonthIndex === thisMonth){
            setMonthCounter(0);
        }
        if(selectedYear !== thisYear && selectedMonthIndex === 11 && thisYear === selectedYear + 1){
            setYearCounter(yearCounter - 1);
            setMonthCounter(11 - (11 - thisMonth));
        }
        if(selectedYear !== thisYear && selectedMonthIndex === 11 && thisYear !== selectedYear + 1){
            setYearCounter(yearCounter - 1);
            setMonthCounter(11);
        }
    }

    // <Show Listボタン押下時にページ遷移>
    const handleClickToMoveList = () => {
        router.push('/list');
    }

    return (
        <Layout>
            <div className={`${generalStyle.centering} ${generalStyle.padLR22}`}>
                <div className={calendarStyle.year}>{selectedYear}</div>
                <div className={`${generalStyle.flxrow}`}>
                    <div className={generalStyle.w1p3}></div>
                    <div className={`${calendarStyle.monthBox} ${generalStyle.w1p3} ${generalStyle.tAc}`}>
                        <span className={calendarStyle["icon-container"]}>
                            <FontAwesomeIcon icon={faCaretLeft} onClick={handleIncrementMonth}/>
                        </span>
                        <p className={calendarStyle.month}>{currentMonth}月</p>
                        <span className={calendarStyle["icon-container"]}>
                                <FontAwesomeIcon icon={faCaretRight} onClick={handleDecrementMonth} />
                        </span>
                    </div>
                    <div className={`${generalStyle.w1p3} ${generalStyle.tAr}`}>
                        <button type="button" className={calendarStyle.listButton} onClick={handleClickToMoveList}>Show List</button>
                    </div>
                </div>
                <Calendar year={selectedYear} month={selectedMonthIndex} />
            </div>
        </Layout>
    );
};

export default Main;
