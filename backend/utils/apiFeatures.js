class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.lang = this.queryString.lang || "en"; // 默认语言为英语
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields", "lang"];

    excludeFields.forEach((el) => delete queryObj[el]);

    // const queryToObj = JSON.parse(JSON.stringify([{ ...queryObj }]));

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    // 总是包含 _id
    let finalFieldsSet = new Set(["_id"]);

    // 获取前端请求的 fields 参数，并清理空格
    const requestedFields = this.queryString.fields
      ? this.queryString.fields.split(",").map((f) => f.trim())
      : [];

    // 如果前端没有明确指定要返回的字段，则返回默认的语言特定字段
    if (requestedFields.length === 0) {
      finalFieldsSet.add(`title.${this.lang}`); // 根据语言选择标题子字段
      finalFieldsSet.add(`summary.${this.lang}`); // 根据语言选择摘要子字段
      finalFieldsSet.add("categories"); // categories 仍是普通数组
    } else {
      // 如果前端指定了字段，则遍历这些字段
      requestedFields.forEach((field) => {
        if (field === "title") {
          // 如果请求了 'title'，添加特定语言的标题子字段
          finalFieldsSet.add(`title.${this.lang}`);
        } else if (field === "summary") {
          // 如果请求了 'summary'，添加特定语言的摘要子字段
          finalFieldsSet.add(`summary.${this.lang}`);
        } else if (field === "categories") {
          // 如果请求了 'categories'，直接添加 (因为它是普通数组)
          finalFieldsSet.add("categories");
        } else {
          // 添加其他非特殊处理的字段
          finalFieldsSet.add(field);
        }
      });
    }

    // 将最终确定的字段集合转换为 Mongoose select 字符串
    const fieldsToSelect = Array.from(finalFieldsSet).join(" ");

    this.query = this.query.select(fieldsToSelect);
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 4;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
