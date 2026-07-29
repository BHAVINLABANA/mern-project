class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Search by product name
  search() {
    if (this.queryString.keyword) {
      const keyword = {
        name: {
          $regex: this.queryString.keyword,
          $options: "i",
        },
      };

      this.query = this.query.find(keyword);
    }

    return this;
  }

  // Filter by category
  filter() {
    if (this.queryString.category) {
      this.query = this.query.find({
        category: this.queryString.category,
      });
    }

    return this;
  }

  // Sort results
  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // Pagination
  paginate(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = APIFeatures;