// 'use client'; là một directive của Prisma, chỉ định rằng file này sẽ được sử dụng trong phạm vi client của Prisma.
'use client';

// Import Prisma User model và UserBox component.
import { User } from "@prisma/client";
import UserBox from "./UserBox";

// Props cho component UserList, nhận một mảng người dùng.
interface UserListProps {
  items: User[];
}

// Component UserList, hiển thị danh sách người dùng trong thanh bên (sidebar).
const UserList: React.FC<UserListProps> = ({ items }) => {
  return ( 
    <aside 
      // CSS classes cho thanh bên, được thiết lập cho các kích thước màn hình khác nhau.
      className="
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200
        block w-full left-0
      "
    >
      <div className="px-5">
        <div className="flex-col">
          {/* Tiêu đề của thanh bên */}
          <div 
            className="
              text-2xl 
              font-bold 
              text-neutral-800 
              py-4
            "
          >
            People
          </div>
        </div>
        {/* Duyệt qua mỗi người dùng và render UserBox cho từng người dùng */}
        {items.map((item) => (
          <UserBox
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </aside>
  );
}
 
// Xuất component UserList để có thể sử dụng ở các phần khác của ứng dụng React.
export default UserList;
