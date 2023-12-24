import { create } from 'zustand';

// Interface định nghĩa cấu trúc của store (global state) cho thanh bên (sidebar)
interface SidebarStore {
  isOpen: boolean;   // Trạng thái mở hay đóng của thanh bên
  onOpen: () => void; // Hàm mở thanh bên
  onClose: () => void; // Hàm đóng thanh bên
}

// Tạo global state sử dụng zustand cho thanh bên
const useSidebar = create<SidebarStore>((set) => ({
  isOpen: false,     // Mặc định, thanh bên là đóng
  onOpen: () => set({ isOpen: true }),   // Hàm mở thanh bên
  onClose: () => set({ isOpen: false }), // Hàm đóng thanh bên
}));

export default useSidebar;
