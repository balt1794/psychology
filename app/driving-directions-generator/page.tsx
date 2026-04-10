import DrivingDirections from '@/components/DrivingDirections';
import { RelatedToolsCards } from '@/components/RelatedToolsCards';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driving Directions Generator',
  description: 'Generate clear and optimized driving directions to your property. Provide a step-by-step guidance on how to get to your property easily.'
};


export default function DrivingDirectionsGenerator () {
  return (
    <>
      <DrivingDirections/>
      <RelatedToolsCards currentTool="driving-directions-generator" />
    </>
  );
}
