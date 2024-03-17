export async function getSubjects() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/subjects`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const subjects = response.json();
    return subjects;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

export async function getSubject(url) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/subject/${url}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const subject = response.json();
    return subject;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

export async function createSubject(data) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/subject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const subject = response.json();
    return subject;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}