import React, { useMemo, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarDays, faQrcode, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import Switch from "react-switch";
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// CSS 변수값을 실제 색상값으로 변환하는 헬퍼
function getVarColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('week');
  const [refreshKey, setRefreshKey] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [intervalSec, setIntervalSec] = useState(30);
  const [statsPeriod, setStatsPeriod] = useState('today');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const intervalOptions = [5, 10, 30, 60, 300];

  // 대시보드 데이터 fetch 함수
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // TODO: 실제 API 엔드포인트로 변경해주세요
      const response = await fetch(`/api/dashboard/stats?period=${statsPeriod}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // 에러 발생시 임시 데이터 사용
      setDashboardData({
        today: {
          total: 200,
          lunch: 120,
          dinner: 80,
          qrLunch: 110,
          qrDinner: 70,
          freeRiderLunch: 5,
          freeRiderDinner: 2,
        },
        week: {
          total: 1200,
          lunch: 700,
          dinner: 500,
          qrLunch: 650,
          qrDinner: 430,
          freeRiderLunch: 18,
          freeRiderDinner: 7,
        },
        month: {
          total: 4800,
          lunch: 2800,
          dinner: 2000,
          qrLunch: 2600,
          qrDinner: 1800,
          freeRiderLunch: 60,
          freeRiderDinner: 22,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 최초 마운트 시 localStorage에서 설정 불러오기
  useEffect(() => {
    const savedInterval = localStorage.getItem('dashboard_auto_interval');
    const savedAuto = localStorage.getItem('dashboard_auto_refresh');
    if (savedInterval) setIntervalSec(Number(savedInterval));
    if (savedAuto) setAutoRefresh(savedAuto === 'true');
  }, []);

  // refreshKey나 statsPeriod가 변경될 때마다 데이터 새로 불러오기
  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey, statsPeriod]);

  // 주기 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('dashboard_auto_interval', intervalSec);
  }, [intervalSec]);

  // 자동갱신 on/off 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('dashboard_auto_refresh', autoRefresh);
  }, [autoRefresh]);

  // 30초마다 자동 갱신 (설정 반영)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, intervalSec * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, intervalSec]);

  // 즉시 새로고침
  const handleManualRefresh = () => setRefreshKey((prev) => prev + 1);

  // 차트 색상 변수값을 useMemo로 캐싱
  const chartColors = useMemo(() => ({
    blue: getVarColor('--primaryBlue') || '#3182f6',
    red: getVarColor('--red400') || '#f66570',
    caption: getVarColor('--contentCaption') || '#8b95a1',
    main: getVarColor('--contentMain') || '#333d4b',
    tertiary: getVarColor('--bgTertiary') || '#e6e8ea',
  }), []);

  // Bar Chart 데이터
  const barData = useMemo(() => {
    if (!dashboardData) {
      return {
        labels: ['점심', '저녁'],
        datasets: [
          {
            label: '예약자 수',
            data: [0, 0],
            backgroundColor: chartColors.blue,
            borderRadius: 8,
            barThickness: 40,
          },
          {
            label: 'QR',
            data: [0, 0],
            backgroundColor: chartColors.red,
            borderRadius: 8,
            barThickness: 40,
          }
        ],
      };
    }

    const currentData = dashboardData[statsPeriod];

    return {
      labels: ['점심', '저녁'],
      datasets: [
        {
          label: '예약자 수',
          data: [currentData.lunch, currentData.dinner],
          backgroundColor: chartColors.blue,
          borderRadius: 8,
          barThickness: 40,
        },
        {
          label: 'QR',
          data: [currentData.qrLunch, currentData.qrDinner],
          backgroundColor: chartColors.red,
          borderRadius: 8,
          barThickness: 40,
        }
      ],
    };
  }, [statsPeriod, dashboardData, chartColors]);

  // 차트 옵션
  const barOptions = useMemo(() => ({
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: chartColors.main,
          font: { size: 13 },
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${context.dataset.label}: ${value}명`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: chartColors.caption }
      },
      y: {
        grid: { color: chartColors.tertiary },
        ticks: {
          color: chartColors.caption,
          callback: (value) => `${value}명`
        },
        beginAtZero: true
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  }), [chartColors]);
 
  const stat = dashboardData?.[statsPeriod] || {
    total: 0,
    lunch: 0,
    dinner: 0,
    qrLunch: 0,
    qrDinner: 0,
    freeRiderLunch: 0,
    freeRiderDinner: 0,
  };

  if (isLoading) {
    return (
      <div className="dashboard-page flex items-center justify-center h-screen">
        <div className="text-lg text-[var(--contentCaption)]">데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Dashboard Title & Actions */}
      <div className="bg-[var(--bgSecondary)] px-10 py-7 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--contentMain)] tracking-tight">대시보드</h1>
            <span className="bg-[var(--bgTertiary)] text-[var(--contentCaption)] text-xs rounded px-2 py-1 ml-2">ver 1.2.0</span>
          </div>
          <select
            value={statsPeriod}
            onChange={e => setStatsPeriod(e.target.value)}
            className="px-3 py-1.5 rounded border text-sm text-[var(--contentMain)] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            style={{ width: 120 }}
          >
            <option value="today">오늘</option>
            <option value="week">주간</option>
            <option value="month">월간</option>
          </select>
        </div>
        
        {/* 자동 갱신 설정 카드 */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="font-semibold text-[var(--contentMain)] mb-2 sm:mb-0">자동 갱신 설정</div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-1 text-sm">
                <span>자동 갱신</span>
                <Switch
                  onChange={setAutoRefresh}
                  checked={autoRefresh}
                  height={20}
                  width={40}
                  onColor="#3182f6"
                  uncheckedIcon={false}
                  checkedIcon={false}
                />
              </label>
              <label className="flex items-center gap-1 text-sm">
                <span>주기</span>
                <select
                  value={intervalSec}
                  onChange={e => setIntervalSec(Number(e.target.value))}
                  className="px-2 py-1 border rounded text-sm"
                >
                  {intervalOptions.map(opt => (
                    <option key={opt} value={opt}>{opt === 60 ? '1분' : opt === 300 ? '5분' : `${opt}초`}</option>
                  ))}
                </select>
              </label>
              <button
                onClick={handleManualRefresh}
                className="px-3 py-1 rounded bg-[var(--primaryBlue)] text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                즉시 새로고침
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col gap-2 border border-[var(--borderOutline)] min-h-[100px]">
            <div className="flex items-center gap-2 text-[var(--contentCaption)] text-xs">
              <FontAwesomeIcon icon={faUsers} className="w-4 h-4" /> 총 예약자
            </div>
            <div className="text-2xl font-bold text-[var(--contentMain)]">{stat.total}</div>
            <div className="text-xs text-[var(--contentCaption)]">{statsPeriod === 'today' ? '오늘 전체 예약자' : statsPeriod === 'week' ? '이번 주 전체 예약자' : '이번 달 전체 예약자'}</div>
          </div>
          <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col gap-2 border border-[var(--borderOutline)] min-h-[100px]">
            <div className="flex items-center gap-2 text-[var(--contentCaption)] text-xs">
              <FontAwesomeIcon icon={faCalendarDays} className="w-4 h-4" /> 점심/저녁 예약자
            </div>
            <div className="text-2xl font-bold text-[var(--contentMain)]">{stat.lunch} / {stat.dinner}</div>
            <div className="text-xs text-[var(--contentCaption)]">점심 / 저녁 예약자</div>
          </div>
          <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col gap-2 border border-[var(--borderOutline)] min-h-[100px]">
            <div className="flex items-center gap-2 text-[var(--contentCaption)] text-xs">
              <FontAwesomeIcon icon={faQrcode} className="w-4 h-4" /> QR 제출자(점심/저녁)
            </div>
            <div className="text-2xl font-bold text-[var(--contentMain)]">{stat.qrLunch} / {stat.qrDinner}</div>
            <div className="text-xs text-[var(--contentCaption)]">점심 / 저녁 QR 제출자</div>
          </div>
          <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col gap-2 border border-[var(--borderOutline)] min-h-[100px]">
            <div className="flex items-center gap-2 text-[var(--contentCaption)] text-xs">
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-4 h-4" /> 무임승차(점심/저녁)
            </div>
            <div className="text-2xl font-bold text-[var(--contentError)]">{stat.freeRiderLunch} / {stat.freeRiderDinner}</div>
            <div className="text-xs text-[var(--contentCaption)]">점심 / 저녁 무임승차</div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="flex-1 bg-[var(--bgSecondary)] px-10 pb-10">
        <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 border border-[var(--borderOutline)] min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-[var(--contentMain)]">예약자/QR 인증 현황</div>
          </div>
          <div className="flex-1 flex items-center justify-center text-[var(--contentCaption)] min-h-[320px]">
            {barData && <Bar data={barData} options={barOptions} height={320} />}
          </div>
        </div>
      </div>

      {/* QR 미제출자 전체 너비 카드 */}
      <div className="w-full px-10 pb-10">
        <div className="bg-gradient-to-r from-[#fff7ec] to-white rounded-[var(--radius-m)] shadow-sm p-6 border-l-4 border-[var(--orange400)] flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-[var(--orange100)] rounded-full p-2">
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-6 h-6 text-[var(--orange500)]" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--contentMain)]">QR 미제출자</span>
                <span className="text-2xl font-bold text-[var(--contentError)]">8명</span>
              </div>
              <div className="text-sm text-[var(--contentCaption)]">오늘 실사 예약 중 QR 미제출</div>
            </div>
          </div>
          <button
            className="px-4 py-2 rounded-lg bg-white border border-[var(--orange400)] text-[var(--orange500)] text-sm font-medium hover:bg-[var(--orange50)] transition-colors duration-200 flex items-center gap-2 shadow-sm"
            onClick={() => navigate('/qr')}
          >
            <span>미제출자 확인</span>
            <FontAwesomeIcon icon={faQrcode} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 