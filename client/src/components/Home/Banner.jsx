import React from 'react'
import landing_banner from "../../assets/landing_banner.png";

const Banner = () => {
    return (
        <>
            <div className=" lg:flex justify-between items-center h-auto lg:py-12 py-4 lg:px-12 bg-white">
                <div className="p-2 lg:px-5 flex justify-center ">
                    <p className="text-3xl lg:text-4xl italic font-bold ">
                        Transform your lab with Flabs Pathology software!
                    </p>
                </div>
                <div className="flex justify-center cursor-pointer">
                    <img src={landing_banner} alt="" />
                </div>
            </div>
        </>
    )
}

export default Banner