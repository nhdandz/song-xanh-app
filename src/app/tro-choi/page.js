<<<<<<< HEAD
'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { FaGamepad, FaQuestionCircle, FaClock, FaTrophy, FaCheck, FaTimes, FaTree, FaRecycle, FaCity } from 'react-icons/fa';
import TreeGrowthGame from '@/components/TreeGrowthGame';
import WasteSortingGame from '@/components/WasteSortingGame';
import GreenCityGame from '@/components/GreenCityGame';

// Dữ liệu mẫu cho câu hỏi
const QUESTIONS = [
  {
    id: 1,
  question: 'Loại rác nào dưới đây mất thời gian phân hủy lâu nhất?',
  options: ['Vỏ chuối', 'Hộp giấy', 'Chai nhựa', 'Túi ni-lông'],
  correctAnswer: 3,
  explanation: `
      • Vỏ chuối: phân hủy rất nhanh, chỉ mất vài ngày đến vài tuần.
      • Hộp giấy: phân hủy trong vài tháng.
      • Chai nhựa: mất hàng trăm năm để phân hủy.
      • Túi ni-lông: có thể mất từ 500 đến 1.000 năm, thậm chí không phân hủy hoàn toàn, mà chỉ vỡ thành vi nhựa gây ô nhiễm lâu dài.
      👉 Vì vậy, Túi ni-lông là loại rác mất thời gian phân hủy lâu nhất.`
  },
  {
    id: 2,
    question: 'Khí nào là nguyên nhân chính gây ra hiệu ứng nhà kính trên Trái Đất?',
    options: [
      'CO2',
      'Ozone',
      'H2O',
      'Nitơ',
    ],
    correctAnswer: 0,
    explanation: `
      •	CO₂ là khí nhà kính chủ yếu do con người thải ra từ việc đốt nhiên liệu hóa thạch (than, dầu, khí đốt), phá rừng, sản xuất công nghiệp...
      •	Các khí nhà kính khác như CH₄ (mêtan), N₂O (nitơ oxit), và hơi nước (H₂O) cũng góp phần, nhưng CO₂ là nguyên nhân chính và ổn định lâu dài nhất trong khí quyển.
      •	Ozone (O₃) và Nitơ (N₂) không phải là nguyên nhân chính gây ra hiệu ứng nhà kính.`,
  },
  {
    id: 3,
    question: 'Lượng nước uống tối thiểu mà mỗi người trưởng thành cần cung cấp cho cơ thể một ngày là bao nhiêu?',
    options: [
      '0,5 lít',
      '1 lít',
      '1,5-2 lít',
      '3-4 lít',
    ],
    correctAnswer: 2,
    explanation: `Theo WHO, một người trưởng thành cần uống khoảng 1,5 đến 2 lít nước mỗi ngày (tương đương 6–8 ly) để duy trì hoạt động trao đổi chất, điều hòa thân nhiệt và loại bỏ chất thải.`,
  },
  {
    id: 4,
    question: 'Chất thải nào sau đây không nên xả vào bồn cầu để tránh gây tắc nghẽn và ô nhiễm môi trường?',
    options: [
      'Giấy vệ sinh',
      'Dầu ăn đã qua sử dụng',
      'Nước tiểu',
      'Nước thải tắm gội',
    ],
    correctAnswer: 1,
    explanation: `
      •	Dầu ăn cũ có thể đông đặc, bám vào thành ống thoát nước, gây tắc nghẽn đường ống và ô nhiễm nguồn nước.
      •	Giấy vệ sinh, nước tiểu và nước tắm gội đều có thể xả được vì chúng dễ phân hủy hoặc được xử lý trong hệ thống nước thải.`,
  },
  {
    id: 5,
    question: 'Loại năng lượng nào dưới đây là năng lượng tái tạo?',
    options: [
      'Than đá',
      'Dầu mỏ',
      'Năng lượng mặt trời',
      'Khí đốt tự nhiên',
    ],
    correctAnswer: 2,
    explanation: `
      •	Năng lượng mặt trời là nguồn năng lượng tái tạo, vì có thể khai thác liên tục và không cạn kiệt theo thời gian.
      •	Trong khi đó, than đá, dầu mỏ và khí đốt tự nhiên đều là nhiên liệu hóa thạch, hình thành trong hàng triệu năm và sẽ cạn kiệt nếu khai thác quá mức.`,
  },
  // bạn có thể thêm nhiều câu hơn ở đây
  {
    id: 6,
    question: 'Ký hiệu vòng đồi (Mobius loop) trên sản phẩm có nghĩa là gì?',
    options: [
      'Sản phẩm có thể được tái chế',
      'Sản phẩm có thể phân hủy nhanh',
      'Sản phẩm nguy hiểm, cần chú ý',
      'Sản phẩm dùng một lần',
    ],
    correctAnswer: 0,
    explanation: 'Mobius loop là ký hiệu biểu thị sản phẩm/hộp có thể đưa vào quy trình tái chế.',
  },
  {
    id: 7,
    question: 'Loại chất thải nào phù hợp nhất để ủ phân (compost)?',
    options: [
      'Vỏ rau củ, lá cây',
      'Thịt, dầu mỡ',
      'Nhựa, túi ni-lông',
      'Pin, ắc quy',
    ],
    correctAnswer: 0,
    explanation: 'Vỏ rau củ và lá cây là chất hữu cơ dễ phân hủy, phù hợp để ủ compost.',
  },
  {
    id: 8,
    question: 'Nguyên nhân chính dẫn đến phá rừng trên diện rộng là gì?',
    options: [
      'Mở rộng diện tích nông nghiệp và chăn nuôi',
      'Sự thay đổi khí hậu tự nhiên',
      'Sóng thần và động đất',
      'Du lịch',
    ],
    correctAnswer: 0,
    explanation: 'Mở rộng canh tác nông nghiệp và chăn nuôi là nguyên nhân phổ biến nhất gây mất rừng.',
  },
  {
    id: 9,
    question: 'Nguồn năng lượng nào dưới đây hầu như không tạo trực tiếp khí CO₂ khi phát điện?',
    options: [
      'Đốt than',
      'Khí tự nhiên',
      'Năng lượng gió',
      'Dầu mỏ',
    ],
    correctAnswer: 2,
    explanation: 'Tua-bin gió không đốt nhiên liệu nên không thải CO₂ trực tiếp khi phát điện.',
  },
  {
    id: 10,
    question: '“Bảo tồn đa dạng sinh học” nghĩa là gì?',
    options: [
      'Bảo vệ sự đa dạng về loài, hệ sinh thái và nguồn gen',
      'Tăng số lượng cây trồng thương mại',
      'Xây dựng nhiều khu công nghiệp hơn',
      'Chỉ bảo vệ các loài động vật to lớn',
    ],
    correctAnswer: 0,
    explanation: 'Bảo tồn đa dạng sinh học là bảo vệ nhiều dạng sống và hệ sinh thái khác nhau.',
  },
  {
    id: 11,
    question: 'Hành động nào sau đây giúp tiết kiệm nước trong sinh hoạt hàng ngày?',
    options: [
      'Tắt vòi khi đánh răng',
      'Rửa xe bằng vòi xả liên tục',
      'Tắm vòi phun liên tục 30 phút',
      'Rửa chén bằng vòi nước mở to',
    ],
    correctAnswer: 0,
    explanation: 'Tắt vòi khi đánh răng là một cách đơn giản nhưng hiệu quả để tiết kiệm nước.',
  },
  {
    id: 12,
    question: 'Khí nào sau đây có tiềm năng gây hiệu ứng nhà kính (GWP) lớn hơn CO₂ trên mỗi đơn vị khối lượng?',
    options: [
      'O₂ (oxy)',
      'CH₄ (methane)',
      'N₂ (nitơ)',
      'He (heli)',
    ],
    correctAnswer: 1,
    explanation: 'Methane (CH₄) có GWP lớn hơn CO₂ trên cùng khối lượng trong khoảng thời gian ngắn hạn.',
  },
  {
    id: 13,
    question: 'Khoảng thời gian để 1 lon nhôm phân hủy trong môi trường tự nhiên thường là bao lâu?',
    options: [
      '50 năm',
      '200 - 500 năm',
      '10 năm',
      '1 năm',
    ],
    correctAnswer: 1,
    explanation: 'Lon nhôm có thể tồn tại hàng trăm năm nếu không được tái chế.',
  },
  {
    id: 14,
    question: 'Biện pháp nào hiệu quả nhất để giảm rác nhựa dùng một lần khi đi mua sắm?',
    options: [
      'Mang theo túi vải/túi tái sử dụng',
      'Yêu cầu túi nhựa lớn hơn',
      'Mua nhiều hơn một loại sản phẩm',
      'Dùng bao nilon miễn phí ở cửa hàng',
    ],
    correctAnswer: 0,
    explanation: 'Mang túi vải/túi tái sử dụng giảm nhu cầu dùng túi nhựa mới mỗi lần mua sắm.',
  },
  {
    id: 15,
    question: 'Khái niệm “kinh tế tuần hoàn” (circular economy) nhấn mạnh điều gì?',
    options: [
      'Tăng tiêu dùng để phát triển kinh tế',
      'Giảm, tái sử dụng và tái chế để giữ nguyên giá trị tài nguyên',
      'Tập trung khai thác tài nguyên tự nhiên nhiều hơn',
      'Sử dụng càng nhiều đồ dùng một lần càng tốt',
    ],
    correctAnswer: 1,
    explanation: 'Kinh tế tuần hoàn hướng đến giảm rác thải bằng cách giữ tài nguyên trong sử dụng lâu hơn (reduce-reuse-recycle).',
  },
];

