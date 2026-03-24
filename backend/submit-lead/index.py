import json
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
import psycopg2

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def handler(event: dict, context) -> dict:
    """
    Принимает заявку с лендинга (имя, телефон, email) и отправляет уведомление на почту.
    """
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    if event.get("httpMethod") != "POST":
        return {
            "statusCode": 405,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Method not allowed"}),
        }

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    email = body.get("email", "").strip()

    if not name or not phone or not email:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Заполните все поля"}),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO leads (name, phone, email) VALUES (%s, %s, %s)",
        (name, phone, email),
    )
    conn.commit()
    cur.close()
    conn.close()

    smtp_host = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = os.environ.get("SMTP_FROM_EMAIL", "")
    smtp_pass = os.environ.get("SMTP_PASSWORD", "")
    notify_email = os.environ.get("NOTIFY_EMAIL", smtp_user)

    now = datetime.now().strftime("%d.%m.%Y %H:%M")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"🔔 Новая заявка от {name}"
    msg["From"] = smtp_user
    msg["To"] = notify_email

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1220; color: #fff; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #39FF5A 0%, #00C8FF 100%); padding: 24px 32px;">
        <h1 style="margin: 0; color: #080B12; font-size: 22px; font-weight: 700;">Новая заявка с сайта</h1>
        <p style="margin: 4px 0 0; color: #080B12; opacity: 0.7; font-size: 14px;">{now}</p>
      </div>
      <div style="padding: 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); font-size: 13px; width: 120px;">Имя</td>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 15px; font-weight: 600;">{name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); font-size: 13px;">Телефон</td>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 15px; font-weight: 600;">{phone}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: rgba(255,255,255,0.5); font-size: 13px;">Email</td>
            <td style="padding: 12px 0; font-size: 15px; font-weight: 600;">{email}</td>
          </tr>
        </table>
        <div style="margin-top: 28px; padding: 16px; background: rgba(57,255,90,0.08); border-radius: 10px; border-left: 3px solid #39FF5A;">
          <p style="margin: 0; color: #39FF5A; font-size: 13px;">Свяжитесь с клиентом как можно скорее!</p>
        </div>
      </div>
    </div>
    """

    msg.attach(MIMEText(html_body, "html", "utf-8"))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, notify_email, msg.as_string())

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"success": True, "message": "Заявка принята"}),
    }