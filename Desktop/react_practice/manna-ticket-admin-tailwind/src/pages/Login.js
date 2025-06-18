import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

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
  const [loading, setLoading] = useState(false);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, timer]);

  useEffect(() => {
    if (step === 2 && otp.length === 6 && !otp.split('').some(v => !v)) {
      const index = SAMPLE_IDS.indexOf(idNumber);
      if (index !== -1 && otp === SAMPLE_OTPS[index]) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          navigate('/dashboard');
        }, 1000);
      } else {
        setError('OTP가 올바르지 않습니다.');
      }
    }
    // eslint-disable-next-line
  }, [otp]);

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
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-[var(--radius-l)] shadow-lg p-4 sm:p-8 flex flex-col items-center border border-[var(--borderOutline)]">
          <div className="mb-4 text-[var(--contentCaption)]">
            <FontAwesomeIcon icon={faUtensils} className="w-12 h-12" />
          </div>
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="text-lg sm:text-xl font-bold text-[var(--contentMain)] mb-4">로그인 중...</div>
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[var(--primaryBlue)]"></div>
            </div>
          ) : (
            <>
              {step === 1 && (
                <>
                  <div className="text-lg sm:text-xl font-bold text-[var(--contentMain)] mb-1 mt-1 tracking-tight text-center">만나식권 관리자 로그인</div>
                  <div className="text-xs sm:text-sm text-[var(--contentCaption)] mb-4 sm:mb-6 text-center">접속 허가된 관리자만 접근 가능합니다</div>
                  <form onSubmit={handleIdNumberSubmit} className="w-full flex flex-col gap-2 sm:gap-3">
                    <label className="text-xs sm:text-sm font-semibold text-[var(--contentMain)] mb-1" htmlFor="idNumber">고유번호</label>
                    <input
                      id="idNumber"
                      name="idNumber"
                      type="text"
                      placeholder="예: 00371210-00149"
                      value={idNumber}
                      onChange={handleIdNumberChange}
                      className={`px-3 sm:px-4 py-2 sm:py-3 rounded border text-sm sm:text-base text-[var(--contentMain)] bg-[var(--white)] border-[var(--borderInput)] focus:outline-none focus:border-[var(--primaryBlue)] transition ${error ? 'border-[var(--contentError)]' : ''}`}
                      autoFocus
                      required
                    />
                    <div className="text-xs text-[var(--contentError)] min-h-[20px]">{error}</div>
                    <button type="submit" className="button-primary-m w-full mt-1 text-sm sm:text-base" disabled={!idNumber}>확인</button>
                  </form>
                  {/* 고유번호 샘플 안내 박스 */}
                  <div className="w-full mt-3 sm:mt-4 bg-[var(--blue50)] rounded-[var(--radius-s)] p-2 sm:p-3 text-[var(--primaryBlue)] text-xs sm:text-sm">
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
                  <div className="text-lg sm:text-xl font-bold text-[var(--contentMain)] mb-1 mt-1 tracking-tight text-center">OTP 인증</div>
                  <div className="text-xs sm:text-sm text-[var(--contentCaption)] mb-2 text-center">등록된 이메일로 전송된 6자리 인증 코드를 입력해 주세요.</div>
                  <div className="text-xs sm:text-sm text-[var(--primaryBlue)] mb-1">남은 시간: {timerStr}</div>
                  <div className="flex justify-center mb-2">
                    <img src={SAMPLE_QR} alt="QR코드" className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-[var(--bgTertiary)] border border-[var(--borderInput)]" />
                  </div>
                  <form className="w-full flex flex-col items-center gap-2" onSubmit={e => e.preventDefault()}>
                    <div className="flex gap-1 sm:gap-2 mb-1">
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
                          className={`w-8 h-10 sm:w-10 sm:h-12 text-xl sm:text-2xl text-center rounded border bg-[var(--white)] border-[var(--borderInput)] focus:outline-none focus:border-[var(--primaryBlue)] transition ${error ? 'border-[var(--contentError)]' : ''}`}
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-[var(--contentError)] min-h-[20px]">{error}</div>
                    <button type="button" onClick={handleResend} className="button-tertiary-m w-full text-sm sm:text-base">인증 코드 재전송</button>
                  </form>
                  {/* OTP 샘플 안내 박스 */}
                  <div className="w-full mt-3 sm:mt-4 bg-[var(--blue50)] rounded-[var(--radius-s)] p-2 sm:p-3 text-[var(--primaryBlue)] text-xs sm:text-sm">
                    <div className="font-bold mb-1">테스트용 OTP 코드:</div>
                    <ul className="pl-4 list-disc">
                      {SAMPLE_OTPS.map((otp, index) => (
                        <li key={index}>{otp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="text-center text-[var(--contentCaption)] text-[10px] sm:text-xs py-4 sm:py-6 tracking-tight">© 2025 만나식권 시스템. All rights reserved.</div>
    </div>
  );
} 