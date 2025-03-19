import HouseRules from '@/components/HouseRules';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Airbnb House Rules Generator',
  description: 'Generate clear house rules for your Airbnb property. Set guest expectations and protect your space with professionally crafted rules.'
};


export default function HouseRulesGenerator () {
  return (
    <HouseRules/>
);
}
