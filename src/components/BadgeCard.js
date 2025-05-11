'use client';

export default function BadgeCard({ badge, earned, progress }) {
  // Map các badge icons (đây chỉ là mẫu, thực tế sẽ dùng hình ảnh thật)
  const badgeIcons = {
    1: {
      icon: (
        <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14.5 9H22L16.5 13.5L19 21L12 17L5 21L7.5 13.5L2 9H9.5L12 2Z" fill={earned ? "#047857" : "#9CA3AF"} />
        </svg>
      ),
      color: "from-green-200 to-yellow-100"
    },
    2: {
      icon: (
        <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={earned ? "#047857" : "#9CA3AF"} strokeWidth="2" />
          <path d="M8 12L11 15L16 9" stroke={earned ? "#047857" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      color: "from-green-200 to-blue-100"
    },
    3: {
      icon: (
        <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill={earned ? "#047857" : "#9CA3AF"} />
          <path d="M19.9391 10.9609C19.4373 8.3109 17.8355 6.1641 15.4945 4.9781L14.1891 6.9591C16.0473 7.8641 17.2909 9.4969 17.6618 11.4769L19.9391 10.9609Z" fill={earned ? "#047857" : "#9CA3AF"} />
          <path d="M15.4945 19.9781C17.8355 18.7921 19.4373 16.6453 19.9391 13.9953L17.6618 13.4793C17.2909 15.4593 16.0473 17.0921 14.1891 17.9971L15.4945 19.9781Z" fill={earned ? "#047857" : "#9CA3AF"} />
          <path d="M4.06091 13.9953C4.5627 16.6453 6.16455 18.7921 8.5055 19.9781L9.8109 17.9971C7.95273 17.0921 6.70909 15.4593 6.33818 13.4793L4.06091 13.9953Z" fill={earned ? "#047857" : "#9CA3AF"} />
          <path d="M8.5055 4.9781C6.16454 6.1641 4.5627 8.3109 4.06091 10.9609L6.33818 11.4769C6.70909 9.4969 7.95272 7.8641 9.8109 6.9591L8.5055 4.9781Z" fill={earned ? "#047857" : "#9CA3AF"} />
        </svg>
      ),
      color: "from-green-200 to-red-100"
    }
  };
  
  const badgeIcon = badgeIcons[badge.id] || badgeIcons[1];
  
  return (
    <div className={`p-4 rounded-lg shadow-md border ${
      earned ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-center">
        <div className="relative w-16 h-16 mr-4 flex-shrink-0">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${badgeIcon.color} flex items-center justify-center ${
            earned ? 'ring-2 ring-green-500' : 'opacity-60'
          }`}>
            {badgeIcon.icon}
          </div>
          
          {earned && (
            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-3 w-3 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold ${earned ? 'text-green-800' : 'text-gray-700'}`}>
            {badge.title}
          </h3>
          <p className="text-sm text-gray-500">
            {earned ? 'Đã đạt được' : `Cần ${badge.points} điểm`}
          </p>
          
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}