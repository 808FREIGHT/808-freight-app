'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Types
interface QuoteRequest {
  id: string;
  created_at: string;
  user_email: string;
  user_name: string;
  user_phone: string;
  company_name: string | null;
  pickup_island: string;
  delivery_island: string;
  cargo_type: string;
  weight_lbs: number;
  length_inches: number | null;
  width_inches: number | null;
  height_inches: number | null;
  selected_carriers: string[];
  status: string;
  special_instructions: string | null;
  metadata: any;
}

// Carrier name mapping
const CARRIER_NAMES: { [key: string]: string } = {
  youngBrothers: 'Young Brothers',
  matson: 'Matson Navigation',
  pasha: 'Pasha Hawaii',
  fedex: 'FedEx Cargo',
  ups: 'UPS Cargo',
  alohaAir: 'Aloha Air Cargo',
  hawaiianAir: 'Hawaiian Air Cargo',
  hawaiiAir: 'Hawaii Air Cargo',
  pacificAir: 'Pacific Air Cargo',
  dhx: 'DHX',
};

// Status colors - dark theme
const STATUS_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  pending: { bg: 'rgba(251, 191, 36, 0.1)', text: '#fbbf24', border: '#fbbf24' },
  in_progress: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#3b82f6' },
  completed: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', border: '#22c55e' },
  cancelled: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#ef4444' },
};

