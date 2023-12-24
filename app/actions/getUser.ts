// Import đối tượng Prisma để truy cập database
import prisma from "@/app/libs/prismadb";

// Import hàm getSession từ module getSession
import getSession from "./getSession";

// Hàm lấy danh sách người dùng, loại bỏ người dùng hiện tại đang đăng nhập
const getUsers = async () => {
  // Lấy thông tin phiên đăng nhập
  const session = await getSession();

  // Nếu không có email trong thông tin người dùng của phiên đăng nhập, trả về mảng rỗng
  if (!session?.user?.email) {
    return [];
  }

  try {
    // Tìm kiếm danh sách người dùng trong database
    const users = await prisma.user.findMany({
      // Sắp xếp theo thời điểm tạo giảm dần
      orderBy: {
        createdAt: 'desc'
      },
      // Lọc bỏ người dùng hiện tại đang đăng nhập
      where: {
        NOT: {
          email: session.user.email
        }
      }
    });

    // Trả về danh sách người dùng
    return users;
  } catch (error: any) {
    // Nếu có lỗi, trả về mảng rỗng
    return [];
  }
};

// Xuất hàm getUsers để có thể sử dụng ở những nơi khác
export default getUsers;
