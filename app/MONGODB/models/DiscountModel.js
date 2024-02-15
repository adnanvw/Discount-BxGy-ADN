import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    discountTitle: String,
    discountValue: Number,
})

const discountModel = mongoose.models.discountData || mongoose.model("discountData", discountSchema);


export default discountModel;




