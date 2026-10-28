'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { FaArrowLeft, FaRecycle, FaLeaf, FaSkull, FaTrash, FaStar, FaTrophy } from 'react-icons/fa';

const WASTE_CATEGORIES = {
  recyclable: {
    name: 'Tái chế',
    icon: <FaRecycle className="text-blue-500" size={24} />,
    color: 'blue',
    bgColor: 'bg-sky-wash',
    borderColor: 'border-blue-300'
  },
  organic: {
    name: 'Hữu cơ',
    icon: <FaLeaf className="text-green-500" size={24} />,
    color: 'green',
    bgColor: 'bg-brand-wash',
    borderColor: 'border-brand'
  },
  hazardous: {
    name: 'Nguy hại',
    icon: <FaSkull className="text-red-500" size={24} />,
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300'
  },
  general: {
    name: 'Rác thải thông thường',
    icon: <FaTrash className="text-ink-faint" size={24} />,
    color: 'gray',
    bgColor: 'bg-canvas',
    borderColor: 'border-line'
  }
};

const WASTE_ITEMS = [
  { id: 1, name: 'Chai nhựa', emoji: '🍾', category: 'recyclable' },
  { id: 2, name: 'Vỏ chuối', emoji: '🍌', category: 'organic' },
  { id: 3, name: 'Pin', emoji: '🔋', category: 'hazardous' },
  { id: 4, name: 'Giấy báo', emoji: '📰', category: 'recyclable' },
  { id: 5, name: 'Vỏ trứng', emoji: '🥚', category: 'organic' },
  { id: 6, name: 'Bóng đèn', emoji: '💡', category: 'hazardous' },
  { id: 7, name: 'Hộp carton', emoji: '📦', category: 'recyclable' },
  { id: 8, name: 'Lá cây', emoji: '🍂', category: 'organic' },
  { id: 9, name: 'Thuốc trừ sâu', emoji: '🧪', category: 'hazardous' },
  { id: 10, name: 'Túi nilon', emoji: '🛍️', category: 'general' },
  { id: 11, name: 'Lon nhôm', emoji: '🥫', category: 'recyclable' },
  { id: 12, name: 'Thức ăn thừa', emoji: '🍱', category: 'organic' },
  { id: 13, name: 'Khẩu trang y tế', emoji: '😷', category: 'hazardous' },
  { id: 14, name: 'Bao bì', emoji: '📄', category: 'general' },
  { id: 15, name: 'Chai thủy tinh', emoji: '🍶', category: 'recyclable' }
];

