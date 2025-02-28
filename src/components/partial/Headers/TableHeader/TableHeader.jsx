// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { IoPersonAdd } from "react-icons/io5";
// import { VscDebugRestart } from "react-icons/vsc";
// import Swal from "sweetalert2";
// import "sweetalert2/dist/sweetalert2.min.css";

// function TableHeader({
//   setIsShowRegister,
//   totalItems,
//   setResetFields,
//   isMember = true,
//   isReset = true,
//   title = "All Members",
// }) {
//   const navigate = useNavigate();
//   const [isRotating, setIsRotating] = useState<any>(false);

//   const handleClick = () => {
//     setIsRotating(true);
//     setTimeout(() => setIsRotating(false), 500); // Reset after animation
//   };

//   const showAlert = (message) => {
//     Swal.fire({
//       icon: "info",
//       title: message,
//       confirmButtonText: "OK",
//     });
//   };

//   return (
//     <div className="flex flex-col md:gap-0 gap-2 md:flex-row items-center justify-between">

//       {isMember && (
//         <b>
//           <span className="font-medium text-xl" id="MemberStatus">
//             {title}
//           </span>
//         </b>
//       )}
//       {!isMember && (
//         <button
//           id="btnAddMember"
//           type="button"
//           className="btn btn-xs btn-neutral rounded-full"
//           data-toggle="modal"
//           data-target="#MemberCreateModal"
//           onClick={() => navigate(-1)}
//         >
//           Go Back
//         </button>
//       )}

//       <div className="flex md:gap-5 w-full md:justify-end justify-between mt-3 md:mt-0 mb-3">
//         {isReset && (
//           <div
//             className="flex md:gap-3 gap-1 py-2 text-sm md:text-base px-3 cursor-pointer items-center hover:bg-yellow-700 hover:text-white md:py-2 md:px-4 rounded-xl border hover:border-transparent text-gray-700 border-yellow-400 transition duration-300"
//             onClick={() => {
//               handleClick();
//               setResetFields((prevValue) => (prevValue += 1));
//             }}
//           >
//             <button
//               id="btnAddMember"
//               type="button"
//               className="font-semibold"
//               data-toggle="modal"
//               data-target="#MemberCreateModal"
//             >
//               Reset Fields
//             </button>

//             <VscDebugRestart
//               className={`transform transition-transform duration-500 ${
//                 isRotating ? "rotate-[360deg]" : ""
//               }`}
//               style={{
//                 transform: isRotating ? "rotate(-360deg)" : "rotate(0)",
//               }}
//             />
//           </div>
//         )}

//         {isMember && (
//           <div className="space-x-4">
//             <div className="flex md:gap-3 gap-1 py-2 text-sm md:text-base px-3 cursor-pointer items-center bg-yellow-500 text-white md:py-2 md:px-4 rounded-xl shadow hover:bg-transparent hover:bg-yellow-600 hover:border border hover:border-gray-300 hover:shadow-none transition duration-300">
//               <button
//                 id="btnAddMember"
//                 type="button"
//                 className="font-semibold"
//                 data-toggle="modal"
//                 data-target="#MemberCreateModal"
//                 onClick={() => setIsShowRegister(true)}
//               >
//                 Register Member
//               </button>

//               <IoPersonAdd />
//             </div>

//             {/* Eface Button */}

//           </div>

//         )}
//       </div>
//     </div>
//   );
// }

// export default TableHeader;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoPersonAdd } from "react-icons/io5";
import { VscDebugRestart } from "react-icons/vsc";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function TableHeader({
  setIsShowRegister,
  totalItems,
  setResetFields,
  isMember = true,
  isReset = true,
  title = "All Members",
}) {
  const navigate = useNavigate();
  const [isRotating, setIsRotating] = useState < any > false;

  const handleClick = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500); // Reset after animation
  };

  const showAlert = (message) => {
    Swal.fire({
      icon: "info",
      title: message,
      confirmButtonText: "OK",
    });
  };

  const handleEface = () => {
    showAlert("Eface functionality triggered");
    // Add your specific logic for Eface here
  };

  const handleAttendanceSync = () => {
    showAlert("Attendance Sync functionality triggered");
    // Add your specific logic for Attendance Sync here
  };

  return (
    <div className="flex flex-row items-center justify-between">
      {/* Left side: Title */}
      {isMember && (
        <div className="flex items-center">
          <b>
            <span className="font-medium text-xl" id="MemberStatus">
              {title}
            </span>
          </b>
          <span className="text-gray-500 ml-2">({totalItems} items)</span>
        </div>
      )}

      {!isMember && (
        <button
          id="btnAddMember"
          type="button"
          className="btn btn-xs btn-neutral rounded-full"
          data-toggle="modal"
          data-target="#MemberCreateModal"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      )}

      {/* Right side: Buttons */}
      <div className="flex gap-3">
        {/* Button 1: Reset Fields */}
        {isReset && (
          <div
            className="flex gap-1 py-2 px-3 cursor-pointer items-center hover:bg-yellow-700 hover:text-white rounded-xl border hover:border-transparent text-gray-700 border-yellow-400 transition duration-300"
            onClick={() => {
              handleClick();
              setResetFields((prevValue) => (prevValue += 1));
            }}
          >
            <button className="font-semibold" type="button">
              Reset Fields
            </button>
            <VscDebugRestart
              className={`transform transition-transform duration-500 ${
                isRotating ? "rotate-[360deg]" : ""
              }`}
              style={{
                transform: isRotating ? "rotate(-360deg)" : "rotate(0)",
              }}
            />
          </div>
        )}
        <button
          className="btn btn-outline btn-info px-10 "
          onClick={handleEface}
        >
          Eface
        </button>

        {/* Button 4: Attendance Sync */}
        <button
          className="btn btn-outline btn-success"
          onClick={handleAttendanceSync}
        >
          Attendance Sync
        </button>

        {/* Button 2: Register Member */}
        {isMember && (
          <div className="flex gap-1 py-2 px-3 cursor-pointer items-center bg-yellow-500 text-white rounded-xl shadow hover:bg-yellow-600 transition duration-300">
            <button
              id="btnAddMember"
              type="button"
              className="font-semibold"
              onClick={() => setIsShowRegister(true)}
            >
              Register Member
            </button>
            <IoPersonAdd />
          </div>
        )}
      </div>
    </div>
  );
}

export default TableHeader;
