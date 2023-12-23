const Recepie=require('../models/recepie');
const {cloudinary} =require('../cloudinary');

module.exports.index=async(req,res)=>{
    const recepies=await Recepie.find({});
    res.render('recepies/index',{recepies});
}
module.exports.renderNewForm=(req,res)=>{
    res.render('recepies/new');
}
module.exports.createRecepie=async (req,res,next)=>{
    const recepie=new Recepie(req.body.recepie);
    recepie.images=req.files.map(f=>({url: f.path,filename: f.filename}));
    recepie.author=req.user._id;
    await recepie.save();
    req.flash('success','Successfully made a new recepie!');
    res.redirect(`/recepies/${recepie._id}`)
}
module.exports.showRecepie = async (req, res,) => {
    const recepie = await Recepie.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!recepie) {
        req.flash('error', 'Cannot find that recepie!');
        return res.redirect('/recepies');
    }
    res.render('recepies/show', { recepie });
}
module.exports.renderEditForm=async(req,res)=>{
    const{id}=req.params;
    const recepie=await Recepie.findById(id);
    if(!recepie){
        req.flash('error','cannot find that recepie');
        return res.redirect('/recepies');
    }
    res.render('recepies/edit',{recepie});
}
module.exports.updateRecepie = async (req, res) => {
    const { id } = req.params; 
    console.log(req.body);
    const recepie = await Recepie.findByIdAndUpdate(id, { ...req.body.recepie });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    recepie.images.push(...imgs);
    await recepie.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await recepie.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }  
    console.log(recepie)  
    req.flash('success', 'Successfully updated recepie!');
    res.redirect(`/recepies/${recepie._id}`)
}
module.exports.deleteRecepie = async (req, res) => {
    const { id } = req.params;
    await Recepie.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted recepie')
    res.redirect('/recepies');
}
module.exports.searchRecepie=async(req,res)=>{
    try{
        const searchTerm=req.body.searchTerm;
        const recepie=await Recepie.find({$text: { $search: searchTerm,$diacriticSensitive:true}});
        res.render('recepies/search',{recepie});
    }catch(error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}