export default function AdminDashboard() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [filter, setFilter] = useState('all');

  // Fetch quotes from Supabase
  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quotes:', error);
    } else {
      setQuotes(data || []);
    }
    setLoading(false);
  };

  // Update quote status
  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('quote_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } else {
      fetchQuotes();
      if (selectedQuote?.id === id) {
        setSelectedQuote({ ...selectedQuote, status: newStatus });
      }
    }
  };

  // Filter quotes
  const filteredQuotes = quotes.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  // Stats
  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    inProgress: quotes.filter(q => q.status === 'in_progress').length,
    completed: quotes.filter(q => q.status === 'completed').length,
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#ffffff'
    }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#0a0a0a', 
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #27272a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '18px'
          }}>
            8
          </div>
          <div>
            <h1 style={{ color: '#ffffff', margin: 0, fontSize: '20px', fontWeight: 600 }}>808 Freight</h1>
            <p style={{ color: '#71717a', margin: 0, fontSize: '13px' }}>Admin Dashboard</p>
          </div>
        </div>
        <a 
          href="/"
          style={{
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '14px',
            padding: '8px 16px',
            backgroundColor: '#27272a',
            borderRadius: '8px',
            transition: 'background 0.2s',
          }}
        >
          ← Back to Site
        </a>
      </header>

      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '16px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            backgroundColor: '#18181b', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #27272a'
          }}>
            <p style={{ color: '#71717a', fontSize: '13px', margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Quotes</p>
            <p style={{ color: '#ffffff', fontSize: '36px', margin: '8px 0 0', fontWeight: 700 }}>{stats.total}</p>
          </div>
          <div style={{ 
            backgroundColor: '#18181b', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #27272a'
          }}>
            <p style={{ color: '#fbbf24', fontSize: '13px', margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending</p>
            <p style={{ color: '#fbbf24', fontSize: '36px', margin: '8px 0 0', fontWeight: 700 }}>{stats.pending}</p>
          </div>
          <div style={{ 
            backgroundColor: '#18181b', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #27272a'
          }}>
            <p style={{ color: '#3b82f6', fontSize: '13px', margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>In Progress</p>
            <p style={{ color: '#3b82f6', fontSize: '36px', margin: '8px 0 0', fontWeight: 700 }}>{stats.inProgress}</p>
          </div>
          <div style={{ 
            backgroundColor: '#18181b', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #27272a'
          }}>
            <p style={{ color: '#22c55e', fontSize: '13px', margin: 0, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completed</p>
            <p style={{ color: '#22c55e', fontSize: '36px', margin: '8px 0 0', fontWeight: 700 }}>{stats.completed}</p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedQuote ? '1fr 420px' : '1fr', gap: '20px' }}>
          {/* Quotes List */}
          <div style={{ 
            backgroundColor: '#18181b', 
            borderRadius: '12px',
            border: '1px solid #27272a',
            overflow: 'hidden'
          }}>
            {/* Filter Tabs */}
            <div style={{ 
              display: 'flex', 
              borderBottom: '1px solid #27272a',
              padding: '0 20px',
              alignItems: 'center'
            }}>
              {['all', 'pending', 'in_progress', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  style={{
                    padding: '16px 20px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: filter === status ? '#ffffff' : '#71717a',
                    borderBottom: filter === status ? '2px solid #3b82f6' : '2px solid transparent',
                    marginBottom: '-1px',
                    transition: 'color 0.2s',
                  }}
                >
                  {status === 'all' ? 'All Quotes' : 
                   status === 'in_progress' ? 'In Progress' : 
                   status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
              <button
                onClick={fetchQuotes}
                style={{
                  marginLeft: 'auto',
                  padding: '8px 16px',
                  border: '1px solid #27272a',
                  backgroundColor: '#27272a',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#ffffff',
                  margin: '12px 0 12px auto',
                  transition: 'background 0.2s',
                }}
              >
                ↻ Refresh
              </button>
            </div>

            {/* Quotes Table */}
            <div style={{ padding: '0' }}>
              {loading ? (
                <p style={{ textAlign: 'center', color: '#71717a', padding: '60px' }}>Loading quotes...</p>
              ) : filteredQuotes.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#71717a', padding: '60px' }}>No quotes found</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #27272a' }}>
                      <th style={{ textAlign: 'left', padding: '14px 20px', color: '#71717a', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '14px 20px', color: '#71717a', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</th>
                      <th style={{ textAlign: 'left', padding: '14px 20px', color: '#71717a', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Route</th>
                      <th style={{ textAlign: 'left', padding: '14px 20px', color: '#71717a', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Carriers</th>
                      <th style={{ textAlign: 'left', padding: '14px 20px', color: '#71717a', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuotes.map(quote => (
                      <tr 
                        key={quote.id}
                        onClick={() => setSelectedQuote(quote)}
                        style={{ 
                          borderBottom: '1px solid #27272a',
                          cursor: 'pointer',
                          backgroundColor: selectedQuote?.id === quote.id ? '#27272a' : 'transparent',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedQuote?.id !== quote.id) {
                            e.currentTarget.style.backgroundColor = '#1f1f23';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedQuote?.id !== quote.id) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <td style={{ padding: '16px 20px', fontSize: '14px', color: '#a1a1aa' }}>
                          {formatDate(quote.created_at)}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#ffffff' }}>{quote.user_name}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#71717a' }}>{quote.user_email}</p>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '14px', color: '#a1a1aa' }}>
                          {quote.pickup_island?.split('(')[0]?.trim()} → {quote.delivery_island?.split('(')[0]?.trim()}
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '13px', color: '#71717a' }}>
                          {quote.selected_carriers?.length || 0} carriers
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 500,
                            backgroundColor: STATUS_COLORS[quote.status]?.bg || 'rgba(113,113,122,0.1)',
                            color: STATUS_COLORS[quote.status]?.text || '#71717a',
                            border: `1px solid ${STATUS_COLORS[quote.status]?.border || '#27272a'}`,
                          }}>
                            {quote.status === 'in_progress' ? 'In Progress' : 
                             quote.status?.charAt(0).toUpperCase() + quote.status?.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Quote Details Panel */}
          {selectedQuote && (
            <div style={{ 
              backgroundColor: '#18181b', 
              borderRadius: '12px',
              border: '1px solid #27272a',
              padding: '24px',
              height: 'fit-content',
              position: 'sticky',
              top: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '16px', fontWeight: 600 }}>Quote Details</h3>
                <button 
                  onClick={() => setSelectedQuote(null)}
                  style={{ 
                    background: '#27272a', 
                    border: 'none', 
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    fontSize: '18px', 
                    cursor: 'pointer',
                    color: '#71717a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>

              {/* Status Update */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '12px', color: '#71717a', margin: '0 0 10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Update Status</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['pending', 'in_progress', 'completed', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedQuote.id, status)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${selectedQuote.status === status ? STATUS_COLORS[status]?.border : '#27272a'}`,
                        backgroundColor: selectedQuote.status === status ? STATUS_COLORS[status]?.bg : 'transparent',
                        color: selectedQuote.status === status ? STATUS_COLORS[status]?.text : '#71717a',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div style={{ backgroundColor: '#0a0a0a', padding: '16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #27272a' }}>
                <p style={{ fontSize: '11px', color: '#71717a', margin: '0 0 12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</p>
                <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#ffffff', fontSize: '15px' }}>{selectedQuote.user_name}</p>
                {selectedQuote.company_name && (
                  <p style={{ margin: '0 0 6px', fontSize: '14px', color: '#71717a' }}>{selectedQuote.company_name}</p>
                )}
                <p style={{ margin: '0 0 4px', fontSize: '14px' }}>
                  <a href={`mailto:${selectedQuote.user_email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{selectedQuote.user_email}</a>
                </p>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  <a href={`tel:${selectedQuote.user_phone}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{selectedQuote.user_phone}</a>
                </p>
              </div>

              {/* Shipment Info */}
              <div style={{ backgroundColor: '#0a0a0a', padding: '16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #27272a' }}>
                <p style={{ fontSize: '11px', color: '#71717a', margin: '0 0 12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shipment</p>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#71717a', fontSize: '14px' }}>Type</span>
                    <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500 }}>{selectedQuote.metadata?.shippingType === 'ocean' ? '🚢 Ocean' : '✈️ Air'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#71717a', fontSize: '14px' }}>From</span>
                    <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500, textAlign: 'right', maxWidth: '200px' }}>{selectedQuote.pickup_island?.split('(')[0]?.trim()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#71717a', fontSize: '14px' }}>To</span>
                    <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500, textAlign: 'right', maxWidth: '200px' }}>{selectedQuote.delivery_island?.split('(')[0]?.trim()}</span>
                  </div>
                </div>
              </div>

              {/* Cargo Info */}
              <div style={{ backgroundColor: '#0a0a0a', padding: '16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #27272a' }}>
                <p style={{ fontSize: '11px', color: '#71717a', margin: '0 0 12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cargo</p>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#71717a', fontSize: '14px' }}>Type</span>
                    <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500 }}>{selectedQuote.cargo_type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#71717a', fontSize: '14px' }}>Weight</span>
                    <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500 }}>{selectedQuote.weight_lbs} lbs</span>
                  </div>
                  {selectedQuote.length_inches && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#71717a', fontSize: '14px' }}>Dimensions</span>
                      <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500 }}>{selectedQuote.length_inches}" × {selectedQuote.width_inches}" × {selectedQuote.height_inches}"</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Carriers */}
              <div style={{ backgroundColor: '#0a0a0a', padding: '16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #27272a' }}>
                <p style={{ fontSize: '11px', color: '#71717a', margin: '0 0 12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Carriers Requested</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedQuote.selected_carriers?.map(carrier => (
                    <span 
                      key={carrier}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      {CARRIER_NAMES[carrier] || carrier}
                    </span>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              {selectedQuote.special_instructions && (
                <div style={{ backgroundColor: 'rgba(251, 191, 36, 0.05)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                  <p style={{ fontSize: '11px', color: '#fbbf24', margin: '0 0 8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Special Instructions</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#fbbf24', lineHeight: 1.5 }}>{selectedQuote.special_instructions}</p>
                </div>
              )}

              {/* Quote ID */}
              <p style={{ fontSize: '11px', color: '#52525b', marginTop: '20px', textAlign: 'center', fontFamily: 'monospace' }}>
                {selectedQuote.id}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
