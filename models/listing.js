const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = Schema({
    title : {
        type : String,
        require : true,
    },

    description : String,
    image :{
        type : String,
        set : (v) => v === " " ? "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg" : v,
    },
    price : Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;