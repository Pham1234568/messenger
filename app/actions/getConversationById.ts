// Import đối tượng Prisma cho việc truy cập database
import prisma from "@/app/libs/prismadb";

// Import hàm getCurrentUser từ module getCurrentUser
import getCurrentUser from "./getCurrentUser";

// Hàm lấy thông tin cuộc trò chuyện dựa trên ID
const getConversationById = async (
  conversationId: string
) => {
  try {
    // Lấy thông tin người dùng hiện tại
    const currentUser = await getCurrentUser();

    // Nếu không có email của người dùng hiện tại, trả về null
    if (!currentUser?.email) {
      return null;
    }

    // Tìm kiếm thông tin cuộc trò chuyện trong database
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      // Bao gồm cả thông tin về người dùng liên quan đến cuộc trò chuyện
      include: {
        users: true,
      },
    });

    // Trả về thông tin cuộc trò chuyện
    return conversation;
  } catch (error: any) {
    // Nếu có lỗi, log lỗi và trả về null
    console.log(error, 'SERVER_ERROR')
    return null;
  }
};

// Xuất hàm getConversationById để có thể sử dụng ở những nơi khác
export default getConversationById;
