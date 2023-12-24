import { useEffect, useState } from "react";
import { pusherClient } from "../libs/pusher";
import { Channel, Members } from "pusher-js";
import useActiveList from "./useActiveList";

// Custom hook để quản lý kênh truyền thông tin thời gian thực
const useActiveChannel = () => {
  // Sử dụng custom hook khác để quản lý danh sách thành viên hoạt động
  const { set, add, remove } = useActiveList();

  // State để theo dõi kênh truyền thông tin thời gian thực đang được sử dụng
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    // Lấy kênh hiện tại từ state
    let channel = activeChannel;

    // Nếu chưa có kênh, đăng ký vào kênh 'presence-messenger'
    if (!channel) {
      channel = pusherClient.subscribe('presence-messenger');
      setActiveChannel(channel);
    }

    // Xử lý sự kiện khi đăng ký thành công vào kênh
    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];

      // Lặp qua danh sách thành viên và thêm vào mảng
      members.each((member: Record<string, any>) => initialMembers.push(member.id));
      
      // Cập nhật danh sách thành viên hoạt động
      set(initialMembers);
    });

    // Xử lý sự kiện khi có thành viên mới tham gia kênh
    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      // Thêm thành viên mới vào danh sách
      add(member.id);
    });

    // Xử lý sự kiện khi có thành viên rời khỏi kênh
    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      // Xóa thành viên khỏi danh sách
      remove(member.id);
    });

    // Cleanup function để hủy đăng ký kênh khi component unmount
    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-messenger');
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove]);

  // Không có giá trị trả về vì custom hook này chủ yếu là để quản lý side effects
};

export default useActiveChannel;
