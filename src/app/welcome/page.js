'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLeaf, FaMedal, FaChartLine, FaUsers, FaArrowRight } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

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
      title: 'Chào mừng đến với Sống Xanh!',
      description: `Xin chào ${user?.name || 'bạn'}, cảm ơn bạn đã tham gia cùng chúng tôi trong hành trình bảo vệ môi trường. Hãy cùng khám phá những tính năng tuyệt vời của ứng dụng!`,
      icon: <FaLeaf className="text-green-500 text-6xl" />,
    },
    {
      title: 'Ghi nhận hành vi xanh hằng ngày',
      description: 'Ghi lại các hoạt động bảo vệ môi trường mỗi ngày để tích điểm xanh và theo dõi tiến độ của bạn.',
      icon: <FaChartLine className="text-green-500 text-6xl" />,
    },
    {
      title: 'Đạt được huy hiệu',
      description: 'Nhận các huy hiệu đặc biệt khi đạt đến các mốc điểm khác nhau. Khám phá và sưu tầm tất cả huy hiệu!',
      icon: <FaMedal className="text-green-500 text-6xl" />,
    },
    {
      title: 'Tham gia cộng đồng',
      description: 'Kết nối với bạn bè, tham gia các nhóm và thử thách cùng nhau. Cùng nhau, chúng ta có thể tạo nên sự thay đổi lớn!',
      icon: <FaUsers className="text-green-500 text-6xl" />,
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
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 bg-green-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mb-8">
            {steps[currentStep].icon}
          </div>
          
          <h1 className="text-3xl font-bold text-green-800 mb-4">
            {steps[currentStep].title}
          </h1>
          
          <p className="text-gray-600 mb-8">
            {steps[currentStep].description}
          </p>
        </div>
        
        {/* Dots indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`w-2.5 h-2.5 rounded-full ${
                index === currentStep ? 'bg-green-600' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleNextStep}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
          >
            {currentStep < steps.length - 1 ? 'Tiếp tục' : 'Bắt đầu ngay'} <FaArrowRight className="ml-2" />
          </button>
          
          {currentStep < steps.length - 1 && (
            <button
              onClick={handleSkip}
              className="w-full py-2 text-gray-600 font-medium hover:text-gray-800"
            >
              Bỏ qua
            </button>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Bạn có thể tìm hiểu thêm tính năng trong quá trình sử dụng ứng dụng.
          </p>
        </div>
      </div>
    </div>
  );
}