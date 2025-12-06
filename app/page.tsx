'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { supabase } from './lib/supabase';

// Types
interface Carrier {
  name: string;
  description: string;
  serviceOptions?: string[];
  commonFields?: string[];
}

interface Carriers {
  [key: string]: Carrier;
}

// Location data for ports and airports
const LOCATIONS = {
  ocean: {
    'westcoast-to-hawaii': {
      origins: [
        'Los Angeles, CA (Port of LA)',
        'Long Beach, CA (Port of Long Beach)',
        'Oakland, CA (Port of Oakland)',
        'Seattle, WA (Port of Seattle)',
        'Tacoma, WA (Port of Tacoma)',
        'Portland, OR (Port of Portland)'
      ],
      destinations: [
        'Honolulu, HI (Honolulu Harbor)',
        'Kawaihae, HI (Kawaihae Harbor)',
        'Hilo, HI (Hilo Harbor)',
        'Kahului, HI (Kahului Harbor)',
        'Nawiliwili, HI (Nawiliwili Harbor)',
        'Kaunakakai, HI (Kaunakakai Wharf)'
      ]
    },
    'hawaii-to-westcoast': {
      origins: [
        'Honolulu, HI (Honolulu Harbor)',
        'Kawaihae, HI (Kawaihae Harbor)',
        'Hilo, HI (Hilo Harbor)',
        'Kahului, HI (Kahului Harbor)',
        'Nawiliwili, HI (Nawiliwili Harbor)',
        'Kaunakakai, HI (Kaunakakai Wharf)'
      ],
      destinations: [
        'Los Angeles, CA (Port of LA)',
        'Long Beach, CA (Port of Long Beach)',
        'Oakland, CA (Port of Oakland)',
        'Seattle, WA (Port of Seattle)',
        'Tacoma, WA (Port of Tacoma)',
        'Portland, OR (Port of Portland)'
      ]
    },
    'inter-island': {
      origins: [
        'Honolulu, HI (Honolulu Harbor)',
        'Kawaihae, HI (Kawaihae Harbor)',
        'Hilo, HI (Hilo Harbor)',
        'Kahului, HI (Kahului Harbor)',
        'Nawiliwili, HI (Nawiliwili Harbor)',
        'Kaunakakai, HI (Kaunakakai Wharf)'
      ],
      destinations: [
        'Honolulu, HI (Honolulu Harbor)',
        'Kawaihae, HI (Kawaihae Harbor)',
        'Hilo, HI (Hilo Harbor)',
        'Kahului, HI (Kahului Harbor)',
        'Nawiliwili, HI (Nawiliwili Harbor)',
        'Kaunakakai, HI (Kaunakakai Wharf)'
      ]
    }
  },
  air: {
    'westcoast-to-hawaii': {
      origins: [
        'Los Angeles, CA (LAX)',
        'San Francisco, CA (SFO)',
        'Oakland, CA (OAK)',
        'San Jose, CA (SJC)',
        'Seattle, WA (SEA)',
        'Portland, OR (PDX)',
        'San Diego, CA (SAN)',
        'Sacramento, CA (SMF)'
      ],
      destinations: [
        'Honolulu, HI (HNL)',
        'Kahului, HI (OGG)',
        'Kona, HI (KOA)',
        'Hilo, HI (ITO)',
        'Lihue, HI (LIH)',
        'Molokai, HI (MKK)',
        'Lanai, HI (LNY)'
      ]
    },
    'hawaii-to-westcoast': {
      origins: [
        'Honolulu, HI (HNL)',
        'Kahului, HI (OGG)',
        'Kona, HI (KOA)',
        'Hilo, HI (ITO)',
        'Lihue, HI (LIH)',
        'Molokai, HI (MKK)',
        'Lanai, HI (LNY)'
      ],
      destinations: [
        'Los Angeles, CA (LAX)',
        'San Francisco, CA (SFO)',
        'Oakland, CA (OAK)',
        'San Jose, CA (SJC)',
        'Seattle, WA (SEA)',
        'Portland, OR (PDX)',
        'San Diego, CA (SAN)',
        'Sacramento, CA (SMF)'
      ]
    },
    'inter-island': {
      origins: [
        'Honolulu, HI (HNL)',
        'Kahului, HI (OGG)',
        'Kona, HI (KOA)',
        'Hilo, HI (ITO)',
        'Lihue, HI (LIH)',
        'Molokai, HI (MKK)',
        'Lanai, HI (LNY)'
      ],
      destinations: [
        'Honolulu, HI (HNL)',
        'Kahului, HI (OGG)',
        'Kona, HI (KOA)',
        'Hilo, HI (ITO)',
        'Lihue, HI (LIH)',
        'Molokai, HI (MKK)',
        'Lanai, HI (LNY)'
      ]
    }
  }
};

