// Import thư viện bcrypt để sử dụng trong việc hash mật khẩu
import bcrypt from "bcrypt";

// Import đối tượng Prisma để truy cập database
import prisma from "@/app/libs/prismadb";

// Import NextResponse từ thư viện next/server
import { NextResponse } from "next/server";

// Xử lý POST request để tạo mới người dùng
export async function POST(
  request: Request
) {
  // Đọc nội dung của request dưới dạng JSON
  const body = await request.json();

  // Trích xuất thông tin từ body của request
  const {
    email,
    name,
    password
  } = body;

  // Hash mật khẩu sử dụng bcrypt với cost factor là 12
  const hashedPassword = await bcrypt.hash(password, 12);

  // Tạo mới người dùng trong database sử dụng Prisma
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword
    }
  });

  // Trả về response JSON chứa thông tin người dùng đã được tạo mới
  return NextResponse.json(user);
}
