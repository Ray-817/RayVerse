/* eslint-disable react/button-has-type */
import React, { useEffect, useRef, useState } from "react"; // 导入 useState
import ReactDOM from "react-dom";
import Icon from "@components/ui/Icon";

const ModalPortal = ({ children, isOpen, onClose }) => {
  // modalRootRef 用于引用 #modal-root DOM 元素
  const modalRootRef = useRef(null);
  // elRef 用于引用每个 ModalPortal 实例创建的 div 元素，这是实际渲染内容的容器
  // !! 关键修改：延迟 elRef 的初始化，只在客户端进行
  const elRef = useRef(null); // 初始为 null

  // 使用一个状态来指示组件是否已挂载在客户端
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // !! 关键修改：确保只在客户端执行 DOM 操作
    if (typeof window !== "undefined") {
      // 在客户端，初始化 elRef.current
      if (!elRef.current) {
        elRef.current = document.createElement("div");
      }

      let currentModalRoot = document.getElementById("modal-root");
      if (!currentModalRoot) {
        currentModalRoot = document.createElement("div");
        currentModalRoot.setAttribute("id", "modal-root");
        document.body.appendChild(currentModalRoot);
      }
      modalRootRef.current = currentModalRoot;

      modalRootRef.current.appendChild(elRef.current);
      setMounted(true); // 标记为已挂载在客户端
    }

    return () => {
      if (
        typeof window !== "undefined" &&
        modalRootRef.current &&
        elRef.current &&
        modalRootRef.current.contains(elRef.current)
      ) {
        // 使用 .contains() 更健壮
        modalRootRef.current.removeChild(elRef.current);
      }
    };
  }, []);

  // 如果在服务器端 (mounted 为 false) 或者 isOpen 为 false，则不渲染任何内容
  if (!mounted || !isOpen) {
    // 只在客户端且 isOpen 为 true 时才渲染 Portal 内容
    return null;
  }

  // 使用 ReactDOM.createPortal 将 children 渲染到 elRef.current
  // 确保 elRef.current 在这里不是 null (因为 mounted 已经确保了它在客户端被初始化)
  return ReactDOM.createPortal(
    <div
      className="fixed bg-gray-200/50 inset-0 flex items-center justify-center z-30 p-4"
      onClick={onClose}
      style={{ zIndex: 30 }}
    >
      <div
        // 默认情况下（移动端）宽度为 w-full
        // 在中等屏幕（md）及以上，最大宽度限制为 md:max-w-3xl
        // 这样电脑端就不会是全宽了
        className="relative w-full top-[15%] h-[60vh] md:w-auto md:h-auto md:max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      <button
        onClick={onClose}
        className="absolute top-[8%] right-[5%] sm:top-[13%] sm:right-[15%] p-2 rounded-full bg-white hover:bg-gray-100 transition-colors duration-200"
        aria-label="Close"
      >
        <Icon name="close" className="w-20 h-20" />
      </button>
    </div>,
    elRef.current
  );
};

export { ModalPortal };
