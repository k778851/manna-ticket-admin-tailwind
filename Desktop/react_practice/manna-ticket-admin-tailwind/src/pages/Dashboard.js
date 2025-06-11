import React, { useMemo, useState } from 'react';
import { MdDashboard, MdPeople, MdEvent, MdQrCode, MdRestaurantMenu, MdAnnouncement, MdFavorite, MdSettings, MdHelp, MdDownload, MdMonitor, MdPerson, MdLogout, MdWarning } from 'react-icons/md';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

// CSS 변수값을 실제 색상값으로 변환하는 헬퍼
function getVarColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const barData = {
  labels: ['개발팀', '마케팅팀', '영업팀', '인사팀', '기획팀'],
  datasets: [
    {
      label: '예약 수',
      data: [12, 8, 6, 5, 3],
      backgroundColor: 'var(--primaryBlue)',
      borderRadius: 8,
      barThickness: 28,
    },
  ],
};
const barOptions = {
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: 'var(--contentCaption)' } },
    y: { grid: { color: 'var(--bgTertiary)' }, ticks: { color: 'var(--contentCaption)' }, beginAtZero: true, stepSize: 3 },
  },
  responsive: true,
  maintainAspectRatio: false,
};

const pieData = {
  labels: ['개발팀', '마케팅팀', '영업팀', '인사팀', '기획팀'],
  datasets: [
    {
      data: [35, 24, 18, 15, 8],
      backgroundColor: [
        'var(--primaryBlue)',
        'var(--green400)',
        'var(--orange400)',
        'var(--red400)',
        'var(--purple400)'
      ],
      borderWidth: 0,
    },
  ],
};
const pieOptions = {
  plugins: { legend: { position: 'right', labels: { color: 'var(--contentMain)', font: { size: 14 } } } },
  responsive: true,
  maintainAspectRatio: false,
};