// Carrier database with service options and requirements
const CARRIERS: { ocean: Carriers; air: Carriers } = {
  ocean: {
    youngBrothers: {
      name: 'Young Brothers',
      description: 'Inter-island freight specialist',
      serviceOptions: ['Standard Service', 'Express Service', 'Refrigerated'],
      commonFields: ['commodity_code', 'packing_type', 'declared_value']
    },
    matson: {
      name: 'Matson Navigation',
      description: 'West Coast ⇄ Hawaii',
      serviceOptions: ['Standard Ocean Freight', 'Expedited Service', 'Temperature Controlled'],
      commonFields: ['container_type', 'commodity_description', 'declared_value']
    },
    pasha: {
      name: 'Pasha Hawaii',
      description: 'West Coast ⇄ Hawaii freight',
      serviceOptions: ['Standard Service', 'Express Service', 'Roll-On/Roll-Off'],
      commonFields: ['pickup_location_type', 'delivery_location_type', 'commodity_description']
    }
  },
  air: {
    fedex: {
      name: 'FedEx Cargo',
      description: 'Global express shipping',
      serviceOptions: ['Priority Overnight', 'FedEx 2Day', 'Express Saver', 'Ground'],
      commonFields: ['dangerous_goods', 'declared_value', 'packaging_type']
    },
    ups: {
      name: 'UPS Cargo',
      description: 'Reliable worldwide delivery',
      serviceOptions: ['Next Day Air', '2nd Day Air', '3 Day Select', 'Ground'],
      commonFields: ['declared_value', 'packaging_type', 'special_handling']
    },
    alohaAir: {
      name: 'Aloha Air Cargo',
      description: 'Fast inter-island & mainland',
      serviceOptions: ['Same Day', 'Next Flight Out', 'Standard Service'],
      commonFields: ['packaging_condition', 'declared_value', 'temperature_sensitive']
    },
    hawaiianAir: {
      name: 'Hawaiian Air Cargo',
      description: 'Priority air freight',
      serviceOptions: ['Next Flight Out', 'Priority (1-2 days)', 'Standard (3-5 days)'],
      commonFields: ['dangerous_goods', 'time_sensitivity', 'special_handling']
    },
    hawaiiAir: {
      name: 'Hawaii Air Cargo',
      description: 'Local Hawaii air freight specialist',
      serviceOptions: ['Same Day', 'Next Day', 'Standard Service'],
      commonFields: ['delivery_type', 'packaging_type', 'time_sensitivity']
    },
    pacificAir: {
      name: 'Pacific Air Cargo',
      description: 'Trans-Pacific cargo specialist',
      serviceOptions: ['Express', 'Priority', 'Standard', 'Economy'],
      commonFields: ['cargo_category', 'packaging_type', 'perishable']
    },
    dhx: {
      name: 'DHX (Dependable Hawaiian Express)',
      description: 'Hawaii inter-island express',
      serviceOptions: ['Same Day', 'Next Day', 'Standard Delivery'],
      commonFields: ['pickup_type', 'delivery_type', 'time_window']
    }
  }
};

// Common detail fields required by all carriers
const COMMON_DETAIL_FIELDS = [
  { name: 'commodity_description', label: 'Detailed Commodity Description', type: 'text', placeholder: 'Full description of goods', required: true },
  { name: 'commodity_code', label: 'Commodity/HS Code (if known)', type: 'text', placeholder: 'e.g., 4821', required: false },
  { name: 'declared_value', label: 'Declared Value (USD)', type: 'text', placeholder: 'e.g., 5000', required: true },
  { name: 'packaging_type', label: 'Packaging Type', type: 'select', options: ['Palletized', 'Crated', 'Boxed', 'Loose', 'Containerized', 'Cooler'], required: true },
  { name: 'dangerous_goods', label: 'Contains Dangerous/Hazardous Goods?', type: 'select', options: ['No', 'Yes - Lithium Batteries', 'Yes - Dry Ice', 'Yes - Flammable', 'Yes - Other (specify in notes)'], required: true },
  { name: 'temperature_sensitive', label: 'Temperature Sensitive?', type: 'select', options: ['No', 'Yes - Refrigerated', 'Yes - Frozen', 'Yes - Climate Controlled'], required: false },
  { name: 'pickup_location_type', label: 'Pickup Location Type', type: 'select', options: ['Pier/Port', 'Airport', 'Business Address', 'Residential'], required: true },
  { name: 'delivery_location_type', label: 'Delivery Location Type', type: 'select', options: ['Pier/Port', 'Airport', 'Business Address', 'Residential'], required: true }
];

