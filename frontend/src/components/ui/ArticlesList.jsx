/* eslint-disable require-await */
/* eslint-disable react/button-has-type */
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getArticles, getSingleArticleBySlug } from "@services/articleService";
import { useAlert } from "@hooks/useAlert";
import config from "@config/appConfig";
import clsx from "clsx";
// import ReactMarkdown from "react-markdown"; // 导入 react-markdown
// import remarkGfm from "remark-gfm"; // 导入 remark-gfm
import { useTranslation } from "react-i18next";
import { ModalPortal } from "@components/layout/ModalPortal";
import MarkdownRenderer from "@components/ui/MarkdownRenderer";

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
  const [loading, setLoading] = useState(true); // 用于文章列表的初始加载
  const [error, setError] = useState(null); // 用于文章列表的错误
  const [currentLang, setCurrentLang] = useState(config.DEFAULT_LANG);
  const { t } = useTranslation();

  // 模态框相关状态
  const [selectedArticle, setSelectedArticle] = useState(null); // 存储选中的文章详情（包含Markdown内容）
  const [loadingArticleContent, setLoadingArticleContent] = useState(false); // 控制模态框内文章内容的加载状态
  const [, setArticleContentError] = useState(null); // 控制模态框内文章内容的错误
  const [modalArticleSlug, setModalArticleSlug] = useState(null);
  const { showAlert } = useAlert();

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
  const fetchArticles = useCallback(
    async (page, category, lang) => {
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
        const title = t("failFetchArticles");
        const message = t("checkNetworkMessage");
        showAlert("destructive", title, message);
      } finally {
        setLoading(false);
      }
    },
    [showAlert, t]
  );

  const fetchAndSetModalContent = useCallback(
    async (articleSlug, lang) => {
      if (!articleSlug || !lang) return;

      setArticleContentError(null); // 仅保留错误状态的重置

      try {
        // 这一步现在会从后端直接获取完整的文章数据，包括 Markdown 内容
        const fullArticleData = await getSingleArticleBySlug(articleSlug, lang);

        // 直接使用后端返回的 fullArticleData 中的 content 字段
        // 假设后端现在返回的 fullArticleData 已经包含了 content 字段
        setSelectedArticle({
          ...fullArticleData,
          content: fullArticleData.content,
        });
      } catch (err) {
        const title = t("failFetchContent");
        const message = t("checkNetworkMessage");
        console.error("Error loading article content:", err);
        setArticleContentError(message);
        showAlert("destructive", title, message);
        setSelectedArticle(null); // 如果获取失败，关闭模态框
        setModalArticleSlug(null); // 重置 slug
      } finally {
        setLoadingArticleContent(false); // 无论成功失败，都停止加载
      }
    },
    [showAlert, t]
  ); // 依赖项不变，因为它依赖的是 getSingleArticleBySlug 这个函数调用

  useEffect(() => {
    const {
      category: categoryFromUrl,
      lang: langFromUrl,
      page: pageFromUrl,
    } = getParamsFromUrl();

    fetchArticles(pageFromUrl, categoryFromUrl, langFromUrl);
  }, [location.search, fetchArticles, getParamsFromUrl]); // 移除了 selectedArticle

  // ** useEffect 钩子 2: 负责控制 body 滚动条 (只依赖 selectedArticle 变化) **
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = "hidden";
      // 优化：计算滚动条宽度并添加 padding-right，避免内容跳动
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        // 仅当有滚动条时才添加 padding
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = ""; // 清除 padding
    }

    // 清理函数
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [selectedArticle]); // 只依赖 selectedArticle

  useEffect(() => {
    if (modalArticleSlug && currentLang) {
      // **在发起请求前，立即设置为加载状态**
      setLoadingArticleContent(true);
      setArticleContentError(null); // 清除可能存在的旧错误信息

      fetchAndSetModalContent(modalArticleSlug, currentLang);
    } else if (!modalArticleSlug) {
      // 如果模态框已关闭，确保相关状态都重置
      setSelectedArticle(null);
      setArticleContentError(null);
      setLoadingArticleContent(false);
    }
  }, [modalArticleSlug, currentLang, fetchAndSetModalContent]);

  const handleArticleClick = useCallback(
    async (article) => {
      setSelectedArticle({ ...article, content: "" });
      setLoadingArticleContent(true);
      setArticleContentError(null); // Make sure to reset error state

      setModalArticleSlug(article.slug); // Set the slug here
      // fetchAndSetModalContent will be triggered by the useEffect below
    },
    [] // No need for currentLang or fetchAndSetModalContent here as they are handled by useEffect
  );
  // 关闭模态框
  const closeModal = useCallback(() => {
    setModalArticleSlug(null); // Indicate no article is selected for the modal
    setSelectedArticle(null); // Clear displayed article data
    setArticleContentError(null);
    setLoadingArticleContent(false); // Reset loading state
  }, []);

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

  const parentHeightClass = error
    ? "w-[80vw] h-[60vw] sm:w-[40vw] sm:h-[10vw]"
    : "min-h-[80vw] w-[70vw]";

  const articleListClasses = clsx(
    `relative ${parentHeightClass} mx-auto flex flex-col items-center justify-center rounded-lg overflow-hidden md:w-[45vw] md:min-h-[45vw]`
  );

  const parentMargin = error ? "my-20" : "my-40";
  const containerClasses = clsx(`container mx-auto ${parentMargin}`);

  // 为错误信息容器定义独立的宽度
  const errorMessageContainerWidthClass = "w-[80vw] sm:w-[40vw]";

  return (
    <div className={containerClasses}>
      <div className={articleListClasses}>
        {loading ? (
          // 加载时显示旋转图标，并使其填充整个预设大小的容器
          <div className={iconClass}>
            <Icon
              name="loader"
              className="w-30 h-30 my-5 mx-auto animate-spin opacity-50"
            />
          </div>
        ) : error ? (
          // 错误时显示错误信息
          <div
            className={`flex flex-col w-[100%] rounded-lg text-center ${errorMessageContainerWidthClass}`}
          >
            <Icon name="refresh" className="w-30 h-30 my-5 mx-auto " />
            <div className="flex flex-col items-center mb-20">
              <p className="text-5xl font-medium px-5 md:text-6xl ">
                {t("failFetchArticles")}
              </p>
              <p className="text-3xl px-5 mt-5 md:text-4xl">
                {t("checkNetworkMessage")}
              </p>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col w-[100%] rounded-lg text-center">
            <Icon name="alert-tri" className="w-30 h-30 my-5 mx-auto " />
            <div className="flex flex-col items-center mb-20">
              <p className="text-5xl font-medium px-5 md:text-6xl ">
                {t("noArticles")}
              </p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col gap-15  md:grid grid-cols-2 grid-rows-2 md:gap-20 p-6 w-full h-full">
            {articles.map((article) => (
              <div
                key={article._id}
                className={`flex flex-col justify-between rounded-lg p-6 ${getArticleCardClass(
                  article.categories
                )} hover:shadow-md transition-shadow duration-300 cursor-pointer`}
                onClick={() => handleArticleClick(article)}
                title={article.title[currentLang]}
              >
                <h3 className="line-clamp-1 text-4xl leading-relaxed font-semibold mb-2 text-left md:line-clamp-2">
                  {article.title ? article.title[currentLang] : ""}
                </h3>
                <p className="line-clamp-1 mt-auto leading-relaxed text-xl text-right md:line-clamp-2 ">
                  {article.summary ? article.summary[currentLang] : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <PaginationMy currentPage={currentPage} totalPages={totalPages} />
      <ModalPortal isOpen={!!selectedArticle} onClose={closeModal}>
        {selectedArticle && (
          <div
            className="relative rounded-lg max-w-4xl max-h-[75vh] w-[70vw] overflow-y-auto transform scale-95 animate-fade-in-scale sm:max-h-[85vh] sm:mt-20 "
            onClick={(e) => e.stopPropagation()}
          >
            {loadingArticleContent ? (
              <div className="w-auto h-[30vh] flex items-center justify-center text-xl sm:h-[70vh]">
                <Icon name="loader" className="w-20 h-20 animate-spin" />
              </div>
            ) : (
              <div className="relative bg-white prose prose-lg max-w-none">
                <div className="flex flex-col gap-3 border-b border-gray-200 ">
                  <h2 className="text-5xl font-bold mb-4 p-3 pt-15">
                    {selectedArticle.title}
                  </h2>
                  <p className="mb-6 py-3 px-8">{selectedArticle.summary}</p>
                  <p className="text-2xl text-right text-gray-400 pb-2 pr-4">
                    {new Date(selectedArticle.publishedAt).toLocaleDateString(
                      currentLang,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div className="mx-8 my-5 flex flex-col">
                  <MarkdownRenderer markdown={selectedArticle.content} />
                </div>
              </div>
            )}
          </div>
        )}
      </ModalPortal>
    </div>
  );
}

export default ArticleList;
