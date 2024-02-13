
import mongoConnect from "./MONGODB/connection";
import shopModel from "./MONGODB/models/ShopModel";
import discountModel from "./MONGODB/models/DiscountModel";
import DraftOrderModel from "./MONGODB/models/DraftOrderModel";


mongoConnect()
export {
  shopModel, discountModel, DraftOrderModel
}
