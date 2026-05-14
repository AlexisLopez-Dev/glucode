<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu cuenta en Glucode</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f3f4f6; margin: 0; padding: 0; }
        .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 32px 40px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { color: #bfdbfe; margin: 4px 0 0; font-size: 14px; }
        .body { padding: 36px 40px; }
        .body p { color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
        .code-box { background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 10px; padding: 24px; text-align: center; margin: 24px 0; }
        .code { font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #1d4ed8; font-family: 'Courier New', monospace; }
        .expiry { color: #6b7280; font-size: 13px; margin-top: 8px; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 12px 16px; margin-top: 24px; }
        .warning p { color: #92400e; font-size: 13px; margin: 0; }
        .footer { background: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>Glucode</h1>
            <p>Simulador de glucemia inteligente</p>
        </div>
        <div class="body">
            <p>Hola, <strong>{{ $userName }}</strong>.</p>
            <p>Gracias por registrarte en Glucode. Para activar tu cuenta, introduce el siguiente código de verificación:</p>

            <div class="code-box">
                <div class="code">{{ $code }}</div>
                <p class="expiry">Este código expira en <strong>15 minutos</strong>.</p>
            </div>

            <p>Si no has creado una cuenta en Glucode, puedes ignorar este correo con total seguridad.</p>

            <div class="warning">
                <p>Por tu seguridad, nunca compartas este código con nadie. Glucode jamás te lo solicitará.</p>
            </div>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} Glucode. Este es un correo automático, no respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>
