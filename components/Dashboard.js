"use client"

import React, { useState, useEffect } from 'react'
import { Fugaz_One } from "next/font/google";
import Calender from './Calender';
import { useAuth } from '@/context/AuthContext';
import { average, doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Login from './Login';
import Loading from './Loading';

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] })
export default function Dashboard() {

    const { currentUser, userDataObj, setuserDataObj, loading } = useAuth()
    const [data, setData] = useState({})
    const [filter, setFilter] = useState('all') // week | month | year | all
    const now = new Date()


    async function handleSetMood(mood) {
        try {
            const day = now.getDate()
            const month = now.getMonth()
            const year = now.getFullYear()

            const newData = { ...userDataObj }

            // Ensure the structure exists for year, month, and day
            if (!newData[year]) {
                newData[year] = {}
            }
            if (!newData[year][month]) {
                newData[year][month] = {}
            }

            // Update the mood for today
            newData[year][month][day] = mood

            setData(newData) // Update local state

            setuserDataObj(newData) // Update user data object

            const docRef = doc(db, 'users', currentUser.uid)
            await setDoc(docRef, newData, { merge: true }) // Merge the entire newData object
        } catch (error) {
            console.log(error)
        }
    }


    function getMoodAt(dateObj) {
        const y = dateObj.getFullYear()
        const m = dateObj.getMonth()
        const d = dateObj.getDate()
        return data?.[y]?.[m]?.[d]
    }

    function computeAll() {
        let totalDays = 0
        let sum = 0
        for (const y of Object.keys(data || {})) {
            for (const m of Object.keys(data[y] || {})) {
                for (const d of Object.keys(data[y][m] || {})) {
                    const mood = data[y][m][d]
                    if (typeof mood === 'number') {
                        totalDays++
                        sum += mood
                    }
                }
            }
        }
        return { num_day: totalDays, Average_mood: totalDays ? (sum / totalDays) : 0 }
    }

    function computeYear() {
        const y = now.getFullYear()
        let totalDays = 0
        let sum = 0
        const months = data?.[y] || {}
        for (const m of Object.keys(months)) {
            const days = months[m] || {}
            for (const d of Object.keys(days)) {
                const mood = days[d]
                if (typeof mood === 'number') {
                    totalDays++
                    sum += mood
                }
            }
        }
        return { num_day: totalDays, Average_mood: totalDays ? (sum / totalDays) : 0 }
    }

    function computeMonth() {
        const y = now.getFullYear()
        const m = now.getMonth()
        const days = data?.[y]?.[m] || {}
        let totalDays = 0
        let sum = 0
        for (const d of Object.keys(days)) {
            const mood = days[d]
            if (typeof mood === 'number') {
                totalDays++
                sum += mood
            }
        }
        return { num_day: totalDays, Average_mood: totalDays ? (sum / totalDays) : 0 }
    }

    function computeWeek() {
        // Last 7 days including today
        let totalDays = 0
        let sum = 0
        for (let i = 0; i < 7; i++) {
            const date = new Date(now)
            date.setDate(now.getDate() - i)
            const mood = getMoodAt(date)
            if (typeof mood === 'number') {
                totalDays++
                sum += mood
            }
        }
        return { num_day: totalDays, Average_mood: totalDays ? (sum / totalDays) : 0 }
    }

    function getStatuses() {
        switch (filter) {
            case 'week':
                return computeWeek()
            case 'month':
                return computeMonth()
            case 'year':
                return computeYear()
            case 'all':
            default:
                return computeAll()
        }
    }

    const statuses = {
        ...getStatuses(),
        time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
    }
    const moods = {
        "@#$@%": '😭',
        'Sad': '😢',
        'Existing': '😑',
        'Good': '😊',
        'Elated': '😆',
    }



    useEffect(() => {
        if (!currentUser || !userDataObj) {
            return
        }
        setData(userDataObj)
    }, [currentUser, userDataObj])


    let children;

    if (loading) {
        children = <Loading />;
    } else if (!currentUser) {
        children = <Login />;
    } else {
        children = (
            <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
                <div className='flex flex-col gap-3'>
                    <div className='flex gap-2 flex-wrap'>
                        {['week','month','year','all'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded-full border text-sm capitalize ${filter===f ? 'bg-indigo-600 text-white border-indigo-600' : 'border-indigo-300 text-indigo-600 hover:bg-indigo-100'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 rounded-lg p-4 gap-4'>
                        {Object.keys(statuses).map((Status, StatusIndex) => {
                            return (
                                <div key={StatusIndex} className='flex flex-col gap-1 sm:gap-2'>
                                    <p className='truncate capitalize font-medium text-xs sm:text-sm'>{Status.replaceAll('_', " ")}</p>
                                    <p className={'text-base truncate ' + fugaz.className}>{
                                        Status === 'Average_mood' ? (Number.isFinite(statuses[Status]) ? statuses[Status].toFixed(2) : '-') : statuses[Status]
                                    }</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
                
                <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>
                    How do you <span className='text-gradient'>feel</span> today?
                </h4>
                <div className='flex items-stretch flex-wrap gap-4'>
                    {Object.keys(moods).map((mood, moodIndex) => {
                        return (
                            <button onClick={() => {
                                const currentMoodValue = moodIndex + 1;
                                handleSetMood(currentMoodValue);
                            }}
                                className={'p-4 px-5 rounded-2xl purple-shadow duration-200 bg-indigo-50 hover:bg-indigo-200 text-center flex items-center flex-col gap-2 flex-1'} key={moodIndex}>
                                <p className='text-4xl sm:text-5xl md:text-6xl'>{moods[mood]}</p>
                                <p className={'text-indigo-500 text-xs sm:text-sm md:text-base ' + fugaz.className}>{mood}</p>
                            </button>
                        )
                    })}
                </div>
                <Calender campleteData={data} handleSetMood={handleSetMood} />
                
            </div>
        );
    }

    return children;
}
