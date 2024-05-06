import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

export default function EditProdcutPage() {
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  //console.log({ router }); // inside router we can find product id inside query --> id (name of our file)
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    axios.get("/api/products?id=" + id).then((response) => {
      // console.log(response.data);
      setProductInfo(response.data);
      setLoading(false);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Edit Product</h1>
      {loading && <Spinner />}
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
}
