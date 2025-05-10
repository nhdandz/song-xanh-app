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