import React, { useState } from 'react';
import { MdDescription, MdPictureAsPdf, MdInfo, MdCheckCircle, MdDevices, MdLogin, MdDownload, MdSupportAgent, MdAccessTime, MdOndemandVideo, MdAdd, MdEdit, MdSearch } from 'react-icons/md';

const tabMenus = [
  '시스템 개요', '대시보드', '사용자 관리', '예약 관리', 'QR 관리', '메뉴 관리', '공지사항', '후원 관리', '시스템 설정'
];

const helpContents = [
  {
    title: '시스템 개요',
    sections: [
      {
        icon: <MdInfo className="text-[var(--primaryBlue)]" size={22}/>,
        title: '만나식권 관리자 시스템 소개',
        content: '만나식권 관리자 시스템은 식권 예약, QR 체크, 통계 등 다양한 기능을 통합적으로 관리할 수 있는 시스템입니다. 실시간 모니터링 데이터와 통계 뷰를 통해 효율적인 식권 운영 환경을 지원합니다.'
      },
      {
        icon: <MdCheckCircle className="text-[var(--green500)]" size={22}/>,
        title: '주요 기능',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>식권 신청/승인/관리</li>
            <li>QR 코드 체크 및 통계</li>
            <li>공지사항 관리</li>
            <li>식단 메뉴 관리</li>
            <li>실시간 통계 및 모니터링</li>
          </ul>
        )
      },
      {
        icon: <MdDevices className="text-[var(--primaryBlue)]" size={22}/>,
        title: '시스템 요구사항',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>운영체제: Windows 10 이상, macOS 10.4 이상</li>
            <li>브라우저: Chrome 90+, Firefox 85+, Safari 14+, Edge 90+</li>
            <li>모바일 환경: 모바일 브라우저 최적화</li>
            <li>화면: 해상도 1280x720 이상 권장</li>
          </ul>
        )
      },
      {
        icon: <MdLogin className="text-[var(--primaryBlue)]" size={22}/>,
        title: '접속 및 로그인',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>브라우저에서 관리자 페이지 URL로 접속합니다.</li>
            <li>고유번호와 비밀번호를 입력합니다.</li>
            <li>2단계 인증(OTP)을 완료합니다.</li>
            <li>최초 로그인 시 비밀번호를 변경할 수 있습니다.</li>
          </ol>
        )
      },
    ]
  },
  {
    title: '대시보드 사용법',
    sections: [
      {
        icon: <MdInfo className="text-[var(--primaryBlue)]" size={22}/>,
        title: '대시보드 개요',
        content: '대시보드는 사이트의 핵심 통계와 현황을 한눈에 확인할 수 있는 메인 화면입니다. 실시간 통계, 예약 현황, 알림 등 통합 운영 상황을 모니터링할 수 있습니다.'
      },
      {
        icon: <MdCheckCircle className="text-[var(--green500)]" size={22}/>,
        title: '주요 통계 카드',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>전체 사용자, 신규 가입, 활성/비활성 사용자 등 주요 지표를 제공합니다.</li>
            <li>오늘 점심/저녁 예약, QR 미제출 등 실시간 예약 현황을 확인할 수 있습니다.</li>
            <li>공지사항, 후원 현황 등 주요 알림도 함께 표시됩니다.</li>
          </ul>
        )
      },
      {
        icon: <MdDevices className="text-[var(--primaryBlue)]" size={22}/>,
        title: '차트 해석 방법',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>누적 사용자/예약/QR 제출 등 주요 지표의 변화 추이를 그래프로 확인할 수 있습니다.</li>
            <li>차트 위에 마우스를 올리면 상세 수치를 확인할 수 있습니다.</li>
            <li>필터를 통해 기간, 유형별로 데이터 조회가 가능합니다.</li>
          </ul>
        )
      },
      {
        icon: <MdDownload className="text-[var(--primaryBlue)]" size={22}/>,
        title: '리포트 다운로드',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>대시보드 상단의 내보내기 버튼을 통해 통계 리포트를 다운로드할 수 있습니다.</li>
            <li>PDF, 엑셀 등 다양한 포맷을 지원합니다.</li>
          </ul>
        )
      },
      {
        icon: <MdAccessTime className="text-[var(--primaryBlue)]" size={22}/>,
        title: '실시간 모니터링',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>실시간 사용자 현황, 예약 현황 등 주요 데이터를 자동으로 갱신하여 보여줍니다.</li>
            <li>새로고침 없이 최신 정보를 확인할 수 있습니다.</li>
          </ul>
        )
      }
    ]
  },
  {
    title: '사용자 관리',
    sections: [
      {
        icon: <MdInfo className="text-[var(--primaryBlue)]" size={22}/>,
        title: '사용자 관리 개요',
        content: '사용자 관리에서는 시스템에 등록된 모든 사용자의 정보를 조회, 수정, 삭제할 수 있습니다. 사용자별 활동 현황 확인도 함께 관리할 수 있습니다.'
      },
      {
        icon: <MdAdd className="text-[var(--primaryBlue)]" size={22}/>,
        title: '새 사용자 추가',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>사용자 목록 상단의 <b>+ 사용자 추가</b> 버튼을 클릭합니다.</li>
            <li>필수 정보를 입력 후 저장합니다.</li>
            <li>등록 완료 시 목록에 새 사용자가 추가됩니다.</li>
          </ol>
        )
      },
      {
        icon: <MdEdit className="text-[var(--primaryBlue)]" size={22}/>,
        title: '사용자 정보 수정',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>수정할 사용자의 <b>연필(수정)</b> 아이콘을 클릭합니다.</li>
            <li>정보를 변경 후 저장합니다.</li>
          </ol>
        )
      },
      {
        icon: <MdCheckCircle className="text-[var(--green500)]" size={22}/>,
        title: '사용자 상태 관리',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>사용자 상태(활성/비활성)를 변경할 수 있습니다.</li>
            <li>비활성화된 사용자는 시스템 이용이 제한됩니다.</li>
          </ul>
        )
      },
      {
        icon: <MdSearch className="text-[var(--primaryBlue)]" size={22}/>,
        title: '사용자 검색 및 필터링',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>상단 검색창에 이름, 이메일 등으로 사용자를 검색할 수 있습니다.</li>
            <li>상태(전체/활성/비활성) 필터로 목록을 빠르게 분류할 수 있습니다.</li>
          </ol>
        )
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: 'QR 제출률 분석',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>각 사용자별 QR 제출률(%)을 확인할 수 있습니다.</li>
            <li>제출률 = (QR 제출 횟수 / 전체 예약 횟수) × 100</li>
            <li>제출률이 낮은 사용자는 별도 관리가 필요할 수 있습니다.</li>
          </ul>
        )
      }
    ]
  },
  {
    title: '예약 관리',
    sections: [
      {
        icon: <MdInfo className="text-[var(--primaryBlue)]" size={22}/>,
        title: '예약 관리 개요',
        content: '예약 관리에서는 전체 예약 현황을 실시간으로 확인하고, 일반 예약과 추가 예약을 구분하여 관리할 수 있습니다. 일반 예약과 추가 예약의 관련정보와 상태변경, QR 제출 현황 등도 함께 모니터링할 수 있습니다.'
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: '일반 예약 관리',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>예약 탭을 선택합니다.</li>
            <li>일반 예약 현황을 확인합니다.</li>
            <li>필요시 예약 상태를 변경합니다.</li>
            <li>QR 제출 여부를 확인합니다.</li>
            <li>사용자별 상세 내역을 조회/수정합니다.</li>
          </ol>
        )
      },
      {
        icon: <MdAdd className="text-[var(--primaryBlue)]" size={22}/>,
        title: '추가 예약 관리',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>추가 예약 탭을 선택합니다.</li>
            <li>추가 예약 현황을 확인합니다.</li>
            <li>필요시 예약 상태를 변경합니다.</li>
            <li>사용자별 상세 내역을 조회/수정합니다.</li>
          </ol>
        )
      },
      {
        icon: <MdDevices className="text-[var(--primaryBlue)]" size={22}/>,
        title: '예약 상태 이해',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>확정: 예약이 승인된 상태입니다.</li>
            <li>대기: 예약이 승인 대기 중입니다.</li>
            <li>취소: 예약이 취소된 상태입니다.</li>
            <li>QR 제출: 식사 시 QR을 제출한 경우 표시됩니다.</li>
            <li>미제출: QR을 제출하지 않은 경우 표시됩니다.</li>
          </ul>
        )
      },
      {
        icon: <MdSearch className="text-[var(--primaryBlue)]" size={22}/>,
        title: 'QR 미제출자 관리',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>QR 미제출자 확인 버튼을 클릭합니다.</li>
            <li>미제출자 목록을 확인합니다.</li>
            <li>필요시 개별 사용자에게 안내 메시지를 발송합니다.</li>
            <li>사용자별 상세 내역을 조회/수정합니다.</li>
          </ol>
        )
      },
      {
        icon: <MdDownload className="text-[var(--primaryBlue)]" size={22}/>,
        title: '예약 데이터 내보내기',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>예약 현황 내보내기 버튼을 클릭합니다.</li>
            <li>내보낼 파일 형식을 선택합니다(PDF/CSV).</li>
            <li>파일을 다운로드합니다.</li>
            <li>필요시 통계용 데이터로 활용합니다.</li>
            <li>※ 보안: 내보낸 파일은 개인정보 보호에 유의하세요.</li>
          </ol>
        )
      }
    ]
  },
  {
    title: 'QR 관리',
    sections: [
      {
        icon: <MdInfo className="text-[var(--primaryBlue)]" size={22}/>,
        title: 'QR 관리 개요',
        content: 'QR 관리에서는 식사 예약자 확인을 위해 발급되는 QR 코드의 스캔 현황을 확인할 수 있습니다. QR 코드 스캔을 통해 현장확인과 식사 이중 방지를 확인하고, 미제출자를 관리할 수 있습니다.'
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: 'QR 스캐너 사용법',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>QR 메뉴에서 스캐너를 실행합니다.</li>
            <li>예약자의 QR 코드를 스캔합니다.</li>
            <li>스캔 성공 시 출입이 완료됩니다.</li>
            <li>스캔 실패 시 오류 메시지가 표시됩니다.</li>
            <li>스캔 이력은 실시간으로 현황에 반영됩니다.</li>
          </ol>
        )
      },
      {
        icon: <MdDevices className="text-[var(--primaryBlue)]" size={22}/>,
        title: 'QR 제출률 모니터링',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>제출률 = (QR 제출 횟수 / 전체 예약 횟수) × 100</li>
            <li>제출률이 낮은 사용자는 별도 관리가 필요합니다.</li>
            <li>미제출자 목록에서 개별 연락 및 안내가 가능합니다.</li>
          </ul>
        )
      },
      {
        icon: <MdSearch className="text-[var(--primaryBlue)]" size={22}/>,
        title: '미제출자 알림 발송',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>미제출자 목록을 확인합니다.</li>
            <li>필요시 알림 메시지(SMS)를 발송합니다.</li>
            <li>발송 이력은 별도 관리됩니다.</li>
            <li>특정 사용자를 선택해 개별 안내도 가능합니다.</li>
          </ol>
        )
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: '재발 조치 관리',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>반복 미제출자에 대해 별도 조치를 취할 수 있습니다.</li>
            <li>1회 경고 후 제한 조치</li>
            <li>제한 해제는 관리자 승인 필요</li>
          </ol>
        )
      },
      {
        icon: <MdDevices className="text-[var(--primaryBlue)]" size={22}/>,
        title: 'QR 스캔 기록 관리',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>모든 QR 스캔 이력은 기록/조회가 가능합니다.</li>
            <li>사용자별, 시간별, 식사별로 필터링할 수 있습니다.</li>
            <li>제출률, 미제출 현황 등 통계 기능을 지원합니다.</li>
          </ul>
        )
      }
    ]
  },
  {
    title: '메뉴 관리',
    sections: [
      {
        icon: <MdInfo className="text-[var(--primaryBlue)]" size={22}/>,
        title: '메뉴 관리 개요',
        content: '메뉴 관리에서는 주간 식단표 등록, 메뉴 추가, 일괄 업로드, 알레르기 정보, 통계/분석 등 다양한 메뉴 관련 업무를 관리할 수 있습니다.'
      },
      {
        icon: <MdAdd className="text-[var(--primaryBlue)]" size={22}/>,
        title: '새 메뉴 추가',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>+ 메뉴 추가 버튼을 클릭합니다.</li>
            <li>메뉴 정보를 입력합니다.</li>
            <li>저장 버튼을 클릭합니다.</li>
            <li>저장된 메뉴는 목록에서 확인할 수 있습니다.</li>
          </ol>
        )
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: '주간 메뉴 계획',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>주간 메뉴 등록을 클릭합니다.</li>
            <li>요일별로 메뉴를 입력합니다.</li>
            <li>각 요일별로 저장 버튼을 클릭합니다.</li>
            <li>등록된 주간 메뉴는 식단표에서 확인할 수 있습니다.</li>
            <li>수정/삭제는 각 요일별 메뉴에서 가능합니다.</li>
          </ol>
        )
      },
      {
        icon: <MdDownload className="text-[var(--primaryBlue)]" size={22}/>,
        title: '메뉴 일괄 업로드',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>엑셀 파일로 메뉴를 등록하는 방법입니다.</li>
            <li>메뉴 업로드 버튼을 클릭합니다.</li>
            <li>양식 파일을 다운로드/작성/업로드합니다.</li>
            <li>업로드 후 저장 버튼을 클릭합니다.</li>
            <li>등록된 메뉴는 목록에서 확인할 수 있습니다.</li>
            <li>중복/오류 항목 등도 등록됩니다.</li>
          </ol>
        )
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: '알레르기 정보 관리',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>알레르기 정보는 각 메뉴별로 입력/관리할 수 있습니다.</li>
            <li>등록된 알레르기 정보는 식단표에서 확인됩니다.</li>
            <li>수정/삭제는 각 메뉴 상세에서 가능합니다.</li>
            <li>사용자 요청 시 추가 알레르기 정보도 입력할 수 있습니다.</li>
          </ul>
        )
      },
      {
        icon: <MdDevices className="text-[var(--primaryBlue)]" size={22}/>,
        title: '메뉴 통계 및 분석',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>메뉴별 제공 횟수, 선호도 통계가 제공됩니다.</li>
            <li>주별/월별 메뉴 제공 현황을 확인할 수 있습니다.</li>
            <li>메뉴별 사용자 피드백을 분석할 수 있습니다.</li>
            <li>메뉴 통계/분석 결과는 차트로 시각화하여 제공합니다.</li>
          </ul>
        )
      }
    ]
  },
  {
    title: '공지사항 관리',
    sections: [
      {
        icon: <MdInfo className="text-[var(--primaryBlue)]" size={22}/>,
        title: '공지사항 관리 개요',
        content: '공지사항 관리에서는 전체 공지, 긴급 공지, 고정 공지 등 다양한 유형의 공지사항을 등록, 수정, 삭제할 수 있습니다. 공지사항은 사용자에게 중요한 정보를 전달하는 데 활용됩니다.'
      },
      {
        icon: <MdAdd className="text-[var(--primaryBlue)]" size={22}/>,
        title: '새 공지사항 등록',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>+ 공지사항 추가 버튼을 클릭합니다.</li>
            <li>제목, 내용, 중요도, 상태(게시/임시저장) 등을 입력합니다.</li>
            <li>필요시 고정/긴급 공지로 설정할 수 있습니다.</li>
            <li>저장 버튼을 클릭하면 목록에 추가됩니다.</li>
          </ol>
        )
      },
      {
        icon: <MdEdit className="text-[var(--primaryBlue)]" size={22}/>,
        title: '공지사항 수정 및 삭제',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>수정/삭제할 공지사항의 아이콘(연필/휴지통)을 클릭합니다.</li>
            <li>수정 시 내용 변경 후 저장, 삭제 시 확인 후 삭제됩니다.</li>
          </ol>
        )
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: '공지사항 유형 및 상태',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>전체 공지: 모든 사용자에게 노출되는 일반 공지입니다.</li>
            <li>긴급 공지: 중요도가 높은 공지로 별도 표시됩니다.</li>
            <li>고정 공지: 목록 상단에 항상 고정되어 노출됩니다.</li>
            <li>상태: 게시중/임시저장으로 관리할 수 있습니다.</li>
          </ul>
        )
      },
      {
        icon: <MdDevices className="text-[var(--primaryBlue)]" size={22}/>,
        title: '공지사항 통계 및 관리',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>공지별 조회수, 등록일, 상태 등 주요 정보를 확인할 수 있습니다.</li>
            <li>중요 공지, 신규 공지 등은 별도 뱃지로 표시됩니다.</li>
            <li>공지사항 목록은 검색/필터링이 가능합니다.</li>
          </ul>
        )
      }
    ]
  },
  {
    title: '후원 관리',
    sections: [
      {
        icon: <MdInfo className="text-[var(--primaryBlue)]" size={22}/>,
        title: '후원 관리 개요',
        content: '후원 관리에서는 후원 감사 게시글 작성, 카테고리별 관리, 투명성 확보, 게시글 상태 관리, 후원자 소통 등 후원 관련 업무를 통합적으로 관리할 수 있습니다.'
      },
      {
        icon: <MdAdd className="text-[var(--primaryBlue)]" size={22}/>,
        title: '감사 게시글 작성',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>+ 감사 게시글 작성 버튼을 클릭합니다.</li>
            <li>제목, 내용을 입력합니다.</li>
            <li>카테고리, 상태(게시/임시저장) 선택</li>
            <li>작성 완료 후 저장 버튼을 클릭합니다.</li>
          </ol>
        )
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: '카테고리별 관리',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>후원 감사글은 다음 카테고리로 분류합니다.</li>
            <li>감사인사: 후원자에게 감사 인사 전달</li>
            <li>보고서: 후원금 사용 내역 공개</li>
            <li>공지: 후원 관련 안내/공지</li>
            <li>특별 감사글: 특정 후원자/날짜 등 특별 감사</li>
            <li>목표 및 계획: 후원 목표/계획 안내</li>
          </ul>
        )
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: '투명성 확보',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>모든 후원금 사용 내역을 공개합니다.</li>
            <li>후원금 사용 내역은 게시글로 등록/공개합니다.</li>
            <li>정기적으로 후원금 내역을 업데이트합니다.</li>
            <li>필요시 후원자 요청에 따라 상세 내역을 안내합니다.</li>
          </ol>
        )
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: '게시글 상태 관리',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>게시글은 상태별로 관리합니다.</li>
            <li>게시중: 사용자에게 공개</li>
            <li>임시저장: 작성 중인 게시글</li>
            <li>삭제: 필요시 게시글 삭제</li>
            <li>특정 글은 관리자 권한에서만 작성/삭제 가능</li>
          </ul>
        )
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: '후원자 소통',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>후원자와의 소통을 위해 댓글을 운영하거나 문의를 받습니다.</li>
            <li>감사의 메시지를 직접 전달할 수 있습니다.</li>
            <li>후원자 요청사항은 신속하게 반영합니다.</li>
            <li>감사 게시글은 후원자에게 알림으로 전달됩니다.</li>
          </ul>
        )
      }
    ]
  },
  {
    title: '시스템 설정',
    sections: [
      {
        icon: <MdInfo className="text-[var(--primaryBlue)]" size={22}/>,
        title: '시스템 설정 개요',
        content: '시스템 설정에서는 메일/푸시, API, 보안, 백업, 모니터링 등 시스템 운영에 필요한 전반의 관리를 할 수 있습니다. 알림 발송, API키, 보안정책, 백업 등 자동화/정책 관리.'
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: '기본 설정 관리',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>기본 설정 메뉴를 클릭합니다.</li>
            <li>메일/푸시 발송 설정을 입력/저장합니다.</li>
            <li>저장 후 적용됩니다.</li>
            <li>설정 변경 시 즉시 반영됩니다.</li>
          </ol>
        )
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: 'API 연동 설정',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>API 연동 메뉴를 클릭합니다.</li>
            <li>새 API키를 생성/입력합니다.</li>
            <li>외부 시스템과의 연동정보를 입력/저장합니다.</li>
            <li>설정 후 즉시 적용됩니다.</li>
            <li>필요시 API 키를 재발급/삭제합니다.</li>
          </ol>
        )
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: '보안 설정',
        content: (
          <ol className="list-decimal ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>보안 설정 메뉴를 클릭합니다.</li>
            <li>패스워드 정책을 입력/저장합니다.</li>
            <li>2단계 인증(OTP) 정책을 입력/저장합니다.</li>
            <li>접근 IP를 등록/관리합니다.</li>
            <li>설정 후 즉시 반영됩니다.</li>
          </ol>
        )
      },
      {
        icon: <MdCheckCircle className="text-[var(--primaryBlue)]" size={22}/>,
        title: '백업 및 복원',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>데이터 백업/복원 메뉴를 클릭합니다.</li>
            <li>주기적 자동 백업(일/주/월) 설정 가능.</li>
            <li>백업 파일 다운로드/복원 기능 제공.</li>
            <li>백업 파일 암호화 및 복원 이력 확인.</li>
          </ul>
        )
      },
      {
        icon: <MdDevices className="text-[var(--primaryBlue)]" size={22}/>,
        title: '시스템 모니터링',
        content: (
          <ul className="list-disc ml-6 mt-1 text-[var(--contentMain)] text-sm">
            <li>시스템 상태를 실시간으로 모니터링합니다.</li>
            <li>서버 리소스 사용량을 확인합니다.</li>
            <li>특정 이벤트 발생 시 알림을 받습니다.</li>
            <li>시스템 로그를 실시간으로 조회/분석합니다.</li>
          </ul>
        )
      }
    ]
  },
];