const slides = [
  // Hawaii Ports
  { image: '/Harbor-Hilo-New.jpg', alt: 'Hilo Harbor', label: 'Hilo' },
  { image: '/Harbor Honolulu.webp', alt: 'Honolulu Harbor', label: 'Honolulu' },
  { image: '/Harbor Kahului.jpg', alt: 'Kahului Harbor', label: 'Kahului' },
  { image: '/aerial-view-of-the-nawiliwili-harbor-pierre-leclerc-photography.jpg', alt: 'Nawiliwili Harbor', label: 'Nawiliwili' },
  { image: '/Harbor Kawaihae.jpg', alt: 'Kawaihae Harbor', label: 'Kawaihae' },
  { image: '/Harbor Kaunakakai.jpg', alt: 'Kaunakakai Harbor', label: 'Kaunakakai' }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shippingType, setShippingType] = useState('');
  const [routeType, setRouteType] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([]);
  const [quoteComplete, setQuoteComplete] = useState(false);
  const [cargoType, setCargoType] = useState('');
  const [weight, setWeight] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  // notificationPref removed for email-only launch (SMS coming later)
  const [selectedServices, setSelectedServices] = useState<Map<string, string[]>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingDate, setShippingDate] = useState('');
  const [flexibleDates, setFlexibleDates] = useState(false);

  // Helper function to mark field as completed
  const markFieldCompleted = (fieldName: string, value: string) => {
    if (value && value.trim() !== '') {
      setCompletedFields(prev => new Set(prev).add(fieldName));
    } else {
      setCompletedFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
  };

  // Toggle service selection for a carrier
  const toggleServiceSelection = (carrierKey: string, service: string) => {
    setSelectedServices(prev => {
      const newMap = new Map(prev);
      const carrierServices = newMap.get(carrierKey) || [];
      
      if (carrierServices.includes(service)) {
        // Remove service
        const updated = carrierServices.filter(s => s !== service);
        if (updated.length === 0) {
          newMap.delete(carrierKey);
        } else {
          newMap.set(carrierKey, updated);
        }
      } else {
        // Add service
        newMap.set(carrierKey, [...carrierServices, service]);
      }
      
      return newMap;
    });
  };

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  const handleShippingTypeChange = (value: string) => {
    setShippingType(value);
    setRouteType('');
    setOrigin('');
    setDestination('');
    setSelectedCarriers([]);
  };

  const handleRouteTypeChange = (value: string) => {
    setRouteType(value);
    setOrigin('');
    setDestination('');
  };

  const handleCarrierToggle = (carrierKey: string) => {
    setSelectedCarriers(prev => {
      const updated = prev.includes(carrierKey) 
        ? prev.filter(c => c !== carrierKey)
        : [...prev, carrierKey];
      
      // Mark carriers field as completed if at least one is selected
      if (updated.length > 0) {
        markFieldCompleted('carriers', 'selected');
      } else {
        markFieldCompleted('carriers', '');
      }
      
      return updated;
    });
  };

  const handleSelectAll = () => {
    if (!shippingType) return;
    
    const carriers = CARRIERS[shippingType as keyof typeof CARRIERS];
    const allCarrierKeys = Object.keys(carriers);
    
    if (selectedCarriers.length === allCarrierKeys.length) {
      setSelectedCarriers([]);
      markFieldCompleted('carriers', '');
    } else {
      setSelectedCarriers(allCarrierKeys);
      markFieldCompleted('carriers', 'selected');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Already submitting, ignoring...');
      return;
    }
    
    if (selectedCarriers.length === 0) {
      alert('Please select at least one carrier to get quotes from.');
      return;
    }
  
    setIsSubmitting(true);
    
    // Store form reference before async operations
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
  
    // Collect carrier-specific service selections
    const carrierServiceSelections: { [key: string]: any } = {};
    selectedCarriers.forEach(carrierKey => {
      const services = selectedServices.get(carrierKey) || [];
      carrierServiceSelections[carrierKey] = {
        selectedServices: services
      };
    });
  
    const quoteRequest = {
      user_email: data.email as string,
      user_name: data.name as string,
      user_phone: data.phone as string,
      company_name: data.companyName as string || null,
      pickup_island: data.origin as string,
      delivery_island: data.destination as string,
      cargo_type: data.cargoType as string,
      length_inches: data.length ? parseFloat(data.length as string) : null,
      width_inches: data.width ? parseFloat(data.width as string) : null,
      height_inches: data.height ? parseFloat(data.height as string) : null,
      weight_lbs: parseFloat(data.weight as string),
      selected_carriers: selectedCarriers,
      status: 'pending',
      special_instructions: data.specialInstructions as string || null,
      // Store additional data as JSON in metadata field
      metadata: {
        shippingType: data.shippingType,
        routeType: data.routeType,
        shippingDate: flexibleDates ? 'flexible' : data.shippingDate,
        flexibleDates: flexibleDates,
        carrierServiceSelections: carrierServiceSelections,
        commonDetails: Object.fromEntries(
          COMMON_DETAIL_FIELDS.map(f => [f.name, data[f.name]])
        ),
        quantity: data.quantity
      }
    };
  
    try {
      console.log('Starting Supabase submission...');
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => {
          console.log('⏰ Timeout triggered after 10 seconds');
          reject(new Error('Request timeout'));
        }, 10000)
      );
      
      // Race between Supabase call and timeout
      const supabasePromise = supabase
        .from('quote_requests')
        .insert([quoteRequest])
        .select();
      
      console.log('Waiting for Supabase response...');
      const { data: insertedData, error } = await Promise.race([
        supabasePromise,
        timeoutPromise
      ]) as any;
      
      console.log('Supabase response received:', { insertedData, error });
      
      if (error) {
        console.error('Supabase error:', error);
        alert(`Error submitting quote: ${error.message}. Please try again or contact support.`);
        setIsSubmitting(false);
        return;
      }
      
      console.log('Quote submitted successfully:', insertedData);
      
      // Send confirmation email
      try {
        console.log('Sending confirmation email...');
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            name: name,
            companyName: companyName,
            phone: data.phone,
            shippingType: data.shippingType,
            routeType: data.routeType,
            origin: data.origin,
            destination: data.destination,
            selectedCarriers: selectedCarriers,
            selectedServices: carrierServiceSelections,
            cargoType: data.cargoType,
            weight: data.weight,
            length: data.length,
            width: data.width,
            height: data.height,
            quantity: data.quantity
          }),
        });
        
        const emailResult = await emailResponse.json();
        if (emailResult.success) {
          console.log('✅ Confirmation email sent successfully!');
        } else {
          console.warn('⚠️ Email failed to send:', emailResult.error);
          // Don't block the form submission if email fails
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Don't block the form submission if email fails
      }
      
      // Mark as complete - button will turn green
      setQuoteComplete(true);
      setIsSubmitting(false)
  
    } catch (error: any) {
      console.error('Unexpected error:', error);
      if (error.message === 'Request timeout') {
        alert('Request timed out. Please check your connection and try again.');
      } else {
        alert('There was an unexpected error. Please try again or contact support.');
      }
      setIsSubmitting(false);
    }
  };  

  const getLocations = () => {
    if (!shippingType || !routeType) return { origins: [], destinations: [] };
    const locs = LOCATIONS[shippingType as keyof typeof LOCATIONS]?.[routeType as keyof typeof LOCATIONS.ocean];
    return locs || { origins: [], destinations: [] };
  };

  const locations = getLocations();
  const carriers = shippingType ? CARRIERS[shippingType as keyof typeof CARRIERS] : {};
  const allCarrierKeys = Object.keys(carriers);
  const allSelected = selectedCarriers.length === allCarrierKeys.length && allCarrierKeys.length > 0;

  return (
    <main>
      {/* TEST SITE BANNER */}
      <div className="test-banner">
        TEST SITE - FOR TRIAL USE ONLY
      </div>
      
      {/* LANDING SECTION */}
      <section id="landing-section">
        {/* Slideshow Section - 33% */}
        <div className="slideshow-section">
          <div className="slideshow">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info Section with White Background */}
        <div className="info-section">
          <div className="info-container">
            <div className="logo-main">
              <Image 
                src="/808-freight-logo-white.png" 
                alt="808 Freight Logo" 
                width={900} 
                height={550} 
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
                priority 
              />
            </div>
            <div className="steps-container">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-title">Tell Us What You're Shipping</div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-title">We Contact All Carriers</div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-title">Compare & Book Direct</div>
              </div>
            </div>

            {/* Call to Action */}
            <div 
              className="cta-section" 
              onClick={() => {
                const quoteSection = document.getElementById('quote-section');
                if (quoteSection) {
                  const offsetTop = quoteSection.offsetTop;
                  window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              <div className="cta-arrow" style={{ color: '#ffffff' }}>↓</div>
              <h2 className="cta-text" style={{ color: '#ffffff', fontSize: '1.8rem' }}>Get Your Free Quotes</h2>
              <div className="cta-arrow" style={{ color: '#ffffff' }}>↓</div>
            </div>

            {/* Featured Carriers - Vertical List */}
            <div className="featured-carriers-section">
              <h3 className="featured-carriers-title">Our Carrier Network</h3>
              <p className="carrier-network-subtext">All major Hawaii freight carriers in one place</p>
              
              <div className="carrier-list-vertical">
                <div className="carrier-list-group">
                  <h4 className="carrier-list-header">Ocean Freight</h4>
                  <ul className="carrier-list">
                    <li>Young Brothers</li>
                    <li>Matson Navigation</li>
                    <li>Pasha Hawaii</li>
                  </ul>
                </div>

                <div className="carrier-list-group">
                  <h4 className="carrier-list-header">Air Cargo</h4>
                  <ul className="carrier-list">
                    <li>FedEx</li>
                    <li>UPS</li>
                    <li>Aloha Air Cargo</li>
                    <li>Hawaiian Airlines Cargo</li>
                    <li>Hawaii Air Cargo</li>
                    <li>Pacific Air Cargo</li>
                    <li>DHX</li>
                  </ul>
                </div>
              </div>
            </div>
        </div>
        </div>
      </section>

      {/* QUOTE FORM SECTION */}
      <section id="quote-section">
        <div className="form-container">
          {/* Trust Signals */}
          <div className="trust-signals">
            <div className="trust-item"><span className="trust-check">✓</span> All Major Hawaii Carriers</div>
            <div className="trust-item"><span className="trust-check">✓</span> Ocean & Air Freight</div>
            <div className="trust-item"><span className="trust-check">✓</span> No Account Required</div>
            <div className="trust-item"><span className="trust-check">✓</span> Quotes Within 24-48 Hours</div>
          </div>

          <form id="quoteForm" className="quote-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Quote Request Form</h2>
            <ul className="form-intro-bullets">
              <li>We check carrier rates weekly to ensure accuracy.</li>
              <li>Fill out once—we handle the rest.</li>
            </ul>
            
            {/* Shipping Type */}
            <div className="form-group">
              <label htmlFor="shippingType">Shipping Type {completedFields.has('shippingType') ? <span className="completed"></span> : <span className="required">*</span>}</label>
              <select 
                id="shippingType" 
                name="shippingType" 
                required 
                value={shippingType}
                onChange={(e) => { handleShippingTypeChange(e.target.value); markFieldCompleted('shippingType', e.target.value); }}
              >
                <option value="">Select shipping method...</option>
                <option value="ocean">Ocean Freight (Sea)</option>
                <option value="air">Air Cargo</option>
              </select>
            </div>

            {/* Route Type */}
            <div className="form-group">
              <label htmlFor="routeType">Route Type {completedFields.has('routeType') ? <span className="completed"></span> : <span className="required">*</span>}</label>
              <select 
                id="routeType" 
                name="routeType" 
                required
                value={routeType}
                onChange={(e) => { handleRouteTypeChange(e.target.value); markFieldCompleted('routeType', e.target.value); }}
                disabled={!shippingType}
              >
                <option value="">Select route...</option>
                <option value="westcoast-to-hawaii">West Coast → Hawaii</option>
                <option value="hawaii-to-westcoast">Hawaii → West Coast</option>
                <option value="inter-island">Inter-Island Hawaii</option>
              </select>
            </div>

            {/* Origin & Destination */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="origin">Origin {completedFields.has('origin') ? <span className="completed"></span> : <span className="required">*</span>}</label>
                <select 
                  id="origin" 
                  name="origin" 
                  required
                  value={origin}
                  onChange={(e) => { setOrigin(e.target.value); markFieldCompleted('origin', e.target.value); }}
                  disabled={locations.origins.length === 0}
                >
                  {locations.origins.length === 0 ? (
                    <option value="">Select shipping type & route first...</option>
                  ) : (
                    <>
                      <option value="">Select origin...</option>
                      {locations.origins.map((originOption) => (
                        <option key={originOption} value={originOption}>{originOption}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="destination">Destination {completedFields.has('destination') ? <span className="completed"></span> : <span className="required">*</span>}</label>
                <select 
                  id="destination" 
                  name="destination" 
                  required
                  value={destination}
                  onChange={(e) => { setDestination(e.target.value); markFieldCompleted('destination', e.target.value); }}
                  disabled={locations.destinations.length === 0}
                >
                  {locations.destinations.length === 0 ? (
                    <option value="">Select shipping type & route first...</option>
                  ) : (
                    <>
                      <option value="">Select destination...</option>
                      {locations.destinations.map((destinationOption) => (
                        <option key={destinationOption} value={destinationOption}>{destinationOption}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Shipping Date */}
            <div className="form-group">
              <label htmlFor="shippingDate">
                Estimated Date of Cargo Movement {completedFields.has('shippingDate') || flexibleDates ? <span className="completed"></span> : <span className="required">*</span>}
              </label>
              <p className="field-helper-text">When will your cargo be ready for pickup?</p>
              <input 
                type="date" 
                id="shippingDate" 
                name="shippingDate" 
                required={!flexibleDates}
                value={shippingDate}
                onChange={(e) => { setShippingDate(e.target.value); markFieldCompleted('shippingDate', e.target.value); }}
                disabled={!destination || flexibleDates}
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
              <div className="flexible-dates-option">
                <input 
                  type="checkbox" 
                  id="flexibleDates" 
                  name="flexibleDates"
                  checked={flexibleDates}
                  onChange={(e) => {
                    setFlexibleDates(e.target.checked);
                    if (e.target.checked) {
                      setShippingDate('');
                      markFieldCompleted('shippingDate', 'flexible');
                    } else {
                      markFieldCompleted('shippingDate', '');
                    }
                  }}
                  disabled={!destination}
                />
                <label htmlFor="flexibleDates" className="flexible-label">
                  Flexible on dates (can ship anytime within the next 2 weeks)
                </label>
              </div>
            </div>

            {/* Select Carriers */}
            <div className="form-group">
              <label>Select Carriers {completedFields.has('carriers') ? <span className="completed"></span> : <span className="required">*</span>}</label>
              {allCarrierKeys.length > 0 && destination && (
                <div id="selectAllContainer">
                  <div 
                    className="select-all-btn" 
                    onClick={handleSelectAll}
                    style={{
                      borderColor: allSelected ? '#f87171' : '#60a5fa',
                      color: allSelected ? '#f87171' : '#60a5fa',
                      opacity: destination ? 1 : 0.5,
                      cursor: destination ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {allSelected ? 'Deselect All Carriers' : 'Select All Carriers'}
                  </div>
                </div>
              )}
              <div id="carrierSelection" className="carrier-grid">
                {allCarrierKeys.length === 0 || !destination ? (
                  <div style={{ color: '#94a3b8', padding: '10px' }}>
                    {!destination ? 'Select origin and destination first...' : 'Select a shipping type first...'}
                  </div>
                ) : (
                  Object.entries(carriers).map(([key, carrier]) => (
                    <div 
                      key={key} 
                      className={`carrier-option ${selectedCarriers.includes(key) ? 'selected' : ''}`}
                      onClick={() => destination && handleCarrierToggle(key)}
                      style={{ 
                        opacity: destination ? 1 : 0.5,
                        cursor: destination ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        className="carrier-checkbox" 
                        id={`carrier-${key}`} 
                        checked={selectedCarriers.includes(key)}
                        onChange={() => {}}
                        disabled={!destination}
                      />
                      <div className="carrier-info">
                        <div className="carrier-name">{carrier.name}</div>
                        <div className="carrier-description">{carrier.description}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="contact-info-section" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid rgba(30, 159, 216, 0.3)' }}>
              <h3 style={{ color: '#1E9FD8', fontSize: '1.3em', marginBottom: '20px' }}>Contact Information</h3>
              
              <div className="form-group">
                <label htmlFor="companyName">Company Name (Optional)</label>
                <input 
                  type="text" 
                  id="companyName" 
                  name="companyName" 
                  placeholder="Your Company Name" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={!destination}
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Name {completedFields.has('name') ? <span className="completed"></span> : <span className="required">*</span>}</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Your Full Name" 
                  required 
                  value={name}
                  onChange={(e) => { setName(e.target.value); markFieldCompleted('name', e.target.value); }}
                  disabled={!destination}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone {completedFields.has('phone') ? <span className="completed"></span> : <span className="required">*</span>}</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    placeholder="(808) 555-1234" 
                    required 
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); markFieldCompleted('phone', e.target.value); }}
                    disabled={!name}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email {completedFields.has('email') ? <span className="completed"></span> : <span className="required">*</span>}</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="you@example.com" 
                    required 
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); markFieldCompleted('email', e.target.value); }}
                    disabled={!name}
                  />
                </div>
              </div>

              {/* Quote confirmations will be sent via email */}
            </div>

            {/* Carrier-Specific Information - Redesigned */}
            {selectedCarriers.length > 0 && (
              <div id="carrierFieldsContainer">
                {/* Part 1: Common Details Section */}
                <div className="carrier-specific-section">
                  <div className="carrier-specific-title">Shipment Details</div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95em', marginBottom: '20px' }}>
                    Please provide the following details required by all carriers for accurate quotes.
                  </p>
                  
                  {COMMON_DETAIL_FIELDS.map((field) => (
                    <div key={field.name} className="form-group">
                      <label htmlFor={field.name}>
                        {field.label} {field.required ? (completedFields.has(field.name) ? <span className="completed"></span> : <span className="required">*</span>) : ''}
                      </label>
                      
                      {field.type === 'select' ? (
                        <select 
                          id={field.name} 
                          name={field.name} 
                          required={field.required}
                          onChange={(e) => markFieldCompleted(field.name, e.target.value)}
                        >
                          <option value="">Select...</option>
                          {field.options?.map((option: string) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type={field.type} 
                          id={field.name} 
                          name={field.name} 
                          placeholder={field.placeholder || ''} 
                          required={field.required}
                          onChange={(e) => markFieldCompleted(field.name, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cargo Details */}
            <div className="form-group">
              <label htmlFor="cargoType">Cargo Type {completedFields.has('cargoType') ? <span className="completed"></span> : <span className="required">*</span>}</label>
              <select 
                id="cargoType" 
                name="cargoType" 
                required
                value={cargoType}
                onChange={(e) => { setCargoType(e.target.value); markFieldCompleted('cargoType', e.target.value); }}
                disabled={!destination || selectedCarriers.length === 0}
              >
                <option value="">Select cargo type...</option>
                <option value="general">General Cargo</option>
                <option value="vehicle">Vehicle</option>
                <option value="household">Household Goods</option>
                <option value="equipment">Equipment/Machinery</option>
                <option value="perishable">Perishable Goods</option>
                <option value="hazmat">Hazardous Materials</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Weight & Dimensions */}
            <div className="form-group">
              <label htmlFor="weight">Weight (lbs) {completedFields.has('weight') ? <span className="completed"></span> : <span className="required">*</span>}</label>
              <input 
                type="text" 
                id="weight" 
                name="weight" 
                placeholder="e.g., 500" 
                required 
                value={weight}
                onChange={(e) => { setWeight(e.target.value); markFieldCompleted('weight', e.target.value); }}
                disabled={!cargoType}
              />
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label htmlFor="length">Length (in)</label>
                <input type="text" id="length" name="length" placeholder="48" disabled={!weight} />
              </div>
              <div className="form-group">
                <label htmlFor="width">Width (in)</label>
                <input type="text" id="width" name="width" placeholder="40" disabled={!weight} />
              </div>
              <div className="form-group">
                <label htmlFor="height">Height (in)</label>
                <input type="text" id="height" name="height" placeholder="36" disabled={!weight} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity/Pieces</label>
              <input type="text" id="quantity" name="quantity" placeholder="e.g., 1" defaultValue="1" disabled={!weight} />
            </div>

            {/* Special Instructions */}
            <div className="form-group">
              <label htmlFor="specialInstructions">Special Instructions (Optional)</label>
              <textarea 
                id="specialInstructions" 
                name="specialInstructions" 
                rows={3} 
                placeholder="Any special handling, time constraints, or additional details..."
                disabled={!weight}
              ></textarea>
            </div>

            {/* Part 2: Individual Carrier Service Options */}
            {selectedCarriers.length > 0 && weight && (
              <div className="carrier-specific-section" style={{ marginTop: '25px' }}>
                <div className="carrier-specific-title">Select Services by Carrier</div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95em', marginBottom: '20px' }}>
                  Choose which service options you'd like quotes for from each carrier.
                </p>
                
                {selectedCarriers.map(carrierKey => {
                  const carrier = carriers[carrierKey];
                  if (!carrier || !carrier.serviceOptions || carrier.serviceOptions.length === 0) {
                    return null;
                  }
                  
                  const carrierServices = selectedServices.get(carrierKey) || [];
                  
                  return (
                    <div key={carrierKey} className="carrier-service-box">
                      <h3 className="carrier-service-title">{carrier.name}</h3>
                      <div className="service-options-list">
                        {carrier.serviceOptions.map((service: string) => (
                          <div
                            key={service}
                            className="service-option-item"
                            onClick={() => toggleServiceSelection(carrierKey, service)}
                          >
                            <div className={`service-bubble ${carrierServices.includes(service) ? 'selected' : ''}`}></div>
                            <span className="service-text">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button 
              type="submit" 
              className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
              disabled={!email || isSubmitting || quoteComplete}
              style={quoteComplete ? {
                background: '#39ff14',
                color: '#1e3a8a',
                fontWeight: 800,
                boxShadow: 'inset 3px 3px 6px rgba(255, 255, 255, 0.4), inset -3px -3px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(57, 255, 20, 0.5)',
                cursor: 'default'
              } : {}}
            >
              {quoteComplete ? 'QUOTE SUBMITTED SUCCESSFULLY' : (isSubmitting ? (
                <div className="barge-loader">
                  <svg className="barge-icon" width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20 L10 25 L50 25 L55 20 L50 15 L10 15 Z" fill="#1E9FD8" stroke="#ffffff" strokeWidth="2"/>
                    <rect x="15" y="8" width="8" height="7" fill="#ffffff" rx="1"/>
                    <rect x="26" y="5" width="10" height="10" fill="#ffffff" rx="1"/>
                    <rect x="39" y="8" width="8" height="7" fill="#ffffff" rx="1"/>
                    <path d="M0 28 Q15 32 30 28 Q45 24 60 28" stroke="#1E9FD8" strokeWidth="2" fill="none"/>
                  </svg>
                  <div className="progress-bar-container">
                    <div className="progress-bar"></div>
                  </div>
                  <span className="loading-text">Sending to carriers...</span>
                </div>
              ) : (
  SUBMIT QUOTE REQUEST
              ))}
            </button>
            <p className="submit-helper-text">Free service • No obligation • Book direct with carrier</p>
          </form>

          {/* What Happens Next Section */}
          <div style={{
            background: 'transparent',
            padding: '30px 20px',
            marginTop: '40px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <h2 style={{
              fontSize: '1.8em',
              color: '#1E9FD8',
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>What Happens Next?</h2>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 20px 0'
            }}>
              <li style={{ color: '#ffffff', fontSize: '1em', fontWeight: 500, lineHeight: 1.6, padding: '12px 0 12px 28px', position: 'relative', borderBottom: '1px solid rgba(30, 159, 216, 0.3)', textAlign: 'left' }}>
                <span style={{ position: 'absolute', left: '6px', top: '8px', fontSize: '1.4em', fontWeight: 'bold', color: '#1E9FD8' }}>•</span>
                You&apos;ll receive a confirmation email. We forward your request to all selected carriers.
              </li>
              <li style={{ color: '#ffffff', fontSize: '1em', fontWeight: 500, lineHeight: 1.6, padding: '12px 0 12px 28px', position: 'relative', borderBottom: '1px solid rgba(30, 159, 216, 0.3)', textAlign: 'left' }}>
                <span style={{ position: 'absolute', left: '6px', top: '8px', fontSize: '1.4em', fontWeight: 'bold', color: '#1E9FD8' }}>•</span>
                Most quotes arrive within 24-48 hours.
              </li>
              <li style={{ color: '#ffffff', fontSize: '1em', fontWeight: 500, lineHeight: 1.6, padding: '12px 0 12px 28px', position: 'relative', borderBottom: '1px solid rgba(30, 159, 216, 0.3)', textAlign: 'left' }}>
                <span style={{ position: 'absolute', left: '6px', top: '8px', fontSize: '1.4em', fontWeight: 'bold', color: '#1E9FD8' }}>•</span>
                Quotes are forwarded to you as they come in.
              </li>
              <li style={{ color: '#ffffff', fontSize: '1em', fontWeight: 500, lineHeight: 1.6, padding: '12px 0 12px 28px', position: 'relative', borderBottom: '1px solid rgba(30, 159, 216, 0.3)', textAlign: 'left' }}>
                <span style={{ position: 'absolute', left: '6px', top: '8px', fontSize: '1.4em', fontWeight: 'bold', color: '#1E9FD8' }}>•</span>
                We compile all quotes side-by-side so you can compare easily.
              </li>
              <li style={{ color: '#ffffff', fontSize: '1em', fontWeight: 500, lineHeight: 1.6, padding: '12px 0 12px 28px', position: 'relative', textAlign: 'left' }}>
                <span style={{ position: 'absolute', left: '6px', top: '8px', fontSize: '1.4em', fontWeight: 'bold', color: '#1E9FD8' }}>•</span>
                Book directly with your preferred carrier—no middleman.
              </li>
            </ul>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '15px',
              gap: '15px'
            }}>
              <span style={{
                color: '#ffffff',
                fontSize: '1.3em',
                fontWeight: 800,
                letterSpacing: '2px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>A HUI HOU!</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

