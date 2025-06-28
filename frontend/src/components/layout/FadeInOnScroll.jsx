import React, { useRef, useEffect } from "react";

const FadeInOnScroll = ({ children }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 当元素进入视口时，添加 'is-visible' 类
            entry.target.classList.add("is-visible");
            // 一旦可见就停止观察，避免重复触发动画
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null, // 观察整个视口
        rootMargin: "0px", // 距离视口边缘的距离，可根据需要调整
        threshold: 0.1, // 目标元素10%可见时触发
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // 清理函数：组件卸载时停止观察
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []); // 空数组表示只在组件挂载时运行一次

  return (
    // 应用 Tailwind CSS 中定义的初始类
    <div ref={sectionRef} className="fade-in-section">
      {children}
    </div>
  );
};

export default FadeInOnScroll;
