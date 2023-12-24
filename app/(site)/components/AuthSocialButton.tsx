import { IconType } from "react-icons";

// Định nghĩa kiểu dữ liệu của prop cho component AuthSocialButton
interface AuthSocialButtonProps {
  icon: IconType; // Kiểu dữ liệu của prop icon là IconType từ thư viện react-icons
  onClick: () => void; // Kiểu dữ liệu của prop onClick là một hàm không nhận tham số và không trả về giá trị
}

// Component AuthSocialButton là một functional component
const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({ 
  icon: Icon, // Destructuring prop icon và đặt tên biến là Icon
  onClick,    // Destructuring prop onClick
}) => {
  // Trả về JSX để hiển thị nút đăng nhập bằng tài khoản mạng xã hội
  return ( 
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex
        w-full 
        justify-center 
        rounded-md 
        bg-white 
        px-4 
        py-2 
        text-gray-500 
        shadow-sm 
        ring-1 
        ring-inset 
        ring-gray-300 
        hover:bg-gray-50 
        focus:outline-offset-0
      "
    >
      <Icon /> {/* Hiển thị biểu tượng mạng xã hội sử dụng prop icon */}
    </button>
  );
}
 
export default AuthSocialButton;
