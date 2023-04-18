class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // BUILD QUERY
        // 1) Filtering
        const queryObj = { ...this.queryString };
        const excludedFiled = ["page", "sort", "limit", "fields"];
        excludedFiled.forEach(el => {
            delete queryObj[el];
        });

        // 2) Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query.find(JSON.parse(queryStr))

        return this;
    }

    sort() {
        // 3) Sorting
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort("-createdAt");
        }

        return this;
    }

    limitFIleds() {
        // 4) Field limiting
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select("-__v");
        }

        return this;
    }

    pagination() {
        // 5) Pagination 
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;