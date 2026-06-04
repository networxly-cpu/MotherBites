import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { orderId, customerName, customerEmail, items, totalAmount, orderStatus } = await req.json();

    if (!customerEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let itemsHtml = items.map((item: any) =>
      `<li style="margin-bottom: 8px; font-size: 15px;"><strong>${item.name}</strong> (Qty: ${item.quantity}) - <span style="color: #D4AF37; font-weight: bold;">₹${item.price * item.quantity}</span></li>`
    ).join('');

    // डायनॅमिक ईमेल डिझाईन (स्टेटसनुसार बदलणार)
    let subject = '';
    let headerText = '';
    let messageContent = '';
    let headerColor = '';
    let actionButton = `<a href="http://localhost:3000/orders" style="background-color: #C85A3A; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Track Your Order</a>`;

    switch (orderStatus) {
      case 'Confirmed':
        subject = `🎉 Congratulations! Your MotherBites Order is Confirmed (ID: ${orderId})`;
        headerText = 'Order Confirmed! 🎉';
        headerColor = '#4CAF50'; // Green
        messageContent = `
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Great news, <strong>${customerName}</strong>!</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">We have successfully received your order. Our team is now preparing your authentic village specialties with utmost love and care. We will notify you once it is shipped!</p>
        `;
        break;

      case 'Shipped':
        subject = `🚚 Good News! Your Order has been Shipped (ID: ${orderId})`;
        headerText = 'Order Shipped! 🚚';
        headerColor = '#2196F3'; // Blue
        messageContent = `
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Hello <strong>${customerName}</strong>,</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">Get ready for an authentic feast! Your order has been packed securely and dispatched. It is currently on its way to your doorstep.</p>
        `;
        break;

      case 'Delivered':
        subject = `✅ Delivered! Enjoy your MotherBites (ID: ${orderId})`;
        headerText = 'Order Delivered! 🎊';
        headerColor = '#4CAF50'; // Green
        messageContent = `
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Hello <strong>${customerName}</strong>,</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">Your order has been successfully delivered! We hope you enjoy the authentic taste of our village food.</p>
          <p style="font-size: 16px; color: #C85A3A; font-weight: bold; margin-top: 20px;">Did you like our taste & service?</p>
        `;
        // डिलीव्हर झाल्यावर 'Track Order' ऐवजी 'Rate Us' चे बटण दाखवा
        actionButton = `<a href="https://motherbites.shop/orders" style="background-color: #D4AF37; color: #2C1810; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">⭐ Rate Us 5 Stars</a>`;
        break;

      case 'Returned':
        subject = `🔄 Update: Your Order Return is Processed (ID: ${orderId})`;
        headerText = 'Return Processed 🔄';
        headerColor = '#FF9800'; // Orange
        messageContent = `
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear <strong>${customerName}</strong>,</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">We have accepted the return for your recent order. We are extremely sorry that the product didn't meet your expectations.</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">Please let us know what went wrong so we can improve our service for you in the future.</p>
        `;
        actionButton = `<a href="mailto:support@motherbites.com" style="background-color: #2C1810; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Contact Support</a>`;
        break;

      case 'Canceled':
        subject = `❌ Order Canceled (ID: ${orderId})`;
        headerText = 'Order Canceled ❌';
        headerColor = '#F44336'; // Red
        messageContent = `
          <p style="font-size: 16px; color: #333; line-height: 1.6;">Dear <strong>${customerName}</strong>,</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">Your order has been canceled. We are sad to see this go.</p>
          <p style="font-size: 16px; color: #555; line-height: 1.6;">If this was a mistake, or if you faced any issues while placing the order, please reply to this email. We would love to have you back!</p>
        `;
        actionButton = `<a href="http://localhost:3000/" style="background-color: #C85A3A; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Shop Again</a>`;
        break;

      default:
        subject = `📦 MotherBites - Order Update (ID: ${orderId})`;
        headerText = 'Order Update 📦';
        headerColor = '#D4AF37';
        messageContent = `<p style="font-size: 16px; color: #555;">Your order status has been updated to: <strong>${orderStatus}</strong></p>`;
    }

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fcf9f5; padding: 20px; border-radius: 12px; border: 1px solid #eaddcf;">
        
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #D4AF37; padding-bottom: 15px;">
          <h1 style="color: #2C1810; margin: 0; font-size: 32px; font-weight: 900;">MotherBites</h1>
          <p style="color: #C85A3A; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Authentic Village Specialties</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 35px 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <h2 style="color: ${headerColor}; text-align: center; margin-top: 0; font-size: 24px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
            ${headerText}
          </h2>
          
          ${messageContent}

          <div style="background-color: #fff8f0; border: 1px solid #eaddcf; border-left: 5px solid #D4AF37; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; color: #2C1810; font-size: 15px;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 0 0 10px 0; color: #2C1810; font-size: 15px;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
            
            <h4 style="margin: 20px 0 10px 0; color: #2C1810; font-size: 16px; border-bottom: 1px solid #eaddcf; padding-bottom: 5px;">Items in your order:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #555;">
              ${itemsHtml}
            </ul>
          </div>

          <div style="text-align: center; margin-top: 35px; margin-bottom: 15px;">
            ${actionButton}
          </div>
          
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
          <p>© 2026 MotherBites. Bringing village authenticity to your home.</p>
        </div>
        
      </div>
    `;

    const mailOptions = {
      from: `"MotherBites Team" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}