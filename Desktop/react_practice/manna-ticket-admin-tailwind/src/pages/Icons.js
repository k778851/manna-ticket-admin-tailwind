import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import * as regularIcons from '@fortawesome/free-regular-svg-icons';

export default function Icons() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState('');
  const [activeTab, setActiveTab] = useState('solid'); // 'solid' or 'regular'

  // 모든 아이콘 목록 생성
  const allIcons = useMemo(() => {
    const icons = activeTab === 'solid' ? solidIcons : regularIcons;
    return Object.keys(icons)
      .filter(key => key.startsWith('fa'))
      .map(key => ({
        name: key,
        icon: icons[key]
      }));
  }, [activeTab]);

  // 검색어에 따른 필터링된 아이콘 목록
  const filteredIcons = useMemo(() => {
    if (!search) return allIcons;
    const searchLower = search.toLowerCase();
    return allIcons.filter(({ name }) =>
      name.toLowerCase().includes(searchLower)
    );
  }, [search, allIcons]);

  // 아이콘 이름 복사 함수
  const copyToClipboard = (iconName) => {
    const importStatement = `import { ${iconName} } from '@fortawesome/free-${activeTab}-svg-icons';`;
    navigator.clipboard.writeText(importStatement);
    setCopied(iconName);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--bgSecondary)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[var(--radius-l)] shadow-sm p-6 border border-[var(--borderOutline)]">
          <h1 className="text-2xl font-bold text-[var(--contentMain)] mb-6">Font Awesome 아이콘 검색</h1>
          
          {/* 탭 메뉴 */}
          <div className="flex gap-2 mb-6">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'solid'
                  ? 'bg-[var(--primaryBlue)] text-white'
                  : 'bg-[var(--bgTertiary)] text-[var(--contentMain)] hover:bg-[var(--bgSecondary)]'
              }`}
              onClick={() => setActiveTab('solid')}
            >
              Solid
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'regular'
                  ? 'bg-[var(--primaryBlue)] text-white'
                  : 'bg-[var(--bgTertiary)] text-[var(--contentMain)] hover:bg-[var(--bgSecondary)]'
              }`}
              onClick={() => setActiveTab('regular')}
            >
              Regular
            </button>
          </div>

          {/* 검색 입력 */}
          <div className="mb-6">
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-[var(--borderInput)] focus:outline-none focus:border-[var(--primaryBlue)]"
              placeholder="아이콘 이름으로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* 검색 결과 통계 */}
          <div className="mb-4 text-sm text-[var(--contentCaption)]">
            {activeTab === 'solid' ? 'Solid' : 'Regular'} 스타일에서 총 {filteredIcons.length}개의 아이콘을 찾았습니다.
          </div>

          {/* 아이콘 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredIcons.map(({ name, icon }) => (
              <div
                key={name}
                className="p-4 border border-[var(--borderOutline)] rounded-lg hover:border-[var(--primaryBlue)] transition-colors cursor-pointer"
                onClick={() => copyToClipboard(name)}
              >
                <div className="flex flex-col items-center gap-2">
                  <FontAwesomeIcon icon={icon} className="w-8 h-8 text-[var(--contentMain)]" />
                  <div className="text-xs text-center">
                    <div className="font-medium text-[var(--contentMain)] truncate" title={name}>
                      {name}
                    </div>
                    <div className="text-[var(--contentCaption)]">
                      {copied === name ? '복사됨!' : '클릭하여 복사'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 아이콘이 없을 경우 */}
          {filteredIcons.length === 0 && (
            <div className="text-center py-8 text-[var(--contentCaption)]">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 