import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { AuthContext } from '../context/AuthContext';
import { IconSimulator, IconWarning } from '../components/icons/Icons';
import { Logo } from '../components/common/Logo';

/**
 * VerifyEmail — Verificación de cuenta con código de 6 dígitos
 *
 * Lee el email pendiente de sessionStorage (tras el registro).
 * Valida el código con la API, inicia sesión vía AuthContext y permite reenviar con cooldown.
 */
export default function VerifyEmail() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const email = sessionStorage.getItem('pending_verification_email');

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    } else {
      inputRefs.current[0]?.focus();
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);
    setServerError('');

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = [...digits];
    pasted.split('').forEach((char, i) => {
      if (i < 6) newDigits[i] = char;
    });
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) {
      setServerError('Por favor, introduce el código completo de 6 dígitos.');
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      const response = await axios.post('/email/verify', { email, code });
      sessionStorage.removeItem('pending_verification_email');
      const hasSettings = await login(response.data.access_token);
      navigate(hasSettings ? '/dashboard' : '/settings');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Código incorrecto o expirado.');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setServerError('');
    setSuccessMessage('');

    try {
      await axios.post('/email/resend', { email });
      setSuccessMessage('Código reenviado. Revisa tu bandeja de entrada.');
      setResendCooldown(60);
    } catch (err) {
      setServerError(err.response?.data?.message || 'No se pudo reenviar el código.');
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => a + '*'.repeat(b.length) + c)
    : '';

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Panel izquierdo — zona de marca oscura */}
      <div
        className="flex-shrink-0 flex flex-col items-center justify-center
                   h-16 md:h-auto md:w-[45%] p-6 md:p-14 bg-dark-surface"
      >
        <div className="flex items-center gap-2 text-dark-text">
          <Logo variant="full" theme="dark" size="lg" />
        </div>

        <div className="hidden md:flex flex-col items-center mt-12 gap-10">
          <p className="text-lg font-medium text-center text-dark-text-muted">
            Descifra tu diabetes
          </p>

          <div
            className="w-32 h-32 flex items-center justify-center rounded-2xl bg-dark-surface-alt"
            style={{ boxShadow: '0 0 32px 4px rgba(37, 99, 235, 0.35)' }}
          >
            <IconSimulator className="w-20 h-20 text-primary" />
          </div>

          <p className="text-sm text-center max-w-xs leading-relaxed text-dark-text-muted">
            Simula cómo afectan la insulina y los carbohidratos a tu glucosa. Una herramienta educativa para ti y tu familia.
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-surface">
        <div className="w-full max-w-[420px]">

          <h2 className="text-2xl font-black tracking-tight mb-1 text-text-strong">
            Verifica tu cuenta
          </h2>
          <p className="text-sm mb-8 text-text-muted">
            Hemos enviado un código de 6 dígitos a{' '}
            <span className="font-semibold text-text-secondary">{maskedEmail}</span>
          </p>

          {serverError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm font-medium border bg-danger-subtle border-danger-border text-danger-text">
              <IconWarning className="w-4 h-4 shrink-0" />
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm font-medium border bg-success-subtle border-success-border text-success-text">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2 justify-between" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={el => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className={`w-full h-14 text-center text-xl font-bold border-2 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150
                    ${serverError
                      ? 'border-danger-border bg-danger-subtle text-danger-text'
                      : digit
                        ? 'border-primary bg-primary-subtle text-primary-on-subtle'
                        : 'border-border-strong text-text'}`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || digits.join('').length < 6}
              className="w-full min-h-12 font-bold text-base rounded-md transition-all duration-150 active:scale-95
                         text-on-primary bg-dark-surface hover:bg-dark-surface-alt
                         disabled:bg-disabled-strong disabled:cursor-not-allowed disabled:hover:bg-disabled-strong"
            >
              {isSubmitting ? 'Verificando...' : 'Verificar cuenta'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-text-muted">
            ¿No has recibido el código?{' '}
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className={`font-semibold transition-colors
                ${resendCooldown > 0 || isResending
                  ? 'text-text-subtle cursor-not-allowed'
                  : 'underline text-primary hover:text-primary-darker'}`}
            >
              {isResending
                ? 'Enviando...'
                : resendCooldown > 0
                  ? `Reenviar en ${resendCooldown}s`
                  : 'Reenviar código'}
            </button>
          </p>

        </div>
      </div>

    </div>
  );
}