// Dữ liệu mẫu cho các trò chơi môi trường
const GAMES = [
  {
    id: 1,
    title: 'Câu đố môi trường',
    description: 'Trả lời các câu hỏi về môi trường và kiểm tra kiến thức của bạn',
    icon: <FaQuestionCircle className="text-green-500" size={24} />,
    points: 10,
    timeLimit: '2 phút',
    type: 'quiz',
  },
  {
    id: 2,
    title: 'Trồng cây',
    description: 'Hóa thân thành người làm vườn, chăm cây mỗi ngày để cây lớn lên và cùng lan tỏa lối sống xanh',
    icon: <FaTree className="text-green-500" size={24} />,
    points: 10,
    timeLimit: '3-5 phút',
    type: 'plant',
    comingSoon: false,
  },
  {
    id: 3,
    title: 'Phân loại rác thải',
    description: 'Phân loại các loại rác thải vào đúng thùng rác',
    icon: <FaRecycle className="text-blue-500" size={24} />,
    points: 15,
    timeLimit: '3 phút',
    type: 'sorting',
    comingSoon: false,
  },
  {
    id: 4,
    title: 'Xây dựng thành phố xanh',
    description: 'Xây dựng một thành phố thân thiện với môi trường',
    icon: <FaCity className="text-purple-500" size={24} />,
    points: 20,
    timeLimit: '5 phút',
    type: 'city',
    comingSoon: false,
  },
];

