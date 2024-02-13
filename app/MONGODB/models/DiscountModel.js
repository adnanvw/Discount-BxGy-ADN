import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    discountTitle: String,
    selectedCollection: String,
    discountValue: Number,
    offerType: String,
    discountMethod: String,
    storeURL: String
})

const discountModel = mongoose.model("discountData", discountSchema);

export default discountModel;




