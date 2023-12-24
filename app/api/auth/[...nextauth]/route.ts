// Import thư viện bcrypt để sử dụng trong việc hash mật khẩu
import bcrypt from "bcrypt";

// Import NextAuth và NextAuthOptions từ thư viện next-auth
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

// Import các providers cung cấp bởi next-auth
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Import PrismaAdapter để sử dụng với Prisma database
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/app/libs/prismadb";

// Định nghĩa các tùy chọn cho việc xác thực (authentication)
export const authOptions: NextAuthOptions = {
  // Sử dụng PrismaAdapter để lưu trữ dữ liệu xác thực trong database của Prisma
  adapter: PrismaAdapter(prisma),

  // Cấu hình các providers xác thực (Github, Google, Credentials) với client ID và client secret
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),

    // Cấu hình provider cho việc xác thực bằng credentials (email và password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' }
      },

      // Logic xác thực tùy chỉnh cho provider credentials
      async authorize(credentials) {
        // Nếu không có email hoặc password, ném lỗi "Invalid credentials"
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // Tìm người dùng trong database với email cung cấp
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        // Nếu không tìm thấy người dùng hoặc không có mật khẩu đã hash, ném lỗi "Invalid credentials"
        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        // So sánh mật khẩu nhập vào với mật khẩu đã hash trong database
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        // Nếu mật khẩu không đúng, ném lỗi "Invalid credentials"
        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        // Nếu mọi thứ hợp lệ, trả về thông tin người dùng
        return user;
      }
    })
  ],

  // Bật chế độ debug trong môi trường phát triển
  debug: process.env.NODE_ENV === 'development',

  // Cấu hình session strategy là "jwt"
  session: {
    strategy: "jwt",
  },

  // Thiết lập secret cho xác thực
  secret: process.env.NEXTAUTH_SECRET,
}

// Tạo handler cho NextAuth sử dụng các tùy chọn đã được định nghĩa
const handler = NextAuth(authOptions);

// Xuất handler cho cả GET và POST requests
export { handler as GET, handler as POST };
