import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getArticles } from "@services/articleService";
import config from "@config/appConfig";
import clsx from "clsx";

import EventAlert from "./EventAlert";
import Icon from "./Icon";
import PaginationMy from "./PaginationMy";

const categoryColors = {
  technology: "bg-primary-my",
  art: "bg-background-dark",
  poetry: "bg-placeholder",
  life: "bg-background-dark",
  default: "bg-gray-100",
};

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLang, setCurrentLang] = useState(config.DEFAULT_LANG);

  const iconClass = clsx("absolute inset-0 flex items-center justify-center");

  const location = useLocation();
  // 移除 navigate 状态，因为它不再需要 handleCategoryChange
  // const navigate = useNavigate();

  // 从 URL 查询参数中获取当前的分类、语言和页码
  const getParamsFromUrl = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category") || "all";
    const lang = params.get("lang") || config.DEFAULT_LANG;
    const page = parseInt(params.get("page")) || 1;
    return { category, lang, page };
  }, [location.search]);

  // 异步获取文章数据的函数
  const fetchArticles = useCallback(async (page, category, lang) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: page,
        limit: config.PAGINATION_PAGE,
        category: category,
        lang: lang,
      };

      const data = await getArticles(params);

      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setArticles(data.articles);
      setCurrentLang(lang);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError(
        err.message || "Unable to load articles, please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect 钩子：当 URL 查询参数变化时，触发数据重新获取
  useEffect(() => {
    // 每次 URL 变化，都从 URL 获取最新的分类、语言和页码
    const {
      category: categoryFromUrl,
      lang: langFromUrl,
      page: pageFromUrl,
    } = getParamsFromUrl();

    // 使用从 URL 获取的参数来调用 fetchArticles
    fetchArticles(pageFromUrl, categoryFromUrl, langFromUrl);
  }, [location.search, fetchArticles, getParamsFromUrl]);

  // 移除 handleCategoryChange 函数，因为它不再属于 ArticleList
  // const handleCategoryChange = useCallback((newCategory) => { ... }, [...]);

  // 辅助函数：根据文章的分类获取对应的 Tailwind CSS 类名
  const getArticleCardClass = (articleCategories) => {
    if (
      !articleCategories ||
      !Array.isArray(articleCategories) ||
      articleCategories.length === 0
    ) {
      return categoryColors.default;
    }

    const primaryCategory = articleCategories[0];

    return categoryColors[primaryCategory] || categoryColors.default;
  };

  // if (loading)
  //   return <Icon name="spin" className="w-25 h-25 animate-spin-slow" />;

  // if (error) return <EventAlert message={error} />;

  return (
    <div className="container mx-auto my-40">
      <div className="relative w-[70vw] min-h-[80vw] mx-auto flex flex-col items-center justify-center rounded-lg overflow-hidden md:w-[45vw] md:min-h-[45vw]">
        {loading ? (
          // 加载时显示旋转图标，并使其填充整个预设大小的容器
          <div className={iconClass}>
            <Icon name="spin" className="animate-spin-slow" />
          </div>
        ) : error ? (
          // 错误时显示错误信息
          <div className={iconClass}>
            <EventAlert message={error} />
          </div>
        ) : articles.length === 0 ? (
          // 没有文章时显示提示信息
          <div className={iconClass}>
            <EventAlert message="No articles found in this category." />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col gap-15  md:grid grid-cols-2 grid-rows-2 md:gap-20 p-6 w-full h-full">
            {articles.map((article) => (
              <div
                key={article._id}
                className={`flex flex-col justify-between rounded-lg p-6 ${getArticleCardClass(article.categories)} hover:shadow-md transition-shadow duration-300 cursor-pointer`}
              >
                <h3 className="line-clamp-1 text-4xl leading-relaxed font-semibold mb-2 text-left md:line-clamp-2 lg:text-5xl">
                  {article.title ? article.title[currentLang] : "No Title"}
                </h3>
                <p className="line-clamp-1 mt-auto leading-relaxed text-xl text-gray-600 text-right md:line-clamp-2 ">
                  {article.summary ? article.summary[currentLang] : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <PaginationMy currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

export default ArticleList;
