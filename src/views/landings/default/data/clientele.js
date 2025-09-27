'use client';
// @project
import { DynamicComponentType } from '@/enum';

export const clientele = {
  title: `Trusted by global brands and public institutions`,
  subtitle: 'Tasheel supports compliance-heavy industries, high-growth tech, and government agencies with multilingual expertise.',
  clienteleList: [
    {
      name: 'Global Bank',
      image: { component: 'clientele/Dribbble', type: DynamicComponentType.IMAGE }
    },
    {
      name: 'MedTech Alliance',
      image: { component: 'clientele/Reddit', type: DynamicComponentType.IMAGE }
    },
    {
      name: 'SaaS Platform',
      image: { component: 'clientele/Mui', type: DynamicComponentType.IMAGE }
    },
    {
      name: 'National Immigration Office',
      image: { component: 'clientele/Devto', type: DynamicComponentType.IMAGE }
    },
    {
      name: 'Media Network',
      image: { component: 'clientele/Envato', type: DynamicComponentType.IMAGE }
    }
  ]
};

export const clientele2 = {
  title: 'Language technology & delivery partners',
  clienteleList: [
    { image: { component: 'clientele/Techlify', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Marketly', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Realtor', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Financely', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Realtor', type: DynamicComponentType.IMAGE } }
  ]
};
