import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';
import { signOut } from "next-auth/react";
import useConversation from "./useConversation";

// Custom hook để quản lý đường dẫn và menu
const useRoutes = () => {
  // Lấy đường dẫn hiện tại sử dụng hook usePathname từ next/navigation
  const pathname = usePathname();

  // Lấy thông tin về cuộc trò chuyện sử dụng custom hook useConversation
  const { conversationId } = useConversation();

  // Sử dụng useMemo để tạo danh sách các đường dẫn và menu
  const routes = useMemo(() => [
    { 
      label: 'Chat', 
      href: '/conversations', 
      icon: HiChat,
      // Kiểm tra nếu đường dẫn là '/conversations' hoặc có conversationId
      active: pathname === '/conversations' || !!conversationId
    },
    { 
      label: 'Users', 
      href: '/users', 
      icon: HiUsers, 
      // Kiểm tra nếu đường dẫn là '/users'
      active: pathname === '/users'
    },
    {
      label: 'Logout', 
      onClick: () => signOut(),
      href: '#',
      icon: HiArrowLeftOnRectangle, 
    }
  ], [pathname, conversationId]);

  // Trả về danh sách các đường dẫn và menu
  return routes;
};

export default useRoutes;
