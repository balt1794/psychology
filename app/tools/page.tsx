import React from "react";

import { Metadata } from 'next';
import Tools from "@/components/Tools";


export const metadata: Metadata = {
  title: 'Real Estate Listing Tools',
  description: 'Discover powerful real estate listing tools to streamline property management, marketing, and sales for agents and buyers.'
};

const ToolsPage = () => {


 

  
  return (
    <>
    <Tools/>
    </>
  );
};

export default ToolsPage;

