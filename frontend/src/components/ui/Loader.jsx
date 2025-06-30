/* eslint-disable react/self-closing-comp */
import React from "react";

// 这个组件仅用于在服务器端提供初始的 HTML 结构
// 客户端 JS 会在 hydration 后将其移除
function Loader() {
  return (
    <div id="loader-wrapper">
      <div id="text-loader">
        Loading<span className="dots"></span>
      </div>
    </div>
  );
}

export default Loader;
