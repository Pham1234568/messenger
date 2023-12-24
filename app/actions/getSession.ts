// Import hàm getServerSession từ thư viện next-auth
import { getServerSession } from "next-auth";

// Import tùy chọn xác thực từ module authOptions
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Hàm lấy thông tin phiên đăng nhập của máy chủ
export default async function getSession() {
  // Gọi hàm getServerSession với tùy chọn xác thực đã được định nghĩa trước đó
  return await getServerSession(authOptions);
}
