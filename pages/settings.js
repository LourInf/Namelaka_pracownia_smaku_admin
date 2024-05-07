import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import Swal from "sweetalert2";

export default function Settings() {
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [featuredProductId, setfeaturedProductId] = useState("");
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [adText, setAdText] = useState("");
  const [subAdText, setSubAdText] = useState("");

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

  return (
    <Layout>
      <h1>Settings</h1>
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
              Save settings
            </button>
          </form>
        </>
      )}
    </Layout>
  );
}
