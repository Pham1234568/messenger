import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/modals/LoadingModal";

// Props cho component UserBox
interface UserBoxProps {
  data: User;
}

// Component UserBox
const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý khi người dùng được nhấp
  const handleClick = useCallback(() => {
    setIsLoading(true);

    // Gửi yêu cầu tạo cuộc trò chuyện mới thông qua API
    axios.post('/api/conversations', { userId: data.id })
      .then((response) => {
        // Chuyển hướng đến trang cuộc trò chuyện mới
        router.push(`/conversations/${response.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <>
      {isLoading && (
        <LoadingModal />
      )}
      <div
        onClick={handleClick}
        className="
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          bg-white 
          p-3 
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer
        "
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">
                {data.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
