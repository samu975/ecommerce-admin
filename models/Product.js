const { Schema, model, default: mongoose } = require("mongoose");

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
});
export let Product;
if (mongoose.models.Product) {
  Product = mongoose.model("Product");
} else {
  Product = model("Product", ProductSchema);
}
