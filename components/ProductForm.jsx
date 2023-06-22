import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

const ProductForm = ({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
}) => {
  const [title, setTitle] = useState(existingTitle || "");
  const [category, setCategory] = useState(existingCategory || "");
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState(existingImages || []);
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goProducts, setGoProducts] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/category").then((response) => {
      setCategories(response.data);
    }, []);
  });

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
    };
    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    setGoProducts(true);
  }
  if (goProducts) {
    router.push("/products");
  }

  async function uploadImages(e) {
    const files = e.target?.files;
    if (files?.length > 0) {
      setLoading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const response = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...response.data.links];
      });
      setLoading(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  return (
    <form onSubmit={saveProduct}>
      <label htmlFor="">Nombre del producto</label>
      <input
        type="text"
        placeholder="Nombre del producto"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Categoria: </label>
      <select
        className="w-full"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option key={0} value="">
          Sin categoria
        </option>
        {categories.length > 0 &&
          categories.map((cat) => (
            <option key={`category #${cat._id}`} value={cat._id}>
              {cat.name}
            </option>
          ))}
      </select>
      <label>Imagenes del producto</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="h-24">
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {loading && (
          <div className="h-24 bg-gray-200 p-1 flex items-center">
            <Spinner />
          </div>
        )}
        <label className=" w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add image</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
        {!images?.length && <p className="mb-2">No hay imagenes</p>}
      </div>
      <label htmlFor="">Descripción del producto</label>
      <textarea
        placeholder="Descripción"
        name=""
        id=""
        cols="30"
        rows="10"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label htmlFor="">Precio del producto (en COP)</label>
      <input
        type="text"
        placeholder="precio del producto"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Guardar
      </button>
    </form>
  );
};

export default ProductForm;
