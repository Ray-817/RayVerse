import clsx from "clsx";
import React, { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Combobox from "@components/ui/ComoboBox";
import ArticleList from "@components/ui/ArticlesList";

function MyTakes() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const sectionClasses = clsx(
    "py-26 md:py-30 lg:py-34 mb-26 md:mb-30 lg:mb-34 ",
    "scroll-offset"
  );

  const titleContainerClasses = clsx(
    "flex ml-[16vw] items-center gap-x-8 justify-start"
  );

  // 从 URL 获取当前的分类，默认为 'all'
  const getCategoryFromUrl = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "all";
  }, [location.search]);

  // 从 URL 获取当前分类，并作为 Combobox 的值
  const selectedCategory = getCategoryFromUrl();

  const handleCategoryChange = useCallback(
    (newCategory) => {
      // 1. 获取当前的 URL 查询参数，以便保留它们（包括 'lang'）
      const currentParams = new URLSearchParams(location.search);

      // 2. 切换分类时，将页码重置为 1
      currentParams.set("page", 1);

      // 3. 根据新的分类值设置或删除 'category' 参数
      if (newCategory !== "all") {
        currentParams.set("category", newCategory);
      } else {
        currentParams.delete("category"); // 如果是 "all"，则从 URL 中移除 category 参数
      }

      // 4. 使用 navigate 更新 URL，同时保留当前路径并添加所有查询参数
      // 注意：这里我们假设 MyTakes 组件所在的路由是 '/' 或你希望文章列表显示在的路径
      navigate(`${location.pathname}?${currentParams.toString()}`);
    },
    [navigate, location.search, location.pathname] // 添加 location.pathname 到依赖项
  );

  return (
    <section className={sectionClasses} id="takes">
      <div className={titleContainerClasses}>
        <h2 className="text-left">{t("take-title")}</h2>
        <Combobox
          value={selectedCategory} // 将从 URL 读取的当前分类传递给 Combobox
          onValueChange={handleCategoryChange} // 将更新 URL 的函数传递给 Combobox
        />
      </div>
      <ArticleList />
    </section>
  );
}

export default MyTakes;
