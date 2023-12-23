const mongoose=require('mongoose');
const recepies=require('./recepies');
const Recepie=require('../models/recepie');

mongoose.connect('mongodb://0.0.0.0:27017/flavorista',{
    useNewUrlParser: true,
    useUnifiedTopology:true,
});
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});
const seedDB =async()=>{
    await Recepie.deleteMany({});
    for(let i=0;i<Recepie.size();i++){
        const random100=Math.floor(Math.random()*27);
        const rec=new Recepie({
            author:'651ed8ce2c772f4b7b0a4ce3',
            title:`${recepies[i].title}`,
            description:`${recepies[i].description}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dnbbc3wae/image/upload/v1696785899/Flavorista/pbizqipl3yyzthz07jkw.jpg',
                  filename:  'Flavorista/pbizqipl3yyzthz07jkw'
                },
                {
                  url:  'https://res.cloudinary.com/dnbbc3wae/image/upload/v1696785109/Flavorista/yaybdfn5dcwgcxtk3vac.jpg',
                  filename:  'Flavorista/yaybdfn5dcwgcxtk3vac'
                }
             
      
            ],
            ingridients:`${recepies[i].ingredients}`,
            instructions:`${recepies[i].instructions}`,
            cookTime: `${recepies[i].cookTime}`
        })
        await rec.save();

    }
}
seedDB().then(()=>{
    mongoose.connection.close()
});