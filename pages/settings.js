import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import Swal from "sweetalert2";
import { ReactSortable } from "react-sortablejs";

export default function Settings() {
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [featuredProductId, setfeaturedProductId] = useState("");
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [adText, setAdText] = useState("");
  const [subAdText, setSubAdText] = useState("");
  const [carouselImages, setCarouselImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setProductLoading(true);
    axios.get("/api/products").then((res) => {
      setProducts(res.data);
      setProductLoading(false);
    });
    setFeaturedLoading(true);
    axios
      .get("/api/settings?name=featuredProductId")
      .then((response) => {
        if (response.data) {
          setfeaturedProductId(response.data.value); // setting value is stored in 'value'
          setAdText(response.data.adText || ""); // Set adText from the fetched data to make it visible in the input
          setSubAdText(response.data.subAdText || "");
          setFeaturedLoading(false);
        }
      })
      .catch((error) => console.error("Failed to fetch settings:", error));
    setFeaturedLoading(false);
  }, []);

  async function saveSettings(e) {
    e.preventDefault();
    setFeaturedLoading(true);
    await axios
      .put("/api/settings", {
        name: "featuredProductId",
        value: featuredProductId,
        adText: adText,
        subAdText: subAdText,
      })
      .then(() => {
        Swal.fire(
          "Success",
          "Featured product updated successfully",
          "success"
        );
        setFeaturedLoading(false);
      })
      .catch((error) => {
        console.error("Failed to save settings:", error);
        Swal.fire("Error", "Failed to update featured product", "error");
        setFeaturedLoading(false);
      });
  }

  useEffect(() => {
    fetchCarouselSettings();
  }, []);

  const fetchCarouselSettings = async () => {
    const response = await axios.get("/api/carouselSettings");
    setCarouselImages(response.data.images || []);
  };

  const uploadImages = async (e) => {
    const files = e.target.files;
    if (files.length) {
      setIsUploading(true);
      const formData = new FormData();
      for (let file of files) {
        formData.append("file", file);
      }
      try {
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setCarouselImages([...carouselImages, ...response.data.links]);
      } catch (error) {
        console.error("Error uploading files:", error);
        Swal.fire("Error", "Failed to upload images", "error");
      } finally {
        setIsUploading(false); //called no matter the outcome
      }
    }
  };

  const saveCarouselSettings = async () => {
    await axios
      .put("/api/carouselSettings", { images: carouselImages })
      .then(() =>
        Swal.fire("Success", "Carousel images updated successfully", "success")
      )
      .catch((error) =>
        Swal.fire("Error", "Failed to update carousel images", "error")
      );
  };

  return (
    <Layout>
      <h1>Header Images Settings</h1>
      <label>Photos</label>
      {isUploading && <Spinner />}
      <div className="mb-2 flex flex-wrap gap-3">
        <ReactSortable
          list={carouselImages}
          setList={setCarouselImages}
          className="flex flex-wrap gap-1"
        >
          {carouselImages.map((image, index) => (
            <div key={index} className="w-24 h-24 relative">
              <img
                src={image}
                alt={`Slide ${index}`}
                className="object-cover rounded-lg w-full h-full"
              />
              <button
                onClick={() => {
                  const updatedImages = carouselImages.filter(
                    (_, i) => i !== index
                  );
                  setCarouselImages(updatedImages);
                }}
                className="absolute right-0 top-0 text-white bg-red-300 rounded p-1"
              >
                &times;
              </button>
            </div>
          ))}
        </ReactSortable>
        <label
          htmlFor="file-upload"
          className="w-24 h-24 flex items-center justify-center shadow-md text-gray-500 rounded-lg bg-gray-200 cursor-pointer  hover:bg-gray-300 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 hover:w-6 hover:h-6 transition"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          multiple // Allow multiple file selection
          onChange={uploadImages}
        />
      </div>
      <button onClick={saveCarouselSettings} className="mt-2 btn-primary">
        Save
      </button>
      <h1 className="mt-20">Featured Product Settings</h1>
      {(productLoading || featuredLoading) && <Spinner />}
      {!productLoading && !featuredLoading && (
        <>
          <form onSubmit={saveSettings}>
            <label>Featured Product</label>
            <select
              value={featuredProductId}
              onChange={(e) => setfeaturedProductId(e.target.value)}
            >
              <option value="">No featured Product</option>
              {products.length > 0 &&
                products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
            </select>
            <label>Featured Product Ad Text</label>
            <input
              type="text"
              value={adText}
              onChange={(e) => setAdText(e.target.value)}
              placeholder="Enter ad text"
            />
            <label>Featured Product SubAd Text</label>
            <input
              type="text"
              value={subAdText}
              onChange={(e) => setSubAdText(e.target.value)}
              placeholder="Enter SubAd text"
            />
            <button type="submit" className="btn-primary">
              Save
            </button>
          </form>
        </>
      )}
    </Layout>
  );
}
