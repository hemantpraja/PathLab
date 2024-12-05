import React from "react";
import Banner from "./Banner";
import Features from "./Features";
import Security from "./Security";
import Testimonial from "./Testimonial";
import CustomerSupport from "./CustomerSupport";
import Faq from "./Faq";
import Footer from "./Footer";
import Header from "./Header";

function Home() {
  return (
    <>
      <Header/>
      <div className="mt-20 ">
        {/* banner section */}
        <Banner />

        {/* features section */}
        <Features />

        {/* security section */}
        <Security />

        {/*  Testimonial section */}
        <Testimonial />

        {/* Customer Support section */}
        <CustomerSupport />

        {/* Faq section */}
        <Faq />

        {/* Footer section */}
        <Footer />
      </div>
    </>

  );
}

export default Home;
