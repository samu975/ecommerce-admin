import LayoutAdmin from "@/components/LayoutAdmin";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {
  return (
    <LayoutAdmin>
      <h1>Nuevo producto</h1>
      <ProductForm />
    </LayoutAdmin>
  );
}
