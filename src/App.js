import { useEffect, useState } from 'react';
import './App.css';

const popularNames = ['카리나', '카리나', '카리나', '카리나', '카리나'];
const imgHeroDownIndicator = "https://www.figma.com/api/mcp/asset/09156f0e-d1fb-4ba2-afae-eaac104386f5";
const imgCatchstyle = "https://www.figma.com/api/mcp/asset/1ff63f56-8a89-4a93-93a7-d5a47438afb3";

// 연예인 사진 배열
const celebrityImages = [
  require('./assets/celebrities/image 6740.png'),
  require('./assets/celebrities/image 6741.png'),
  require('./assets/celebrities/image 6742.png'),
  require('./assets/celebrities/image 6743.png'),
  require('./assets/celebrities/IMG_0588 2.png'),
  require('./assets/celebrities/IMG_0589 2.png'),
  require('./assets/celebrities/IMG_0590 2.png'),
  require('./assets/celebrities/IMG_0612 2.png'),
  require('./assets/celebrities/IMG_0613 2.png'),
  require('./assets/celebrities/IMG_7383 2.png'),
  require('./assets/celebrities/IMG_7384 3.png'),
  require('./assets/celebrities/KakaoTalk_Photo_2026-03-30-15-10-37 2.png'),
  require('./assets/celebrities/weverse_20260329222131_2914655965 2.png'),
  require('./assets/celebrities/weverse_20260330135959_1742692651 2.png'),
  require('./assets/celebrities/weverse_20260330143523_1363134248 2.png'),
];

// 랜덤 사진 선택 함수
const getRandomCelebrityImage = () => {
  return celebrityImages[Math.floor(Math.random() * celebrityImages.length)];
};

// 모바일 감지 함수
const isMobileDevice = () => {
  return window.matchMedia('(max-width: 720px)').matches;
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://catchstyle-mvp-be.onrender.com';
const SEARCH_PATH = '/api/v1/search';
const RANKINGS_PATH = '/api/v1/rankings';
const NOTIFY_PATH = '/api/v1/notifications';
const SESSION_STORAGE_KEY = 'catchstyle-session-id';

const getSessionId = () => {
  const existingId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (existingId) {
    return existingId;
  }

  const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  localStorage.setItem(SESSION_STORAGE_KEY, newId);
  return newId;
};

function App() {
  const [inputValue, setInputValue] = useState('');
  const [phone, setPhone] = useState('');
  const [savedResult, setSavedResult] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThanksOpen, setIsThanksOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');

  const apiFetch = async (url, options = {}) => {
    if (!API_BASE_URL) {
      throw new Error('백엔드 API 주소가 설정되지 않았습니다.');
    }

    const sessionId = getSessionId();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'X-Session-Id': sessionId,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 요청 실패: ${response.status} ${errorText || response.statusText}`);
    }
    return response.json();
  };

  useEffect(() => {
    // 모바일에서만 랜덤 이미지 설정
    if (isMobileDevice()) {
      setBackgroundImage(getRandomCelebrityImage());
    }
  }, []);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const data = await apiFetch(RANKINGS_PATH, { method: 'GET' });
        setRankings(Array.isArray(data?.rankings) ? data.rankings : []);
      } catch (error) {
        console.warn('인기 순위 조회 실패:', error);
      }
    };

    fetchRankings();
  }, []);

  const handleSubmitData = async (event) => {
    event?.preventDefault();
    setErrorMessage('');
    setStatusMessage('');
    setSavedResult(null);

    if (!inputValue.trim()) {
      setErrorMessage('입력값을 입력해주세요.');
      return;
    }

    if (!API_BASE_URL) {
      setStatusMessage('백엔드 주소가 설정되지 않아 데이터를 저장할 수 없습니다.');
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch(SEARCH_PATH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: inputValue }),
      });
      setSavedResult(data);

      if (!data || (Array.isArray(data) ? data.length === 0 : Object.keys(data).length === 0)) {
        setStatusMessage('입력하신 데이터가 아직 등록되지 않았습니다. 출시 알림을 신청하시면 알려드릴게요.');
        setIsModalOpen(true);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotify = async () => {
    setErrorMessage('');

    if (!phone.trim()) {
      setErrorMessage('휴대폰 번호를 입력해주세요.');
      return;
    }

    if (!API_BASE_URL) {
      setErrorMessage('백엔드 주소가 설정되지 않았습니다.');
      return;
    }

    setIsLoading(true);
    try {
      await apiFetch(NOTIFY_PATH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, query: inputValue }),
      });
      setIsModalOpen(false);
      setIsThanksOpen(true);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="app-root" 
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <main className="hero-section" data-node-id="228:256">
        <img alt="Catchstyle" className="brand" data-node-id="228:243" src={imgCatchstyle} />
        <h1 className="headline" data-node-id="228:258">
          <span>그때 그 착장,</span>
          <span className="headline-break"> 연예인이 입은 옷 정보</span>
          <span className="headline-break"> 찾느라 헤맨 적 있나요?</span>
        </h1>
        <div className="hero-bullet" aria-hidden="true">
          •
        </div>
        <div className="hero-copy">
          <p>인스타그램, X 더 이상 헤매지 마세요</p>
          <p>날짜별 셀럽 착장 정보부터, 구매까지 한 곳에 모았습니다</p>
          <p>가장 정확한 착장 아카이브 서비스가 곧 시작됩니다</p>
        </div>
        <div className="hero-down-indicator" aria-hidden="true" data-node-id="228:259">
          <img alt="" src={imgHeroDownIndicator} />
        </div>
      </main>

      <section className="query-section">
        <h2 className="query-title">
          어떤 연예인의 착장 정보가
          <span className="query-title-break"> 가장 궁금하신가요?</span>
        </h2>
        <p className="subtitle">서비스에 정보를 먼저 등록해 드릴게요</p>

        <form className="search-form" onSubmit={handleSubmitData}>
          <input
            className="search-input"
            type="text"
            placeholder="예) 에스파 카리나"
            aria-label="연예인 정보 등록"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="search-button">
            {isLoading ? '저장 중...' : '등록'}
          </button>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        {savedResult && (
          <article className="search-result">
            <h3>등록 결과</h3>
            <pre>{JSON.stringify(savedResult, null, 2)}</pre>
          </article>
        )}

        <article className="popular-card">
          <div className="popular-card-header">
            <h3>다른 사람들이 궁금해하는 연예인이에요</h3>
            <span>오늘 11:45기준</span>
          </div>
          <ol className="popular-list">
            {(rankings.length > 0 ? rankings : popularNames.map((name, index) => ({ rank: index + 1, keyword: name }))).map((item, index) => (
              <li key={index}>
                <span className="rank">{item.rank}</span>
                <span className="name">{item.keyword}</span>
                <span className="trend" aria-label="up">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8L6 14H18L12 8Z" fill="currentColor" />
                  </svg>
                </span>
                {item.searchCount != null && <span className="search-count">{item.searchCount.toLocaleString()}회</span>}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="modal-note">
              * 입력하신 정보는 출시 알림 외에 사용되지 않으며, 발송 직후 즉시 폐기됩니다.
            </p>
            <button className="modal-action" onClick={handleNotify}>
              {isLoading ? '전송 중...' : '출시 알림 받기'}
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