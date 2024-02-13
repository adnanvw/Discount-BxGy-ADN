import mongoose from "mongoose";
const draftOrderSchema = new mongoose.Schema({
  draftOrderID: {
    type: String,
    required: true, 
  },
  createdAt: {
    type: Date,
    required: true, 
  },
});

const DraftOrderModel = mongoose.model("DraftOrder", draftOrderSchema);

export default DraftOrderModel;
