import { create } from 'zustand';

// Interface định nghĩa cấu trúc của store (global state)
interface ActiveListStore {
  members: string[];          // Mảng chứa danh sách các thành viên
  add: (id: string) => void;   // Hàm thêm một thành viên mới
  remove: (id: string) => void; // Hàm xóa một thành viên
  set: (ids: string[]) => void; // Hàm cập nhật danh sách thành viên
}

// Tạo global state sử dụng zustand
const useActiveList = create<ActiveListStore>((set) => ({
  members: [], // Mảng ban đầu rỗng
  // Hàm thêm một thành viên mới
  add: (id) => set((state) => ({ members: [...state.members, id] })),
  // Hàm xóa một thành viên dựa trên ID
  remove: (id) => set((state) => ({ members: state.members.filter((memberId) => memberId !== id) })),
  // Hàm cập nhật toàn bộ danh sách thành viên
  set: (ids) => set({ members: ids })
}));

export default useActiveList;
