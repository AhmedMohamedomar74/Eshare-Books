// db.services.js
export const findOne = async ({ model, filter = {}, projection = {}, options = {} }) => {
    return await model.findOne(filter, projection, options);
}

export const findMany = async ({ model, filter = {}, projection = {}, options = {}, sort = {}, limit = 0, skip = 0, select = '' }) => {
    let query = model.find(filter, projection, options);
    
    if (sort && Object.keys(sort).length > 0) {
        query = query.sort(sort);
    }
    
    if (skip > 0) {
        query = query.skip(skip);
    }
    
    if (limit > 0) {
        query = query.limit(limit);
    }
    
    if (select) {
        query = query.select(select);
    }
    
    return await query.exec();
}

export const findById = async ({ model, id, projection = {}, options = {} }) => {
    return await model.findById(id, projection, options);
}

export const create = async ({ model, data = {}, options = {} }) => {
    const result = await model.create([data], options);
    return result[0];
}

export const createMany = async ({ model, data = [], options = {} }) => {
    return await model.create(data, options);
}

// UPDATED: All update operations now automatically increment version
export const update = async ({ model, filter = {}, data = {}, options = {} }) => {
    const updateOptions = { 
        new: true, 
        // runValidators: true, 
        ...options 
    };
    
    // Increment version and update timestamps
    const updateData = {
        ...data,
        $inc: { __v: 1 }, // Automatically increment version
        $set: { updatedAt: new Date() }
    };
    
    return await model.findOneAndUpdate(filter, updateData, updateOptions);
}

export const updateMany = async ({ model, filter = {}, data = {}, options = {} }) => {
    const updateOptions = { 
        // runValidators: true, 
        ...options 
    };
    
    // Increment version for all updated documents
    const updateData = {
        ...data,
        $inc: { __v: 1 },
        $set: { updatedAt: new Date() }
    };
    
    const result = await model.updateMany(filter, updateData, updateOptions);
    return result;
}

export const findByIdAndUpdate = async ({ model, id, data = {}, options = {} }) => {
    const updateOptions = { 
        new: true, 
        // runValidators: true, 
        ...options 
    };
    
    // Increment version
    const updateData = {
        ...data,
        $inc: { __v: 1 },
        $set: { updatedAt: new Date() }
    };
    
    return await model.findByIdAndUpdate(id, updateData, updateOptions);
}

export const deleteOne = async ({ model, filter = {}, options = {} }) => {
    return await model.findOneAndDelete(filter, options);
}

export const deleteMany = async ({ model, filter = {}, options = {} }) => {
    const result = await model.deleteMany(filter, options);
    return result;
}

export const findByIdAndDelete = async ({ model, id, options = {} }) => {
    return await model.findByIdAndDelete(id, options);
}

export const countDocuments = async ({ model, filter = {}, options = {} }) => {
    return await model.countDocuments(filter, options);
}

export const aggregate = async ({ model, pipeline = [], options = {} }) => {
    return await model.aggregate(pipeline, options);
}

export const exists = async ({ model, filter = {}, options = {} }) => {
    return await model.exists(filter, options);
}

export const populate = async ({ model, query, path, select = '', options = {} }) => {
    return await query.populate({
        path,
        select,
        ...options
    });
}

// Advanced query operations
export const findWithPagination = async ({ 
    model, 
    filter = {}, 
    projection = {}, 
    options = {}, 
    page = 1, 
    limit = 10, 
    sort = { createdAt: -1 },
    select = '' 
}) => {
    const skip = (page - 1) * limit;
    
    let query = model.find(filter, projection, options);
    
    if (sort && Object.keys(sort).length > 0) {
        query = query.sort(sort);
    }
    
    if (skip > 0) {
        query = query.skip(skip);
    }
    
    if (limit > 0) {
        query = query.limit(limit);
    }
    
    if (select) {
        query = query.select(select);
    }
    
    const [data, totalCount] = await Promise.all([
        query.exec(),
        countDocuments({ model, filter })
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return {
        data,
        pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNext,
            hasPrev,
            limit
        }
    };
}

// UPDATED: Soft delete operations with version increment
export const softDelete = async ({ model, filter = {}, options = {} }) => {
    return await update({
        model,
        filter,
        data: { 
            isDeleted: true, 
            deletedAt: new Date(),
            $inc: { __v: 1 } // Increment version on soft delete
        },
        options
    });
}

export const restoreSoftDelete = async ({ model, filter = {}, options = {} }) => {
    return await update({
        model,
        filter,
        data: { 
            isDeleted: false, 
            deletedAt: null,
            $inc: { __v: 1 } // Increment version on restore
        },
        options
    });
}

export const findNonDeleted = async ({ model, filter = {}, projection = {}, options = {} }) => {
    const finalFilter = { ...filter, isDeleted: { $ne: true } };
    return await findOne({ model, filter: finalFilter, projection, options });
}

export const findManyNonDeleted = async ({ model, filter = {}, projection = {}, options = {}, sort = {}, limit = 0, skip = 0, select = '' }) => {
    const finalFilter = { ...filter, isDeleted: { $ne: true } };
    return await findMany({ 
        model, 
        filter: finalFilter, 
        projection, 
        options, 
        sort, 
        limit, 
        skip, 
        select 
    });
}

// // NEW: Manual version control
// export const incrementVersion = async ({ model, filter = {}, options = {} }) => {
//     const updateOptions = { 
//         new: true, 
//         ...options 
//     };
    
//     return await model.findOneAndUpdate(
//         filter, 
//         { 
//             $inc: { __v: 1 },
//             $set: { updatedAt: new Date() }
//         }, 
//         updateOptions
//     );
// }