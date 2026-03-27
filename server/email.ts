import { Resend } from "resend";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is niet ingesteld als omgevingsvariabele.");
  return new Resend(key);
}

// Switch to "doel.io <noreply@doel.io>" once Resend domain is verified
const FROM = process.env.RESEND_FROM ?? "doel.io <onboarding@resend.dev>";

export async function sendVerificationCode(email: string, code: string): Promise<void> {
  const resend = getResend();
  const result = await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${code} is jouw doel.io inlogcode`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #0e7490; margin-bottom: 8px;">Jouw verificatiecode</h2>
        <p style="color: #374151; margin-bottom: 24px;">Gebruik de onderstaande code om in te loggen bij doel.io.</p>
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0e7490;">${code}</span>
        </div>
        <p style="color: #6b7280; font-size: 14px;">De code is 10 minuten geldig en kan maar &eacute;&eacute;n keer gebruikt worden.</p>
        <p style="color: #6b7280; font-size: 14px;">Als je niet hebt geprobeerd in te loggen, kun je deze e-mail negeren.</p>
      </div>
    `,
  });
  if (result.error) {
    throw new Error(`Resend fout: ${result.error.message}`);
  }
}
