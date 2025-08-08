/* eslint-disable react/button-has-type */
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Icon from "@components/ui/Icon";

const ModalPortal = ({
  children,
  isOpen,
  onClose,
  isLoading,
  type = "default",
}) => {
  const modalRootRef = useRef(null);
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

  // 动态设置容器样式
  const isImageOrLoading = type === "image" || isLoading;
  const containerClass = `relative w-auto h-auto flex flex-col items-center justify-center ${
    isImageOrLoading
      ? "bg-transparent"
      : "bg-white rounded-xl w-[80%] max-h-[70%]"
  }`;

  // 动态设置关闭按钮样式
  const closeButtonClass = `absolute top-[12vh] right-4 p-2 rounded-full bg-white hover:bg-gray-100 transition-colors duration-200 md:top-[13vh] ${
    isImageOrLoading ? "hidden" : "bg-white hover:bg-gray-100"
  } transition-colors duration-200 z-50`;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-30 p-4 bg-gray-200/50"
      onClick={onClose}
    >
      <div
        className={containerClass}
        onClick={(e) => e.stopPropagation()}
        style={{ marginTop: isImageOrLoading ? "0" : "10vh" }}
      >
        {isLoading ? (
          <Icon
            name="loader"
            className="w-40 h-40 animate-spin text-gray-500"
          />
        ) : (
          children
        )}
      </div>
      <button
        onClick={onClose}
        className={closeButtonClass}
        aria-label="Close modal"
      >
        <Icon name="close" className="w-20 h-20 md:w-15 md:h-15" />
      </button>
    </div>,
    elRef.current
  );
};

export { ModalPortal };
