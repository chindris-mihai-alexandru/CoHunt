'use client';

import { 
  LiquidButton, 
  LiquidCard, 
  LiquidInput, 
  LiquidNav, 
  LiquidBadge 
} from '@/components/liquid-glass';
import { Search, Briefcase, MapPin, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function DesignSystemPage() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen">
      {/* Liquid Glass Navigation */}
      <LiquidNav>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CoHunt Liquid Glass Design
          </h1>
          <div className="flex gap-4">
            <LiquidButton variant="glass" size="sm">Home</LiquidButton>
            <LiquidButton variant="primary" size="sm">Jobs</LiquidButton>
            <LiquidButton variant="accent" size="sm">Profile</LiquidButton>
          </div>
        </div>
      </LiquidNav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4">Liquid Glass Design System</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A revolutionary design language inspired by Apple's Liquid Glass, creating translucent, 
            dynamic interfaces that adapt and morph to enhance user experience.
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-semibold mb-6">Buttons</h3>
          <LiquidCard className="mb-8">
            <div className="flex flex-wrap gap-4">
              <LiquidButton variant="glass">Glass Button</LiquidButton>
              <LiquidButton variant="primary">Primary Button</LiquidButton>
              <LiquidButton variant="secondary">Secondary Button</LiquidButton>
              <LiquidButton variant="accent">Accent Button</LiquidButton>
            </div>
          </LiquidCard>

          <LiquidCard variant="primary" className="mb-8">
            <h4 className="text-lg font-medium mb-4">Button Sizes</h4>
            <div className="flex flex-wrap gap-4 items-center">
              <LiquidButton size="sm">Small</LiquidButton>
              <LiquidButton size="md">Medium</LiquidButton>
              <LiquidButton size="lg">Large</LiquidButton>
              <LiquidButton fullWidth>Full Width Button</LiquidButton>
            </div>
          </LiquidCard>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-semibold mb-6">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LiquidCard hover>
              <h4 className="text-lg font-semibold mb-2">Default Card</h4>
              <p className="text-gray-600 dark:text-gray-400">
                This card has hover effects with morphing animations.
              </p>
            </LiquidCard>

            <LiquidCard variant="primary" elevated>
              <h4 className="text-lg font-semibold mb-2">Primary Elevated</h4>
              <p className="text-blue-900 dark:text-blue-100">
                This card floats with a gentle animation.
              </p>
            </LiquidCard>

            <LiquidCard variant="accent" hover>
              <h4 className="text-lg font-semibold mb-2">Accent with Hover</h4>
              <p className="text-pink-900 dark:text-pink-100">
                Combines hover and accent styling.
              </p>
            </LiquidCard>
          </div>
        </section>

        {/* Input Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-semibold mb-6">Inputs</h3>
          <LiquidCard>
            <div className="space-y-6">
              <LiquidInput
                label="Basic Input"
                placeholder="Enter text here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />

              <LiquidInput
                icon={Search}
                label="Search Jobs"
                placeholder="Search for your dream job..."
              />

              <LiquidInput
                icon={MapPin}
                label="Location"
                placeholder="San Francisco, CA"
              />

              <LiquidInput
                icon={Briefcase}
                label="Job Type"
                placeholder="Full-time, Remote..."
                error="Please select a valid job type"
              />
            </div>
          </LiquidCard>
        </section>

        {/* Badges Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-semibold mb-6">Badges</h3>
          <LiquidCard>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <LiquidBadge>Default</LiquidBadge>
                <LiquidBadge variant="primary">Primary</LiquidBadge>
                <LiquidBadge variant="secondary">Secondary</LiquidBadge>
                <LiquidBadge variant="success">Success</LiquidBadge>
                <LiquidBadge variant="warning">Warning</LiquidBadge>
                <LiquidBadge variant="danger">Danger</LiquidBadge>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <LiquidBadge size="sm">Small Badge</LiquidBadge>
                <LiquidBadge size="md">Medium Badge</LiquidBadge>
                <LiquidBadge size="lg">Large Badge</LiquidBadge>
              </div>
            </div>
          </LiquidCard>
        </section>

        {/* Real-world Example */}
        <section className="mb-16">
          <h3 className="text-2xl font-semibold mb-6">Real-world Example: Job Card</h3>
          <LiquidCard hover className="max-w-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-semibold mb-2">Senior Frontend Engineer</h4>
                <p className="text-gray-600 dark:text-gray-400">Acme Corporation</p>
              </div>
              <LiquidBadge variant="primary" size="sm">
                <Star className="w-4 h-4 mr-1" />
                Featured
              </LiquidBadge>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <LiquidBadge size="sm">React</LiquidBadge>
              <LiquidBadge size="sm">TypeScript</LiquidBadge>
              <LiquidBadge size="sm">Next.js</LiquidBadge>
              <LiquidBadge variant="success" size="sm">
                <TrendingUp className="w-3 h-3 mr-1" />
                95% Match
              </LiquidBadge>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We're looking for a talented frontend engineer to help build the future of our platform 
              using cutting-edge technologies and beautiful design systems.
            </p>

            <div className="flex gap-3">
              <LiquidButton variant="primary" size="sm">Apply Now</LiquidButton>
              <LiquidButton variant="glass" size="sm">Save Job</LiquidButton>
            </div>
          </LiquidCard>
        </section>

        {/* Design Principles */}
        <section>
          <h3 className="text-2xl font-semibold mb-6">Design Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LiquidCard variant="secondary">
              <h4 className="text-lg font-semibold mb-2">🌊 Fluidity</h4>
              <p>Elements morph and adapt dynamically, creating smooth transitions that guide user attention.</p>
            </LiquidCard>

            <LiquidCard variant="primary">
              <h4 className="text-lg font-semibold mb-2">✨ Translucency</h4>
              <p>Glass-like materials create depth and hierarchy while maintaining visual lightness.</p>
            </LiquidCard>

            <LiquidCard variant="accent">
              <h4 className="text-lg font-semibold mb-2">🎨 Adaptive Color</h4>
              <p>Colors blend and refract based on context, creating harmonious interfaces.</p>
            </LiquidCard>

            <LiquidCard>
              <h4 className="text-lg font-semibold mb-2">🚀 Performance</h4>
              <p>Optimized for modern browsers with hardware acceleration and efficient rendering.</p>
            </LiquidCard>
          </div>
        </section>
      </div>
    </div>
  );
}