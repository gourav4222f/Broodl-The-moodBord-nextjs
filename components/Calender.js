"use client"

import React, { useState } from 'react'

import { Fugaz_One } from "next/font/google";
import { gradients } from '@/utils/gradients';
import { baseRating } from '@/utils/data';
const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] })

export default function Calender(props) {



    const months = {
        'January': 'Jan',
        'February': 'Feb',
        'March': 'Mar',
        'April': 'Apr',
        'May': 'May',
        'June': 'Jun',
        'July': 'Jul',
        'August': 'Aug',
        'September': 'Sep',
        'October': 'Oct',
        'November': 'Nov',
        'December': 'Dec',
    };
    const monthsArr = Object.keys(months)
    const now = new Date();

    const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const { demo, campleteData, handleSetMood } = props;

    const today = new Date();
    const currMonth = today.getMonth();
    const [selectedMonth, setSelectedMonth] = useState(monthsArr[currMonth]);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear())

    const monthNow = new Date(selectedYear, monthsArr.indexOf(selectedMonth), 1);
    const firstDayOfMonth = monthNow.getDay();
    const daysInMonth = new Date(selectedYear, monthsArr.indexOf(selectedMonth) + 1, 0).getDate();

    const dayToDisplay = firstDayOfMonth + daysInMonth;
    const numRows = (Math.floor(dayToDisplay / 7)) + ((dayToDisplay % 7) ? 1 : 0)

    console.log("selected month", selectedMonth);


    function handleIncrementMonths(val) {
        const newNumericMonth = (numericMonth + val) % 12;
        if (newNumericMonth < 0) {
            setSelectedYear(curr => curr - 1);
            setSelectedMonth(monthsArr[monthsArr.length + newNumericMonth]);
        } else if (newNumericMonth > 11) {
            setSelectedYear(curr => curr + 1);
            setSelectedMonth(monthsArr[newNumericMonth - 12]);
        } else {
            setSelectedMonth(monthsArr[newNumericMonth]);
        }
    }

    function handleGoToToday() {
        const t = new Date()
        setSelectedYear(t.getFullYear())
        setSelectedMonth(monthsArr[t.getMonth()])
    }


    const numericMonth = monthsArr.indexOf(selectedMonth)
    const data = campleteData?.[selectedYear]?.[numericMonth] || {};

    const demodata = {
        "1": 5, "2": 4, "3": 5, "4": 2, "5": 1,
        "6": 5, "7": 4, "8": 5, "9": 2, "10": 1,
        "11": 5, "12": 4, "13": 5, "14": 2, "15": 1,
        "16": 5, "17": 4, "18": 5, "19": 2, "20": 1,
        "21": 5, "22": 4, "23": 5, "24": 2, "25": 1,
        "26": 5, "27": 2, "28": 5, "29": 2, "30": 1,
        "31": 5, "32": 2, "33": 3, "34": 2, "35": 1,
        "36": 5, "37": 2, "38": 3, "39": 2, "40": 1,
        "41": 5, "42": 4, "43": 3, "44": 2, "45": 1,
        "46": 5, "47": 4, "48": 3, "49": 2, "50": 1,
    }

    return (
        <div className=' flex flex-col gap-2 '>
            <div className=' grid grid-cols-3 gap-4 items-center'>
                <button onClick={() => { handleIncrementMonths(-1) }} className=' text-3xl sm:text-4xl rounded-full px-5 bg-indigo-200 text-indigo-600 hover:bg-indigo-700 hover:text-indigo-200 duration-200 mr-auto'>{`<`}</button>
                <div className='flex flex-col items-center gap-2'>
                    <p className={' text-center capitalize text-gradient ' + fugaz.className}>{`${selectedYear}  , ${selectedMonth}`}</p>
                    <button onClick={handleGoToToday} className='text-xs px-3 py-1 border border-indigo-400 text-indigo-600 rounded-full hover:bg-indigo-100 duration-200'>Current</button>
                </div>
                <button onClick={() => { handleIncrementMonths(+1) }} className=' text-3xl sm:text-4xl rounded-full px-5 bg-indigo-200 text-indigo-600 hover:bg-indigo-700 hover:text-indigo-200 duration-200 ml-auto'>{`>`}</button>
            </div>
            <div className='flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10'>
                {[...Array(numRows).keys()].map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className='grid grid-cols-7 gap-1'>
                            {dayList.map((dayOfWeek, dayOfWeekIndex) => {
                                const dayIndex = rowIndex * 7 + dayOfWeekIndex - (firstDayOfMonth - 1);
                                const dayDisplay = dayIndex > daysInMonth ? false : row === 0 && dayOfWeekIndex < firstDayOfMonth ? false : true;
                                const isToday = dayIndex === now.getDate();

                                if (!dayDisplay) {
                                    return <div className='bg-white' key={dayOfWeekIndex} />;
                                }

                                let color = demo ? gradients.indigo[baseRating[demodata[dayIndex]]] : dayIndex in data ? gradients.indigo[data[dayIndex]] : "white";

                                return (
                                    <div style={{ background: color }} key={dayOfWeekIndex} className={'text-xs sm:text-sm border border-solid p-2 flex items-center gap-2 justify-between rounded-lg '
                                        + ((isToday) ? ' border-indigo-400' : 'border-indigo-100')
                                        + ((color === 'white') ? ' text-indigo-800' : ' text-indigo-50')
                                    }>
                                        <p>{dayIndex}</p>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}






