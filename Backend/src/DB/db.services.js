export const findOne = async ({model , filter = {},projection={} , options={}})=>
{
    return await model.findOne(filter,projection,options)
}

export const create = async ({model , data={},options={}})=>
{
    const result = await model.create([data], options);
    return result[0]
}