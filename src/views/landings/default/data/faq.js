'use client';
// @project
import branding from '@/branding.json';

export const faq = {
  heading: 'Frequently Asked Questions',
  caption: `How ${branding.brandName} handles translation today—and how we set the foundation for every future service you need.`,
  defaultExpanded: 'Services',
  faqList: [
    {
      question: `What is ${branding.brandName}?`,
      answer: `${branding.brandName} is Tasheel's dedicated language services division. We provide document translation, localisation, interpreting, transcription, and multimedia language solutions delivered by certified linguists in 120+ languages.`,
      category: 'Services'
    },
    {
      question: 'Which services do you offer?',
      answer: {
        content: 'We cover the full spectrum of professional language services:',
        type: 'list',
        data: [
          { primary: 'Certified document translation (legal, immigration, academic)' },
          { primary: 'Website, software, and marketing localisation' },
          { primary: 'On-site, remote, and on-demand interpreting' },
          { primary: 'Subtitling, voiceover, transcription, and DTP' }
        ]
      },
      category: 'Services'
    },
    {
      question: 'Do you provide certified or notarised translations?',
      answer:
        'Yes. Certified translations include a signed statement from our linguists and project manager. Notarisation and apostille services are available in supported jurisdictions on request.',
      category: 'Services'
    },
    {
      question: 'How fast can you deliver?',
      answer:
        'Standard documents complete within 24–48 hours. Complex or high-volume projects are scheduled with dedicated teams and agreed SLAs. Rush and same-day turnarounds are available with express fees.',
      category: 'Services'
    },
    {
      question: 'How does pricing work?',
      answer:
        'Translation is typically priced per word, interpreting per minute or per day, and multimedia projects by audio minute or deliverable. Every quote clearly outlines scope, turnaround, and any rush or certification fees.',
      category: 'Pricing & Payment'
    },
    {
      question: 'What payment methods do you accept?',
      answer: {
        content: 'We accept the following payment options:',
        type: 'list',
        data: [
          { primary: 'Credit / debit cards (Visa, MasterCard, Amex)' },
          { primary: 'International bank transfer and ACH' },
          { primary: 'Invoices with PO for approved enterprises' },
          { primary: 'Digital wallets upon request' }
        ]
      },
      category: 'Pricing & Payment'
    },
    {
      question: 'Is there a minimum project size?',
      answer:
        'Our minimum billing for ad-hoc translation projects starts at $75. Enterprise agreements can bundle requests into monthly retainers or volume-based pricing tiers.',
      category: 'Pricing & Payment'
    },
    {
      question: 'Do you use machine translation?',
      answer:
        'We blend secure neural machine translation with human post-editing when it improves turnaround or cost. Pure human translation is used for certified, legal, and highly sensitive content.',
      category: 'Operations'
    },
    {
      question: 'How do you protect sensitive information?',
      answer:
        'All uploads are encrypted in transit and at rest. Access is role-based, NDAs are standard for linguists, and we can enforce bespoke data residency or on-prem workflows for regulated industries.',
      category: 'Operations'
    },
    {
      question: 'Which file formats do you support?',
      answer: {
        content: 'We work with most document, design, and development formats including:',
        type: 'list',
        data: [
          { primary: 'DOCX, XLSX, PPTX, PDF, InDesign, Illustrator' },
          { primary: 'JSON, YAML, PO, RESX, XLIFF, CSV' },
          { primary: 'Video/audio links (MP4, MOV, MP3, WAV)' },
          { primary: 'Subtitles (SRT, VTT, STL) and proprietary formats' }
        ]
      },
      category: 'Operations'
    },
    {
      question: 'How do we get started?',
      answer:
        'Share your files and requirements through the quote form or speak with our language desk. We scope the project, align on turnaround and quality expectations, then onboard your dedicated linguist pod.',
      category: 'Operations'
    }
  ],
  getInTouch: {
    link: { children: 'Talk to an expert', href: '/contact?intent=consult' }
  },
  categories: ['Services', 'Pricing & Payment', 'Operations'],
  activeCategory: 'Services'
};
