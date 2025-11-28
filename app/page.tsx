'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';

// Types
interface CarrierField {
  name: string;
  label: string;
  type: string;
  options?: string[];
  placeholder?: string;
  required: boolean;
}

interface Carrier {
  name: string;
  description: string;
  fields?: CarrierField[];
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

// Carrier database with specific field requirements
const CARRIERS: { ocean: Carriers; air: Carriers } = {
  ocean: {
    youngBrothers: {
      name: 'Young Brothers',
      description: 'Inter-island freight specialist',
      fields: [
        { name: 'commodity_code', label: 'Commodity Code', type: 'text', placeholder: 'e.g., 4821', required: true },
        { name: 'packing_type', label: 'Packing Type', type: 'select', options: ['Palletized', 'Crated', 'Loose', 'Containerized'], required: true }
      ]
    },
    matson: {
      name: 'Matson Navigation',
      description: 'West Coast ⇄ Hawaii',
      fields: [
        { name: 'container_type', label: 'Container Type', type: 'select', options: ['20ft Standard', '40ft Standard', '40ft High Cube', 'LCL (Less than Container Load)'], required: true },
        { name: 'commodity_description', label: 'Detailed Commodity Description', type: 'text', placeholder: 'Full description of goods', required: true }
      ]
    },
    pasha: {
      name: 'Pasha Hawaii',
      description: 'West Coast ⇄ Hawaii freight',
      fields: [
        { name: 'pickup_location_type', label: 'Pickup Location Type', type: 'select', options: ['Pier/Port', 'Business Address', 'Residential'], required: true },
        { name: 'delivery_location_type', label: 'Delivery Location Type', type: 'select', options: ['Pier/Port', 'Business Address', 'Residential'], required: true }
      ]
    }
  },
  air: {
    fedex: {
      name: 'FedEx Cargo',
      description: 'Global express shipping',
      fields: [
        { name: 'service_type', label: 'Service Type', type: 'select', options: ['FedEx Priority Overnight', 'FedEx 2Day', 'FedEx Express Saver', 'FedEx Ground'], required: true },
        { name: 'dangerous_goods', label: 'Contains Dangerous Goods?', type: 'select', options: ['No', 'Yes - Lithium Batteries', 'Yes - Dry Ice', 'Yes - Other (specify in notes)'], required: true }
      ]
    },
    ups: {
      name: 'UPS Cargo',
      description: 'Reliable worldwide delivery',
      fields: [
        { name: 'service_type', label: 'Service Type', type: 'select', options: ['UPS Next Day Air', 'UPS 2nd Day Air', 'UPS 3 Day Select', 'UPS Ground'], required: true },
        { name: 'declared_value', label: 'Declared Value (USD)', type: 'text', placeholder: 'e.g., 5000', required: false }
      ]
    },
    alohaAir: {
      name: 'Aloha Air Cargo',
      description: 'Fast inter-island & mainland',
      fields: [
        { name: 'packaging_condition', label: 'Packaging Condition', type: 'select', options: ['Factory Sealed', 'Boxed - Good Condition', 'Crated', 'Loose/Open'], required: true },
        { name: 'declared_value', label: 'Declared Value (USD)', type: 'text', placeholder: 'e.g., 5000', required: false }
      ]
    },
    hawaiianAir: {
      name: 'Hawaiian Air Cargo',
      description: 'Priority air freight',
      fields: [
        { name: 'dangerous_goods', label: 'Contains Dangerous Goods?', type: 'select', options: ['No', 'Yes - Lithium Batteries', 'Yes - Other (specify in notes)'], required: true },
        { name: 'time_sensitivity', label: 'Time Sensitivity', type: 'select', options: ['Standard (3-5 days)', 'Priority (1-2 days)', 'Next Flight Out'], required: true }
      ]
    },
    hawaiiAir: {
      name: 'Hawaii Air Cargo',
      description: 'Local Hawaii air freight specialist',
      fields: [
        { name: 'delivery_type', label: 'Delivery Type', type: 'select', options: ['Airport Pickup', 'Door Delivery', 'Business Delivery'], required: true },
        { name: 'time_sensitivity', label: 'Time Sensitivity', type: 'select', options: ['Standard', 'Same Day', 'Next Day'], required: true }
      ]
    },
    pacificAir: {
      name: 'Pacific Air Cargo',
      description: 'Trans-Pacific cargo specialist',
      fields: [
        { name: 'cargo_type_specific', label: 'Cargo Category', type: 'select', options: ['General Cargo', 'Perishables', 'High Value', 'Oversized'], required: true },
        { name: 'packaging_type', label: 'Packaging Type', type: 'select', options: ['Palletized', 'Crated', 'Boxed', 'Loose'], required: true }
      ]
    },
    dhx: {
      name: 'DHX (Dependable Hawaiian Express)',
      description: 'Hawaii inter-island express',
      fields: [
        { name: 'service_level', label: 'Service Level', type: 'select', options: ['Standard Delivery', 'Same Day', 'Next Day'], required: true },
        { name: 'pickup_type', label: 'Pickup Type', type: 'select', options: ['Drop-off at Terminal', 'Scheduled Pickup', 'Will Call'], required: true }
      ]
    }
  }
};

const slides = [
  // Hawaii Ports
  { image: '/Harbor Hilo.jpg', alt: 'Hilo Harbor', label: 'Hilo' },
  { image: '/Harbor Honolulu.webp', alt: 'Honolulu Harbor', label: 'Honolulu' },
  { image: '/Harbor Kahului.jpg', alt: 'Kahului Harbor', label: 'Kahului' },
  { image: '/Harbor Nawiliwili.jpg', alt: 'Nawiliwili Harbor', label: 'Nawiliwili' },
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [carrierFields, setCarrierFields] = useState<Map<string, any>>(new Map());
  const [cargoType, setCargoType] = useState('');
  const [weight, setWeight] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update carrier fields when selected carriers change
  useEffect(() => {
    if (selectedCarriers.length === 0 || !shippingType) {
      setCarrierFields(new Map());
      return;
    }

    const allFields = new Map();
    const carriers = CARRIERS[shippingType as keyof typeof CARRIERS];

    selectedCarriers.forEach(carrierKey => {
      const carrier = carriers[carrierKey];
      if (carrier.fields) {
        carrier.fields.forEach(field => {
          const fieldKey = field.name;
          if (!allFields.has(fieldKey)) {
            allFields.set(fieldKey, {
              ...field,
              carriers: [carrier.name]
            });
          } else {
            allFields.get(fieldKey).carriers.push(carrier.name);
          }
        });
      }
    });

    setCarrierFields(allFields);
  }, [selectedCarriers, shippingType]);

  const handleShippingTypeChange = (value: string) => {
    setShippingType(value);
    setRouteType('');
    setOrigin('');
    setDestination('');
    setSelectedCarriers([]);
    setCarrierFields(new Map());
  };

  const handleRouteTypeChange = (value: string) => {
    setRouteType(value);
    setOrigin('');
    setDestination('');
  };

  const handleCarrierToggle = (carrierKey: string) => {
    setSelectedCarriers(prev => {
      if (prev.includes(carrierKey)) {
        return prev.filter(c => c !== carrierKey);
      } else {
        return [...prev, carrierKey];
      }
    });
  };

  const handleSelectAll = () => {
    if (!shippingType) return;
    
    const carriers = CARRIERS[shippingType as keyof typeof CARRIERS];
    const allCarrierKeys = Object.keys(carriers);
    
    if (selectedCarriers.length === allCarrierKeys.length) {
      setSelectedCarriers([]);
    } else {
      setSelectedCarriers(allCarrierKeys);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (selectedCarriers.length === 0) {
      alert('Please select at least one carrier to get quotes from.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Collect carrier-specific fields
    const carrierSpecificFields: { [key: string]: any } = {};
    selectedCarriers.forEach(carrierKey => {
      const carrier = CARRIERS[shippingType as keyof typeof CARRIERS][carrierKey];
      carrierSpecificFields[carrierKey] = {};
      if (carrier.fields) {
        carrier.fields.forEach(field => {
          const value = data[field.name];
          if (value) {
            carrierSpecificFields[carrierKey][field.name] = value;
          }
        });
      }
    });

    const quoteRequest = {
      shippingType: data.shippingType,
      routeType: data.routeType,
      origin: data.origin,
      destination: data.destination,
      selectedCarriers: selectedCarriers,
      carrierSpecificFields: carrierSpecificFields,
      cargoType: data.cargoType,
      weight: data.weight,
      dimensions: {
        length: data.length || null,
        width: data.width || null,
        height: data.height || null
      },
      quantity: data.quantity || '1',
      specialInstructions: data.specialInstructions || '',
      contact: {
        phone: data.phone,
        email: data.email,
        notificationPref: data.notificationPref
      },
      timestamp: new Date().toISOString()
    };

    console.log('Quote Request Submitted:', quoteRequest);

    // Show success message
    setShowSuccess(true);
    
    // Reset form
    e.currentTarget.reset();
    setSelectedCarriers([]);
    setShippingType('');
    setRouteType('');
    setOrigin('');
    setDestination('');
    setCargoType('');
    setWeight('');
    setPhone('');
    setEmail('');
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
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
                <div className="port-label">{slide.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Section with White Background */}
        <div className="info-section">
          <div className="info-container">
            <div className="logo-main">
              <Image 
                src="/808-freight-logo_2.png" 
                alt="808 Freight Logo" 
                width={240} 
                height={240} 
                style={{ objectFit: 'contain' }} 
                priority 
              />
            </div>
            <p className="tagline">Hawaii&apos;s ONLY free quote comparison tool for shipping freight inter-island and west coast. Save TIME AND MONEY right here at 808 FREIGHT!</p>

            <div className="steps-container">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-title">Enter Information</div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-title">Select Carriers</div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-title">Compare Quotes</div>
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
              <div className="cta-arrow">↓</div>
              <h2 className="cta-text">LETS GET SHIP DONE</h2>
              <div className="cta-arrow">↓</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE FORM SECTION */}
      <section id="quote-section">
        {/* Featured Carriers */}
        <div className="featured-carriers-section">
          <h3 className="featured-carriers-title">Featured Carriers</h3>
          
          {/* Ocean Freight Row */}
          <div className="carriers-grid">
            <div className="carrier-card">
              <div className="carrier-logo-box">
                <Image src="/YB-Logo-transparent.png" alt="Young Brothers" width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div className="carrier-name-label">Young Brothers</div>
            </div>
            <div className="carrier-card">
              <div className="carrier-logo-box">
                <Image src="/matson_logo.png" alt="Matson" width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div className="carrier-name-label">Matson</div>
            </div>
            <div className="carrier-card">
              <div className="carrier-logo-box">
                <Image src="/Pasha Logo.png" alt="Pasha Hawaii" width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div className="carrier-name-label">Pasha Hawaii</div>
            </div>
          </div>
          
          {/* Air Cargo Row */}
          <div className="carriers-grid">
            <div className="carrier-card">
              <div className="carrier-logo-box">
                <Image src="/FedEx Logo.png" alt="FedEx" width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div className="carrier-name-label">FedEx</div>
            </div>
            <div className="carrier-card">
              <div className="carrier-logo-box">
                <Image src="/ups-logo2.png" alt="UPS" width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div className="carrier-name-label">UPS</div>
            </div>
            <div className="carrier-card">
              <div className="carrier-logo-box">
                <Image src="/Aloha Air Cargo Logo.png" alt="Aloha Air" width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div className="carrier-name-label">Aloha Air</div>
            </div>
            <div className="carrier-card">
              <div className="carrier-logo-box">
                <Image src="/Hawaiian Air Cargo Logo.png" alt="Hawaiian Air" width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div className="carrier-name-label">Hawaiian Air</div>
            </div>
            <div className="carrier-card">
              <div className="carrier-logo-box">
                <Image src="/Hawaii Air Cargo Logo.png" alt="Hawaii Air" width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div className="carrier-name-label">Hawaii Air</div>
            </div>
            <div className="carrier-card">
              <div className="carrier-logo-box">
                <Image src="/Pacific Air Cargo Logo.jpeg" alt="Pacific Air" width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div className="carrier-name-label">Pacific Air</div>
            </div>
            <div className="carrier-card">
              <div className="carrier-logo-box">
                <Image src="/DHX Logo.jpeg" alt="DHX" width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div className="carrier-name-label">DHX</div>
            </div>
          </div>
        </div>

        <div className="form-container">
          <form id="quoteForm" className="quote-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Get Your Free Quote</h2>
            
            {/* Shipping Type */}
            <div className="form-group">
              <label htmlFor="shippingType">Shipping Type <span className="required">*</span></label>
              <select 
                id="shippingType" 
                name="shippingType" 
                required 
                value={shippingType}
                onChange={(e) => handleShippingTypeChange(e.target.value)}
              >
                <option value="">Select shipping method...</option>
                <option value="ocean">Ocean Freight (Sea)</option>
                <option value="air">Air Cargo</option>
              </select>
            </div>

            {/* Route Type */}
            <div className="form-group">
              <label htmlFor="routeType">Route Type <span className="required">*</span></label>
              <select 
                id="routeType" 
                name="routeType" 
                required
                value={routeType}
                onChange={(e) => handleRouteTypeChange(e.target.value)}
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
                <label htmlFor="origin">Origin <span className="required">*</span></label>
                <select 
                  id="origin" 
                  name="origin" 
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
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
                <label htmlFor="destination">Destination <span className="required">*</span></label>
                <select 
                  id="destination" 
                  name="destination" 
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
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

            {/* Select Carriers */}
            <div className="form-group">
              <label>Select Carriers <span className="required">*</span></label>
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
                    {allSelected ? '✗ Deselect All Carriers' : '✓ Select All Carriers'}
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

            {/* Carrier-Specific Fields Container */}
            {carrierFields.size > 0 && (
              <div id="carrierFieldsContainer">
                <div className="carrier-specific-section">
                  <div className="carrier-specific-title">📋 Carrier-Specific Information</div>
                  <p style={{ color: '#94a3b8', fontSize: '0.95em', marginBottom: '20px' }}>
                    These fields are required by your selected carriers for accurate quotes.
                  </p>
                  
                  {Array.from(carrierFields.entries()).map(([fieldKey, field]) => (
                    <div key={fieldKey} className="form-group">
                      <label htmlFor={fieldKey}>
                        {field.label} {field.required && <span className="required">*</span>}
                      </label>
                      
                      {field.type === 'select' ? (
                        <select id={fieldKey} name={fieldKey} required={field.required}>
                          <option value="">Select...</option>
                          {field.options?.map((option: string) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type={field.type} 
                          id={fieldKey} 
                          name={fieldKey} 
                          placeholder={field.placeholder || ''} 
                          required={field.required}
                        />
                      )}
                      
                      <div className="field-note">Required by: {field.carriers.join(', ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cargo Details */}
            <div className="form-group">
              <label htmlFor="cargoType">Cargo Type <span className="required">*</span></label>
              <select 
                id="cargoType" 
                name="cargoType" 
                required
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value)}
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
              <label htmlFor="weight">Weight (lbs) <span className="required">*</span></label>
              <input 
                type="text" 
                id="weight" 
                name="weight" 
                placeholder="e.g., 500" 
                required 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
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

            {/* Contact Information */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone <span className="required">*</span></label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  placeholder="(808) 555-1234" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!weight}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email <span className="required">*</span></label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="you@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!phone}
                />
              </div>
            </div>

            {/* Notification Preference */}
            <div className="form-group">
              <label>How should we send your quotes? <span className="required">*</span></label>
              <div className="notification-prefs">
                <div className="radio-group">
                  <input type="radio" id="sms" name="notificationPref" value="sms" required disabled={!email} />
                  <label htmlFor="sms" style={{ margin: 0 }}>Text Only</label>
                </div>
                <div className="radio-group">
                  <input type="radio" id="email-only" name="notificationPref" value="email" required disabled={!email} />
                  <label htmlFor="email-only" style={{ margin: 0 }}>Email Only</label>
                </div>
                <div className="radio-group">
                  <input type="radio" id="both" name="notificationPref" value="both" required defaultChecked disabled={!email} />
                  <label htmlFor="both" style={{ margin: 0 }}>Both</label>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={!email}>Get Free Quotes 🚀</button>
          </form>

          <div id="successMessage" className={`success-message ${showSuccess ? 'show' : ''}`}>
            ✅ <strong>Quote Request Submitted!</strong><br />
            We&apos;ll send quotes from your selected carriers within 24-48 hours.
          </div>
        </div>
      </section>
    </main>
  );
}