const quickMenus = [
  { icon: <MdDescription size={28} className="text-[var(--primaryBlue)]" />, label: '사용자 매뉴얼', desc: '상세한 사용자 매뉴얼을 PDF로 다운로드하세요.', btn: '다운로드' },
  { icon: <MdSupportAgent size={28} className="text-[var(--green500)]" />, label: '실시간 지원', desc: '궁금한 점이 있으신가요? 언제든 문의하세요.', btn: '문의하기' },
  { icon: <MdOndemandVideo size={28} className="text-[var(--purple500)]" />, label: '동영상 튜토리얼', desc: '단계별 사용법을 동영상으로 확인하세요.', btn: '시청하기' },
];

const updates = [
  { version: 'v1.2.0', date: '2024-05-29', desc: '도움말 섹션 및 기능 추가', details: '도움말 PDF 다운로드, 실시간 지원 기능이 추가되었습니다.' },
  { version: 'v1.1.5', date: '2024-05-15', desc: '사용자 가이드 기능 개선', details: 'UI/UX, 레이아웃 등 도움말 가이드가 개선되었습니다.' },
  { version: 'v1.0.0', date: '2024-04-01', desc: '리뉴얼된 전체 기능 추가', details: '전체, 세부 가이드 등 도움말이 추가되었습니다.' },
];

