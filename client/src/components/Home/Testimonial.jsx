import React from 'react'
import testimonial_icon from "../../assets/testimonial_icon.png";

const Testimonial = () => {
    return (
        <>
            <div className="bg-gray-50 w-full py-12">
                <p className="text-center text-btn-color font-medium">TESTIMONIALS</p>
                <p className="text-center text-3xl md:text-4xl lg:text-5xl font-regular font-bold py-4">
                    What our customers say
                </p>
                <div className="md:flex justify-around w-full sm:px-24 md:px-5 lg:px-32 space-y-3 md:space-y-0 px-5 gap-10 py-12  ">
                    <div className="border border-btn-color p-6 text-justify rounded-lg bg-white ">
                        <img src={testimonial_icon} height={40} width={40} alt="" />
                        <p className="py-2">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
                            quidem optio suscipit. Deserunt a quia dicta aliquam
                            exercitationem harum? Dolorum commodi a asperiores ut
                            reprehenderit consequatur nesciunt vero necessitatibus veritatis?
                        </p>
                        <p className="text-[12px] text-btn-color font-medium">
                            NIDAN DIAGONISTICS
                        </p>
                        <p className="font-medium">Mr. Shubham Kumar</p>
                    </div>

                    <div className="border border-btn-color p-6 text-justify rounded-lg bg-white">
                        <img src={testimonial_icon} height={40} width={40} alt="" />
                        <p className="py-2">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
                            quidem optio suscipit. Deserunt a quia dicta aliquam
                            exercitationem harum? Dolorum commodi a asperiores ut
                            reprehenderit consequatur nesciunt vero necessitatibus veritatis?
                        </p>
                        <p className="text-[12px] text-btn-color font-medium">
                            NIDAN DIAGONISTICS
                        </p>
                        <p className="font-medium">Mr. Akshay Kumar</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Testimonial