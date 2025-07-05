import React, { useMemo, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarDays, faQrcode, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import Switch from "react-switch";
import QRNotSubmittedTable from '../components/QRNotSubmittedTable';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as XLSX from 'xlsx';
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

// CSS 변수값을 실제 색상값으로 변환하는 헬퍼
function getVarColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const notSubmitted = [
  { id: 1, department: '개발팀', name: '김철수', user: 'kimcs', meal: '저녁', time: '18:00', count: 3 },
  { id: 2, department: '디자인팀', name: '이영희', user: 'leeyh', meal: '점심', time: '12:00', count: 1 },
  { id: 3, department: '기획팀', name: '박민수', user: 'parkms', meal: '저녁', time: '18:00', count: 2 },
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('week');
  const [refreshKey, setRefreshKey] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [intervalSec, setIntervalSec] = useState(30);
  const [statsPeriod, setStatsPeriod] = useState('today');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [qrModalOpen, setQrModalOpen] = useState(false);

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

  // QR 미제출자 데이터 내보내기
  const handleExportQRData = (format = 'csv') => {
    const headers = ['부서', '이름', '예약시간', '미제출 횟수'];
    const data = notSubmitted.map(row => [
      row.department,
      row.name,
      `${row.meal} ${row.time}`,
      `${row.count}회`
    ]);

    if (format === 'xlsx') {
      // XLSX 형식으로 내보내기
      const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'QR_미제출자');
      
      // 컬럼 너비 자동 조정
      const colWidths = headers.map(header => ({ wch: Math.max(header.length, 10) }));
      ws['!cols'] = colWidths;
      
      XLSX.writeFile(wb, `QR_미제출자_${new Date().toISOString().split('T')[0]}.xlsx`);
    } else {
      // CSV 형식으로 내보내기
      const csvContent = [
        headers.join(','),
        ...data.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `QR_미제출자_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
            backgroundColor: '#FFEA8B',
            borderRadius: 8,
            barThickness: 40,
          },
          {
            label: 'QR',
            data: [0, 0],
            backgroundColor: '#3182F6',
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
          backgroundColor: '#FFEA8B',
          borderRadius: 8,
          barThickness: 40,
        },
        {
          label: 'QR',
          data: [currentData.qrLunch, currentData.qrDinner],
          backgroundColor: '#3182F6',
          borderRadius: 8,
          barThickness: 40,
        }
      ],
    };
  }, [statsPeriod, dashboardData]);

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
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: chartColors.main,
        font: { weight: 'bold', size: 14 },
        formatter: (value) => `${value}명`
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
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bgSecondary)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-10 pt-14 sm:pt-10 pb-2 sm:pb-4 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--contentMain)] mb-2">대시보드</h1>
        {/* 필요시 버튼 영역 추가 */}
        <div className="flex items-center gap-3">
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
      </div>
      {/* Dashboard Title & Actions */}
      <div className="bg-[var(--bgSecondary)] px-2 sm:px-10 py-7 flex flex-col gap-5">
          {/* 자동 갱신 설정 카드 */}
          <div className="w-full bg-white rounded-[var(--radius-m)] shadow-sm p-4 sm:p-6 border border-[var(--borderOutline)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-[var(--contentMain)]">자동 갱신</span>
                <Switch
                  checked={autoRefresh}
                  onChange={setAutoRefresh}
                  onColor="#3182f6"
                  offColor="#e6e8ea"
                  checkedIcon={false}
                  uncheckedIcon={false}
                  height={20}
                  width={36}
                />
                <span className="text-sm text-[var(--contentCaption)]">주기</span>
                <select
                  value={intervalSec}
                  onChange={e => setIntervalSec(Number(e.target.value))}
                  className="px-2 py-1 rounded border text-sm text-[var(--contentMain)] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  style={{ width: 100 }}
                >
                  {intervalOptions.map(sec => (
                    <option key={sec} value={sec}>{sec}초</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleManualRefresh}
                className="px-4 py-2 rounded-lg bg-white border border-[var(--borderOutline)] text-[var(--contentMain)] text-sm font-medium hover:bg-[var(--bgSecondary)] transition-colors duration-200 flex items-center gap-2"
              >
                <span>즉시 새로고침</span>
              </button>
            </div>
          </div>

        {/* Summary Cards */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
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
            <div className="text-xs text-[var(--contentCaption)]">점심 / 저녁 </div>
          </div>
          <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col gap-2 border border-[var(--borderOutline)] min-h-[100px]">
            <div className="flex items-center gap-2 text-[var(--contentCaption)] text-xs">
              <FontAwesomeIcon icon={faQrcode} className="w-4 h-4" /> QR 제출자(점심/저녁)
            </div>
            <div className="text-2xl font-bold text-[var(--contentMain)]">{stat.qrLunch} / {stat.qrDinner}</div>
            <div className="text-xs text-[var(--contentCaption)]">점심 / 저녁 QR </div>
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
      <div className="flex-1 bg-[var(--bgSecondary)] px-2 sm:px-10 pb-10">
                  <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-2 sm:p-6 border border-[var(--borderOutline)] min-h-[320px] flex flex-col">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="font-semibold text-[var(--contentMain)]">예약자/QR 인증 현황</div>
          </div>
          <div className="flex-1 flex items-center justify-center text-[var(--contentCaption)] min-h-[220px] sm:min-h-[320px] w-full overflow-x-auto">
            <div className="w-full h-full" style={{minWidth: 280}}>
              {barData && <Bar data={barData} options={barOptions} height={220} />}
            </div>
          </div>
        </div>
      </div>

      {/* QR 미제출자 전체 너비 카드 */}
      <div className="w-full px-2 sm:px-10 pb-10">
                  <div className="bg-gradient-to-r from-[#fff7ec] to-white rounded-[var(--radius-m)] shadow-sm p-4 sm:p-6 border-l-4 border-[var(--orange400)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-[var(--orange100)] rounded-full p-2">
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-6 h-6 text-[var(--orange500)]" />
              {/* import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'; */}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--contentMain)] text-base sm:text-lg">QR 미제출자</span>
                <span className="text-xl sm:text-2xl font-bold text-[var(--contentError)]">8명</span>
              </div>
              <div className="text-xs sm:text-sm text-[var(--contentCaption)]">오늘 식사 예약 중 QR 미제출 / 식사 예약을 하지 않고 QR코드 제출한 사용자</div>
            </div>
          </div>
          <button
            className="mt-3 sm:mt-0 px-4 py-2 rounded-lg bg-white border border-[var(--orange400)] text-[var(--orange500)] text-sm font-medium hover:bg-[var(--orange50)] transition-colors duration-200 flex items-center gap-2 shadow-sm"
            onClick={() => setQrModalOpen(true)}
          >
            <span>미제출자 확인</span>
            <FontAwesomeIcon icon={faQrcode} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QR 미제출자 모달 */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-lg mx-2 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setQrModalOpen(false)}>&times;</button>
            <div className="font-bold text-[var(--contentMain)] mb-2 text-lg">QR 미제출자 명단</div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-[var(--contentCaption)]">식사 예약 후 QR 코드를 제출하지 않은 사용자 목록</div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportQRData('xlsx')}
                  className="px-3 py-1.5 rounded-lg bg-[var(--primaryBlue)] text-white text-xs font-medium hover:bg-blue-600 transition-colors duration-200"
                >
                  XLSX
                </button>
                <button
                  onClick={() => handleExportQRData('csv')}
                  className="px-3 py-1.5 rounded-lg bg-[var(--green500)] text-white text-xs font-medium hover:bg-green-600 transition-colors duration-200"
                >
                  CSV
                </button>
              </div>
            </div>
            <QRNotSubmittedTable notSubmitted={notSubmitted} />
            <div className="flex justify-end mt-4 pt-3 border-t border-[var(--borderOutline)]">
              <button
                onClick={() => setQrModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white border border-[var(--borderOutline)] text-[var(--contentMain)] text-sm font-medium hover:bg-[var(--bgSecondary)] transition-colors duration-200"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 