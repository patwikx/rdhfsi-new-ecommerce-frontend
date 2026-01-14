import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'RD Hardware <noreply@rdretailgroup.com.ph>';

// Admin email recipients for order notifications
const ADMIN_EMAILS = [
  'rdh_santiago@rdretailgroup.com.ph',
  'operationshead@rdretailgroup.com.ph',
];

interface OrderConfirmationEmailData {
  orderNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  discountAmount?: number;
  totalAmount: number;
  deliveryType: 'delivery' | 'pickup';
  shippingAddress?: {
    address: string;
    city: string;
    province: string;
    postalCode?: string;
  };
  paymentMethod: string;
  poNumber?: string;
  poFileUrl?: string;
  trackingNumber?: string;
}

// Backend admin URL
const ADMIN_BACKEND_URL = 'https://backend.rdretailgroup.com.ph';

export async function sendOrderConfirmationEmail(data: OrderConfirmationEmailData) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.name}</strong><br>
        <span style="color: #6b7280; font-size: 12px;">SKU: ${item.sku}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₱${formatPrice(item.price)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₱${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  const deliveryInfo = data.deliveryType === 'delivery' && data.shippingAddress
    ? `
      <p style="margin: 0 0 8px 0;"><strong>Delivery Address:</strong></p>
      <p style="margin: 0; color: #374151;">
        ${data.shippingAddress.address}<br>
        ${data.shippingAddress.city}, ${data.shippingAddress.province} ${data.shippingAddress.postalCode || ''}
      </p>
    `
    : `
      <p style="margin: 0 0 8px 0;"><strong>Pickup Location:</strong></p>
      <p style="margin: 0; color: #374151;">
        RD Hardware Santiago Branch<br>
        Santiago Boulevard, General Santos City
      </p>
    `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background-color: #1f2937; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">RD Hardware</h1>
          <p style="color: #9ca3af; margin: 4px 0 0 0; font-size: 12px;">& Fishing Supply, Inc.</p>
        </div>

        <!-- Content -->
        <div style="background-color: #ffffff; padding: 32px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #059669; margin: 0 0 16px 0;">Order Confirmed! ✓</h2>
          
          <p style="margin: 0 0 24px 0;">
            Hi <strong>${data.customerName}</strong>,<br><br>
            Thank you for your order! We've received your order and will process it shortly.
          </p>

          <!-- Order Details -->
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0;"><strong>Order Number:</strong> <span style="color: #059669;">${data.orderNumber}</span></p>
            ${data.trackingNumber ? `<p style="margin: 0 0 8px 0;"><strong>Tracking Number:</strong> <span style="color: #2563eb;">${data.trackingNumber}</span></p>` : ''}
            <p style="margin: 0 0 8px 0;"><strong>Payment Method:</strong> ${data.paymentMethod}</p>
            ${data.poNumber ? `<p style="margin: 0;"><strong>PO Number:</strong> ${data.poNumber}</p>` : ''}
          </div>

          <!-- Delivery Info -->
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            ${deliveryInfo}
          </div>

          <!-- Order Items -->
          <h3 style="margin: 0 0 16px 0; font-size: 16px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280;">Product</th>
                <th style="padding: 12px; text-align: center; font-size: 12px; text-transform: uppercase; color: #6b7280;">Qty</th>
                <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #6b7280;">Price</th>
                <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #6b7280;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Order Summary -->
          <div style="border-top: 2px solid #e5e7eb; padding-top: 16px;">
            <table style="width: 100%; max-width: 300px; margin-left: auto;">
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">Subtotal</td>
                <td style="padding: 4px 0; text-align: right;">₱${formatPrice(data.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">Shipping</td>
                <td style="padding: 4px 0; text-align: right;">${data.shippingAmount === 0 ? '<span style="color: #059669;">FREE</span>' : `₱${formatPrice(data.shippingAmount)}`}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">Tax</td>
                <td style="padding: 4px 0; text-align: right;">₱${formatPrice(data.taxAmount)}</td>
              </tr>
              ${data.discountAmount && data.discountAmount > 0 ? `
              <tr>
                <td style="padding: 4px 0; color: #059669;">Discount</td>
                <td style="padding: 4px 0; text-align: right; color: #059669;">-₱${formatPrice(data.discountAmount)}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 12px 0 4px 0; font-weight: bold; font-size: 18px; border-top: 1px solid #e5e7eb;">Total</td>
                <td style="padding: 12px 0 4px 0; text-align: right; font-weight: bold; font-size: 18px; border-top: 1px solid #e5e7eb;">₱${formatPrice(data.totalAmount)}</td>
              </tr>
            </table>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" style="display: inline-block; background-color: #1f2937; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              View Order Status
            </a>
          </div>

          <!-- Footer -->
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
            <p style="margin: 0 0 8px 0;">Questions? Contact us at <a href="tel:09399124032" style="color: #2563eb;">0939 912 4032</a></p>
            <p style="margin: 0 0 8px 0;">Santiago Boulevard, General Santos City</p>
            <p style="margin: 0;">© ${new Date().getFullYear()} RD Hardware & Fishing Supply, Inc.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Send email to customer
    const { data: customerResult, error: customerError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order Confirmed - ${data.orderNumber} | RD Hardware`,
      html,
    });

    if (customerError) {
      console.error('Failed to send order confirmation email to customer:', customerError);
    } else {
      console.log('Order confirmation email sent to customer:', customerResult?.id);
    }

    // Build admin email HTML with additional customer info and backend URL
    const adminHtml = html.replace(
      'Order Confirmed! ✓',
      `New Order Received - ${data.orderNumber}`
    ).replace(
      `Hi <strong>${data.customerName}</strong>,<br><br>
            Thank you for your order! We've received your order and will process it shortly.`,
      `<strong>Customer Details:</strong><br>
            Name: ${data.customerName}<br>
            Email: ${data.customerEmail}<br>
            Phone: ${data.customerPhone}<br>
            ${data.companyName ? `Company: ${data.companyName}<br>` : ''}
            <br>
            A new order has been placed and requires processing.`
    ).replace(
      `${process.env.NEXT_PUBLIC_APP_URL}/orders`,
      `${ADMIN_BACKEND_URL}/admin/orders/${data.orderId}`
    ).replace(
      'View Order Status',
      'View Order in Admin'
    );

    // Prepare attachments if PO file exists
    const attachments: Array<{ filename: string; path: string }> = [];
    if (data.poFileUrl) {
      // Extract filename from URL
      const urlParts = data.poFileUrl.split('/');
      const filename = urlParts[urlParts.length - 1].split('?')[0] || 'purchase-order.pdf';
      attachments.push({
        filename: `PO-${data.poNumber || data.orderNumber}-${filename}`,
        path: data.poFileUrl,
      });
    }

    // Send email to admin recipients
    const { data: adminResult, error: adminError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAILS,
      subject: `[NEW ORDER] ${data.orderNumber} - ${data.customerName} | ₱${data.totalAmount.toLocaleString()}`,
      html: adminHtml,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (adminError) {
      console.error('Failed to send order notification to admins:', adminError);
    } else {
      console.log('Order notification sent to admins:', adminResult?.id);
    }

    return { success: true, id: customerResult?.id };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

interface PasswordResetEmailData {
  email: string;
  name: string;
  otp: string;
}

export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background-color: #1f2937; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">RD Hardware</h1>
          <p style="color: #9ca3af; margin: 4px 0 0 0; font-size: 12px;">& Fishing Supply, Inc.</p>
        </div>

        <!-- Content -->
        <div style="background-color: #ffffff; padding: 32px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1f2937; margin: 0 0 16px 0;">Password Reset Request</h2>
          
          <p style="margin: 0 0 24px 0;">
            Hi <strong>${data.name || 'there'}</strong>,<br><br>
            We received a request to reset your password. Use the code below to complete the process:
          </p>

          <!-- OTP Code -->
          <div style="background-color: #f3f4f6; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Your verification code:</p>
            <p style="margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${data.otp}</p>
          </div>

          <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">
            This code will expire in 10 minutes. If you didn't request a password reset, you can safely ignore this email.
          </p>

          <!-- Footer -->
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
            <p style="margin: 0 0 8px 0;">Questions? Contact us at <a href="tel:09399124032" style="color: #2563eb;">0939 912 4032</a></p>
            <p style="margin: 0;">© ${new Date().getFullYear()} RD Hardware & Fishing Supply, Inc.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Password Reset Code | RD Hardware',
      html,
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      return { success: false, error: error.message };
    }

    console.log('Password reset email sent:', result?.id);
    return { success: true, id: result?.id };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}
