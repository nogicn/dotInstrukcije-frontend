import axios from "axios";

export const handleLogin = async (data, user) => {
  try {
    // Send a POST request to the /login/student endpoint
    const response = await fetch(
      import.meta.env.VITE_REACT_BACKEND_URL + "/login/" + user,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    // Check if the request was successful
    if (response.ok) {
      const result = await response.json();

      // Clear previous token and user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Save the token to the local storage
      localStorage.setItem("token", result.token);
      if (user === "student") {
        result.student.status = "student";
      } else {
        result.professor.status = "professor";
      }

      localStorage.setItem(
        "user",
        JSON.stringify(user === "student" ? result.student : result.professor)
      );
      window.location.href = "/";
    } else {
      console.error("Failed to login");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

export const handlerRegister = async (formData, user) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_REACT_BACKEND_URL + "/register/" + user,
      formData,
      {}
    );

    if (response.status === 201) {
      console.log(user + " registered successfully");
      window.location.href = "/login";
    } else {
      console.error(response.status + " " + response.statusText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};
