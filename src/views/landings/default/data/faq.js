// @project
import branding from '@/branding.json';

export const faq = {
  heading: 'Frequently Asked Questions',
  caption: `Everything you need to know about using ${branding.brandName} for government services.`,
  defaultExpanded: 'General',
  faqList: [
    {
      question: `What is ${branding.brandName}?`,
      answer: `${branding.brandName} is a comprehensive digital platform for government services in Palestine. It allows citizens and businesses to apply for permits, licenses, visas, and other government services online without visiting government offices.`,
      category: 'General'
    },
    {
      question: `Who can use ${branding.brandName} services?`,
      answer: `${branding.brandName} is available to all Palestinian citizens, residents, and businesses. Some services may have specific eligibility requirements which will be clearly stated during the application process.`,
      category: 'General'
    },
    {
      question: `What documents do I need to apply for services?`,
      answer: {
        content: `Required documents vary by service type. Generally, you may need:`,
        type: 'list',
        data: [
          { primary: 'Valid ID or passport' },
          { primary: 'Proof of residence' },
          { primary: 'Service-specific documents' },
          { primary: 'Digital photos when required' }
        ]
      },
      category: 'General'
    },
    {
      question: `How long does it take to process applications?`,
      answer:
        'Processing times vary by service type. Simple document requests may take 1-2 business days, while complex permits may take 5-10 business days. You can track your application status in real-time through our platform.',
      category: 'General'
    },
    {
      question: 'Is my personal information secure?',
      answer:
        'Yes, we use advanced encryption and security protocols to protect your personal information. All data transmission is encrypted, and we comply with international data protection standards.',
      category: 'General'
    },
    {
      question: `What payment methods are accepted?`,
      answer: {
        content: 'We accept various payment methods for your convenience:',
        type: 'list',
        data: [
          { primary: `Credit/Debit Cards (Visa, MasterCard)` },
          { primary: `Bank transfers` },
          { primary: `Mobile payment platforms` },
          { primary: `Cash payment at designated centers` }
        ]
      },
      category: 'Fees & Payment'
    },
    {
      question: `Are there any service fees?`,
      answer: {
        content:
          'Service fees vary depending on the type of application. All fees are clearly displayed before you submit your application. Government fees are standardized and non-negotiable.',
        type: 'list',
        data: [
          { primary: `Transparent pricing displayed upfront` },
          { primary: `No hidden charges` },
          { primary: `Receipt provided for all payments` }
        ]
      },
      category: 'Fees & Payment'
    },
    {
      question: 'Can I get a refund if my application is rejected?',
      answer:
        'Processing fees are generally non-refundable as they cover the administrative costs of reviewing your application. However, if your application is rejected due to a system error, you may be eligible for a refund.',
      category: 'Fees & Payment'
    },
    {
      question: 'How can I track my application status?',
      answer: {
        content: 'You can track your application status through multiple channels:',
        type: 'list',
        data: [
          { primary: `Online tracking with application number` },
          { primary: `SMS notifications for status updates` },
          { primary: `Email alerts at each stage` }
        ]
      },
      category: 'Application Process'
    },
    {
      question: 'What if I need help during the application process?',
      answer: {
        content: 'We provide comprehensive support to help you complete your applications:',
        type: 'list',
        data: [
          { primary: `24/7 online chat support` },
          { primary: `Step-by-step application guides` },
          { primary: `Video tutorials for complex processes` },
          { primary: `Phone support during business hours` }
        ]
      },
      category: 'Application Process'
    },
    {
      question: 'Can I save my application and complete it later?',
      answer:
        'Yes, you can save your application progress at any stage and return to complete it later. Your saved application will be available for 30 days.',
      category: 'Application Process'
    },
    {
      question: 'What languages are supported?',
      answer:
        'The platform is available in both Arabic and English. You can switch languages at any time using the language selector in the top menu.',
      category: 'Application Process'
    }
  ],
  getInTouch: {
    link: { children: 'Get in Touch', href: branding.company.socialLink.support, target: '_blank', rel: 'noopener noreferrer' }
  },
  categories: ['General', 'Fees & Payment', 'Application Process'],
  activeCategory: 'General'
};
