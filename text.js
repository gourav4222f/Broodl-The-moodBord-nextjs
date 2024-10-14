import React from 'react'

import { Fugaz_One } from "next/font/google";
import { gradients } from '@/utils/gradients';
import { baseRating } from '@/utils/data';
const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] })

export default function Calender(props) {
    const { demo } = props;

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
    const now = new Date();

    const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const year = 2024;
    const month = 'July';
    const monthNow = new Date(year, Object.keys(months).indexOf(month), 1);
    const firstDayOfMonth = monthNow.getDay();
    const daysInMonth = new Date(year, Object.keys(months).indexOf(month) + 1, 0).getDate();

    const dayToDisplay = firstDayOfMonth + daysInMonth;
    const numRows = (Math.floor(dayToDisplay / 7)) + ((dayToDisplay % 7) ? 1 : 0)

    const data = {
        "15": 1, "16": 5, "17": 4, "18": 5, "19": 2,
        "20": 1, "21": 5, "22": 4, "23": 5, "24": 2,
    }

    return (
        <div className=' flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10'>
            {[...Array(numRows).keys()].map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className=' grid grid-cols-7 gap-1'>
                        {dayList.map((dayOfWeek, dayOfWeekIndex) => {
                            const dayIndex = rowIndex * 7 + dayOfWeekIndex - (firstDayOfMonth - 1);
                            const dayDisplay = dayIndex > daysInMonth ? false : row === 0 && dayOfWeekIndex < firstDayOfMonth ? false : true;
                            const isToday = dayIndex === now.getDate();

                            if (!dayDisplay) {
                                return <div className='bg-white' key={dayOfWeekIndex} />;
                            }

                            let color = (demo ? gradients.indigo[baseRating[dayIndex]] : dayIndex in data ? gradients.indigo[data[dayIndex]] : "white");
                            return (
                                <div style={{ background: color }} key={dayOfWeekIndex} className={'text-xs sm:text-sm border border-solid p-2 flex items-center gap-2 justify-between rounded-lg '
                                    + ((isToday) ? ' border-indigo-400' : 'border-indigo-100')
                                    + ((color === 'white') ? ' text-indigo-400' : ' text-indigo-50')
                                }>
                                    <p>{dayIndex}</p>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div >
    )
}
