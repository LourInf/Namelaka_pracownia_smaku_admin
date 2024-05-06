import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  //we useEffect hook to perform a side effect (fetching data), when the components first loads ([])
  useEffect(() => {
    setLoading(true);
    axios.get("/api/products").then((response) => {
      //console.log(response.data);
      setProducts(response.data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <Link
        className="bg-custom-magenta text-white font-semibold text-2xl py-3 pb-3.5 px-5 rounded-full inline-flex items-center justify-center  hover:bg-custom-dark-magenta hover:font-bold transition"
        href={"/products/new"}
      >
        +
      </Link>
      <div className="bg-neutral-50 rounded-lg pt-1 pb-2 px-5 mt-5 shadow-md">
        <table className="basic mt-8">
          <thead>
            <tr>
              <th>Product name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4}>
                  <div className="flex justify-center items-center">
                    <Spinner />
                  </div>
                </td>
              </tr>
            )}

            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.title}</td>
                <td>
                  {product.images && product.images.length > 0 ? ( // Checking if there are images
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50px",
                      }}
                    /> // Display first image only
                  ) : (
                    <span>No image available</span> // Fallback text if no images are available
                  )}
                </td>
                <td>{product.price} PLN</td>
                <td>
                  <Link href={"/products/edit/" + product._id} className="pl-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="w-5 h-5 sm:w-7 sm:h-7 text-stone-400 icon-scale"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    {/*Edit*/}
                  </Link>
                  <Link href={"/products/delete/" + product._id}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="w-5 h-5 sm:w-7 sm:h-7 text-red-400 icon-scale"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    {/*Delete*/}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
