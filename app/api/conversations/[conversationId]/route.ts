// Import hàm getCurrentUser từ module getCurrentUser
import getCurrentUser from "@/app/actions/getCurrentUser";

// Import NextResponse từ thư viện next/server
import { NextResponse } from "next/server";

// Import đối tượng Prisma để truy cập database
import prisma from "@/app/libs/prismadb";

// Import pusherServer từ thư viện pusher
import { pusherServer } from "@/app/libs/pusher";

// Định nghĩa kiểu dữ liệu cho params của request
interface IParams {
  conversationId?: string;
}

// Xử lý DELETE request để xóa một cuộc trò chuyện
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    // Trích xuất conversationId từ params
    const { conversationId } = params;

    // Lấy thông tin người dùng hiện tại
    const currentUser = await getCurrentUser();

    // Nếu không có ID của người dùng hiện tại, trả về response JSON null
    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    // Tìm kiếm thông tin cuộc trò chuyện trong database
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      // Bao gồm thông tin về người dùng thuộc cuộc trò chuyện
      include: {
        users: true
      }
    });

    // Nếu không tìm thấy cuộc trò chuyện, trả về response lỗi "Invalid ID"
    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    // Xóa cuộc trò chuyện trong database
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        },
      },
    });

    // Gửi thông báo đến tất cả người dùng thuộc cuộc trò chuyện về việc cuộc trò chuyện đã bị xóa
    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
      }
    });

    // Trả về response JSON chứa thông tin cuộc trò chuyện đã bị xóa
    return NextResponse.json(deletedConversation);
  } catch (error) {
    // Nếu có lỗi, trả về response JSON null
    return NextResponse.json(null);
  }
}
