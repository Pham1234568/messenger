import { useParams } from "next/navigation";
import { useMemo } from "react";

// Custom hook để quản lý thông tin về cuộc trò chuyện
const useConversation = () => {
  // Lấy các tham số từ URL bằng hook useParams từ next/navigation
  const params = useParams();

  // Sử dụng useMemo để tạo một biến `conversationId` dựa trên tham số URL
  const conversationId = useMemo(() => {
    // Nếu không có `conversationId` trong params, trả về chuỗi rỗng
    if (!params?.conversationId) {
      return '';
    }

    // Nếu có, trả về `conversationId` dưới dạng chuỗi
    return params.conversationId as string;
  }, [params?.conversationId]);

  // Sử dụng useMemo để tạo một biến `isOpen` dựa trên có hay không có `conversationId`
  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  // Sử dụng useMemo để trả về một đối tượng chứa thông tin cuộc trò chuyện
  return useMemo(() => ({
    isOpen,
    conversationId
  }), [isOpen, conversationId]);
};

export default useConversation;
