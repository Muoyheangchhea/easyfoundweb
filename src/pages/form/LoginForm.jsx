import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../auth/register";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../../components/animations/login.json";
import animationData2 from "../../components/animations/online-sales.json";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function LoginForm({ handleLogin }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const regex = /^.{5,}$/;

  const handleLoginSubmit = async (values) => {
    setLoading(true);
    try {
      const loginRes = await login(values);
      console.log("Login Response:", loginRes);
      if (loginRes.access) {
        localStorage.setItem("accessToken", loginRes.access);
        handleLogin(loginRes.access); // Call handleLogin to update navbar state
        toast.success("Login Successfully");

        navigate("/");
      } else if (loginRes.message) {
        toast.error(loginRes.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/"); // Navigate back to the home page
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Login</title>
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
          <meta
            property="og:url"
            content="https://easyfound-cstad.vercel.app/"
          />
          <link rel="canonical" href="https://easyfound-cstad.vercel.app/" />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://easyfound.automatex.dev/media/uploads/category_0a492b09-90d5-4a29-b21c-944f54693dab.png"
          />
        </Helmet>

        <section className="grid grid-cols-1 md:grid-cols-2 h-screen max-w-screen-xl min-w-80 mx-auto relative">
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-4 right-32 text-2xl font-bold text-gray-500 hover:text-gray-800"
            onClick={handleClose}
          >
            &#10005; {/* This is the "X" character */}
          </button>

          <div className="md:flex items-center justify-start hidden">
            <Lottie
              animationData={animationData}
              className="h-[500px] pt-10 dark:hidden"
              loop
            />
            <Lottie
              animationData={animationData2}
              className="h-[500px] pt-10 hidden dark:flex"
              loop
            />
          </div>

          <div className="h-screen md:h-auto grid place-content-center ">
            <div className="grid gap-8">
              <section id="back-div" className="rounded-3xl">
                <div className="border-8 border-transparent rounded-xl bg-white dark:bg-gray-900 shadow-xl p-8 m-2">
                  <h1 className="text-5xl font-bold text-center cursor-default dark:text-gray-300 text-gray-900 mb-10">
                    Log in
                  </h1>
                  <Formik
                    initialValues={{
                      email: "",
                      password: "",
                    }}
                    validationSchema={Yup.object({
                      email: Yup.string()
                        .email("Email is invalid")
                        .required("Email is required"),
                      password: Yup.string()
                        .matches(
                          regex,
                          "Password must be at least 5 characters long."
                        )
                        .required("Password is required"),
                    })}
                    onSubmit={async (values, { resetForm }) => {
                      await handleLoginSubmit(values);
                      resetForm(); // Reset after handling login
                    }}
                  >
                    <Form
                      className="space-y-6"
                      onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                    >
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-lg dark:text-gray-300"
                        >
                          Email
                        </label>
                        <Field
                          id="email"
                          name="email"
                          className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-amber-500 transition transform hover:scale-105 duration-300"
                          type="email"
                          placeholder="Email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-600"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="block mb-2 text-lg dark:text-gray-300"
                        >
                          Password
                        </label>
                        <Field
                          id="password"
                          name="password"
                          className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-amber-500 transition transform hover:scale-105 duration-300"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-600"
                        />
                      </div>

                      <a
                        href="#"
                        className="text-amber-400 text-sm transition hover:underline"
                      >
                        Forget your password?
                      </a>

                      <button
                        className="text-white bg-amber-700 flex items-center px-8 py-3 rounded-full"
                        type="submit"
                      >
                        Login
                      </button>
                    </Form>
                  </Formik>

                  <div className="flex flex-col mt-4 text-sm text-center dark:text-gray-300">
                    <p>
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-amber-400 transition hover:underline"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>

                  <div
                    id="third-party-auth"
                    className="flex justify-center gap-4 mt-5"
                  >
                    <button className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg">
                      <img
                        className="w-6 h-6"
                        loading="lazy"
                        src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
                        alt="Google"
                      />
                    </button>
                    <button className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg">
                      <img
                        className="w-6 h-6"
                        loading="lazy"
                        src="https://ucarecdn.com/95eebb9c-85cf-4d12-942f-3c40d7044dc6/"
                        alt="LinkedIn"
                      />
                    </button>
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    <p>
                      By signing in, you agree to our{" "}
                      <a
                        href="#"
                        className="text-amber-400 transition hover:underline"
                      >
                        Terms
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-amber-400 transition hover:underline"
                      >
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </HelmetProvider>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
}
