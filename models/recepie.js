const mongoose=require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;
const User=require('./user')

const ImageSchema=new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});
const RecepieSchema=new Schema({
    title: String,
    description:String,
    images:[ImageSchema],
    ingridients:String,
    instructions:String,
    cookTime:Number,
    author:{        
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
RecepieSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
               $in: doc.reviews 
            }
        })
    }
    
})
RecepieSchema.index({title: 'text'});

const Recepie=mongoose.model('Recepie',RecepieSchema);
module.exports=Recepie;
