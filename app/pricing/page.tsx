import React from "react";

import { Metadata } from 'next';
import Pricing from "@/components/Pricing";

export const metadata: Metadata = {
  title: 'PropertyListingsAI - Pricing',
  description: 'Explore flexible pricing plans for PropertyListingsAI and find the perfect solution to enhance your real estate listings.'
};

const PricingPage = () => {


  return (
    <>
    <Pricing/>
    </>
  );
};

export default PricingPage;