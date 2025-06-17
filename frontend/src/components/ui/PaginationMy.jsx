import React, { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // 确保路径正确

/**
 * ArticlePagination 组件用于显示文章列表的分页控件。
 * 它会根据传入的总页数和当前页码渲染分页链接，
 * 并通过更新 URL 查询参数来处理页码切换。
 *
 * @param {object} props - 组件的属性。
 * @param {number} props.currentPage - 当前激活的页码。
 * @param {number} props.totalPages - 总页数。
 */
function ArticlePagination({ currentPage, totalPages }) {
  const location = useLocation();
  const navigate = useNavigate();

  // 处理页码改变的函数：更新 URL 中的 'page' 参数
  const handlePageChange = useCallback(
    (newPage) => {
      // 获取当前 URL 的所有查询参数，确保保留 'lang', 'category' 等
      const currentParams = new URLSearchParams(location.search);
      currentParams.set("page", newPage); // 设置新的页码参数

      // 构建新的 URL 并导航
      // 保持当前路径，只更新查询参数
      navigate(`${location.pathname}?${currentParams.toString()}`);
    },
    [location.pathname, location.search, navigate]
  ); // 依赖项：location.search 和 navigate

  // 如果总页数小于或等于 1，则不显示分页
  if (totalPages <= 1) {
    return null;
  }

  // 渲染页码链接的辅助函数 (包含省略号逻辑)
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // 可见的最大页码数

    // 情况1: 总页数不多，显示所有页码
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i} size="8">
            <PaginationLink
              className="text-2xl md:text-3xl p-2 md:p-3"
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // 情况2: 总页数很多，显示起始、结束和中间带省略号的页码
      // 始终显示第一页
      pages.push(
        <PaginationItem key={1} size="8">
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // 如果当前页离第一页较远，显示前置省略号
      if (currentPage > Math.floor(maxVisiblePages / 2) + 1) {
        pages.push(
          <PaginationItem key="ellipsis-start" size="8">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // 计算中间页码的显示范围
      let startPage = Math.max(
        2,
        currentPage - Math.floor(maxVisiblePages / 2) + 1
      );
      let endPage = Math.min(
        totalPages - 1,
        currentPage + Math.floor(maxVisiblePages / 2) - 1
      );

      // 调整范围以确保总是显示大致数量的页码链接
      if (currentPage <= Math.floor(maxVisiblePages / 2) + 1) {
        endPage = Math.min(totalPages - 1, maxVisiblePages - 2);
      } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
        startPage = Math.max(2, totalPages - maxVisiblePages + 2);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationItem key={i} size="8">
            <PaginationLink
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // 如果当前页离最后一页较远，显示后置省略号
      if (currentPage < totalPages - Math.floor(maxVisiblePages / 2)) {
        pages.push(
          <PaginationItem key="ellipsis-end" size="8">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // 始终显示最后一页 (如果总页数大于1)
      if (totalPages > 1) {
        pages.push(
          <PaginationItem key={totalPages} size="8">
            <PaginationLink
              isActive={totalPages === currentPage}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <Pagination>
        <PaginationContent>
          {/* 上一页按钮 */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : undefined}
              className={`text-xl md:text-3xl p-2 md:p-3 
                ${currentPage === 1 ? "pointer-events-none opacity-50" : undefined}`}
            />
          </PaginationItem>

          {/* 渲染页码链接 */}
          {renderPageNumbers()}

          {/* 下一页按钮 */}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : undefined}
              className={`text-xl md:text-3xl p-2 md:p-3 ${currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default ArticlePagination;
