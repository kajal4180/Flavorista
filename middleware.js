const{ recepieSchema,reviewSchema}=require('./schemas.js');
const ExpressError=require('./utils/ExpressError');
const Recepie=require('./models/recepie');
const User=require('./models/user');
const Review=require('./models/review');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','you must be signed in');
        return res.redirect('/login');
    }
    next()
}
module.exports.validateRecepie =(req,res,next)=>{
    const { error }=recepieSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}
module.exports.isAuthor=async(req,res,next)=>{
    const { id }=req.params;
    const recepie =await Recepie.findById(id);
    if(!recepie.author.equals(req.user._id)){
        req.flash('error','You do not have pemission to do that');
        return res.redirect(`/recepies/${id}`);
    }
    next();
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId }=req.params;
    const review =await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You dont have permission too do this!!');
        return res.redirect(`/recepies/${id}`);
    }  
    next();

}
module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}