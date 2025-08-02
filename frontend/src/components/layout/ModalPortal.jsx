/* eslint-disable react/button-has-type */
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Icon from "@components/ui/Icon";

const ModalPortal = ({ children, isOpen, onClose }) => {
  // modalRootRef 用于引用 #modal-root DOM 元素
  const modalRootRef = useRef(null);
  // elRef 用于引用每个 ModalPortal 实例创建的 div 元素，这是实际渲染内容的容器
  const elRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
      setMounted(true);
    }

    return () => {
      if (
        typeof window !== "undefined" &&
        modalRootRef.current &&
        elRef.current &&
        modalRootRef.current.contains(elRef.current)
      ) {
        modalRootRef.current.removeChild(elRef.current);
      }
    };
  }, []);

  if (!mounted || !isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className="fixed bg-gray-200/50 inset-0 flex items-center justify-center z-30 p-4"
      onClick={onClose}
      style={{ zIndex: 30 }}
    >
      <div
        // 关键修改：模态框主体容器的尺寸和样式
        // 默认情况下（移动端），宽度为全宽，高度为屏幕高度的 70%
        // 在中等屏幕（md）及以上，宽度和高度都恢复为自适应，并设置最大宽度为 3xl
        // 添加 bg-white 和 rounded-xl 以确保内容有背景和圆角
        className="relative w-full h-[70vh] bg-white rounded-xl md:w-auto md:h-auto md:max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      <button
        onClick={onClose}
        // 关键修改：调整关闭按钮的定位
        // 在移动端，按钮定位在右上角
        // 在中等屏幕（md）及以上，按钮定位在模态框的右上角
        className="absolute top-4 right-4 md:top-8 md:right-8 p-2 rounded-full bg-white hover:bg-gray-100 transition-colors duration-200"
        aria-label="Close"
      >
        {/*
          根据你的需求调整图标大小
          例如：className="w-8 h-8 text-gray-500"
        */}
        <Icon name="close" className="w-8 h-8 text-gray-500" />
      </button>
    </div>,
    elRef.current
  );
};

export { ModalPortal };
