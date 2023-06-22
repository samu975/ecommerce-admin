import LayoutAdmin from "@/components/LayoutAdmin";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedcategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    axios.get("/api/category").then((response) => {
      setCategories(response.data);
    });
  }

  async function saveCategory(e) {
    e.preventDefault();
    const data = { name, parent };
    if (editedcategory) {
      data._id = editedcategory._id;
      await axios.put(`/api/category`, data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/category", data);
    }
    setName("");
    setParent("");
    getCategories();
  }

  async function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParent(category.parent?._id);
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: "You will not be able to recover this category: " + category.name,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#d33",
        showCancelButton: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const _id = category._id;
          axios.delete(`/api/category?_id=${_id}`).then(() => getCategories());
        }
      });
  }

  return (
    <LayoutAdmin>
      <h1>Categories</h1>
      <label htmlFor="">
        {editedcategory
          ? `Edit category ${editedcategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          placeholder={"Category name"}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <select
          className="mb-0 border"
          value={parent}
          onChange={(e) => setParent(e.target.value)}
        >
          <option key={0} value="0">
            No parent category
          </option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category.name + category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={`tr-${category.name}`}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-primary mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="btn-primary"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </LayoutAdmin>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