// hàm shuffle (Fisher–Yates) trả về mảng mới (không mutate input)
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Games() {
  const { points, setPoints, userId } = useAppContext();
  const [selectedGame, setSelectedGame] = useState(null);

  // bộ câu hỏi hiện tại (5 câu random)
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 phút
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [canPlayQuizToday, setCanPlayQuizToday] = useState(true);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  // Xử lý đếm ngược thời gian
  useEffect(() => {
    if (selectedGame && selectedGame.type === 'quiz' && !quizCompleted) {
      const timer = timeLeft > 0 && setInterval(() => setTimeLeft(prev => prev - 1), 1000);

      if (timeLeft === 0) {
        setQuizCompleted(true);
      }

      return () => clearInterval(timer);
    }
  }, [selectedGame, timeLeft, quizCompleted]);

  // Format thời gian từ giây sang phút:giây
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // tạo bộ quiz ngẫu nhiên gồm N câu (ở đây N=5)
  const buildRandomQuiz = (N = 5) => {
    const total = QUESTIONS.length;
    if (total <= N) {
      return shuffleArray(QUESTIONS); // shuffle toàn bộ nếu tổng <= N
    }
    const shuffled = shuffleArray(QUESTIONS);
    return shuffled.slice(0, N);
  };

  // Kiểm tra xem quiz đã chơi hôm nay chưa
  const checkQuizPlayedToday = async () => {
    if (!userId) return false;

    setIsLoadingQuiz(true);
    try {
      const response = await fetch(`/api/game-progress?userId=${userId}&gameType=quiz`);

      if (!response.ok) {
        return false;
      }

      const progress = await response.json();

      if (progress && progress.data) {
        const lastPlayDate = progress.data.lastPlayDate;

        if (lastPlayDate) {
          const today = new Date();
          const last = new Date(lastPlayDate);

          today.setHours(0, 0, 0, 0);
          last.setHours(0, 0, 0, 0);

          // Nếu cùng ngày
          if (today.getTime() === last.getTime()) {
            return true; // Đã chơi hôm nay
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking quiz status:', error);
      return false;
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  // Xử lý chọn trò chơi
  const handleGameSelect = async (game) => {
    if (game.comingSoon) return;

    setSelectedGame(game);

    if (game.type === 'quiz') {
      // Kiểm tra xem đã chơi hôm nay chưa
      const hasPlayedToday = await checkQuizPlayedToday();

      if (hasPlayedToday) {
        setCanPlayQuizToday(false);
        setQuizCompleted(true);
        return;
      }

      // tạo bộ câu hỏi ngẫu nhiên 5 câu
      const picked = buildRandomQuiz(5);
      setQuizQuestions(picked);
      setCurrentQuestion(0);
      setScore(0);
      setTimeLeft(120);
      setQuizCompleted(false);
      setCanPlayQuizToday(true);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  // Xử lý chọn câu trả lời
  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const currentQ = quizQuestions[currentQuestion];
    if (!currentQ) return;

    // Kiểm tra câu trả lời
    if (answerIndex === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  // Xử lý chuyển câu hỏi tiếp theo
  const handleNextQuestion = async () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);

      // Thưởng điểm khi hoàn thành câu đố
      const earnedPoints = Math.round((score / quizQuestions.length) * (selectedGame?.points || 0));

      if (earnedPoints > 0 && userId) {
        try {
          const playDate = new Date().toISOString();

          // Lưu điểm vào database
          const response = await fetch('/api/game-progress', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              gameType: 'quiz',
              pointsEarned: earnedPoints,
              data: {
                score,
                totalQuestions: quizQuestions.length,
                percentage: Math.round((score / quizQuestions.length) * 100),
                lastPlayDate: playDate,
              },
            }),
          });

          const data = await response.json();

          if (response.ok) {
            // Cập nhật điểm trong context
            setPoints(prev => ({
              ...prev,
              total: data.points
            }));

            // Đánh dấu đã chơi hôm nay
            setCanPlayQuizToday(false);
          }
        } catch (error) {
          console.error('Error saving quiz result:', error);
          // Vẫn cộng điểm local nếu lỗi
          setPoints(prev => ({
            ...prev,
            total: (prev.total || 0) + earnedPoints
          }));
        }
      }
    }
  };

  // Xử lý quay lại danh sách trò chơi
  const handleBackToGames = () => {
    setSelectedGame(null);
    setQuizCompleted(false);
  };

  // Render màn hình danh sách trò chơi
  const renderGamesList = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Trò chơi môi trường
        </h1>
        <p className="text-gray-600 mt-1">
          Vừa học vừa chơi, vừa tích điểm
        </p>
      </div>

      <div className="space-y-4">
        {GAMES.map(game => (
          <div
            key={game.id}
            className={`p-4 rounded-lg shadow-md border ${game.comingSoon ? 'bg-gray-50 border-gray-200' : 'bg-white border-green-100'}`}
            onClick={() => handleGameSelect(game)}
          >
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-gray-100 mr-3">
                {game.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className={`font-bold ${game.comingSoon ? 'text-gray-600' : 'text-green-800'}`}>
                    {game.title}
                  </h2>

                  {game.comingSoon && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Sắp ra mắt
                    </span>
                  )}
                </div>

                <p className={`text-sm mt-1 ${game.comingSoon ? 'text-gray-500' : 'text-gray-600'}`}>
                  {game.description}
                </p>

                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <div className="flex items-center mr-3">
                    <FaClock className="mr-1" />
                    <span>{game.timeLimit}</span>
                  </div>
                  <div className="flex items-center">
                    <FaTrophy className="mr-1 text-yellow-500" />
                    <span>+{game.points} điểm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2">Lợi ích từ trò chơi</h3>
        <ul className="text-sm text-blue-700 space-y-1 pl-5 list-disc">
          <li>Học thêm kiến thức về môi trường</li>
          <li>Giải trí lành mạnh</li>
          <li>Nhận thêm điểm xanh</li>
          <li>Thử thách bản thân</li>
        </ul>
      </div>
    </div>
  );

  // Render màn hình câu đố
  const renderQuiz = () => {
    const currentQ = quizQuestions[currentQuestion];

    if (!currentQ) return <div>Đang chuẩn bị câu hỏi...</div>;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleBackToGames}
            className="text-gray-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Quay lại
          </button>

          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
            <FaClock className="mr-1" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <div className="text-gray-600">
            {currentQuestion + 1}/{quizQuestions.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-bold text-green-800 text-lg mb-4">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-3 rounded-lg border text-left ${
                  selectedAnswer === index
                    ? isAnswered
                      ? index === currentQ.correctAnswer
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : 'bg-red-100 border-red-500 text-red-800'
                      : 'bg-blue-100 border-blue-500 text-blue-800'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                disabled={isAnswered}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? isAnswered
                        ? index === currentQ.correctAnswer
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {selectedAnswer === index && isAnswered ? (
                      index === currentQ.correctAnswer ? <FaCheck size={12} /> : <FaTimes size={12} />
                    ) : (
                      <span className="text-xs">{String.fromCharCode(65 + index)}</span>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {isAnswered && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-1">Giải thích:</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">{currentQ.explanation}</p>
            </div>
          )}
        </div>

        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            {currentQuestion < quizQuestions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
          </button>
        )}
      </div>
    );
  };

  // Render màn hình kết quả câu đố
  const renderQuizResult = () => {
    const earnedPoints = Math.round((score / quizQuestions.length) * (selectedGame?.points || 0));
    const percentage = Math.round((score / quizQuestions.length) * 100);

    // Nếu đã chơi hôm nay rồi
    if (!canPlayQuizToday) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-800 mb-2">
              Câu đố môi trường
            </h1>
            <p className="text-gray-600">
              Kết quả của bạn
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mb-4">
              <div className="inline-block p-4 rounded-full bg-green-100">
                <FaTrophy className="text-yellow-500 text-4xl" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-green-800 mb-2">
              {percentage}%
            </h2>

            <p className="text-gray-600 mb-4">
              Bạn đã trả lời đúng {score}/{quizQuestions.length} câu hỏi
            </p>

            <div className="p-3 bg-green-50 rounded-lg text-green-800 mb-4">
              <p className="font-semibold">
                +{earnedPoints} điểm xanh
              </p>
            </div>

            <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 mb-4">
              <p className="text-sm text-amber-800">
                🎯 Bạn đã hoàn thành câu đố hôm nay! Hãy quay lại vào ngày mai để chơi tiếp nhé.
              </p>
            </div>

            <button
              onClick={handleBackToGames}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Quay lại danh sách trò chơi
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Kết quả câu đố
          </h1>
          <p className="text-gray-600">
            Bạn đã hoàn thành trò chơi!
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="mb-4">
            <div className="inline-block p-4 rounded-full bg-green-100">
              <FaTrophy className="text-yellow-500 text-4xl" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-green-800 mb-2">
            {percentage}%
          </h2>

          <p className="text-gray-600 mb-4">
            Bạn trả lời đúng {score}/{quizQuestions.length} câu hỏi
          </p>

          <div className="p-3 bg-green-50 rounded-lg text-green-800 mb-4">
            <p className="font-semibold">
              +{earnedPoints} điểm xanh
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleBackToGames}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Quay lại danh sách trò chơi
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Xử lý hoàn thành game trồng cây
  const handleTreeGameComplete = (earnedPoints) => {
    // Thưởng điểm
    setPoints(prev => ({
      ...prev,
      total: (prev.total || 0) + earnedPoints
    }));
  };

  // Render trò chơi theo loại
  const renderGame = () => {
    if (!selectedGame) return renderGamesList();

    if (selectedGame.type === 'quiz') {
      if (quizCompleted) {
        return renderQuizResult();
      } else {
        return renderQuiz();
      }
    }

    if (selectedGame.type === 'plant') {
      return (
        <TreeGrowthGame
          onComplete={handleTreeGameComplete}
          onBack={handleBackToGames}
        />
      );
    }

    if (selectedGame.type === 'sorting') {
      return (
        <WasteSortingGame
          onComplete={handleTreeGameComplete}
          onBack={handleBackToGames}
        />
      );
    }

    if (selectedGame.type === 'city') {
      return (
        <GreenCityGame
          onComplete={handleTreeGameComplete}
          onBack={handleBackToGames}
        />
      );
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      {renderGame()}
    </div>
  );
}

=======
'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { FaGamepad, FaQuestionCircle, FaClock, FaTrophy, FaCheck, FaTimes } from 'react-icons/fa';

// Dữ liệu mẫu cho câu hỏi
const QUESTIONS = [
  {
    id: 1,
    question: 'Loại rác nào dưới đây mất thời gian phân hủy lâu nhất?',
    options: [
      'Vỏ chuối',
      'Hộp giấy',
      'Chai nhựa',
      'Túi ni-lông',
    ],
    correctAnswer: 3,
    explanation: 'Túi ni-lông có thể mất tới 500-1000 năm để phân hủy hoàn toàn trong tự nhiên.',
  },
  {
    id: 2,
    question: 'Nguyên nhân chính gây ra hiệu ứng nhà kính là gì?',
    options: [
      'CO2',
      'Ozone',
      'H2O',
      'Nitơ',
    ],
    correctAnswer: 0,
    explanation: 'CO2 (khí cacbonic) là một trong những khí nhà kính chính, được thải ra từ việc đốt nhiên liệu hóa thạch.',
  },
  {
    id: 3,
    question: 'Lượng nước uống tối thiểu mỗi người cần mỗi ngày là bao nhiêu?',
    options: [
      '1 lít',
      '2 lít',
      '3 lít',
      '4 lít',
    ],
    correctAnswer: 1,
    explanation: 'Theo WHO, một người trưởng thành cần uống khoảng 2 lít nước mỗi ngày để duy trì sức khỏe tốt.',
  },
  {
    id: 4,
    question: 'Chất thải nào không nên được xả vào bồn cầu?',
    options: [
      'Giấy vệ sinh',
      'Dầu ăn đã qua sử dụng',
      'Nước tiểu',
      'Nước thải tắm gội',
    ],
    correctAnswer: 1,
    explanation: 'Dầu ăn có thể gây tắc nghẽn ống cống và gây ô nhiễm nguồn nước.',
  },
  {
    id: 5,
    question: 'Loại năng lượng nào dưới đây là năng lượng tái tạo?',
    options: [
      'Than đá',
      'Dầu mỏ',
      'Năng lượng mặt trời',
      'Khí đốt tự nhiên',
    ],
    correctAnswer: 2,
    explanation: 'Năng lượng mặt trời là năng lượng tái tạo vì nó không bao giờ cạn kiệt và tái tạo liên tục.',
  },
];

// Dữ liệu mẫu cho các trò chơi môi trường
const GAMES = [
  {
    id: 1,
    title: 'Câu đố môi trường',
    description: 'Trả lời các câu hỏi về môi trường và kiểm tra kiến thức của bạn',
    icon: <FaQuestionCircle className="text-green-500" size={24} />,
    points: 10,
    timeLimit: '2 phút',
    type: 'quiz',
  },
  {
    id: 2,
    title: 'Phân loại rác thải',
    description: 'Phân loại các loại rác thải vào đúng thùng rác',
    icon: <FaGamepad className="text-blue-500" size={24} />,
    points: 15,
    timeLimit: '3 phút',
    type: 'sorting',
    comingSoon: true,
  },
  {
    id: 3,
    title: 'Xây dựng thành phố xanh',
    description: 'Xây dựng một thành phố thân thiện với môi trường',
    icon: <FaGamepad className="text-purple-500" size={24} />,
    points: 20,
    timeLimit: '5 phút',
    type: 'building',
    comingSoon: true,
  },
];

export default function Games() {
  const { points, setPoints } = useAppContext();
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 phút
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Xử lý đếm ngược thời gian
  useEffect(() => {
    if (selectedGame && selectedGame.type === 'quiz' && !quizCompleted) {
      const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      
      if (timeLeft === 0) {
        setQuizCompleted(true);
      }
      
      return () => clearInterval(timer);
    }
  }, [selectedGame, timeLeft, quizCompleted]);
  
  // Format thời gian từ giây sang phút:giây
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Xử lý chọn trò chơi
  const handleGameSelect = (game) => {
    if (game.comingSoon) return;
    
    setSelectedGame(game);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(120);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };
  
  // Xử lý chọn câu trả lời
  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    // Kiểm tra câu trả lời
    if (answerIndex === QUESTIONS[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };
  
  // Xử lý chuyển câu hỏi tiếp theo
  const handleNextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      
      // Thưởng điểm khi hoàn thành câu đố
      const earnedPoints = Math.round((score / QUESTIONS.length) * selectedGame.points);
      if (earnedPoints > 0) {
        setPoints(prev => ({
          ...prev,
          total: prev.total + earnedPoints
        }));
      }
    }
  };
  
  // Xử lý quay lại danh sách trò chơi
  const handleBackToGames = () => {
    setSelectedGame(null);
    setQuizCompleted(false);
  };
  
  // Render màn hình danh sách trò chơi
  const renderGamesList = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Trò chơi môi trường
        </h1>
        <p className="text-gray-600 mt-1">
          Vừa học vừa chơi, vừa tích điểm
        </p>
      </div>
      
      <div className="space-y-4">
        {GAMES.map(game => (
          <div 
            key={game.id} 
            className={`p-4 rounded-lg shadow-md border ${game.comingSoon ? 'bg-gray-50 border-gray-200' : 'bg-white border-green-100'}`}
            onClick={() => handleGameSelect(game)}
          >
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-gray-100 mr-3">
                {game.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className={`font-bold ${game.comingSoon ? 'text-gray-600' : 'text-green-800'}`}>
                    {game.title}
                  </h2>
                  
                  {game.comingSoon && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Sắp ra mắt
                    </span>
                  )}
                </div>
                
                <p className={`text-sm mt-1 ${game.comingSoon ? 'text-gray-500' : 'text-gray-600'}`}>
                  {game.description}
                </p>
                
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <div className="flex items-center mr-3">
                    <FaClock className="mr-1" />
                    <span>{game.timeLimit}</span>
                  </div>
                  <div className="flex items-center">
                    <FaTrophy className="mr-1 text-yellow-500" />
                    <span>+{game.points} điểm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2">Lợi ích từ trò chơi</h3>
        <ul className="text-sm text-blue-700 space-y-1 pl-5 list-disc">
          <li>Học thêm kiến thức về môi trường</li>
          <li>Giải trí lành mạnh</li>
          <li>Nhận thêm điểm xanh</li>
          <li>Thử thách bản thân</li>
        </ul>
      </div>
    </div>
  );
  
  // Render màn hình câu đố
  const renderQuiz = () => {
    const currentQ = QUESTIONS[currentQuestion];
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleBackToGames}
            className="text-gray-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Quay lại
          </button>
          
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
            <FaClock className="mr-1" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          
          <div className="text-gray-600">
            {currentQuestion + 1}/{QUESTIONS.length}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-bold text-green-800 text-lg mb-4">
            {currentQ.question}
          </h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-3 rounded-lg border text-left ${
                  selectedAnswer === index 
                    ? isAnswered 
                      ? index === currentQ.correctAnswer 
                        ? 'bg-green-100 border-green-500 text-green-800' 
                        : 'bg-red-100 border-red-500 text-red-800' 
                      : 'bg-blue-100 border-blue-500 text-blue-800'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                disabled={isAnswered}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${
                    selectedAnswer === index 
                      ? isAnswered 
                        ? index === currentQ.correctAnswer 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white' 
                        : 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {selectedAnswer === index && isAnswered ? (
                      index === currentQ.correctAnswer ? <FaCheck size={12} /> : <FaTimes size={12} />
                    ) : (
                      <span className="text-xs">{String.fromCharCode(65 + index)}</span>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
          
          {isAnswered && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-1">Giải thích:</h3>
              <p className="text-sm text-gray-600">{currentQ.explanation}</p>
            </div>
          )}
        </div>
        
        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            {currentQuestion < QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
          </button>
        )}
      </div>
    );
  };
  
  // Render màn hình kết quả câu đố
  const renderQuizResult = () => {
    const earnedPoints = Math.round((score / QUESTIONS.length) * selectedGame.points);
    const percentage = Math.round((score / QUESTIONS.length) * 100);
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Kết quả câu đố
          </h1>
          <p className="text-gray-600">
            Bạn đã hoàn thành trò chơi!
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="mb-4">
            <div className="inline-block p-4 rounded-full bg-green-100">
              <FaTrophy className="text-yellow-500 text-4xl" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            {percentage}%
          </h2>
          
          <p className="text-gray-600 mb-4">
            Bạn trả lời đúng {score}/{QUESTIONS.length} câu hỏi
          </p>
          
          <div className="p-3 bg-green-50 rounded-lg text-green-800 mb-4">
            <p className="font-semibold">
              +{earnedPoints} điểm xanh
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleBackToGames}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Quay lại danh sách trò chơi
            </button>
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setTimeLeft(120);
                setQuizCompleted(false);
                setSelectedAnswer(null);
                setIsAnswered(false);
              }}
              className="w-full py-3 bg-green-50 text-green-700 rounded-lg font-semibold hover:bg-green-100"
            >
              Chơi lại
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render trò chơi theo loại
  const renderGame = () => {
    if (!selectedGame) return renderGamesList();
    
    if (selectedGame.type === 'quiz') {
      if (quizCompleted) {
        return renderQuizResult();
      } else {
        return renderQuiz();
      }
    }
    
    return null;
  };
  
  return (
    <div className="pb-16">
      {renderGame()}
    </div>
  );
}
>>>>>>> c9a6028 (add database)
