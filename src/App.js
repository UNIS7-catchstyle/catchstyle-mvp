import { useState } from 'react';
import './App.css';

const popularNames = ['카라나', '카라나', '카라나', '카라나', '카라나'];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThanksOpen, setIsThanksOpen] = useState(false);

  return (
    <div className="app-root">
      <main className="hero-section" data-node-id="228:256">
        <div className="brand" data-node-id="228:257">Catchstyle</div>
        <h1 className="headline" data-node-id="228:258">
          그때 그 착장, 연예인이 입은 옷 정보 찾느라 헤맨 적 있나요?
        </h1>
        <div className="hero-bullet" aria-hidden="true">
          •
        </div>
        <div className="hero-copy">
          <p>인스타그램, X 더 이상 헤매지 마세요</p>
          <p>날짜별 셀럽 착장 정보부터, 구매까지 한 곳에 모았습니다</p>
          <p>가장 정확한 착장 아카이브 서비스가 곧 시작됩니다</p>
        </div>
        <div className="hero-down-indicator" aria-hidden="true">
          <span />
          <span />
        </div>
      </main>

      <section className="query-section">
        <h2>어떤 연예인의 착장 정보가 가장 궁금하신가요?</h2>
        <p className="subtitle">서비스에 정보를 먼저 등록해 드릴게요</p>

        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <input
            className="search-input"
            type="text"
            placeholder="예) 에스파 카리나"
            aria-label="연예인 정보 검색"
          />
          <button type="button" className="search-button" onClick={() => setIsModalOpen(true)}>
            확인
          </button>
        </form>

        <article className="popular-card">
          <div className="popular-card-header">
            <h3>다른 사람들이 궁금해하는 연예인이에요</h3>
            <span>오늘 11:45기준</span>
          </div>
          <ol className="popular-list">
            {popularNames.map((name, index) => (
              <li key={index}>
                <span className="rank">{index + 1}</span>
                <span className="name">{name}</span>
                <span className="trend" aria-label="up">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8L6 14H18L12 8Z" fill="currentColor" />
                  </svg>
                </span>
              </li>
            ))}
          </ol>
        </article>
      </section>

      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setIsModalOpen(false)} aria-label="모달 닫기">
              ×
            </button>
            <h3 id="modal-title" className="modal-title">
              신청 완료! 서비스가 출시되면 가장 먼저 알려드릴게요.
            </h3>
            <input
              className="modal-input"
              type="text"
              placeholder="010-0000-0000"
              aria-label="휴대폰 번호 입력"
            />
            <p className="modal-note">
              * 입력하신 정보는 출시 알림 외에 사용되지 않으며, 발송 직후 즉시 폐기됩니다.
            </p>
            <button
              className="modal-action"
              onClick={() => {
                setIsModalOpen(false);
                setIsThanksOpen(true);
              }}
            >
              출시 알림 받기
            </button>
          </div>
        </div>
      )}

      {isThanksOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="thanks-title">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setIsThanksOpen(false)} aria-label="모달 닫기">
              ×
            </button>
            <h3 id="thanks-title" className="thanks-title">
              감사합니다
            </h3>
            <p className="thanks-message">
              손민수를 좋아하는 친구가 있다면 링크를 공유해 주세요
            </p>
            <div className="thanks-actions">
              <button className="thanks-button outline" onClick={() => setIsThanksOpen(false)}>
                확인
              </button>
              <button className="thanks-button solid" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                링크 복사
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
