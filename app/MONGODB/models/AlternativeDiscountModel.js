import mongoose from 'mongoose'

const AlternativeDiscountSchema = new mongoose.Schema({
    discountTitle: {
        type: String,
        required: true
    },
    discountValueType: {
        type: String,
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    }
})

const AlternativeDiscountModel = mongoose.model.AlternativeDiscountData || mongoose.model('AlternativeDiscountData', AlternativeDiscountSchema)

export default AlternativeDiscountModel





