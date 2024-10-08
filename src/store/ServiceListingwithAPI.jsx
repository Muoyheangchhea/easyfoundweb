import { useEffect, useState } from "react";
import { getAllProduct } from "./getAllProduct";
import { ProductCardClone } from "./CardClone";
import Lottie from "lottie-react";
import Loading from "../components/animations/loading.json";
import { SearchBar } from "../components/seaction/searchpage/SearchBar";
import LogoGP from "../assets/img/LogoCP1.png";
import PaginatedProductList from "./Pagenation";
import { Helmet, HelmetProvider } from "react-helmet-async";

export function TestAPI() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(""); // Store the selected category
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch products based on selected category
  const fetchAllProduct = async (category) => {
    setLoading(true);
    const product = await getAllProduct(category); // Fetch products based on selected category
    setData(product);
    setLoading(false);
  };

  // Effect to fetch products when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      fetchAllProduct(selectedCategory); // Fetch products when selectedCategory changes
    }
  }, [selectedCategory]);

  // Fetch all products initially
  useEffect(() => {
    fetchAllProduct(""); // Fetch all products when the component mounts
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = data.slice(indexOfFirstItem, indexOfLastItem); // Display products starting from index 8

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle back button click
  const handleBackClick = () => {
    setSelectedCategory(""); // Reset selected category
    fetchAllProduct(""); // Fetch all products again
    setCurrentPage(1); // Reset to the first page
  };

  const handleSearch = (query) => {
    console.log("Searching for: ", query);
    // Implement the search logic here
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>service listing</title>
        <meta
          name="description"
          content="Welcome to Easy Found, Cambodia’s premier service listing platform! Explore a wide range of trusted local services, from restaurants to repair shops, all in one place. Let Easy Found connect you to what you need with just a few clicks!"
        />
        <meta
          name="keywords"
          content="service listing, Cambodia, local services, restaurants, repair shops"
        />
        <meta name="author" content="Easy Found" />
        <link rel="canonical" href="https://easyfound-cstad.vercel.app/" />
        <meta
          property="og:title"
          content="Easy Found - Cambodia's Premier Service Listing Platform"
        />
        <meta
          property="og:description"
          content="Explore trusted local services, from restaurants to repair shops, all in one place!"
        />
        <meta property="og:url" content="https://easyfound-cstad.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://easyfound.automatex.dev/media/uploads/category_0a492b09-90d5-4a29-b21c-944f54693dab.png"
        />
      </Helmet>
      <div className="max-w-screen-xl min-w-80 mx-auto px-10 md:p-4">
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <SearchBar
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
            onSearch={handleSearch}
          />{" "}
          {/* Pass category to setSelectedCategory */}
          {/* Back Button */}
{/* \ */}
        </div>

        <div className="flex flex-col gap-10">
          {loading && (
            <div className="text-center">
              <Lottie
                animationData={Loading}
                className="h-[300px]"
                loop={true}
              />
            </div>
          )}
          {!loading && (
            <>
              {currentProducts.map((product) => (
                <ProductCardClone
                  key={product.id}
                  title={product.name}
                  category={product.category}
                  day={product.working_days}
                  price={product.price}
                  description={product.description}
                  id={product.id}
                  images={product?.image ?? LogoGP}
                />
              ))}

              {/* Pagination Component */}
              <PaginatedProductList
                itemsPerPage={itemsPerPage}
                totalItems={data.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          )}
        </div>
      </div>
    </HelmetProvider>
  );
}
