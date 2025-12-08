import Link from 'next/link';

export const metadata = {
  title: '808 FREIGHT - Privacy Policy',
  description: 'Privacy Policy for 808 Freight - Hawaii freight quote comparison platform',
};

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>
        
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px', fontSize: '0.95rem' }}>
          <strong>Last Updated:</strong> December 2024
        </p>

        {/* Introduction */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            1. Introduction
          </h2>
          <p style={{ marginBottom: '15px' }}>
            Welcome to 808 Freight ("we," "our," or "us"). 808 Freight operates the website 808freight.com, 
            a free quote comparison platform that connects customers with Hawaii freight carriers for inter-island 
            and West Coast shipping.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, disclose, and protect your personal information 
            when you use our website and services. By using 808freight.com, you agree to the terms of this Privacy Policy.
          </p>
        </section>

        {/* Information We Collect */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            2. Information We Collect
          </h2>
          
          <h3 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '10px', marginTop: '20px' }}>
            Information You Provide
          </h3>
          <p style={{ marginBottom: '10px' }}>When you submit a quote request, we collect:</p>
          <ul style={{ marginLeft: '25px', marginBottom: '15px' }}>
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Company name (if provided)</li>
            <li>Origin and destination addresses/locations</li>
            <li>Cargo type and description</li>
            <li>Cargo dimensions and weight</li>
            <li>Preferred shipping method (ocean or air)</li>
            <li>Selected carriers for quote requests</li>
          </ul>

          <h3 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '10px', marginTop: '20px' }}>
            Information Collected Automatically
          </h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul style={{ marginLeft: '25px' }}>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Pages visited and time spent on site</li>
            <li>Referring website</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            3. How We Use Your Information
          </h2>
          <p style={{ marginBottom: '10px' }}>We use your information to:</p>
          <ul style={{ marginLeft: '25px', marginBottom: '15px' }}>
            <li>Forward your quote request to the carriers you select</li>
            <li>Communicate with you about your quote request status</li>
            <li>Send follow-up emails regarding your shipping inquiry</li>
            <li>Improve our website and services</li>
            <li>Respond to your questions or requests</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p style={{ 
            background: 'rgba(30, 159, 216, 0.15)', 
            padding: '15px', 
            borderRadius: '8px',
            borderLeft: '4px solid #1E9FD8'
          }}>
            <strong>Important:</strong> We do NOT use your personal information for marketing purposes 
            to third parties. We do NOT sell your data.
          </p>
        </section>

        {/* How We Share Your Information */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            4. How We Share Your Information
          </h2>
          
          <h3 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '10px', marginTop: '20px' }}>
            With Carriers You Select
          </h3>
          <p style={{ marginBottom: '15px' }}>
            When you submit a quote request, we share your shipping information ONLY with the carriers 
            you specifically select. This enables them to provide you with accurate freight quotes. 
            These carriers may include:
          </p>
          <ul style={{ marginLeft: '25px', marginBottom: '15px' }}>
            <li>Young Brothers (inter-island ocean freight)</li>
            <li>Matson Navigation (West Coast to Hawaii ocean freight)</li>
            <li>Pasha Hawaii (West Coast to Hawaii ocean freight)</li>
            <li>Aloha Air Cargo (air cargo)</li>
            <li>Alaska/Hawaiian Air Cargo (air cargo)</li>
            <li>Pacific Air Cargo (air cargo)</li>
            <li>DHX - Dependable Hawaiian Express (freight forwarding)</li>
          </ul>

          <h3 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '10px', marginTop: '20px' }}>
            We Do NOT Share With Third Parties for Marketing
          </h3>
          <p style={{ marginBottom: '15px' }}>
            We do NOT sell, rent, trade, or otherwise share your personal information with third parties 
            for their marketing purposes. We do NOT sell your data to data brokers.
          </p>

          <h3 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '10px', marginTop: '20px' }}>
            Legal Requirements
          </h3>
          <p>
            We may disclose your information if required by law, court order, or government regulation, 
            or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
          </p>
        </section>

        {/* Data Retention */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            5. Data Retention
          </h2>
          <p style={{ marginBottom: '15px' }}>
            We retain your quote request data for up to two (2) years for service improvement and 
            to assist with any follow-up inquiries you may have.
          </p>
          <p>
            You may request deletion of your data at any time by contacting us at{' '}
            <a href="mailto:admin@808freight.com" style={{ color: '#1E9FD8' }}>admin@808freight.com</a>.
          </p>
        </section>

        {/* Your Rights - CCPA */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            6. Your Privacy Rights (California Residents / CCPA)
          </h2>
          <p style={{ marginBottom: '15px' }}>
            If you are a California resident, you have the following rights under the California Consumer 
            Privacy Act (CCPA):
          </p>
          <ul style={{ marginLeft: '25px', marginBottom: '15px' }}>
            <li><strong>Right to Know:</strong> You can request information about what personal data we have collected about you.</li>
            <li><strong>Right to Delete:</strong> You can request that we delete your personal information.</li>
            <li><strong>Right to Opt-Out of Sale:</strong> You have the right to opt-out of the sale of your personal information. Note: 808 Freight does NOT sell personal information.</li>
            <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights.</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{' '}
            <a href="mailto:admin@808freight.com" style={{ color: '#1E9FD8' }}>admin@808freight.com</a>. 
            We will respond to your request within 45 days.
          </p>
        </section>

        {/* Cookies and Tracking */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            7. Cookies and Tracking Technologies
          </h2>
          <p style={{ marginBottom: '15px' }}>
            We may use cookies and similar tracking technologies to enhance your experience on our website. 
            Cookies are small files stored on your device that help us understand how you use our site.
          </p>
          <p style={{ marginBottom: '15px' }}>
            We may use Google Analytics or similar services to analyze website traffic and usage patterns. 
            This helps us improve our service.
          </p>
          <p>
            You can control cookies through your browser settings. However, disabling cookies may affect 
            some functionality of our website.
          </p>
        </section>

        {/* Data Security */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            8. Data Security
          </h2>
          <p style={{ marginBottom: '15px' }}>
            We implement reasonable administrative, technical, and physical security measures to protect 
            your personal information from unauthorized access, use, or disclosure.
          </p>
          <p>
            However, no method of transmission over the Internet or electronic storage is 100% secure. 
            While we strive to protect your information, we cannot guarantee absolute security.
          </p>
        </section>

        {/* Children's Privacy */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            9. Children's Privacy
          </h2>
          <p>
            808 Freight is not intended for use by individuals under 18 years of age. We do not knowingly 
            collect personal information from children. If we become aware that we have collected information 
            from a minor, we will take steps to delete it promptly.
          </p>
        </section>

        {/* Changes to Policy */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            10. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will post the updated 
            policy on this page and update the "Last Updated" date at the top. We encourage you to review 
            this policy periodically. Your continued use of our website after any changes indicates your 
            acceptance of the updated policy.
          </p>
        </section>

        {/* Contact Us */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#1E9FD8', fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px' }}>
            11. Contact Us
          </h2>
          <p style={{ marginBottom: '15px' }}>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div style={{ 
            background: 'rgba(30, 58, 138, 0.3)', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid rgba(30, 159, 216, 0.3)'
          }}>
            <p style={{ margin: '5px 0' }}><strong>808 Freight</strong></p>
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
          <Link href="/terms" style={{ color: '#1E9FD8', marginRight: '30px', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Privacy Policy</Link>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '20px', fontSize: '0.9rem' }}>
            © 2024 808 Freight. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}

