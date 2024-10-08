import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const isKhmerText = (text) => {
  const khmerRegex = /[\u1780-\u17FF]/;
  return khmerRegex.test(text);
};

const FeedbackForm = ({ shopename, id }) => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [showAlert, setShowAlert] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [reviews, setReviews] = useState([]); // State to hold fetched reviews
  const khmerTitleClass = isKhmerText(shopename) ? "font-kh" : "font-pacifico"; // Use shopename instead of title

  const handleTextareaFocus = (event) => {
    if (!accessToken) {
      setShowAlert(true);
      event.preventDefault();
      event.target.blur();
    }
  };

  const svcid = id;

  useEffect(() => {
    console.log("Fetched single product:", shopename);
    console.log("Service ID being used:", svcid);
  }, [shopename, svcid]);

  // Fetch reviews from the API
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        "https://easyfound.automatex.dev/api/reviews/"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setReviews(data); // Set the fetched reviews to state
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews(); // Call the function to fetch reviews when the component mounts
  }, []); // Empty dependency array to run only on mount

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const submitReview = async (reviewData) => {
    try {
      const response = await fetch(
        "https://easyfound.automatex.dev/api/reviews/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error submitting review:", error);
      return { error: "An error occurred while submitting the review." };
    }
  };

  const handleSubmit = async () => {
    console.log("service id ", id);
    if (!accessToken) {
      navigate("/login");
    } else {
      const reviewData = {
        comment: feedback,
        rate_star: 5, // Assuming a default star rating
        service: svcid,
      };

      const result = await submitReview(reviewData);

      if (result.error) {
        console.log("Review submission failed:", result.error);
      } else {
        console.log("Review submitted successfully:", result);
        setFeedback(""); // Clear the feedback field after submission
        fetchReviews(); // Refetch reviews to display the new review
      }
    }
  };

  return (
    <div className={`md:flex mb-10 rounded-lg flex flex-col ${khmerTitleClass}`}>
      <div className="bg-white grid grid-cols-6 gap-2 rounded-xl p-5 text-sm">
        <h1 className="font-poppins text-center text-black text-xl font-bold col-span-6">
          Send Feedback to{" "}
          <span className="text-amber-500 font-pacifico">
            {shopename}
          </span>
        </h1>
  
        {/* Textarea for feedback */}
        <textarea
          placeholder="I love this service so much it makes me easy and efficient....."
          className="bg-slate-100 text-slate-600 h-28 placeholder:text-slate-600 placeholder:opacity-50 border border-slate-200 col-span-6 resize-none outline-none rounded-lg p-2 duration-300 focus:border-slate-600"
          value={feedback}
          onChange={handleFeedbackChange}
          onFocus={handleTextareaFocus}
        ></textarea>
  
        {/* Feedback button */}
        <button
          className="fill-slate-600 col-span-1 flex justify-center items-center rounded-lg p-2 duration-300 bg-slate-100 hover:border-slate-600 focus:fill-blue-200 focus:bg-blue-400 border border-slate-200"
          onClick={handleSubmit}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 0 512 512"
          >
            <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path>
          </svg>
        </button>
  
        {/* Alert Message */}
        {showAlert && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
            <div className="flex flex-col gap-2 w-80 sm:w-72 text-[10px] sm:text-xs">
              <div className="error-alert cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg bg-[#232531] px-[10px]">
                <div className="flex gap-2">
                  <div className="text-[#d65563] bg-white/5 backdrop-blur-xl p-1 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 1 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white">Please log in to provide feedback!</p>
                    <p className="text-gray-500">You need to log in first to type your feedback.</p>
                  </div>
                </div>
                <button
                  className="text-gray-600 hover:bg-white/10 p-1 rounded-md transition-colors ease-linear"
                  onClick={handleCloseAlert}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
  
              {/* Link to Login */}
              <Link
                to="/login"
                className="w-full bg-blue-500 text-white rounded-md py-2 text-center hover:bg-blue-600 transition duration-300"
              >
                Log In
              </Link>
            </div>
          </div>
        )}
  
        {/* Display fetched reviews */}
        <div className="col-span-6 mt-4">
          <h2 className="text-lg font-bold font-pacifico">Reviews:</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-slate-200 pb-2 mb-2">
                <p className="font-medium font-pacifico">{review.comment}</p>{" "}
                {/* Adjust according to your API response */}
                <p className="text-yellow-500">Rating: {review.rate_star}</p>{" "}
                {/* Adjust according to your API response */}
              </div>
            ))
          ) : (
            <p className="font-pacifico">No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
}  

export default FeedbackForm;
