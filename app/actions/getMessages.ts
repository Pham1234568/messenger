// Import đối tượng Prisma để truy cập database
import prisma from "@/app/libs/prismadb";

// Hàm lấy danh sách tin nhắn trong một cuộc trò chuyện dựa trên ID của cuộc trò chuyện
const getMessages = async (
  conversationId: string
) => {
  try {
    // Tìm kiếm danh sách tin nhắn trong database
    const messages = await prisma.message.findMany({
      // Lọc tin nhắn dựa trên ID của cuộc trò chuyện
      where: {
        conversationId: conversationId
      },
      // Bao gồm thông tin về người gửi và trạng thái đọc của tin nhắn
      include: {
        sender: true,
        seen: true,
      },
      // Sắp xếp tin nhắn theo thời điểm tạo tăng dần
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Trả về danh sách các tin nhắn
    return messages;
  } catch (error: any) {
    // Nếu có lỗi, trả về mảng rỗng
    return [];
  }
};

// Xuất hàm getMessages để có thể sử dụng ở những nơi khác
export default getMessages;
