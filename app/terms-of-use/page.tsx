import React from "react";

import { Metadata } from 'next';
import TermsOfUse from "@/components/TermsComponent";


export const metadata: Metadata = {
  title: 'PropertyListingsAI - Terms and Conditions',
  description: 'PropertyListingsAI terms and conditions detail the use of our AI tool, platform integrations, and guidelines to ensure accessibility and user compliance.'
};

const TermsPage = () => {


 

  
  return (
    <>
    <TermsOfUse/>
    </>
  );
};

export default TermsPage;