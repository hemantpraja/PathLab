import React from 'react'
import { BsSendArrowUpFill } from 'react-icons/bs'
import { PiUserCircleCheckLight } from 'react-icons/pi'
import { SlGraph } from 'react-icons/sl'
import { VscSettingsGear } from 'react-icons/vsc'

const Features = () => {
    return (
        <>
            {/*  Powerful features section */}
            <div className=" w-full lg:px-32 py-12 ">
                <p className="text-center font-regular text-3xl md:text-4xl lg:text-5xl font-bold py-4">
                    Powerful features
                </p>
                <div className="md:flex lg:gap-12 px-5 space-y-5 md:space-y-0 md:px-3 xl:px-0">
                    <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-3">
                        <div className="flex justify-center bg-blue-50 rounded-full p-3 w-14  ">
                            <VscSettingsGear className="font-bold text-3xl flex items-center justify-center" />
                        </div>
                        <div>
                            <p className="font-bold font-sans text-xl py-2">Streamlined Lab Operations</p>
                            <p className="font-medium text-sm text-justify">With Flabs, you can easily manage patient registration, automate lab analysis, and generate QR coded reports for seamless access and sharing. Flabs integrates with WhatsApp, enabling automated communication and reducing manual efforts. By optimizing processes and minimizing manual tasks, Flabs helps you save time, improve accuracy, and enhance overall lab productivity.</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-3">
                        <div className="flex justify-center bg-blue-50 rounded-full p-3 w-14  ">
                            <PiUserCircleCheckLight className="font-bold text-3xl flex items-center justify-center" />
                        </div>
                        <div>
                            <p className="font-bold font-sans text-xl py-2">Streamlined Lab Operations</p>
                            <p className="font-medium text-sm text-justify">With Flabs, you can easily manage patient registration, automate lab analysis, and generate QR coded reports for seamless access and sharing. Flabs integrates with WhatsApp, enabling automated communication and reducing manual efforts. By optimizing processes and minimizing manual tasks, Flabs helps you save time, improve accuracy, and enhance overall lab productivity.</p>
                        </div>
                    </div>
                </div>
                <div className="md:flex lg:gap-12 px-5 space-y-5 md:space-y-0 md:px-3 xl:px-0 mt-5 md:mt-8">
                    <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-3">
                        <div className="flex justify-center bg-blue-50 rounded-full p-3 w-14  ">
                            <SlGraph className="font-bold text-3xl flex items-center justify-center" />
                        </div>
                        <div>
                            <p className="font-bold font-sans text-xl py-2">Streamlined Lab Operations</p>
                            <p className="font-medium text-sm text-justify">With Flabs, you can easily manage patient registration, automate lab analysis, and generate QR coded reports for seamless access and sharing. Flabs integrates with WhatsApp, enabling automated communication and reducing manual efforts. By optimizing processes and minimizing manual tasks, Flabs helps you save time, improve accuracy, and enhance overall lab productivity.</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-3">
                        <div className="flex justify-center bg-blue-50 rounded-full p-3 w-14  ">
                            <BsSendArrowUpFill className="font-bold text-3xl flex items-center justify-center" />
                        </div>
                        <div>
                            <p className="font-bold font-sans text-xl py-2">Streamlined Lab Operations</p>
                            <p className="font-medium text-sm text-justify">With Flabs, you can easily manage patient registration, automate lab analysis, and generate QR coded reports for seamless access and sharing. Flabs integrates with WhatsApp, enabling automated communication and reducing manual efforts. By optimizing processes and minimizing manual tasks, Flabs helps you save time, improve accuracy, and enhance overall lab productivity.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Features