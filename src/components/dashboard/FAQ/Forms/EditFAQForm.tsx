import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hook/useAxiosSecure";

export default function EditFAQForm({ targetId, setIsShowModal, isShowModal }) {
  const [question, setQuestion] = useState < any > "";
  const [answer, setAnswer] = useState < any > "";
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    async function fetchQuestionData() {
      try {
        const res = await axiosSecure.get(`/faq/${targetId}`);
        const questionData = res?.data?.data;

        // Populate form fields with existing data
        setQuestion(questionData.question);
        setAnswer(questionData.answer);
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    }

    if (targetId) {
      fetchQuestionData();
    }

    if (!isShowModal) {
      handleCloseModal();
    }
  }, [targetId, axiosSecure, isShowModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("question", question);
    formData.append("answer", answer);

    try {
      const res = await axiosSecure.put(`/faq/${targetId}`, formData);

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "question updated successfully",
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
      setIsShowModal(false);
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong!",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
    setQuestion("");
  };

  return (
    <div className="w-[80%] bg-gray-100 p-10">
      <div className="w-full mx-auto bg-white p-8 shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-5">Edit Product Color Form</h1>
        <form onSubmit={handleSubmit}>
          {/* Model Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              question *
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Model Name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Answer *
            </label>
            <textarea
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-2 border rounded-md min-h-[200px]"
              placeholder="Model Name"
              required
            />
          </div>

          <div className="flex justify-end mt-4 gap-6">
            <button
              type="button"
              className="w-full p-3 bg-gray-500 text-white font-bold rounded-md"
              onClick={() => handleCloseModal()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white font-bold rounded-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
