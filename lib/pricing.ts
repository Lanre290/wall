export interface PricingTier {
  id: 'free' | 'celebration' | 'plus' | 'organization';
  name: string;
  tagline: string;
  price: string;
  cadence?: string;
  highlighted?: boolean;
  badge?: string;
  ctaText: string;
  ctaAction: 'free' | 'checkout' | 'subscribe' | 'contact';
  features: string[];
  description: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'For casual memory collecting.',
    price: '$0',
    ctaText: 'Get Started Free',
    ctaAction: 'free',
    description: 'Perfect for trying out Thoughtboard or collecting notes from a small circle.',
    features: [
      '1 basic board',
      'Limited classic themes & sticky colors',
      'Standard sharing links',
      '200 character limit per note',
      'Standard digital font',
      'Community abuse reporting'
    ]
  },
  {
    id: 'celebration',
    name: 'Celebration Pass',
    tagline: 'For single milestone occasions.',
    price: '$7',
    cadence: 'one-time',
    highlighted: true,
    badge: 'Most Popular for Events',
    ctaText: 'Get Celebration Pass',
    ctaAction: 'checkout',
    description: 'Ideal for graduations, birthdays, farewells, anniversaries, and personal milestones.',
    features: [
      '1 dedicated celebration board',
      'All premium themes & seasonal palettes',
      'Authentic handwriting fonts & stickers',
      'Animated decorative accents',
      'Downloadable keepsake memory book',
      'Extended archive & preservation period',
      'Enhanced sharing & custom link'
    ]
  },
  {
    id: 'plus',
    name: 'Plus',
    tagline: 'For passionate curators & clubs.',
    price: '$6',
    cadence: '/ month',
    ctaText: 'Subscribe to Plus',
    ctaAction: 'subscribe',
    description: 'Designed for ongoing memory keeping, multiple boards, and avid archivists.',
    features: [
      'Unlimited boards & memories',
      'Expanded media & note storage',
      'All present & future premium themes',
      'Full typography & handwriting suite',
      'Advanced board controls & customization',
      'Early access to new features'
    ]
  },
  {
    id: 'organization',
    name: 'Organization & Events',
    tagline: 'For universities, weddings & galas.',
    price: 'Custom',
    cadence: 'per event or annual',
    ctaText: 'Inquire for Event',
    ctaAction: 'contact',
    description: 'Built for large gatherings, campus cohorts, brand activations, and weddings needing full moderation.',
    features: [
      'Custom branding & organization colors',
      'Print-ready high-res QR codes for tables & banners',
      'Pre-moderation queue (approve notes before public view)',
      'Team & committee multi-admin access',
      'Engagement analytics & scan metrics',
      'Dedicated event support & high-capacity servers'
    ]
  }
];