export default function Help() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');

  const content = helpContents[tab] || helpContents[0];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--bgSecondary)]">
      {/* 상단 타이틀, 검색, PDF 다운로드 */}
      <div className="flex items-center justify-between px-10 pt-10 pb-4">
        <h1 className="text-3xl font-bold text-[var(--contentMain)]">도움말</h1>
        <div className="flex gap-2 min-w-[320px] items-center">
          <input type="text" className="px-4 py-2 rounded border border-[var(--borderInput)] bg-white text-sm" placeholder="도움말 검색..." value={search} onChange={e => setSearch(e.target.value)} style={{width:180}} />
          <button className="flex items-center gap-1 px-4 py-2 rounded border border-[var(--borderOutline)] bg-white text-[var(--contentMain)] text-sm font-semibold hover:bg-[var(--bgTertiary)] transition"><MdPictureAsPdf size={18}/> PDF 다운로드</button>
        </div>
      </div>
      {/* 탭 메뉴 */}
      <div className="flex justify-center gap-2 mb-6 px-10">
        {tabMenus.map((menu, idx) => (
          <button
            key={menu}
            onClick={() => setTab(idx)}
            className={`flex-1 h-11 rounded-[var(--radius-s)] text-base transition font-semibold border ${tab===idx ? 'bg-[var(--bgPrimary)] border-[var(--contentMain)] shadow-sm text-[var(--contentMain)]' : 'bg-transparent border-transparent text-[var(--contentSub)]'}`}
            style={{minWidth:120}}
          >
            {menu}
          </button>
        ))}
      </div>
      {/* 본문 카드 */}
      <div className="bg-white rounded-[var(--radius-l)] shadow-sm p-8 border border-[var(--borderOutline)] mx-10 mb-8">
        <div className="font-bold text-xl text-[var(--contentMain)] mb-6">{content.title}</div>
        {content.sections && content.sections.map((section, idx) => (
          <div key={idx} className="mb-7">
            <div className="flex items-center gap-2 mb-1">
              {section.icon}
              <span className="font-semibold text-[var(--contentMain)]">{section.title}</span>
            </div>
            <div className="text-[var(--contentCaption)] text-sm mb-1">{section.content}</div>
          </div>
        ))}
      </div>
      {/* 퀵메뉴 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 mb-8">
        {quickMenus.map((q, idx) => (
          <div key={q.label} className="bg-white rounded-[var(--radius-m)] shadow-sm p-6 border border-[var(--borderOutline)] flex flex-col items-center text-center">
            {q.icon}
            <div className="font-bold text-[var(--contentMain)] mt-2 mb-1">{q.label}</div>
            <div className="text-sm text-[var(--contentCaption)] mb-3">{q.desc}</div>
            <button className="px-4 py-2 rounded bg-[var(--primaryBlue)] text-white text-sm font-semibold shadow-sm">{q.btn}</button>
          </div>
        ))}
      </div>
      {/* 최근 업데이트 카드 */}
      <div className="bg-white rounded-[var(--radius-l)] shadow-sm p-8 border border-[var(--borderOutline)] mx-10 mb-10">
        <div className="font-bold text-lg text-[var(--contentMain)] mb-4">최근 업데이트</div>
        <ul className="space-y-4">
          {updates.map(u => (
            <li key={u.version} className="border-l-4 pl-4 border-[var(--primaryBlue)]">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-[var(--primaryBlue)]">{u.version}</span>
                <span className="text-xs text-[var(--contentCaption)]">{u.date}</span>
              </div>
              <div className="font-semibold text-[var(--contentMain)]">{u.desc}</div>
              <div className="text-sm text-[var(--contentCaption)]">{u.details}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
