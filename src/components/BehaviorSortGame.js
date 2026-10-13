'use client';

import { useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaLeaf,
  FaExclamationTriangle,
  FaPaperPlane,
  FaRedo,
} from 'react-icons/fa';

const QUIZ_LENGTH = 5;
const POINT_PER_CORRECT = 2;

export default function BehaviorSortGame({ onBack }) {
  const { user, setUser } = useAppContext();
  const [tab, setTab] = useState('de'); // 'de' = AI ra đề | 'cham' = mình mô tả

  // ---------- Chế độ AI ra đề ----------
  const [question, setQuestion] = useState(null);
  const [asked, setAsked] = useState([]);
  const [picked, setPicked] = useState(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [loadingQ, setLoadingQ] = useState(false);
  const [finished, setFinished] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  // ---------- Chế độ mình mô tả ----------
  const [text, setText] = useState('');
  const [verdict, setVerdict] = useState(null);
  const [judging, setJudging] = useState(false);
  const [judgeError, setJudgeError] = useState('');

  const nextQuestion = useCallback(async () => {
    setLoadingQ(true);
    setPicked(null);
    try {
      const res = await fetch('/api/classify-behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'de', exclude: asked }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Không lấy được câu hỏi');
      setQuestion(data);
      setAsked((prev) => [...prev, data.text].slice(-10));
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoadingQ(false);
    }
  }, [asked]);

  const startQuiz = async () => {
    setRound(0);
    setScore(0);
    setAsked([]);
    setFinished(false);
    setClaimed(false);
    setPicked(null);
    await nextQuestion();
  };

  const answer = (choice) => {
    if (picked || !question) return;
    setPicked(choice);
    if (choice === question.label) setScore((s) => s + 1);
  };

  const goNext = async () => {
    const done = round + 1;
    setRound(done);
    if (done >= QUIZ_LENGTH) {
      setFinished(true);
    } else {
      await nextQuestion();
    }
  };

  // Cộng điểm qua API dùng chung với các game khác
  const awardPoints = async (points, data) => {
    if (!user?.id || points <= 0) return;
    const res = await fetch('/api/game-progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        gameType: 'behavior-sort',
        pointsEarned: points,
        data,
      }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Không cộng được điểm');
    if (typeof result.points === 'number') {
      setUser((prev) => ({ ...prev, points: result.points }));
    }
  };

  const claimQuizPoints = async () => {
    if (claiming || claimed) return;
    const earned = score * POINT_PER_CORRECT;
    setClaiming(true);
    try {
      await awardPoints(earned, {
        mode: 'de',
        score,
        total: QUIZ_LENGTH,
        at: new Date().toISOString(),
      });
      setClaimed(true);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setClaiming(false);
    }
  };

  const judge = async (e) => {
    e.preventDefault();
    if (judging || text.trim().length < 5) return;

    setJudging(true);
    setJudgeError('');
    setVerdict(null);

    try {
      const res = await fetch('/api/classify-behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'cham', text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Không chấm được');

      setVerdict(data);

      if (data.points > 0) {
        await awardPoints(data.points, {
          mode: 'cham',
          text: text.slice(0, 200),
          label: data.label,
          at: new Date().toISOString(),
        });
      }
      setText('');
    } catch (err) {
      console.error(err);
      setJudgeError(err.message);
    } finally {
      setJudging(false);
    }
  };

  const TONE = {
    tot: { chip: 'bg-brand-wash text-brand', icon: FaLeaf, label: 'Tốt cho môi trường' },
    xau: { chip: 'bg-coral-wash text-coral', icon: FaExclamationTriangle, label: 'Có hại cho môi trường' },
    trungtinh: { chip: 'bg-canvas text-ink-soft', icon: FaLeaf, label: 'Không liên quan môi trường' },
  };

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-brand font-bold hover:underline"
      >
        <FaArrowLeft size={13} />
        Quay lại danh sách trò chơi
      </button>

      <header>
        <h1 className="text-2xl sm:text-3xl text-ink">Phân loại hành vi</h1>
        <p className="text-ink-soft mt-1">
          Nhận biết đâu là hành vi tốt, đâu là hành vi có hại với môi trường.
        </p>
      </header>

      {/* Chuyển chế độ */}
      <div className="flex gap-2">
        {[
          ['de', 'Luyện tập'],
          ['cham', 'Ghi nhận việc của bạn'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-pill font-bold text-sm border-[1.5px] transition-colors ${
              tab === key
                ? 'bg-brand text-white border-brand'
                : 'bg-paper text-ink-soft border-line hover:border-brand hover:text-brand'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ---------------- Chế độ 1: AI ra đề ---------------- */}
      {tab === 'de' && (
        <section className="sx-card p-5 sm:p-6">
          {!question && !finished ? (
            <div className="text-center py-8">
              <p className="text-5xl mb-4">🧠</p>
              <h2 className="text-xl text-ink mb-2">{QUIZ_LENGTH} câu, mỗi câu đúng +{POINT_PER_CORRECT} điểm</h2>
              <p className="text-ink-soft mb-6">
                Máy sẽ đưa ra một hành vi, bạn chọn xem nó tốt hay có hại cho môi trường.
              </p>
              <button onClick={startQuiz} disabled={loadingQ} className="sx-btn sx-btn-primary">
                {loadingQ ? 'Đang chuẩn bị...' : 'Bắt đầu'}
              </button>
            </div>
          ) : finished ? (
            <div className="text-center py-8">
              <p className="text-5xl mb-4">{score >= 4 ? '🎉' : score >= 2 ? '👍' : '💪'}</p>
              <h2 className="text-xl text-ink mb-1">
                Đúng {score}/{QUIZ_LENGTH} câu
              </h2>
              <p className="sx-figure text-4xl text-brand my-3">
                +{score * POINT_PER_CORRECT}
                <span className="text-sm font-semibold text-ink-faint ml-1 tracking-normal">điểm</span>
              </p>

              <div className="flex gap-2 justify-center flex-wrap mt-5">
                {score > 0 && !claimed && (
                  <button onClick={claimQuizPoints} disabled={claiming} className="sx-btn sx-btn-sun">
                    {claiming ? 'Đang lưu...' : 'Nhận điểm'}
                  </button>
                )}
                {claimed && (
                  <span className="sx-chip bg-brand-wash text-brand py-2.5 px-4">
                    <FaCheck size={11} /> Đã cộng vào tài khoản
                  </span>
                )}
                <button onClick={startQuiz} className="sx-btn sx-btn-outline">
                  <FaRedo size={12} /> Chơi lại
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="sx-chip bg-canvas text-ink-soft">
                  Câu {round + 1}/{QUIZ_LENGTH}
                </span>
                <span className="sx-chip bg-brand-wash text-brand">Đúng: {score}</span>
              </div>

              <p className="text-lg sm:text-xl font-bold text-ink text-center py-8 px-2 leading-snug">
                {loadingQ ? 'Đang nghĩ câu hỏi...' : question?.text}
              </p>

              {!picked ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => answer('tot')}
                    disabled={loadingQ}
                    className="sx-btn w-full py-4 bg-brand-wash text-brand border-[1.5px] border-brand disabled:opacity-40"
                  >
                    <FaLeaf size={14} /> Tốt
                  </button>
                  <button
                    onClick={() => answer('xau')}
                    disabled={loadingQ}
                    className="sx-btn w-full py-4 bg-coral-wash text-coral border-[1.5px] border-coral disabled:opacity-40"
                  >
                    <FaExclamationTriangle size={14} /> Có hại
                  </button>
                </div>
              ) : (
                <div>
                  <div
                    className={`rounded-xl p-4 border-[1.5px] ${
                      picked === question.label
                        ? 'bg-brand-wash border-brand'
                        : 'bg-coral-wash border-coral'
                    }`}
                  >
                    <p
                      className={`flex items-center gap-2 font-extrabold mb-1.5 ${
                        picked === question.label ? 'text-brand' : 'text-coral'
                      }`}
                    >
                      {picked === question.label ? <FaCheck size={13} /> : <FaTimes size={13} />}
                      {picked === question.label
                        ? 'Chính xác!'
                        : `Chưa đúng — đây là hành vi ${question.label === 'tot' ? 'tốt' : 'có hại'}`}
                    </p>
                    <p className="text-sm text-ink-soft leading-relaxed">{question.explain}</p>
                  </div>

                  <button onClick={goNext} className="sx-btn sx-btn-primary w-full mt-4">
                    {round + 1 >= QUIZ_LENGTH ? 'Xem kết quả' : 'Câu tiếp theo'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* ---------------- Chế độ 2: mình mô tả, AI chấm ---------------- */}
      {tab === 'cham' && (
        <section className="sx-card p-5 sm:p-6">
          <h2 className="text-lg text-ink mb-1">Bạn vừa làm việc gì?</h2>
          <p className="text-sm text-ink-soft mb-4">
            Kể lại một việc bạn vừa làm, máy sẽ cho biết nó tác động thế nào tới môi trường.
            Việc tốt được cộng điểm, việc chưa tốt thì không bị trừ — chỉ gợi ý cách làm khác.
          </p>

          <form onSubmit={judge} className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={300}
              rows={3}
              placeholder="Ví dụ: Hôm nay mình mang hộp cơm riêng đi học thay vì mua hộp xốp"
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-line bg-paper text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand transition-colors"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-ink-faint">{text.length}/300</span>
              <button
                type="submit"
                disabled={judging || text.trim().length < 5}
                className="sx-btn sx-btn-primary"
              >
                <FaPaperPlane size={12} />
                {judging ? 'Đang phân loại...' : 'Gửi'}
              </button>
            </div>
          </form>

          {judgeError && (
            <div className="mt-4 bg-coral-wash border border-coral/30 text-coral rounded-xl p-3 text-sm font-medium">
              {judgeError}
            </div>
          )}

          {verdict && (
            <div className="mt-5 rounded-xl border-[1.5px] border-line p-4 bg-canvas sx-enter">
              {(() => {
                const tone = TONE[verdict.label] || TONE.trungtinh;
                const Icon = tone.icon;
                return (
                  <>
                    <span className={`sx-chip ${tone.chip}`}>
                      <Icon size={11} /> {tone.label}
                    </span>
                    <p className="text-ink mt-3 leading-relaxed">{verdict.explain}</p>
                    {verdict.suggestion && (
                      <p className="text-sm text-ink-soft mt-2 leading-relaxed">
                        💡 {verdict.suggestion}
                      </p>
                    )}
                    {verdict.points > 0 && (
                      <p className="sx-figure text-2xl text-brand mt-3">
                        +{verdict.points}
                        <span className="text-xs font-semibold text-ink-faint ml-1 tracking-normal">
                          điểm đã cộng
                        </span>
                      </p>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
