// Import các đối tượng và hàm từ thư viện Next.js và thư viện Pusher
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/app/libs/pusher";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Xử lý request API
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // Lấy thông tin phiên đăng nhập từ server session sử dụng hàm getServerSession và authOptions
  const session = await getServerSession(request, response, authOptions);

  // Kiểm tra xem có email trong thông tin người dùng của phiên đăng nhập hay không
  if (!session?.user?.email) {
    // Nếu không có, trả về mã trạng thái 401 (Unauthorized)
    return response.status(401).end();
  }

  // Trích xuất thông tin từ body của request
  const socketId = request.body.socket_id;
  const channel = request.body.channel_name;
  
  // Chuẩn bị dữ liệu để gửi đến Pusher
  const data = {
    user_id: session.user.email,
  };

  // Sử dụng hàm authorizeChannel từ pusherServer để xác thực và lấy thông tin cho channel
  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

  // Trả về response với thông tin xác thực từ Pusher
  return response.send(authResponse);
}
