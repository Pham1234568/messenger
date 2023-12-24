import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

// Custom hook để lấy thông tin về người dùng khác trong một cuộc trò chuyện
const useOtherUser = (conversation: FullConversationType | { users: User[] }) => {
  // Lấy thông tin về session sử dụng hook useSession từ next-auth/react
  const session = useSession();

  // Sử dụng useMemo để tạo biến otherUser dựa trên thông tin session và conversation
  const otherUser = useMemo(() => {
    // Lấy địa chỉ email của người dùng hiện tại từ session
    const currentUserEmail = session.data?.user?.email;

    // Lọc người dùng khác trong conversation bằng cách so sánh địa chỉ email
    const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);

    // Trả về người dùng khác, nếu có
    return otherUser[0];
  }, [session.data?.user?.email, conversation.users]);

  // Trả về thông tin về người dùng khác
  return otherUser;
};

export default useOtherUser;
