import React from 'react'
import { Fugaz_One } from "next/font/google";


const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] })

export default function Button(props) {
    const { text, dark, full, clickHandler, disabled, loading } = props;
    return (
        <button onClick={clickHandler} disabled={disabled || loading} className={`border-indigo-600 border-2 border-solid rounded-full overflow-hidden duration-200 ` +
            (dark ?
                ' text-white bg-indigo-600 ' :
                ' text-indigo-600'
            ) +
            (full ?
                ' grid place-items-center w-full' :
                ''
            ) +
            ((disabled || loading) ? ' opacity-50 cursor-not-allowed ' : ' hover:opacity-60 ')
            }>

            <p className={' px-6 sm:px-10 whitespace-nowrap py-2 sm:py-3 ' + fugaz.className}>
                {loading ? 'Please wait…' : text}
            </p>
        </button>
    )
}
