import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isEmailConfigured, getResendApiKey, getContactEmail } from '@/lib/utils/email-config';

/**
 * GET /api/test-email
 * Send a test email to verify Resend configuration
 * 
 * Access: Public (for testing purposes)
 */
export async function GET(request: NextRequest) {
  try {
    if (!isEmailConfigured()) {
      return NextResponse.json(
        { 
          error: 'Email not configured',
          message: 'RESEND_API_KEY or CONTACT_EMAIL environment variables are missing'
        },
        { status: 500 }
      );
    }

    const resend = new Resend(getResendApiKey()!);
    const contactEmail = getContactEmail()!;

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Test <onboarding@resend.dev>',
      to: contactEmail,
      subject: '🎉 Resend Email Configuration Test',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .success-badge {
                background: #10b981;
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                display: inline-block;
                font-weight: bold;
                margin: 20px 0;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
              }
              .code-block {
                background: #1f2937;
                color: #10b981;
                padding: 15px;
                border-radius: 5px;
                font-family: 'Courier New', monospace;
                margin: 15px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>✅ Email Configuration Test</h1>
              <p>Your Resend integration is working perfectly!</p>
            </div>
            <div class="content">
              <div class="success-badge">✓ Test Successful</div>
              
              <h2>Configuration Details</h2>
              <ul>
                <li><strong>Service:</strong> Resend Email API</li>
                <li><strong>Recipient:</strong> ${contactEmail}</li>
                <li><strong>Status:</strong> Successfully Configured</li>
                <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
              </ul>

              <h3>What's Next?</h3>
              <p>Your portfolio contact form is now ready to use! Visitors can send you messages directly from your portfolio.</p>

              <div class="code-block">
                ✓ Resend API Key: Configured<br/>
                ✓ Contact Email: ${contactEmail}<br/>
                ✓ Email Service: Active
              </div>

              <div class="footer">
                <p><strong>Portfolio Management System</strong></p>
                <p>This is an automated test email from your portfolio website.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      return NextResponse.json(
        { 
          error: 'Failed to send test email',
          details: error 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${contactEmail}`,
      emailId: data?.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}
