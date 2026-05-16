import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { AuthContext } from '../context/AuthContext';

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
      await login(response.data.access_token);
      navigate('/settings');
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
    <div className="min-h-screen flex items-center justify-center bg-surface-elevated p-4">
      <div className="bg-surface p-8 rounded-xl shadow-lg w-full max-w-md">

        <div className="flex justify-center mb-4">
          <div className="bg-primary-subtle-strong rounded-full p-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0-9.75 6.75L2.25 6.75" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-text-strong mb-1">Verifica tu cuenta</h2>
        <p className="text-center text-text-muted text-sm mb-6">
          Hemos enviado un código de 6 dígitos a<br />
          <span className="font-medium text-text-secondary">{maskedEmail}</span>
        </p>

        {serverError && (
          <div className="bg-danger-subtle border border-danger-border text-danger-text px-4 py-3 rounded mb-4 text-sm">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="bg-success-subtle border border-success-border text-success-text px-4 py-3 rounded mb-4 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
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
                className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light transition-colors
                  ${digit ? 'border-primary bg-primary-subtle text-primary-on-subtle' : 'border-border-strong text-text'}
                  ${serverError ? 'border-danger-border' : ''}`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || digits.join('').length < 6}
            className={`w-full text-on-primary font-bold py-2.5 px-4 rounded-lg transition duration-200
              ${isSubmitting || digits.join('').length < 6
                ? 'bg-disabled-soft cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark'}`}
          >
            {isSubmitting ? 'Verificando...' : 'Verificar cuenta'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-sm text-text-muted">
            ¿No has recibido el código?{' '}
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className={`font-medium transition-colors
                ${resendCooldown > 0 || isResending
                  ? 'text-text-subtle cursor-not-allowed'
                  : 'text-primary hover:text-primary-darker hover:underline'}`}
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
