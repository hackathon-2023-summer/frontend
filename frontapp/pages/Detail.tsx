// import Link from "next/link";
import { useRouter } from 'next/router';
import Layout from "../components/mainLayout/Layout";
import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import generalStyle from "../styles/generalStyle.module.css";
// import calendarStyle from "../styles/calendar.module.css";
import { withAuthCheck } from '../components/AuthCheck'
import detailStyle from "../styles/detail.module.css";

// 詳細ページ
const Main: React.FC = () => {
    // 現在の日付から、現在の年（4桁）と現在の月のインデックス（0-11）を取得する。
    // 生成された数値は引数としてCalendar関数に渡される。
    const recipe_title = 'Stake';
    const create_date = '2023.08.20'
    const recipe_summary = '今日は良いことがあったので、お肉を食べたい気分でした。'
    const sequence_list = '作り方'
    const sequence_number = '1.'
    const sequence_description = 'お肉の下拵え'

    const router = useRouter();
    const [monthCounter, setMonthCounter] = useState<number>(0);
    const [yearCounter, setYearCounter] = useState<number>(0);
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    const selectedYear = thisYear - yearCounter;
    // monthCounter(0-11)
    let selectedMonthIndex = thisMonth - monthCounter;

    // 年度を下跨ぎする場合の処理
    if (selectedYear !== thisYear) {
        selectedMonthIndex = 11 - monthCounter;
    }

    const currentMonth = selectedMonthIndex + 1;

    // <減算のためのカウンターを制御>
    // 前月を選択した場合はmonthCounterをselectedMonthIndexから減算する。
    // 1月に達した場合はmonthCounterを初期値に戻す。
    const handleIncrementMonth = () => {
        setMonthCounter(monthCounter + 1);
        if (selectedMonthIndex === 0) {
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
        if (selectedYear === thisYear && selectedMonthIndex === thisMonth) {
            setMonthCounter(0);
        }
        if (selectedYear !== thisYear && selectedMonthIndex === 11 && thisYear === selectedYear + 1) {
            setYearCounter(yearCounter - 1);
            setMonthCounter(11 - (11 - thisMonth));
        }
        if (selectedYear !== thisYear && selectedMonthIndex === 11 && thisYear !== selectedYear + 1) {
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
            <div className={detailStyle.centering}>
            {/* ・レシピのタイトル */}
                <div className={detailStyle.recipe_title}>{recipe_title}</div>
            {/* ・作成日 */}
                <div className={detailStyle.create_date}>{create_date}</div>
            {/* ・完成画像 */}
                <div className={detailStyle.photo_layout}>
                    <img src="/img/27185828_s.jpg" alt="chiken_nanban" />
                </div>
            {/* ・レシピ概要 */}
                <textarea className={detailStyle.recipe_summary}>{recipe_summary}</textarea>
            {/* ・作成手順 */}
                <div className={detailStyle.sequence_list}>{sequence_list}</div>
                {/* 　-手順番号 */}
                    <span className={detailStyle.sequence_number}>{sequence_number}</span>
                {/* 　-手順説明 */}
                    <span className={detailStyle.sequence_description}>{sequence_description}</span>
            </div>
        </Layout>
    );
};
export const getServerSideProps = withAuthCheck();

export default Main;