const lineData = {
  labels: ['월', '화', '수', '목', '금', '토', '일'],
  datasets: [
    {
      label: '점심',
      data: [45, 42, 40, 44, 48, 30, 18],
      borderColor: 'var(--primaryBlue)',
      backgroundColor: 'var(--primaryBlue)',
      tension: 0.4,
      pointRadius: 3,
      fill: false,
    },
    {
      label: '저녁',
      data: [32, 30, 28, 35, 38, 22, 15],
      borderColor: 'var(--red500)',
      backgroundColor: 'var(--red500)',
      tension: 0.4,
      pointRadius: 3,
      fill: false,
    },
  ],
};
const lineOptions = {
  plugins: { legend: { labels: { color: 'var(--contentMain)', font: { size: 13 } } } },
  scales: {
    x: { grid: { display: false }, ticks: { color: 'var(--contentCaption)' } },
    y: { grid: { color: 'var(--bgTertiary)' }, ticks: { color: 'var(--contentCaption)' }, beginAtZero: true },
  },
  responsive: true,
  maintainAspectRatio: false,
};

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('week');
  const navigate = useNavigate();

  // 차트 색상 변수값을 useMemo로 캐싱
  const chartColors = useMemo(() => ({
    blue: getVarColor('--primaryBlue') || '#3182f6',
    green: getVarColor('--green400') || '#15c47e',
    orange: getVarColor('--orange400') || '#ffa927',
    red: getVarColor('--red400') || '#f66570',
    purple: getVarColor('--purple400') || '#b44bd7',
    redLine: getVarColor('--red500') || '#f04452',
    caption: getVarColor('--contentCaption') || '#8b95a1',
    main: getVarColor('--contentMain') || '#333d4b',
    tertiary: getVarColor('--bgTertiary') || '#e6e8ea',
  }), []);

  // Bar Chart 데이터
  const barData = useMemo(() => {
    const data = {
      week: {
        labels: ['개발팀', '마케팅팀', '영업팀', '인사팀', '기획팀'],
        data: [12, 8, 6, 5, 3]
      },
      month: {
        labels: ['개발팀', '마케팅팀', '영업팀', '인사팀', '기획팀'],
        data: [45, 32, 28, 25, 15]
      },
      year: {
        labels: ['개발팀', '마케팅팀', '영업팀', '인사팀', '기획팀'],
        data: [180, 150, 120, 100, 80]
      }
    };

    return {
      labels: data[timeRange].labels,
      datasets: [
        {
          label: '예약 수',
          data: data[timeRange].data,
          backgroundColor: chartColors.blue,
          borderRadius: 8,
          barThickness: 28,
        },
      ],
    };
  }, [timeRange, chartColors]);

  // Pie Chart 데이터
  const pieData = useMemo(() => {
    const data = {
      week: [35, 24, 18, 15, 8],
      month: [30, 25, 20, 15, 10],
      year: [28, 22, 18, 17, 15]
    };

    return {
      labels: ['개발팀', '마케팅팀', '영업팀', '인사팀', '기획팀'],
      datasets: [
        {
          data: data[timeRange],
          backgroundColor: [
            chartColors.blue,
            chartColors.green,
            chartColors.orange,
            chartColors.red,
            chartColors.purple
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [timeRange, chartColors]);

  // Line Chart 데이터 (일별 점심/저녁 예약 추이)
  const lineData = useMemo(() => {
    const data = {
      week: {
        labels: ['월', '화', '수', '목', '금', '토', '일'],
        lunch: [45, 42, 40, 44, 48, 30, 18],
        dinner: [32, 30, 28, 35, 38, 22, 15]
      },
      month: {
        labels: ['1일', '5일', '10일', '15일', '20일', '25일', '30일'],
        lunch: [38, 42, 48, 53, 50, 46, 40],
        dinner: [28, 32, 35, 37, 36, 33, 30],
      },
      year: {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        lunch: [120, 150, 180, 160, 190, 210, 200, 180, 160, 140, 130, 150],
        dinner: [100, 120, 150, 140, 160, 180, 170, 150, 130, 110, 100, 120]
      }
    };

    return {
      labels: data[timeRange].labels,
      datasets: [
        {
          label: '점심',
          data: data[timeRange].lunch,
          borderColor: chartColors.blue,
          backgroundColor: chartColors.blue,
          tension: 0.4,
          pointRadius: 3,
          fill: false,
        },
        {
          label: '저녁',
          data: data[timeRange].dinner,
          borderColor: chartColors.redLine,
          backgroundColor: chartColors.redLine,
          tension: 0.4,
          pointRadius: 3,
          fill: false,
        },
      ],
    };
  }, [timeRange, chartColors]);

  // 시간대별 식사 예약 현황 데이터
  const timeLineData = useMemo(() => {
    const data = {
      week: {
        labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        values: [2, 5, 10, 25, 15, 12, 20, 18, 8]
      },
      month: {
        labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        values: [5, 12, 25, 45, 35, 28, 40, 35, 15]
      },
      year: {
        labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        values: [15, 35, 75, 120, 95, 80, 110, 95, 45]
      }
    };

    return {
      labels: data[timeRange].labels,
      datasets: [
        {
          label: '예약수',
          data: data[timeRange].values,
          borderColor: chartColors.green,
          backgroundColor: chartColors.green,
          tension: 0.4,
          pointRadius: 3,
          fill: false,
        },
      ],
    };
  }, [timeRange, chartColors]);

  // 차트 옵션
  const barOptions = useMemo(() => ({
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: chartColors.caption } },
      y: { grid: { color: chartColors.tertiary }, ticks: { color: chartColors.caption }, beginAtZero: true, stepSize: 3 },
    },
    responsive: true,
    maintainAspectRatio: false,
  }), [chartColors]);

  const pieOptions = useMemo(() => ({
    plugins: { legend: { position: 'right', labels: { color: chartColors.main, font: { size: 14 } } } },
    responsive: true,
    maintainAspectRatio: false,
  }), [chartColors]);

  const lineOptions = useMemo(() => ({
    plugins: { legend: { labels: { color: chartColors.main, font: { size: 13 } } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: chartColors.caption } },
      y: { grid: { color: chartColors.tertiary }, ticks: { color: chartColors.caption }, beginAtZero: true },
    },
    responsive: true,
    maintainAspectRatio: false,
  }), [chartColors]);

  const timeLineOptions = useMemo(() => ({
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: chartColors.caption } },
      y: { grid: { color: chartColors.tertiary }, ticks: { color: chartColors.caption }, beginAtZero: true },
    },
    responsive: true,
    maintainAspectRatio: false,
  }), [chartColors]);

  return (
    <>
      {/* Dashboard Title & Actions */}
      <div className="bg-[var(--bgSecondary)] px-10 py-7 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--contentMain)] tracking-tight">대시보드</h1>
            <span className="bg-[var(--bgTertiary)] text-[var(--contentCaption)] text-xs rounded px-2 py-1 ml-2">ver 1.2.0</span>
          </div>
          <div className="flex gap-2">
            <button className="button-tertiary-m flex items-center gap-1 px-4 py-2 shadow-sm transition hover:border-[var(--borderFocused)] focus:ring-2 focus:ring-[var(--primaryBlue)]">
              <MdDownload size={18} className="text-[var(--contentMain)]"/> 리포트 다운로드
            </button>
            <button className="button-tertiary-m flex items-center gap-1 px-4 py-2 shadow-sm transition hover:border-[var(--borderFocused)] focus:ring-2 focus:ring-[var(--primaryBlue)]">
              <MdMonitor size={18} className="text-[var(--contentMain)]"/> 실시간 모니터링
            </button>
          </div>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col gap-2 border border-[var(--borderOutline)] min-h-[100px]">
            <div className="flex items-center gap-2 text-[var(--contentCaption)] text-xs"><MdEvent size={18}/> 총 예약</div>
            <div className="text-2xl font-bold text-[var(--contentMain)]">83</div>
            <div className="text-xs text-[var(--contentCaption)]">오늘</div>
          </div>
          <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col gap-2 border border-[var(--borderOutline)] min-h-[100px]">
            <div className="flex items-center gap-2 text-[var(--contentCaption)] text-xs"><MdEvent size={18}/> 주간 예약</div>
            <div className="text-2xl font-bold text-[var(--contentMain)]">324</div>
            <div className="text-xs text-[var(--contentCaption)]">이번 주</div>
          </div>
          <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col gap-2 border border-[var(--borderOutline)] min-h-[100px]">
            <div className="flex items-center gap-2 text-[var(--contentCaption)] text-xs"><MdPeople size={18}/> 총 사용자</div>
            <div className="text-2xl font-bold text-[var(--contentMain)]">156</div>
            <div className="text-xs text-[var(--contentCaption)]">등록된 사용자</div>
          </div>
          <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 flex flex-col gap-2 border border-[var(--borderOutline)] min-h-[100px]">
            <div className="flex items-center gap-2 text-[var(--contentCaption)] text-xs"><MdQrCode size={18}/> QR 제출률</div>
            <div className="text-2xl font-bold text-[var(--contentMain)]">81%</div>
            <div className="text-xs text-[var(--contentCaption)]">오늘 기준</div>
          </div>
        </div>
      </div>
      {/* Charts & Cards */}
      <div className="flex-1 bg-[var(--bgSecondary)] px-10 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="col-span-1 flex flex-col gap-5">
          <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 border border-[var(--borderOutline)] min-h-[260px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-[var(--contentMain)]">부서별 예약 현황</div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-3 py-1 rounded text-xs border transition-colors duration-150 ${timeRange === 'week' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-[var(--contentCaption)] border-[var(--borderOutline)] hover:bg-blue-50'}`}
                  onClick={() => setTimeRange('week')}
                >
                  주간
                </button>
                <button
                  className={`px-3 py-1 rounded text-xs border transition-colors duration-150 ${timeRange === 'month' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-[var(--contentCaption)] border-[var(--borderOutline)] hover:bg-blue-50'}`}
                  onClick={() => setTimeRange('month')}
                >
                  월간
                </button>
                <button
                  className={`px-3 py-1 rounded text-xs border transition-colors duration-150 ${timeRange === 'year' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-[var(--contentCaption)] border-[var(--borderOutline)] hover:bg-blue-50'}`}
                  onClick={() => setTimeRange('year')}
                >
                  연간
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-[var(--contentCaption)] min-h-[180px]">
              <Bar data={barData} options={barOptions} height={180} />
            </div>
          </div>
          <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 border border-[var(--borderOutline)] min-h-[260px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-[var(--contentMain)]">부서별 예약 비율</div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-3 py-1 rounded text-xs border transition-colors duration-150 ${timeRange === 'week' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-[var(--contentCaption)] border-[var(--borderOutline)] hover:bg-blue-50'}`}
                  onClick={() => setTimeRange('week')}
                >
                  주간
                </button>
                <button
                  className={`px-3 py-1 rounded text-xs border transition-colors duration-150 ${timeRange === 'month' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-[var(--contentCaption)] border-[var(--borderOutline)] hover:bg-blue-50'}`}
                  onClick={() => setTimeRange('month')}
                >
                  월간
                </button>
                <button
                  className={`px-3 py-1 rounded text-xs border transition-colors duration-150 ${timeRange === 'year' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-[var(--contentCaption)] border-[var(--borderOutline)] hover:bg-blue-50'}`}
                  onClick={() => setTimeRange('year')}
                >
                  연간
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-[var(--contentCaption)] min-h-[180px]">
              <Pie data={pieData} options={pieOptions} height={180} />
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-5">
          <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 border border-[var(--borderOutline)] min-h-[260px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-[var(--contentMain)]">일별 점심/저녁 예약 추이</div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-3 py-1 rounded text-xs border transition-colors duration-150 ${timeRange === 'week' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-[var(--contentCaption)] border-[var(--borderOutline)] hover:bg-blue-50'}`}
                  onClick={() => setTimeRange('week')}
                >
                  주간
                </button>
                <button
                  className={`px-3 py-1 rounded text-xs border transition-colors duration-150 ${timeRange === 'month' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-[var(--contentCaption)] border-[var(--borderOutline)] hover:bg-blue-50'}`}
                  onClick={() => setTimeRange('month')}
                >
                  월간
                </button>
                <button
                  className={`px-3 py-1 rounded text-xs border transition-colors duration-150 ${timeRange === 'year' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-[var(--contentCaption)] border-[var(--borderOutline)] hover:bg-blue-50'}`}
                  onClick={() => setTimeRange('year')}
                >
                  연간
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-[var(--contentCaption)] min-h-[180px]">
              <Line data={lineData} options={lineOptions} height={180} />
            </div>
          </div>
          <div className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 border border-[var(--borderOutline)] min-h-[260px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-[var(--contentMain)]">시간대별 식사 예약 현황</div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-3 py-1 rounded text-xs border transition-colors duration-150 ${timeRange === 'week' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-[var(--contentCaption)] border-[var(--borderOutline)] hover:bg-blue-50'}`}
                  onClick={() => setTimeRange('week')}
                >
                  주간
                </button>
                <button
                  className={`px-3 py-1 rounded text-xs border transition-colors duration-150 ${timeRange === 'month' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-[var(--contentCaption)] border-[var(--borderOutline)] hover:bg-blue-50'}`}
                  onClick={() => setTimeRange('month')}
                >
                  월간
                </button>
                <button
                  className={`px-3 py-1 rounded text-xs border transition-colors duration-150 ${timeRange === 'year' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-[var(--contentCaption)] border-[var(--borderOutline)] hover:bg-blue-50'}`}
                  onClick={() => setTimeRange('year')}
                >
                  연간
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-[var(--contentCaption)] min-h-[180px]">
              <Line data={timeLineData} options={timeLineOptions} height={180} />
            </div>
          </div>
        </div>
      </div>
      {/* QR 미제출자 전체 너비 카드 */}
      <div className="w-full px-10 pb-10">
        <div className="bg-[#fff7ec] rounded-[var(--radius-m)] shadow-sm p-6 border border-[var(--orange100)] min-h-[120px] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[var(--contentWarning)] font-semibold">
            <MdWarning size={20}/><span>QR 미제출자</span>
          </div>
          <div className="text-2xl font-bold text-[var(--contentError)]">8명</div>
          <div className="text-xs text-[var(--contentCaption)]">오늘 실사 예약 중 QR 미제출</div>
          <button
            className="button-secondary-m w-fit mt-2 px-5 py-2 font-semibold shadow-sm transition hover:bg-[var(--orange200)] focus:ring-2 focus:ring-[var(--orange400)]"
            onClick={() => navigate('/qr')}
          >
            명단 확인
          </button>
        </div>
      </div>
    </>
  );
} 