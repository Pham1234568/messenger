// Import đối tượng Prisma để truy cập database
import prisma from "@/app/libs/prismadb";

// Import hàm getSession từ module getSession
import getSession from "./getSession";

// Hàm lấy thông tin người dùng hiện tại dựa trên phiên đăng nhập
const getCurrentUser = async () => {
  try {
    // Lấy thông tin phiên đăng nhập hiện tại
    const session = await getSession();

    // Nếu không có email trong thông tin người dùng của phiên đăng nhập, trả về null
    if (!session?.user?.email) {
      return null;
    }

    // Tìm kiếm thông tin người dùng trong database dựa trên email từ phiên đăng nhập
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string
      }
    });

    // Nếu không tìm thấy thông tin người dùng, trả về null
    if (!currentUser) {
      return null;
    }

    // Trả về thông tin người dùng hiện tại
    return currentUser;
  } catch (error: any) {
    // Nếu có lỗi, trả về null
    return null;
  }
};

// Xuất hàm getCurrentUser để có thể sử dụng ở những nơi khác
export default getCurrentUser;
