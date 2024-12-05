import React from 'react'

const CustomerSupport = () => {
    return (
        <>
            <div className="bg-gray-100 lg:flex justify-between items-center lg:px-32 py-20 w-full px-3 sm:px-16">
                <div className="space-y-2 w-full flex flex-col lg:items-start items-center py-6 justify-center ">
                    <p className="text-btn-color text-md font-medium">CUSTOMER SUPPORT</p>
                    <p className="text-3xl text-md font-bold font-sans">
                        Support for every problem
                    </p>
                    <p className="text-md ">
                        We'd love to help you resolve your problem.
                    </p>
                </div>
                <div className="flex justify-around rounded-lg p-5  bg-white w-full shadow-lg ">
                    <div>
                        <p>Write to us at</p>
                        <p className="text-btn-color">hello@flabs.in</p>
                    </div>
                    <div className="w-[1px] bg-gray-300"></div>
                    <div className="">
                        <p className="">Write to us at</p>
                        <p className="text-btn-color">hello@flabs.in</p>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CustomerSupport