const WasteSortingGame = ({ onComplete, onBack }) => {
  const { points, setPoints, user } = useAppContext();
  const userId = user?.id || 'guest';

  const [currentItems, setCurrentItems] = useState([]);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctSorts, setCorrectSorts] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [level, setLevel] = useState(1);
  const [itemsPerRound] = useState(5);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Danh sách món rác lấy từ database để quản trị viên tự thêm/sửa được.
  // Mảng WASTE_ITEMS cắm cứng bên trên chỉ còn là phương án dự phòng khi
  // chưa gọi được API.
  const [wasteItems, setWasteItems] = useState(WASTE_ITEMS);

  useEffect(() => {
    let huy = false;

    fetch('/api/noi-dung-tro-choi')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (huy || !d?.wasteItems?.length) return;
        setWasteItems(d.wasteItems);
        // Bốc lại lượt chơi ngay bằng danh sách vừa tải, nếu không người
        // chơi sẽ thấy lượt đầu dựng từ dữ liệu dự phòng.
        setCurrentItems([...d.wasteItems].sort(() => Math.random() - 0.5).slice(0, itemsPerRound));
      })
      .catch((err) => console.warn('Không tải được danh sách món rác:', err));

    return () => { huy = true; };
  }, [itemsPerRound]);

  // Load saved game
  useEffect(() => {
    const savedGame = localStorage.getItem(`waste_game_${userId}`);
    if (savedGame) {
      const data = JSON.parse(savedGame);
      setScore(data.score || 0);
      setCorrectSorts(data.correctSorts || 0);
      setTotalAttempts(data.totalAttempts || 0);
      setLevel(data.level || 1);
      setBestStreak(data.bestStreak || 0);
    }
    generateNewRound();
  }, [userId]);

  // Save game
  const saveGame = () => {
    const gameData = {
      score,
      correctSorts,
      totalAttempts,
      level,
      bestStreak,
      lastPlayed: new Date().toISOString()
    };
    localStorage.setItem(`waste_game_${userId}`, JSON.stringify(gameData));
  };

  // Auto-save every 5 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => saveGame(), 5000);
    return () => clearInterval(saveInterval);
  }, [score, correctSorts, totalAttempts, level, bestStreak]);

  const generateNewRound = () => {
    const shuffled = [...wasteItems].sort(() => Math.random() - 0.5);
    setCurrentItems(shuffled.slice(0, itemsPerRound));
    setFeedback(null);
  };

  const handleSort = (item, selectedCategory) => {
    const isCorrect = item.category === selectedCategory;
    const newTotalAttempts = totalAttempts + 1;
    setTotalAttempts(newTotalAttempts);

    if (isCorrect) {
      const pointsEarned = 2 * level; // More points at higher levels
      const newScore = score + pointsEarned;
      const newCorrectSorts = correctSorts + 1;
      const newStreak = streak + 1;

      setScore(newScore);
      setCorrectSorts(newCorrectSorts);
      setStreak(newStreak);

      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }

      // Award green points
      setPoints(prev => ({
        ...prev,
        total: prev.total + pointsEarned,
        today: prev.today + pointsEarned
      }));

      setFeedback({
        type: 'success',
        message: `Chính xác! +${pointsEarned} điểm`,
        item: item.name
      });

      // Remove sorted item
      setCurrentItems(prev => prev.filter(i => i.id !== item.id));

      // Check if round complete
      if (currentItems.length === 1) {
        setTimeout(() => {
          // Level up every 10 correct sorts
          if (newCorrectSorts % 10 === 0 && newCorrectSorts > 0) {
            setLevel(prev => prev + 1);
            setFeedback({
              type: 'levelup',
              message: `Lên cấp ${level + 1}! 🎉`
            });
            setTimeout(() => generateNewRound(), 2000);
          } else {
            generateNewRound();
          }
        }, 1000);
      }
    } else {
      setStreak(0);
      setFeedback({
        type: 'error',
        message: `Sai rồi! ${item.name} thuộc loại ${WASTE_CATEGORIES[item.category].name}`,
        item: item.name
      });

      // Remove item anyway to keep game flowing
      setCurrentItems(prev => prev.filter(i => i.id !== item.id));

      if (currentItems.length === 1) {
        setTimeout(() => generateNewRound(), 2000);
      }
    }

    saveGame();
  };

  const accuracy = totalAttempts > 0 ? Math.round((correctSorts / totalAttempts) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-ink-soft hover:text-ink transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Quay lại
        </button>
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
            Cấp {level}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-paper p-4 rounded-card border border-line">
          <div className="flex items-center text-xs text-ink-faint mb-1">
            <FaStar className="text-yellow-500 mr-1" size={12} />
            Điểm
          </div>
          <div className="text-2xl font-bold text-ink">{score}</div>
        </div>

        <div className="bg-paper p-4 rounded-card border border-line">
          <div className="text-xs text-ink-faint mb-1">Độ chính xác</div>
          <div className="text-2xl font-bold text-brand">{accuracy}%</div>
        </div>

        <div className="bg-paper p-4 rounded-card border border-line">
          <div className="flex items-center text-xs text-ink-faint mb-1">
            <FaTrophy className="text-orange-500 mr-1" size={12} />
            Chuỗi hiện tại
          </div>
          <div className="text-2xl font-bold text-orange-600">{streak}</div>
        </div>

        <div className="bg-paper p-4 rounded-card border border-line">
          <div className="text-xs text-ink-faint mb-1">Kỷ lục</div>
          <div className="text-2xl font-bold text-purple-600">{bestStreak}</div>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`p-4 rounded-xl ${
          feedback.type === 'success' ? 'bg-brand-wash border border-green-200 text-brand' :
          feedback.type === 'levelup' ? 'bg-purple-50 border border-purple-200 text-purple-700' : 'bg-red-50 border border-red-200 text-red-700'
        } animate-pulse`}>
          <p className="font-medium text-center">{feedback.message}</p>
        </div>
      )}

      {/* Current Item */}
      {currentItems.length > 0 && (
        <div className="bg-paper p-8 rounded-card border border-line">
          <div className="text-center mb-8">
            <p className="text-sm text-ink-faint mb-4">Hãy phân loại rác thải này:</p>
            <div className="text-7xl mb-4">{currentItems[0].emoji}</div>
            <h3 className="text-2xl font-bold text-ink">{currentItems[0].name}</h3>
            <p className="text-sm text-ink-faint mt-2">Còn {currentItems.length} vật phẩm trong vòng này</p>
          </div>

          {/* Category Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(WASTE_CATEGORIES).map(([key, category]) => (
              <button
                key={key}
                onClick={() => handleSort(currentItems[0], key)}
                className={`${category.bgColor} ${category.borderColor} border-2 p-6 rounded-xl  transition-all transform hover:scale-105 active:scale-95`}
              >
                <div className="flex flex-col items-center gap-2">
                  {category.icon}
                  <span className={`font-medium text-${category.color}-700 text-sm text-center`}>
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-sky-wash border border-line rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2 text-sm">Hướng dẫn:</h4>
        <ul className="text-xs text-sky space-y-1">
          <li>• <strong>Tái chế:</strong> Nhựa, giấy, kim loại, thủy tinh</li>
          <li>• <strong>Hữu cơ:</strong> Thức ăn thừa, vỏ trái cây, lá cây</li>
          <li>• <strong>Nguy hại:</strong> Pin, bóng đèn, hóa chất, khẩu trang y tế</li>
          <li>• <strong>Thông thường:</strong> Túi nilon, bao bì không tái chế</li>
          <li>• Mỗi lần phân loại đúng: +{2 * level} điểm xanh</li>
          <li>• Cứ 10 lần đúng sẽ lên cấp và nhận nhiều điểm hơn!</li>
        </ul>
      </div>
    </div>
  );
};

export default WasteSortingGame;
