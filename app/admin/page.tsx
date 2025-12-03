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

// Status colors
const STATUS_COLORS: { [key: string]: { bg: string; text: string } } = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  in_progress: { bg: '#dbeafe', text: '#1e40af' },
  completed: { bg: '#d1fae5', text: '#065f46' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#1e3a8a', 
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ color: '#ffffff', margin: 0, fontSize: '28px', fontWeight: 800 }}>808 FREIGHT</h1>
          <p style={{ color: '#1E9FD8', margin: '5px 0 0', fontSize: '14px' }}>Admin Dashboard</p>
        </div>
        <a 
          href="/"
          style={{
            color: '#1E9FD8',
            textDecoration: 'none',
            fontSize: '14px',
            padding: '8px 16px',
            border: '2px solid #1E9FD8',
            borderRadius: '6px',
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
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '25px', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0, fontWeight: 600 }}>TOTAL QUOTES</p>
            <p style={{ color: '#1e3a8a', fontSize: '36px', margin: '10px 0 0', fontWeight: 800 }}>{stats.total}</p>
          </div>
          <div style={{ 
            backgroundColor: '#fef3c7', 
            padding: '25px', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <p style={{ color: '#92400e', fontSize: '14px', margin: 0, fontWeight: 600 }}>PENDING</p>
            <p style={{ color: '#92400e', fontSize: '36px', margin: '10px 0 0', fontWeight: 800 }}>{stats.pending}</p>
          </div>
          <div style={{ 
            backgroundColor: '#dbeafe', 
            padding: '25px', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <p style={{ color: '#1e40af', fontSize: '14px', margin: 0, fontWeight: 600 }}>IN PROGRESS</p>
            <p style={{ color: '#1e40af', fontSize: '36px', margin: '10px 0 0', fontWeight: 800 }}>{stats.inProgress}</p>
          </div>
          <div style={{ 
            backgroundColor: '#d1fae5', 
            padding: '25px', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <p style={{ color: '#065f46', fontSize: '14px', margin: 0, fontWeight: 600 }}>COMPLETED</p>
            <p style={{ color: '#065f46', fontSize: '36px', margin: '10px 0 0', fontWeight: 800 }}>{stats.completed}</p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedQuote ? '1fr 400px' : '1fr', gap: '20px' }}>
          {/* Quotes List */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            {/* Filter Tabs */}
            <div style={{ 
              display: 'flex', 
              borderBottom: '2px solid #e2e8f0',
              padding: '0 20px'
            }}>
              {['all', 'pending', 'in_progress', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  style={{
                    padding: '15px 20px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: filter === status ? '#1e3a8a' : '#64748b',
                    borderBottom: filter === status ? '3px solid #1e3a8a' : '3px solid transparent',
                    marginBottom: '-2px',
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
                  padding: '10px 15px',
                  border: '2px solid #1e3a8a',
                  background: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1e3a8a',
                  margin: '10px 0 10px auto',
                }}
              >
                Refresh
              </button>
            </div>

            {/* Quotes Table */}
            <div style={{ padding: '20px' }}>
              {loading ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>Loading quotes...</p>
              ) : filteredQuotes.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No quotes found</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', fontWeight: 700 }}>DATE</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', fontWeight: 700 }}>CUSTOMER</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', fontWeight: 700 }}>ROUTE</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', fontWeight: 700 }}>CARRIERS</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', fontWeight: 700 }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuotes.map(quote => (
                      <tr 
                        key={quote.id}
                        onClick={() => setSelectedQuote(quote)}
                        style={{ 
                          borderBottom: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          backgroundColor: selectedQuote?.id === quote.id ? '#f1f5f9' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '15px 12px', fontSize: '14px', color: '#334155' }}>
                          {formatDate(quote.created_at)}
                        </td>
                        <td style={{ padding: '15px 12px' }}>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{quote.user_name}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{quote.user_email}</p>
                        </td>
                        <td style={{ padding: '15px 12px', fontSize: '14px', color: '#334155' }}>
                          {quote.pickup_island?.split('(')[0]?.trim()} → {quote.delivery_island?.split('(')[0]?.trim()}
                        </td>
                        <td style={{ padding: '15px 12px', fontSize: '13px', color: '#64748b' }}>
                          {quote.selected_carriers?.length || 0} carriers
                        </td>
                        <td style={{ padding: '15px 12px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            backgroundColor: STATUS_COLORS[quote.status]?.bg || '#e2e8f0',
                            color: STATUS_COLORS[quote.status]?.text || '#334155',
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
              backgroundColor: '#ffffff', 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              padding: '25px',
              height: 'fit-content',
              position: 'sticky',
              top: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}>Quote Details</h3>
                <button 
                  onClick={() => setSelectedQuote(null)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '20px', 
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Status Update */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px', fontWeight: 600 }}>UPDATE STATUS</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['pending', 'in_progress', 'completed', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedQuote.id, status)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: selectedQuote.status === status ? 'none' : '2px solid #e2e8f0',
                        backgroundColor: selectedQuote.status === status ? STATUS_COLORS[status]?.bg : 'transparent',
                        color: selectedQuote.status === status ? STATUS_COLORS[status]?.text : '#64748b',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px', fontWeight: 600 }}>CUSTOMER</p>
                <p style={{ margin: '0 0 5px', fontWeight: 600, color: '#1e293b' }}>{selectedQuote.user_name}</p>
                {selectedQuote.company_name && (
                  <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#64748b' }}>{selectedQuote.company_name}</p>
                )}
                <p style={{ margin: '0 0 5px', fontSize: '14px' }}>
                  <a href={`mailto:${selectedQuote.user_email}`} style={{ color: '#1e3a8a' }}>{selectedQuote.user_email}</a>
                </p>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  <a href={`tel:${selectedQuote.user_phone}`} style={{ color: '#1e3a8a' }}>{selectedQuote.user_phone}</a>
                </p>
              </div>

              {/* Shipment Info */}
              <div style={{ backgroundColor: '#1E9FD8', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                <p style={{ fontSize: '12px', color: '#1e3a8a', margin: '0 0 10px', fontWeight: 600 }}>SHIPMENT</p>
                <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#1e3a8a' }}>
                  <strong>Type:</strong> {selectedQuote.metadata?.shippingType === 'ocean' ? 'Ocean Freight' : 'Air Cargo'}
                </p>
                <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#1e3a8a' }}>
                  <strong>From:</strong> {selectedQuote.pickup_island}
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#1e3a8a' }}>
                  <strong>To:</strong> {selectedQuote.delivery_island}
                </p>
              </div>

              {/* Cargo Info */}
              <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px', fontWeight: 600 }}>CARGO</p>
                <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#334155' }}>
                  <strong>Type:</strong> {selectedQuote.cargo_type}
                </p>
                <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#334155' }}>
                  <strong>Weight:</strong> {selectedQuote.weight_lbs} lbs
                </p>
                {selectedQuote.length_inches && (
                  <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#334155' }}>
                    <strong>Dimensions:</strong> {selectedQuote.length_inches}" × {selectedQuote.width_inches}" × {selectedQuote.height_inches}"
                  </p>
                )}
              </div>

              {/* Carriers */}
              <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px', fontWeight: 600 }}>CARRIERS REQUESTED</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedQuote.selected_carriers?.map(carrier => (
                    <span 
                      key={carrier}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: '#1e3a8a',
                        color: '#ffffff',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {CARRIER_NAMES[carrier] || carrier}
                    </span>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              {selectedQuote.special_instructions && (
                <div style={{ backgroundColor: '#fef3c7', padding: '15px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '12px', color: '#92400e', margin: '0 0 10px', fontWeight: 600 }}>SPECIAL INSTRUCTIONS</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>{selectedQuote.special_instructions}</p>
                </div>
              )}

              {/* Quote ID */}
              <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '20px', textAlign: 'center' }}>
                ID: {selectedQuote.id}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


