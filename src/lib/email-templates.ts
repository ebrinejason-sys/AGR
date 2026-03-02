export const BaseEmailTemplate = (title: string, contentHtml: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
          color: #121212;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          margin-top: 40px;
          margin-bottom: 40px;
        }
        .header {
          background: linear-gradient(135deg, #d81b60, #4a148c);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .logo-container {
          margin-bottom: 20px;
        }
        .logo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 3px solid white;
          background-color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .content {
          padding: 30px 40px;
          line-height: 1.6;
          font-size: 16px;
        }
        .content p {
          margin-top: 0;
          margin-bottom: 20px;
        }
        .footer {
          background-color: #0c0c0c;
          padding: 20px;
          text-align: center;
          color: #a0a0a0;
          font-size: 13px;
        }
        .footer a {
          color: #03a9f4;
          text-decoration: none;
        }
        .accent-blue { color: #03a9f4; }
        .accent-pink { color: #d81b60; }
        
        .btn {
          display: inline-block;
          background-color: #d81b60;
          color: #ffffff !important;
          padding: 12px 25px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- HEADER -->
        <div class="header">
          <div class="logo-container">
            <!-- Using the production URL for the logo -->
            <img class="logo" src="https://africangirlriseltd.org/logo.png" alt="African Girl Rise" />
          </div>
          <h1>${title}</h1>
        </div>

        <!-- CONTENT -->
        <div class="content">
          ${contentHtml}
        </div>

        <!-- FOOTER -->
        <div class="footer">
          <p>African Girl Rise Initiative</p>
          <p>Breaking cycles. One girl at a time. One generation at a time.</p>
          <p>Ibanda District, Western Uganda</p>
          <p style="margin-top:15px">
            <a href="https://africangirlriseltd.org">Visit our website</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const escapeHtml = (str: string): string =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Example specific templates
export const ContactSubmissionTemplate = (name: string, email: string, message: string) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  return BaseEmailTemplate(
    "New Contact Form Submission",
    `
      <p>Hello Admin,</p>
      <p>You have received a new message from the website contact form.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #03a9f4;">
        <p style="margin-bottom: 8px;"><strong>Name:</strong> ${safeName}</p>
        <p style="margin-bottom: 8px;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin-bottom: 0;"><strong>Message:</strong><br/> ${safeMessage.replace(/\n/g, '<br/>')}</p>
      </div>
      
      <p>Please respond to this inquiry when possible.</p>
      <a href="mailto:${safeEmail}" class="btn">Reply to ${safeName}</a>
    `
  );
};

export const SubscriberWelcomeTemplate = (name: string) => {
  return BaseEmailTemplate(
    "Welcome to African Girl Rise",
    `
      <p>Hello <strong class="accent-pink">${name || 'Friend'}</strong>,</p>
      <p>Thank you for subscribing to our updates and joining our movement.</p>
      <p>Your children do not have to suffer the way you suffered. When you keep your daughter in school, you are not just educating a child. You are changing your family's future for generations.</p>
      <p>We will keep you informed about our <strong>Rise Rooms</strong>, stories of generational transformation, and ways you can help us break cycles of poverty.</p>
      <p>Rise. Then reach back.</p>
      <br/>
      <p>Warm regards,<br/><strong>Grace Akatwijuka</strong><br/>Founder, African Girl Rise Initiative</p>
    `
  );
};
