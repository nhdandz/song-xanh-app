'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLeaf, FaCamera, FaGamepad, FaArrowRight } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';
import { APP_NAME } from '@/lib/app-config';

export default function Welcome() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Chuyển sang trang đăng nhập nếu không đăng nhập
  useEffect(() => {
    if (!isAuthenticated && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/dang-nhap');
    }
  }, [isAuthenticated, isRedirecting]);

  // Các bước giới thiệu
  const steps = [
    {
      title: `Chào mừng đến với ${APP_NAME}!`,
      description: `Xin chào ${user?.name || 'bạn'}, cảm ơn bạn đã tham gia cùng chúng tôi trong hành trình bảo vệ môi trường. Hãy cùng khám phá những tính năng tuyệt vời của ứng dụng!`,
      icon: <FaLeaf className="text-green-500 text-6xl" />,
    },
    {
      title: 'Ghi nhận hành động xanh hằng ngày',
      description: 'Ghi lại các việc bảo vệ môi trường bạn làm mỗi ngày để tích điểm xanh.',
      icon: <FaLeaf className="text-green-500 text-6xl" />,
    },
    {
      title: 'Quét sản phẩm',
      description: 'Quét mã vạch hoặc chụp ảnh sản phẩm để biết sản phẩm đó có thân thiện với môi trường không.',
      icon: <FaCamera className="text-green-500 text-6xl" />,
    },
    {
      title: 'Chơi trò chơi môi trường',
      description: 'Câu đố môi trường, trồng cây và phân loại rác — vừa chơi vừa học, lại được tích điểm.',
      icon: <FaGamepad className="text-green-500 text-6xl" />,
    },
  ];
  
  // Xử lý chuyển bước
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Hoàn thành giới thiệu, chuyển về trang chủ
      setIsRedirecting(true);
      router.push('/');
    }
  };
  
  // Bỏ qua giới thiệu
  const handleSkip = () => {
    setIsRedirecting(true);
    router.push('/');
  };
  
  // Nếu đang chuyển hướng hoặc chưa đăng nhập, hiển thị trạng thái loading
  if (isRedirecting || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 bg-brand-wash">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mb-8">
            {steps[currentStep].icon}
          </div>
          
          <h1 className="text-3xl font-bold text-ink mb-4">
            {steps[currentStep].title}
          </h1>
          
          <p className="text-ink-soft mb-8">
            {steps[currentStep].description}
          </p>
        </div>
        
        {/* Dots indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`w-2.5 h-2.5 rounded-full ${
                index === currentStep ? 'bg-brand' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleNextStep}
            className="w-full py-3 bg-brand text-white rounded-lg font-semibold hover:bg-brand flex items-center justify-center"
          >
            {currentStep < steps.length - 1 ? 'Tiếp tục' : 'Bắt đầu ngay'} <FaArrowRight className="ml-2" />
          </button>
          
          {currentStep < steps.length - 1 && (
            <button
              onClick={handleSkip}
              className="w-full py-2 text-ink-soft font-medium hover:text-ink"
            >
              Bỏ qua
            </button>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-ink-faint">
            Bạn có thể tìm hiểu thêm tính năng trong quá trình sử dụng ứng dụng.
          </p>
        </div>
      </div>
    </div>
  );
}