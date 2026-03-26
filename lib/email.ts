// lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

interface OrderPayload {
  _id: string;
  email: string;
  totalAmount: number;
  items: { name: string; quantity: number; price: number }[];
  shippingAddress: { address: string; city: string; state: string; zipCode: string; };
}

export const sendOrderConfirmationEmail = async (order: OrderPayload) => {
  const { email, _id, totalAmount, items, shippingAddress } = order;

  const itemsHtml = items.map(item => `
    <tr>
      <td>${item.name} (x${item.quantity})</td>
      <td style="text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
      <h1 style="color: #333;">Thank you for your order!</h1>
      <p>Your order #${_id.slice(-6)} has been confirmed.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Item</th>
            <th style="text-align: right; border-bottom: 1px solid #ddd; padding: 8px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td style="font-weight: bold; padding-top: 10px;">Total</td>
            <td style="font-weight: bold; text-align: right; padding-top: 10px;">$${totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <h2 style="color: #333;">Shipping Address</h2>
      <p>
        ${shippingAddress.address}<br>
        ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
      </p>
      
      <p style="margin-top: 30px; font-size: 0.9em; color: #777;">
        You will receive another email once your order has shipped.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Your Store Name" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Order Confirmation #${_id.slice(-6)}`,
      html: emailHtml,
    });
    console.log('Order confirmation email sent to:', email);
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    // Don't block the API response if email fails
  }
};
