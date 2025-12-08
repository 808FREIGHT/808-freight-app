import Link from 'next/link';

export const metadata = {
  title: '808 FREIGHT - Terms of Service',
  description: 'Terms of Service for 808 Freight - Hawaii freight quote comparison platform',
};

export default function TermsOfService() {
  return (
    <main style={{ background: '#000435', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        background: '#000435', 
        padding: '20px', 
        borderBottom: '2px solid rgba(30, 159, 216, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ color: '#1E9FD8', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 800 }}>
          ← 808 FREIGHT
        </Link>
      </div>

      {/* Content */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '40px 20px',
        color: '#ffffff',
        lineHeight: 1.8
      }}>
        <h1 style={{ 
          color: '#1E9FD8', 
          fontSize: '2.5rem', 
          fontWeight: 800, 
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          Terms of Service
        </h1>
        
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px', fontSize: '0.95rem' }}>
          <strong>Last Updated:</strong> December 2024
        </p>

        {/* Acceptance of Terms */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            1. Acceptance of Terms
          </h2>
          <p style={{ marginBottom: '15px' }}>
            Welcome to 808 Freight. By accessing or using our website at 808freight.com ("Service"), 
            you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these 
            Terms, please do not use our Service.
          </p>
          <p>
            These Terms apply to all visitors, users, and others who access or use the Service. 
            Please read them carefully before using 808 Freight.
          </p>
        </section>

        {/* Description of Service */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            2. Description of Service
          </h2>
          <p style={{ marginBottom: '15px' }}>
            808 Freight is a <strong>FREE quote comparison platform</strong> that helps customers obtain 
            shipping quotes from Hawaii freight carriers. We provide a convenient way to submit your 
            shipping information to multiple carriers at once.
          </p>
          
          <div style={{ 
            background: 'rgba(30, 159, 216, 0.15)', 
            padding: '20px', 
            borderRadius: '8px',
            borderLeft: '4px solid #1E9FD8',
            marginBottom: '20px'
          }}>
            <p style={{ fontWeight: 700, marginBottom: '10px', color: '#1E9FD8' }}>What We Do:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '0' }}>
              <li>Forward your shipping information to carriers you select</li>
              <li>Help you compare quotes from multiple Hawaii freight carriers</li>
              <li>Provide a free service with no obligation</li>
            </ul>
          </div>

          <div style={{ 
            background: 'rgba(248, 113, 113, 0.15)', 
            padding: '20px', 
            borderRadius: '8px',
            borderLeft: '4px solid #f87171',
            marginBottom: '15px'
          }}>
            <p style={{ fontWeight: 700, marginBottom: '10px', color: '#f87171' }}>What We Do NOT Do:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '0' }}>
              <li>We are NOT a freight broker, carrier, or freight forwarder</li>
              <li>We do NOT transport goods or handle shipments</li>
              <li>We do NOT process payments or handle billing</li>
              <li>We do NOT guarantee shipping rates or carrier availability</li>
              <li>We do NOT take responsibility for carrier performance</li>
            </ul>
          </div>

          <p>
            All shipping arrangements, contracts, and payments are made directly between you and the 
            carrier(s) you choose. 808 Freight is simply a lead generation service that connects you 
            with carriers.
          </p>
        </section>

        {/* User Responsibilities */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            3. User Responsibilities
          </h2>
          <p style={{ marginBottom: '10px' }}>By using our Service, you agree to:</p>
          <ul style={{ marginLeft: '25px', marginBottom: '15px' }}>
            <li>Provide accurate and complete shipping information (dimensions, weight, cargo type, addresses)</li>
            <li>Be solely responsible for the accuracy of all information you submit</li>
            <li>Be at least 18 years of age</li>
            <li>Use the Service only for lawful purposes</li>
            <li>Not submit requests for shipping prohibited, illegal, or hazardous materials without proper disclosure</li>
            <li>Not misrepresent yourself or your shipment</li>
            <li>Not attempt to interfere with or disrupt the Service</li>
          </ul>
          <p>
            Inaccurate information may result in incorrect quotes or carriers being unable to fulfill your request.
          </p>
        </section>

        {/* Quote Disclaimer */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            4. Quote Disclaimer
          </h2>
          <div style={{ 
            background: 'rgba(251, 191, 36, 0.15)', 
            padding: '20px', 
            borderRadius: '8px',
            borderLeft: '4px solid #fbbf24'
          }}>
            <p style={{ marginBottom: '15px' }}>
              <strong>Quotes are estimates only.</strong> All quotes provided through our Service are 
              preliminary estimates provided by the carriers themselves. These quotes are NOT guarantees 
              of final pricing.
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Final rates are determined by carriers based on actual shipment details at time of booking</li>
              <li>Rates may vary due to fuel surcharges, seasonal demand, or other factors</li>
              <li>Carrier rates may change without notice</li>
              <li>Additional fees may apply for special handling, remote locations, or other services</li>
            </ul>
            <p style={{ marginBottom: '0' }}>
              808 Freight does not guarantee the accuracy of any quotes. Always confirm final pricing 
              directly with your chosen carrier before booking.
            </p>
          </div>
        </section>

        {/* No Liability for Carrier Performance */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            5. No Liability for Carrier Performance
          </h2>
          <p style={{ marginBottom: '15px' }}>
            <strong>808 Freight is NOT responsible for any actions or failures of the carriers.</strong> 
            This includes but is not limited to:
          </p>
          <ul style={{ marginLeft: '25px', marginBottom: '15px' }}>
            <li>Accuracy of carrier-provided quotes</li>
            <li>Shipping delays or missed delivery windows</li>
            <li>Loss, damage, or theft of cargo</li>
            <li>Quality of carrier service or customer support</li>
            <li>Carrier billing disputes or overcharges</li>
            <li>Carrier cancellations or refusals to ship</li>
            <li>Any disputes between you and the carrier</li>
          </ul>
          <p>
            All claims regarding shipments, quotes, or service quality must be directed to the carrier 
            directly. 808 Freight has no authority or responsibility to resolve carrier-related disputes.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            6. Limitation of Liability
          </h2>
          <p style={{ marginBottom: '15px' }}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, 808 FREIGHT, ITS OWNER, EMPLOYEES, AND AFFILIATES 
            SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE 
            DAMAGES ARISING FROM:
          </p>
          <ul style={{ marginLeft: '25px', marginBottom: '15px' }}>
            <li>Your use of or inability to use the Service</li>
            <li>Any quotes, information, or content obtained through the Service</li>
            <li>Any transactions or relationships between you and carriers</li>
            <li>Unauthorized access to your data</li>
            <li>Any errors, mistakes, or inaccuracies in the Service</li>
          </ul>
          <p style={{ marginBottom: '15px' }}>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
            FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            Your use of the Service is at your own risk.
          </p>
        </section>

        {/* Indemnification */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            7. Indemnification
          </h2>
          <p style={{ marginBottom: '15px' }}>
            You agree to indemnify, defend, and hold harmless 808 Freight, its owner (Pono Enos), 
            employees, and affiliates from any and all claims, damages, losses, liabilities, costs, 
            and expenses (including reasonable attorney fees) arising from:
          </p>
          <ul style={{ marginLeft: '25px' }}>
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any rights of another party</li>
            <li>Any disputes between you and carriers</li>
            <li>Inaccurate or misleading information you provide</li>
            <li>Any claims related to your shipments</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            8. Intellectual Property
          </h2>
          <p style={{ marginBottom: '15px' }}>
            The Service and its original content, features, and functionality are owned by 808 Freight 
            and are protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            The 808 Freight name, logo, and all related names, logos, product and service names, designs, 
            and slogans are trademarks of 808 Freight. You may not use such marks without our prior written 
            permission. You may not copy, reproduce, distribute, or create derivative works from our content 
            without express authorization.
          </p>
        </section>

        {/* Modifications */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            9. Modifications to Service and Terms
          </h2>
          <p style={{ marginBottom: '15px' }}>
            We reserve the right to modify or discontinue the Service (or any part thereof) at any time, 
            with or without notice.
          </p>
          <p>
            We may also revise these Terms from time to time. The most current version will always be 
            posted on this page with an updated "Last Updated" date. Your continued use of the Service 
            after any changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        {/* Termination */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            10. Termination
          </h2>
          <p style={{ marginBottom: '15px' }}>
            We may terminate or suspend your access to the Service immediately, without prior notice, 
            for any reason, including if you breach these Terms.
          </p>
          <p>
            You may stop using the Service at any time. All provisions of these Terms that should 
            reasonably survive termination shall survive, including ownership provisions, warranty 
            disclaimers, indemnity, and limitations of liability.
          </p>
        </section>

        {/* Governing Law */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            11. Governing Law
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the 
            <strong> State of Hawaii</strong>, without regard to its conflict of law provisions. 
            Any disputes arising from these Terms or your use of the Service shall be subject to the 
            exclusive jurisdiction of the state and federal courts located in Hawaii.
          </p>
        </section>

        {/* Severability */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            12. Severability
          </h2>
          <p>
            If any provision of these Terms is found to be invalid, illegal, or unenforceable, the 
            remaining provisions shall continue in full force and effect. The invalid or unenforceable 
            provision shall be modified to the minimum extent necessary to make it valid and enforceable.
          </p>
        </section>

        {/* Entire Agreement */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            13. Entire Agreement
          </h2>
          <p>
            These Terms, together with our <Link href="/privacy" style={{ color: '#1E9FD8' }}>Privacy Policy</Link>, 
            constitute the entire agreement between you and 808 Freight regarding your use of the Service 
            and supersede any prior agreements.
          </p>
        </section>

        {/* Contact Us */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            14. Contact Us
          </h2>
          <p style={{ marginBottom: '15px' }}>
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div style={{ 
            background: 'rgba(30, 58, 138, 0.3)', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid rgba(30, 159, 216, 0.3)'
          }}>
            <p style={{ margin: '5px 0' }}><strong>808 Freight</strong></p>
            <p style={{ margin: '5px 0' }}>Owner: Pono Enos</p>
            <p style={{ margin: '5px 0' }}>Email: <a href="mailto:admin@808freight.com" style={{ color: '#1E9FD8' }}>admin@808freight.com</a></p>
            <p style={{ margin: '5px 0' }}>Location: Hawaii, USA</p>
          </div>
        </section>

        {/* Footer Links */}
        <div style={{ 
          marginTop: '60px', 
          paddingTop: '30px', 
          borderTop: '1px solid rgba(30, 159, 216, 0.3)',
          textAlign: 'center'
        }}>
          <Link href="/" style={{ color: '#1E9FD8', marginRight: '30px', textDecoration: 'none' }}>Home</Link>
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.5)', marginRight: '30px', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/privacy" style={{ color: '#1E9FD8', textDecoration: 'none' }}>Privacy Policy</Link>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '20px', fontSize: '0.9rem' }}>
            © 2024 808 Freight. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}

