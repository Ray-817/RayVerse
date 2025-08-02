/* eslint-disable require-await */
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getArticles, getSingleArticleBySlug } from "@services/articleService";
import { useAlert } from "@hooks/useAlert";
import config from "@config/appConfig";
import clsx from "clsx";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLang, setCurrentLang] = useState(config.DEFAULT_LANG);
  const { t } = useTranslation();

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loadingArticleContent, setLoadingArticleContent] = useState(false);
  const [, setArticleContentError] = useState(null);
  const [modalArticleSlug, setModalArticleSlug] = useState(null);
  const { showAlert } = useAlert();

  const iconClass = clsx("absolute inset-0 flex items-center justify-center");
  const location = useLocation();

  const getParamsFromUrl = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category") || "all";
    const lang = params.get("lang") || config.DEFAULT_LANG;
    const page = parseInt(params.get("page")) || 1;
    return { category, lang, page };
  }, [location.search]);

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
      setArticleContentError(null);
      try {
        const fullArticleData = await getSingleArticleBySlug(articleSlug, lang);
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
        setSelectedArticle(null);
        setModalArticleSlug(null);
      } finally {
        setLoadingArticleContent(false);
      }
    },
    [showAlert, t]
  );

  useEffect(() => {
    const {
      category: categoryFromUrl,
      lang: langFromUrl,
      page: pageFromUrl,
    } = getParamsFromUrl();
    fetchArticles(pageFromUrl, categoryFromUrl, langFromUrl);
  }, [location.search, fetchArticles, getParamsFromUrl]);

  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = "hidden";
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [selectedArticle]);

  useEffect(() => {
    if (modalArticleSlug && currentLang) {
      setLoadingArticleContent(true);
      setArticleContentError(null);
      fetchAndSetModalContent(modalArticleSlug, currentLang);
    } else if (!modalArticleSlug) {
      setSelectedArticle(null);
      setArticleContentError(null);
      setLoadingArticleContent(false);
    }
  }, [modalArticleSlug, currentLang, fetchAndSetModalContent]);

  const handleArticleClick = useCallback(async (article) => {
    setSelectedArticle({ ...article, content: "" });
    setLoadingArticleContent(true);
    setArticleContentError(null);
    setModalArticleSlug(article.slug);
  }, []);

  const closeModal = useCallback(() => {
    setModalArticleSlug(null);
    setSelectedArticle(null);
    setArticleContentError(null);
    setLoadingArticleContent(false);
  }, []);

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
  const errorMessageContainerWidthClass = "w-[80vw] sm:w-[40vw]";

  return (
    <div className={containerClasses}>
      <div className={articleListClasses}>
        {loading ? (
          <div className={iconClass}>
            <Icon
              name="loader"
              className="w-30 h-30 my-5 mx-auto animate-spin opacity-50"
            />
          </div>
        ) : error ? (
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
          // 修改这个 div 的 className
          <div
            className="relative w-full h-[70vh] md:w-auto md:h-auto md:max-w-3xl rounded-lg overflow-y-auto transform scale-95 animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            {loadingArticleContent ? (
              <div className="w-auto h-[30vh] flex items-center justify-center text-xl sm:h-[70vh]">
                <Icon name="loader" className="w-20 h-20 animate-spin" />
              </div>
            ) : (
              <div className="relative bg-white max-w-none">
                <div className="flex flex-col gap-3 border-b border-gray-200 ">
                  <h2 className="text-6xl font-bold mb-4 p-3 pt-15">
                    {selectedArticle.title}
                  </h2>
                  <p className="mb-6 py-3 px-8">{selectedArticle.summary}</p>
                  <p className="text-3xl text-right text-gray-400 pb-2 pr-4">
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
                {/* 修改内边距，让内容在小屏幕下不紧贴边缘 */}
                <div className="flex flex-col mx-auto px-4 py-8 md:px-8 max-w-7xl">
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
