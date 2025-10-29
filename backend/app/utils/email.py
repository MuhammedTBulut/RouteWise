import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger(__name__)


async def send_email(to_email: str, subject: str, body: str, html_body: Optional[str] = None):
    """Send an email using SMTP"""
    try:
        message = MIMEMultipart("alternative")
        message["From"] = settings.SMTP_FROM
        message["To"] = to_email
        message["Subject"] = subject

        # Add plain text part
        message.attach(MIMEText(body, "plain"))

        # Add HTML part if provided
        if html_body:
            message.attach(MIMEText(html_body, "html"))

        # Send email
        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USERNAME,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
        )
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False


async def send_verification_email(email: str, code: str):
    """Send verification code email"""
    subject = "RouteWise - Email Verification"
    body = f"""
Hello,

Your verification code is: {code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
RouteWise Team
    """
    
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #007AFF;">RouteWise - Email Verification</h2>
                <p>Hello,</p>
                <p>Your verification code is:</p>
                <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                    {code}
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #666; font-size: 12px;">Best regards,<br>RouteWise Team</p>
            </div>
        </body>
    </html>
    """
    
    return await send_email(email, subject, body, html_body)
