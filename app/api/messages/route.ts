// Import các đối tượng và hàm cần thiết từ thư viện Next.js, thư viện Pusher, và Prisma
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from '@/app/libs/pusher';
import prisma from "@/app/libs/prismadb";

// Xử lý request POST để tạo mới một tin nhắn trong cuộc trò chuyện
export async function POST(
  request: Request,
) {
  try {
    // Lấy thông tin người dùng hiện tại
    const currentUser = await getCurrentUser();

    // Trích xuất thông tin từ body của request
    const body = await request.json();
    const {
      message,
      image,
      conversationId
    } = body;

    // Kiểm tra xem có ID và email của người dùng hiện tại hay không
    if (!currentUser?.id || !currentUser?.email) {
      // Nếu không có, trả về response lỗi "Unauthorized" với mã trạng thái 401
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Tạo mới một tin nhắn trong database sử dụng Prisma
    const newMessage = await prisma.message.create({
      include: {
        seen: true,
        sender: true
      },
      data: {
        body: message,
        image: image,
        conversation: {
          connect: { id: conversationId }
        },
        sender: {
          connect: { id: currentUser.id }
        },
        seen: {
          connect: {
            id: currentUser.id
          }
        },
      }
    });

    // Cập nhật thông tin cuộc trò chuyện trong database
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true
          }
        }
      }
    });

    // Gửi thông báo đến tất cả người người dùng thuộc cuộc trò chuyện về tin nhắn mới
    await pusherServer.trigger(conversationId, 'messages:new', newMessage);

    // Lấy tin nhắn cuối cùng trong cuộc trò chuyện
    const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    // Gửi thông báo đến tất cả người dùng thuộc cuộc trò chuyện về cập nhật cuộc trò chuyện
    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage]
      });
    });

    // Trả về response JSON chứa thông tin tin nhắn mới được tạo
    return NextResponse.json(newMessage);
  } catch (error) {
    // Nếu có lỗi, ghi log và trả về response lỗi "Error" với mã trạng thái 500
    console.error(error, 'ERROR_MESSAGES');
    return new NextResponse('Error', { status: 500 });
  }
}
