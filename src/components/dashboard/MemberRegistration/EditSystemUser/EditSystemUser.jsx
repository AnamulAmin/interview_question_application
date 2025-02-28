import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
import Swal from "sweetalert2";
import DragEditUploadImageInput from "../../../../shared/DragEditUploadImageInput";
import { useDropzone } from "react-dropzone";
import useAxiosSecure from "../../../../Hook/useAxiosSecure";
import MemberRegisterSelect from "../MemberRegisterSelect/MemberRegisterSelect";
import MemberRegisterInput from "../MemberRegisterInput/MemberRegisterInput";
import useGetDepartments from "../../../../Hook/GetDepartments/useGetDepartments";

const schema = z.object({
  first_name: z.string().nonempty({ message: "Please enter your first name" }),
  last_name: z.string().nonempty({ message: "Please enter your last name" }),
  role: z.string().nonempty({ message: "Please enter the role" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  contact_no: z
    .string()
    .regex(/^\d{11}$/, { message: "Please enter a valid phone number" }),
  address: z.string().optional(),
  gender: z.string().nonempty({ message: "Please select your gender" }),
  status: z.string().optional(),
});

function EditSystemUser({ setIsShow, isShow, targetId }) {
  const [errorMessage, setErrorMessage] = useState < any > "";
  const [loading, setLoading] = useState < any > false;
  const [image, setImage] = useState < any > null;
  const [imagePreview, setImagePreview] = useState < any > null;

  const axiosSecure = useAxiosSecure();
  const departments = useGetDepartments();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  console.log(errors, "errors edit");

  useEffect(() => {
    const branch = "";
    if (targetId) {
      const fetchUserData = async () => {
        try {
          const response = await axiosSecure.get(
            `/users/system-user/${targetId}?${branch}`
          );
          if (response?.status === 200) {
            const data = response.data;
            Object.keys(data).forEach((fieldName) => {
              setValue(fieldName, data[fieldName]);
            });
          }

          setImagePreview(response.data.photourl);
        } catch (error) {
          console.log(error);
          toast.error("Failed to load user data");
        }
      };
      fetchUserData();
    }
  }, [targetId, axiosSecure, setValue, isShow]);

  const onSubmit = async (data) => {
    // setLoading(true);
    // data.branch = branch;

    console.log(data);

    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("contact_no", data.contact_no);
    formData.append("address", data.address);
    formData.append("gender", data.gender);
    formData.append("status", data.status);
    formData.append("role", data.role);
    formData.append("photourl", image ? image : imagePreview);

    try {
      const response = await axiosSecure.put(
        `/users/system-user/${targetId}`,
        formData
      );
      if (response?.status === 200 || response?.status === 201) {
        toast.success("System User Registration successful!");
        setIsShow(false);
        reset();
        setErrorMessage("");
      }
    } catch (error) {
      handleApiErrors(error);
    } finally {
      setLoading(false);
    }
  };

  // Dropzone for thumbnail and gallery
  const onDropThumbnail = (acceptedFiles) => {
    const file = acceptedFiles[0]; // Assuming one file for simplicity

    // Create a local URL for the dropped image
    const previewUrl = URL.createObjectURL(file);

    // Set the state with the URL
    setImagePreview(previewUrl);

    setImage(acceptedFiles[0]);
  };

  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
  } = useDropzone({
    onDrop: onDropThumbnail,
    accept: "image/*",
    multiple: false,
  });

  const handleApiErrors = (error) => {
    if (error?.response?.status === 409) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage.includes("email") && errorMessage.includes("mobile")) {
        setError("email", { type: "manual", message: "Email already exists." });
        setError("contact_no", {
          type: "manual",
          message: "Mobile number already exists.",
        });
      } else if (errorMessage.includes("email")) {
        setError("email", { type: "manual", message: "Email already exists." });
      } else if (errorMessage.includes("mobile")) {
        setError("contact_no", {
          type: "manual",
          message: "Mobile number already exists.",
        });
      }
    } else if (error?.response?.status === 401) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage === "Member ID already exists.") {
        setError("member_id", {
          type: "manual",
          message: "Member ID already exists.",
        });
      }
    } else if (error?.response?.status === 400) {
      setErrorMessage("Invalid input, please check your data.");
    } else {
      setErrorMessage("Something went wrong! Please try again.");
    }
  };

  return (
    <article
      className={`w-full rounded-xl bg-white my-7 transition-all duration-500 ${
        isShow ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <h2 className="px-5 py-1 border-b border-gray-300 flex justify-between items-center w-full">
        <span className="font-bold text-2xl mt-2">Add User</span>
      </h2>

      {/* Display error message */}
      {errorMessage && (
        <div className="text-red-600 font-semibold px-5 py-2 text-center">
          {errorMessage}
        </div>
      )}

      <form className="md:px-5 px-3 py-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Profile Image
          </label>

          <DragEditUploadImageInput
            getRootProps={getThumbnailRootProps}
            getInputProps={getThumbnailInputProps}
            image={image}
            imagePreview={imagePreview}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <MemberRegisterInput
            type={"text"}
            register={register}
            error={errors}
            name={"first_name"}
            isRequired={true}
            label={"First Name*"}
          />
          <MemberRegisterInput
            type={"text"}
            register={register}
            error={errors}
            name={"last_name"}
            isRequired={true}
            label={"Last Name*"}
          />

          <MemberRegisterInput
            type={"email"}
            label={"Email*"}
            register={register}
            error={errors}
            name={"email"}
            isRequired={true}
          />

          <MemberRegisterInput
            type={"text"}
            label={"phone number*"}
            register={register}
            error={errors}
            name={"contact_no"}
            isRequired={true}
          />

          <MemberRegisterSelect
            type={"text"}
            label={"Gender *"}
            register={register}
            error={errors}
            name={"gender"}
            isRequired={true}
          >
            <option value={""}>Select Gender</option>
            <option value={"Male"}>Male</option>
            <option value={"Female"}>Female</option>
          </MemberRegisterSelect>

          <MemberRegisterSelect
            type={"text"}
            label={"Role *"}
            register={register}
            error={errors}
            name={"role"}
            isRequired={true}
          >
            <option value={""}>Select role</option>
            {departments?.length > 0 &&
              departments.map((item: any, index: number) => (
                <option key={index} value={item.Role}>
                  {item.Role}
                </option>
              ))}
          </MemberRegisterSelect>

          <MemberRegisterInput
            type={"text"}
            label={"Address"}
            register={register}
            error={errors}
            name={"address"}
            isRequired={false}
          />

          <MemberRegisterSelect
            type={"text"}
            label={"Marital Status"}
            register={register}
            error={errors}
            name={"status"}
            isRequired={false}
          >
            <option value={""}>Select Marital Status</option>
            <option value={"Married"}>Married</option>
            <option value={"Unmarried"}>Unmarried</option>
            <option value={"Divorced"}>Divorced</option>
            <option value={"Don't say"}>{`Don't Say`}</option>
          </MemberRegisterSelect>
        </div>

        <div className="flex justify-end items-center gap-3 mt-9">
          <div className="flex justify-end">
            <div className="flex gap-2 cursor-pointer items-center bg-gray-700 text-white py-2 px-3 rounded-xl shadow hover:bg-gray-800 transition duration-300">
              <button
                type="button"
                onClick={() => {
                  setIsShow(false);
                  reset();
                }}
                className="font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="flex gap-2 cursor-pointer items-center bg-gray-700 text-white py-2 px-3 rounded-xl shadow hover:bg-gray-800 transition duration-300">
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                </>
              ) : (
                <>
                  <button type="submit" className="font-semibold">
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </article>
  );
}

export default EditSystemUser;
