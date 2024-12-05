import React from 'react'
import { BsDatabaseFillCheck } from 'react-icons/bs'
import { HiUserGroup } from 'react-icons/hi'
import { SiSpringsecurity } from 'react-icons/si'

const Security = () => {
    return (
        <>
            <div className="bg-slate-100 w-full lg:px-32 py-12 ">
                <p className="text-center text-3xl md:text-4xl lg:text-5xl font-regular font-bold py-4">
                    Your data is <span className="text-btn-color">safe</span> with us!
                </p>
                <div className="flex justify-around py-5">
                    <div className="w-1/6 ">
                        <HiUserGroup className="text-btn-color text-5xl mx-auto " />
                        <p className="py-3 font-normal text-center">Your patients are linked only to you</p>
                    </div>
                    <div className="w-1/6 ">
                        <BsDatabaseFillCheck className="text-btn-color text-5xl mx-auto " />
                        <p className="py-3 font-normal text-center">Secure data backups and disaster recovery options</p>
                    </div>
                    <div className="w-1/6 ">
                        <SiSpringsecurity className="text-btn-color text-5xl mx-auto " />
                        <p className="py-3 font-normal text-center">Compliance with industry security standards and regulations</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Security