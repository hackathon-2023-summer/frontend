import { GetServerSideProps, NextPage } from "next";
import { useRouter } from 'next/router';
// import Layout from "../components/mainLayout/Layout";
import React, { useState } from 'react';
import Calendar from '../components/Calendar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import calendarStyle from "../styles/calendar.module.css";
import { withAuthCheck } from '../components/AuthCheck'

const Main: NextPage = () => {
  // 現在の日付から、現在の年（4桁）と現在の月のインデックス（0-11）を取得する。
  // 生成された数値は引数としてCalendar関数に渡される。
  const router = useRouter();
  const [monthCounter, setMonthCounter] = useState<number>(0);
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth();
  let selectedYear = thisYear;
  let selectedMonthIndex = thisMonth - monthCounter;
  const currentMonth = selectedMonthIndex + 1;

  const handleIncrement = () => {
    setMonthCounter(monthCounter + 1);
    if (selectedMonthIndex === 0) {
      setMonthCounter(0);
    }
  }

  const handleDecrement = () => {
    // 本月よりも後の月を選べないよう制御
    setMonthCounter(monthCounter - 1);
    if (selectedYear === thisYear && selectedMonthIndex === thisMonth) {
      setMonthCounter(0);
    }
  }

  const handleClickToMoveList = () => {
    router.push('/list');
  }

  return (
    <>
      <div className={calendarStyle.buttonBox}><button type="button" onClick={handleClickToMoveList}>リストで表示</button></div>
      <div className={`${calendarStyle.centering} ${calendarStyle.year}`}>{selectedYear}年</div>
      <div className={calendarStyle.centering}>
        <span className={calendarStyle["icon-container"]}>
          <FontAwesomeIcon icon={faCaretLeft} onClick={handleIncrement} />
        </span>
        <p className={calendarStyle.month}>{currentMonth}月</p>
        <span className={calendarStyle["icon-container"]}>
          <FontAwesomeIcon icon={faCaretRight} onClick={handleDecrement} />
        </span>
      </div>
      <Calendar year={selectedYear} month={selectedMonthIndex} />
    </>
  );
}

export const getServerSideProps = withAuthCheck();
export default Main;
