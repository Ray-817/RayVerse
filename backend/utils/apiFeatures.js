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
    // 总是包含 _id 和 slug
    let finalFieldsSet = new Set(["_id", "slug"]); // **修改点 1: 总是包含 slug**

    const requestedFields = this.queryString.fields
      ? this.queryString.fields.split(",").map((f) => f.trim())
      : [];

    if (requestedFields.length === 0) {
      // 如果前端没有明确指定字段，则返回默认的语言特定字段 + categories
      finalFieldsSet.add(`title.${this.lang}`);
      finalFieldsSet.add(`summary.${this.lang}`);
      finalFieldsSet.add("categories");
    } else {
      // 如果前端指定了字段，则遍历这些字段
      requestedFields.forEach((field) => {
        // 处理排除字段（以 '-' 开头）
        if (field.startsWith("-")) {
          // 如果是排除字段，我们通常不将其添加到 finalFieldsSet
          // Mongoose 的 .select() 可以处理排除逻辑
          // 确保你传入 select 的字符串是正确的格式（正向选择或负向排除）
          // 注意：混合正负选择通常会导致意外行为，Mongoose 推荐只用一种
          // 鉴于你的需求，我们倾向于正向选择并确保必含字段
        } else {
          // 处理包含字段
          if (field === "title") {
            finalFieldsSet.add(`title.${this.lang}`);
          } else if (field === "summary") {
            finalFieldsSet.add(`summary.${this.lang}`);
          } else if (field === "categories") {
            finalFieldsSet.add("categories");
          } else {
            finalFieldsSet.add(field); // 添加其他非特殊处理的字段
          }
        }
      });
    }

    // 处理用户请求排除某些字段的情况
    // 如果你的前端没有发送 '-field' 这样的请求，下面的逻辑可以简化
    let fieldsToSelectArray = Array.from(finalFieldsSet);
    let finalSelectString = fieldsToSelectArray.join(" ");

    // 如果前端同时发送了排除字段（通常不推荐和包含字段混用）
    // 或者你想要在没有明确指定 fields 时，有一些默认排除的字段（比如 __v）
    // 你可以在这里添加类似 `this.query.select('-__v')`
    // 但鉴于你的代码结构，最简单的是确保 `finalFieldsSet` 包含了所有需要的正面选择。

    this.query = this.query.select(finalSelectString);
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
