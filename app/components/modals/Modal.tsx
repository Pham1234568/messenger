// Import các thành phần từ thư viện React và thư viện UI headless
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// Import biểu tượng đóng (close) từ thư viện react-icons
import { IoClose } from 'react-icons/io5';

// Định nghĩa kiểu Props cho component Modal
interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Component Modal sử dụng thư viện UI headless
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* Lớp đen mờ khi modal hiển thị */}
          <div 
            className="
              fixed 
              inset-0 
              bg-gray-500 
              bg-opacity-75 
              transition-opacity
            "
          />
        </Transition.Child>

        {/* Nội dung chính của modal */}
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div 
            className="
              flex 
              min-h-full 
              items-center 
              justify-center 
              p-4 
              text-center 
              sm:p-0
            "
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {/* Panel chứa nội dung modal */}
              <Dialog.Panel 
                className="
                  relative 
                  transform 
                  overflow-hidden 
                  rounded-lg 
                  bg-white 
                  px-4 
                  pb-4
                  pt-5 
                  text-left 
                  shadow-xl 
                  transition-all
                  w-full
                  sm:my-8 
                  sm:w-full 
                  sm:max-w-lg 
                  sm:p-6
                "
              >
                {/* Nút đóng modal */}
                <div 
                  className="
                    absolute 
                    right-0 
                    top-0 
                    hidden 
                    pr-4 
                    pt-4 
                    sm:block
                    z-10
                  "
                >
                  <button
                    type="button"
                    className="
                      rounded-md 
                      bg-white 
                      text-gray-400 
                      hover:text-gray-500 
                      focus:outline-none 
                      focus:ring-2 
                      focus:ring-indigo-500 
                      focus:ring-offset-2
                    "
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <IoClose className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                {/* Nội dung chính của modal */}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

// Xuất component Modal để có thể sử dụng ở những nơi khác trong ứng dụng
export default Modal;
