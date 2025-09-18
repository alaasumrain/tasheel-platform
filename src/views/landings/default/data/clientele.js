// @project
import { DynamicComponentType } from '@/enum';

export const clientele = {
  title: `Trusted by Government Departments and Citizens`,
  subtitle: 'Working together to deliver efficient digital services across Palestine',
  clienteleList: [
    { 
      name: 'Ministry of Interior',
      image: { component: 'clientele/Dribbble', type: DynamicComponentType.IMAGE } 
    },
    { 
      name: 'Ministry of Health',
      image: { component: 'clientele/Reddit', type: DynamicComponentType.IMAGE } 
    },
    { 
      name: 'Ministry of Labor',
      image: { component: 'clientele/Mui', type: DynamicComponentType.IMAGE } 
    },
    { 
      name: 'Tax Authority',
      image: { component: 'clientele/Devto', type: DynamicComponentType.IMAGE } 
    },
    { 
      name: 'Land Registry',
      image: { component: 'clientele/Envato', type: DynamicComponentType.IMAGE } 
    }
  ]
};

export const clientele2 = {
  title: '50,000+ Citizens Served Monthly',
  clienteleList: [
    { image: { component: 'clientele/Techlify', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Marketly', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Realtor', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Financely', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Realtor', type: DynamicComponentType.IMAGE } }
  ]
};