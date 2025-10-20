export const asyncHandler = (fn)=>
{
    return async (req,res,next) =>
    {
        try {
            await fn(req,res,next)
        } catch (error) {
            // console.log({status : error.cause})
            next(error,{cause : error.cause})
        }
    }
}