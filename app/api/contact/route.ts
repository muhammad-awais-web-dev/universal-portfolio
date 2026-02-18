import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isEmailConfigured, getResendApiKey, getContactEmail } from '@/lib/utils/email-config';

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const MAX_REQUESTS_PER_HOUR = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 };
  }

  if (record.count >= MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - record.count };
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

const reasonLabels: Record<string, string> = {
  collaboration: 'Collaboration Opportunity',
  job: 'Job Opportunity',
  project: 'Project Inquiry',
  freelance: 'Freelance Work',
  speaking: 'Speaking Engagement',
  general: 'General Question',
  other: 'Other',
};

/**
 * POST /api/contact
 * Send a contact form email
 */
export async function POST(request: NextRequest) {
  try {
    // Check email configuration
    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { name, email, reason, message } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!name || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Valid email is required';
    }

    if (!reason) {
      errors.reason = 'Reason is required';
    }

    if (!message || message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    } else if (message.trim().length > 2000) {
      errors.message = 'Message must be less than 2000 characters';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Send email
    const resend = new Resend(getResendApiKey()!);
    const contactEmail = getContactEmail()!;

    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="580" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#0a0a0a;padding:36px 40px;">
              <p style="margin:0 0 6px;color:#a3a3a3;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;">Portfolio</p>
              <h1 style="margin:0;color:#fafafa;font-size:22px;font-weight:600;letter-spacing:-0.3px;">New message received</h1>
            </td>
          </tr>

          <!-- Reason badge row -->
          <tr>
            <td style="padding:28px 40px 0;">
              <span style="display:inline-block;background-color:#f5f5f5;color:#0a0a0a;border:1px solid #e5e5e5;padding:5px 14px;border-radius:4px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;">${reasonLabels[reason] || reason}</span>
            </td>
          </tr>

          <!-- Sender details -->
          <tr>
            <td style="padding:20px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right:10px;">
                    <div style="background-color:#fafafa;border:1px solid #e5e5e5;border-radius:6px;padding:16px;">
                      <p style="margin:0 0 4px;color:#737373;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">From</p>
                      <p style="margin:0;color:#0a0a0a;font-size:15px;font-weight:500;">${name}</p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left:10px;">
                    <div style="background-color:#fafafa;border:1px solid #e5e5e5;border-radius:6px;padding:16px;">
                      <p style="margin:0 0 4px;color:#737373;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">Email</p>
                      <p style="margin:0;"><a href="mailto:${email}" style="color:#0a0a0a;font-size:15px;font-weight:500;text-decoration:underline;">${email}</a></p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message body -->
          <tr>
            <td style="padding:20px 40px 0;">
              <div style="border:1px solid #e5e5e5;border-radius:6px;padding:24px;">
                <p style="margin:0 0 12px;color:#737373;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">Message</p>
                <div style="color:#262626;font-size:15px;line-height:1.75;white-space:pre-wrap;word-wrap:break-word;">${message}</div>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:28px 40px 36px;">
              <a href="mailto:${email}" style="display:inline-block;background-color:#0a0a0a;color:#fafafa;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;letter-spacing:0.2px;">Reply to ${name} &rarr;</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;border-top:1px solid #e5e5e5;padding:20px 40px;">
              <p style="margin:0 0 4px;color:#a3a3a3;font-size:12px;">Received: ${timestamp}</p>
              <p style="margin:0;color:#d4d4d4;font-size:11px;">Sent from your portfolio contact form &bull; IP: ${clientIp}</p>
            </td>
          </tr>

        </table>

        <!-- Bottom note -->
        <table width="580" cellpadding="0" cellspacing="0" style="margin-top:16px;">
          <tr>
            <td style="text-align:center;color:#a3a3a3;font-size:12px;">
              &copy; ${new Date().getFullYear()} Portfolio &mdash; This email was auto-generated.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: contactEmail,
      replyTo: email,
      subject: `${reasonLabels[reason] || 'New Contact'} - ${name}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      emailId: data?.id,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
