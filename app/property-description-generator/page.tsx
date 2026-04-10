import PropertyDescription from '@/components/PropertyDescription';
import { RelatedToolsCards } from '@/components/RelatedToolsCards';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Description Generator',
  description: 'Generate compelling property descriptions to increase bookings and maximize your listings today.'
};


export default function PropertyDescriptionGenerator () {
  return (
    <>
      <PropertyDescription/>
      <RelatedToolsCards currentTool="property-description-generator" />
    </>
  );
}
