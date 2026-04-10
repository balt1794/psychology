import InstantListing from '@/components/InstantListing';
import { RelatedToolsCards } from '@/components/RelatedToolsCards';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Airbnb Listing Generator',
  description: 'Generate a fully optimized and compelling Airbnb listing using AI to attract more guests, increase bookings, and maximize revenue'
};


export default function AirbnbListing () {
  return (
    <>
      <InstantListing/>
      <RelatedToolsCards currentTool="airbnb-listing" />
    </>
  );
}
