/**
 * @fileoverview APIFeatures Class: A utility class for
 * handling common API features like filtering, sorting, and pagination.
 */
class APIFeatures {
  /**
   * @description Constructs an APIFeatures instance.
   * @param {object} query - The Mongoose query object.
   * @param {object} queryString - The Express request query object (req.query).
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    // Set a default language if not specified in the query.
    this.lang = this.queryString.lang || "en";
  }

  /**
   * @description Filters the query based on the request query string.
   * Excludes pagination, sorting, and field selection fields from the filter.
   * Supports advanced filtering with operators like gte, gt, lte, lt.
   * @returns {APIFeatures} The current APIFeatures instance for chaining.
   */
  filter() {
    // Create a shallow copy of the query string to avoid modifying the original.
    const queryObj = { ...this.queryString };
    // Define fields to exclude from filtering.
    const excludeFields = ["page", "sort", "limit", "fields", "lang"];

    // Remove excluded fields from the query object.
    excludeFields.forEach((el) => delete queryObj[el]);

    // Convert the query object to a string and replace operators (e.g., gt) with MongoDB operators ($gt).
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Apply the filter to the Mongoose query.
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * @description Sorts the query results. Defaults to sorting by creation date in descending order.
   * @returns {APIFeatures} The current APIFeatures instance for chaining.
   */
  sort() {
    if (this.queryString.sort) {
      // If a sort field is provided, format it for Mongoose.
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort by `createdAt` in descending order.
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  /**
   * @description Limits the fields to be returned in the query results.
   * Always includes `_id` and `slug`.
   * @returns {APIFeatures} The current APIFeatures instance for chaining.
   */
  limitFields() {
    // Always include `_id` and `slug` in the final fields set.
    let finalFieldsSet = new Set(["_id", "slug"]);

    // If a list of fields is provided, parse and process it.
    const requestedFields = this.queryString.fields
      ? this.queryString.fields.split(",").map((f) => f.trim())
      : [];

    if (requestedFields.length === 0) {
      // If no fields are specified, select default language-specific fields and categories.
      finalFieldsSet.add(`title.${this.lang}`);
      finalFieldsSet.add(`summary.${this.lang}`);
      finalFieldsSet.add("categories");
    } else {
      // If fields are specified, add them to the set, handling language-specific fields.
      requestedFields.forEach((field) => {
        if (field === "title") {
          finalFieldsSet.add(`title.${this.lang}`);
        } else if (field === "summary") {
          finalFieldsSet.add(`summary.${this.lang}`);
        } else if (field === "categories") {
          finalFieldsSet.add("categories");
        } else {
          finalFieldsSet.add(field);
        }
      });
    }

    // Convert the set of fields to a space-separated string and apply to the query.
    let finalSelectString = Array.from(finalFieldsSet).join(" ");
    this.query = this.query.select(finalSelectString);
    return this;
  }

  /**
   * @description Paginates the query results based on page and limit parameters.
   * @returns {APIFeatures} The current APIFeatures instance for chaining.
   */
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || process.env.PAGINATION_PAGE;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
