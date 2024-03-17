export async function getProfessors() {
  try {
    const response = await fetch(
      import.meta.env.VITE_REACT_BACKEND_URL + "/professors",
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
    const professors = await response.json();
    return professors;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

export async function sentInstructionDate(selectedDate, professorId) {
  try {
      const response = await fetch(
          import.meta.env.VITE_REACT_BACKEND_URL + "/instructions",
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
              },
              body: JSON.stringify({
                  date: selectedDate,
                  professorId: professorId
              })
          }
      );
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const date = await response.json();
      return date;
  } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
  }
}

export async function getInstructions() {
  const response = await fetch(
    `${import.meta.env.VITE_REACT_BACKEND_URL}/instructions`,
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
  const instructions = await response.json();
  return instructions;
}