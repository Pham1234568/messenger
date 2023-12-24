// Import đối tượng Prisma để truy cập database
import prisma from "@/app/libs/prismadb";

// Import hàm getCurrentUser từ module getCurrentUser
import getCurrentUser from "./getCurrentUser";

// Hàm lấy danh sách các cuộc trò chuyện của người dùng hiện tại
const getConversations = async () => {
  // Lấy thông tin người dùng hiện tại
  const currentUser = await getCurrentUser();

  // Nếu không có ID của người dùng hiện tại, trả về mảng rỗng
  if (!currentUser?.id) {
    return [];
  }

  try {
    // Tìm kiếm danh sách cuộc trò chuyện trong database
    const conversations = await prisma.conversation.findMany({
      // Sắp xếp theo thời điểm của tin nhắn cuối cùng theo thứ tự giảm dần
      orderBy: {
        lastMessageAt: 'desc',
      },
      // Lọc cuộc trò chuyện dựa trên ID của người dùng hiện tại
      where: {
        userIds: {
          has: currentUser.id
        }
      },
      // Bao gồm thông tin về người dùng và tin nhắn trong mỗi cuộc trò chuyện
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          }
        },
      }
    });

    // Trả về danh sách các cuộc trò chuyện
    return conversations;
  } catch (error: any) {
    // Nếu có lỗi, trả về mảng rỗng
    return [];
  }
};

// Xuất hàm getConversations để có thể sử dụng ở những nơi khác
export default getConversations;
