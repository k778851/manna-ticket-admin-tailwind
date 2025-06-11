import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SAMPLE_IDS = ['00371210-00149', '00371210-00150', '00371210-00151'];
const SAMPLE_OTPS = ['123456', '654321', '111111'];
const SAMPLE_QR = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=sample';

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 고유번호, 2: OTP
  const [idNumber, setIdNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(180);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, timer]);

  const handleIdNumberSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (SAMPLE_IDS.includes(idNumber)) {
      setStep(2);
      setTimer(180);
    } else {
      setError('고유번호가 올바르지 않습니다.');
    }
  };

  const handleOtpChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    let next = otp.split('');
    next[idx] = val;
    next = next.join('').padEnd(6, '');
    setOtp(next);
    if (val && idx < 5) {
      otpRefs[idx + 1].current?.focus();
    }
    if (!val && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (otp === SAMPLE_OTPS[step - 2]) {
      navigate('/dashboard');
    } else {
      setError('OTP가 올바르지 않습니다.');
    }
  };

  const handleResend = () => {
    setTimer(180);
    setOtp('');
    setError('');
    otpRefs[0].current?.focus();
  };

  const handleIdNumberChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 8) {
      value = value.slice(0, 8) + '-' + value.slice(8, 13);
    }
    setIdNumber(value);
  };

  const timerStr = `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bgSecondary)]">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-[var(--radius-l)] shadow-lg p-8 flex flex-col items-center border border-[var(--borderOutline)]">
          <div className="text-4xl text-[var(--contentCaption)] mb-2 select-none">⎈</div>
          {step === 1 && (
            <>
              <div className="text-xl font-bold text-[var(--contentMain)] mb-1 mt-1 tracking-tight">만나식권 관리자 로그인</div>
              <div className="text-sm text-[var(--contentCaption)] mb-6 text-center">접속 허가된 관리자만 접근 가능합니다</div>
              <form onSubmit={handleIdNumberSubmit} className="w-full flex flex-col gap-3">
                <label className="text-sm font-semibold text-[var(--contentMain)] mb-1" htmlFor="idNumber">고유번호</label>
                <input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  placeholder="예: 00371210-00149"
                  value={idNumber}
                  onChange={handleIdNumberChange}
                  className={`px-4 py-3 rounded border text-[var(--contentMain)] bg-[var(--white)] border-[var(--borderInput)] focus:outline-none focus:border-[var(--primaryBlue)] text-base transition ${error ? 'border-[var(--contentError)]' : ''}`}
                  autoFocus
                  required
                />
                <div className="text-xs text-[var(--contentError)] min-h-[20px]">{error}</div>
                <button type="submit" className="button-primary-m w-full mt-1" disabled={!idNumber}>확인</button>
              </form>
              {/* 고유번호 샘플 안내 박스 */}
              <div className="w-full mt-4 bg-[var(--blue50)] rounded-[var(--radius-s)] p-3 text-[var(--primaryBlue)] text-sm">
                <div className="font-bold mb-1">테스트용 고유번호:</div>
                <ul className="pl-4 list-disc">
                  {SAMPLE_IDS.map((id, index) => (
                    <li key={index}>{id}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
          {step === 2 && (
            <div className="w-full flex flex-col items-center gap-2">
              <div className="text-xl font-bold text-[var(--contentMain)] mb-1 mt-1 tracking-tight">OTP 인증</div>
              <div className="text-sm text-[var(--contentCaption)] mb-2 text-center">등록된 이메일로 전송된 6자리 인증 코드를 입력해 주세요.</div>
              <div className="text-sm text-[var(--primaryBlue)] mb-1">남은 시간: {timerStr}</div>
              <div className="flex justify-center mb-2">
                <img src={SAMPLE_QR} alt="QR코드" className="w-28 h-28 rounded-lg bg-[var(--bgTertiary)] border border-[var(--borderInput)]" />
              </div>
              <form onSubmit={handleOtpSubmit} className="w-full flex flex-col items-center gap-2">
                <div className="flex gap-2 mb-1">
                  {[0,1,2,3,4,5].map(i => (
                    <input
                      key={i}
                      ref={otpRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i] || ''}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={`w-10 h-12 text-2xl text-center rounded border bg-[var(--white)] border-[var(--borderInput)] focus:outline-none focus:border-[var(--primaryBlue)] transition ${error ? 'border-[var(--contentError)]' : ''}`}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <div className="text-xs text-[var(--contentError)] min-h-[20px]">{error}</div>
                <button type="submit" className="button-primary-m w-full mt-1" disabled={otp.length !== 6 || otp.split('').some(v => !v)}>로그인</button>
                <button type="button" onClick={handleResend} className="button-tertiary-m w-full">인증 코드 재전송</button>
                <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }} className="button-quarternary-m w-full">고유번호 다시 입력</button>
              </form>
              {/* OTP 샘플 안내 박스 */}
              <div className="w-full mt-4 bg-[var(--blue50)] rounded-[var(--radius-s)] p-3 text-[var(--primaryBlue)] text-sm">
                <div className="font-bold mb-1">테스트용 OTP 코드:</div>
                <ul className="pl-4 list-disc">
                  {SAMPLE_OTPS.map((otp, index) => (
                    <li key={index}>{otp}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="text-center text-[var(--contentCaption)] text-xs py-6 tracking-tight">© 2025 만나식권 시스템. All rights reserved.</div>
    </div>
  );
} 