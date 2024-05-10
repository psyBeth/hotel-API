'use strict'

module.exports = (req, res, next) => {
    let { filter, search, sort, limit, page, skip } = req.query

    limit = Number(limit);
    limit = limit > 0 ? limit : Number(process.env.PAGE_SIZE);

    page = Number(page);
    page = page > 0 ? (page - 1) : 0;

    skip = Number(skip);
    skip = skip > 0 ? skip : (page * limit);

    //? FILTERING & SEARCHING & SORTING & PAGINATION 
    res.getModelList = async (Model, customFilter = {}, populate = null) => {
        return await Model.find({ ...filter, ...search, ...customFilter }).sort(sort).skip(skip).limit(limit).populate(populate)
    };

    //? DETAILS
    res.getModelListDetails = async (Model, customFilter = {}) => {

        const data = await Model.find({ ...filter, ...search, ...customFilter });

        let details = {
            filter,
            search,
            sort,
            skip,
            limit,
            page,
            pages: {
                previous_page: (page > 0 ? page : false),
                current_page: page + 1,
                next_page: page + 2,
                total_pages: Math.ceil(data.length / limit)
            },
            totalRecords: data.length,
        };
        details.pages.next_page = (details.pages.next_page > details.pages.total_pages ? false : details.pages.next_page);
        if (details.totalRecords <= limit) details.pages = false;
        return details;
    };

    next();
};