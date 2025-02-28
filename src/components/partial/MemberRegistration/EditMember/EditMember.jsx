import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
import MemberRegisterInput from "../MemberRegisterInput/MemberRegisterInput";
import MemberRegisterSelect from "../MemberRegisterSelect/MemberRegisterSelect";
import useAxiosSecure from "../../../../../useAxiosSecure";
import useGetDepartments from "../../../../../GetDepartments/useGetDepartments";
import ImageUpload from "../../../../config/Upload/ImageUploadcpanel";
import Swal from "sweetalert2";
import { useAuth } from "../../../../providers/AuthProvider";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const religions = ["Islam", "Hindu", "Christian", "Buddhism", "Other"];

function EditMember({
  reFetch,
  setIsShow,
  setIsShowAddPackage,
  isShow,
  user_id,
  isActiveUserPage,
  setUserId = () => {},
}) {
  const axiosSecure = useAxiosSecure();
  const [imageUrl, setImageUrl] = useState < any > "";
  const [previewImageUrl, setPreviewImageUrl] = useState < any > "";
  const { branch } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    if (user_id) {
      const fetchUserData = async () => {
        try {
          const response = await axiosSecure.get(
            `/users/get-id/${user_id}?${branch}`
          );
          if (response?.status === 200) {
            const data = response.data;
            Object.keys(data).forEach((fieldName) => {
              setValue(fieldName, data[fieldName]);
            });
          }
        } catch (error) {
          console.log(error);
          toast.error("Failed to load user data");
        }
      };
      fetchUserData();
    }
  }, [user_id, axiosSecure, setValue, isShow]);

  const onSubmit = async (data) => {
    data.branch = branch;
    try {
      const response = await axiosSecure.put(`/users/put/${user_id}`, data);
      if (response?.status === 200 || response.status === 201) {
        if (isActiveUserPage) {
          if (response.data.card_no && response.data.member_id) {
            Swal.fire({
              icon: "success",
              title: "Activated!",
              text: "Member activated successfully!",
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                setIsShowAddPackage(true);
                setUserId(response.data._id);
              }
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Not activated",
              text: "Card no and Member ID is required to active member !",
              confirmButtonText: "OK",
            });
          }
        } else {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Member Information updated successfully!",
            confirmButtonText: "OK",
          });
        }

        reFetch && reFetch();
        setIsShow(false);
        reset();
        setUserId("");
        return response?.status;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Request failed!",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <article
      className={`w-[95%] md:w-[65%] rounded-xl lg:w-[80%] bg-white my-7 transition-all duration-500 ${
        isShow ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <h2 className="px-5 py-1 pt-2 font-medium border-b border-gray-300">
        {isActiveUserPage ? "Finalize User Activation" : "Edit Member"}
      </h2>
      <form className="md:px-5 py-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid px-3 md:grid-cols-4 gap-3">
          <MemberRegisterInput
            type={"text"}
            register={register}
            error={errors}
            name={"full_name"}
            isRequired={false}
            label={"Full Name"}
          />
          <MemberRegisterInput
            type={"text"}
            register={register}
            error={errors}
            name={"nickname"}
            isRequired={false}
            label={"Nickname"}
          />
          <MemberRegisterInput
            type={"email"}
            label={"Email"}
            register={register}
            error={errors}
            name={"email"}
            isRequired={false}
          />
          {isActiveUserPage && (
            <MemberRegisterInput
              type={"text"}
              label={"Member Id"}
              register={register}
              error={errors}
              name={"member_id"}
              isRequired={false}
            />
          )}
          <MemberRegisterInput
            type={"text"}
            label={"Contact Number"}
            register={register}
            error={errors}
            name={"contact_no"}
            isRequired={false}
          />
          <MemberRegisterSelect
            type={"text"}
            label={"Gender"}
            register={register}
            error={errors}
            name={"gender"}
            isRequired={false}
          >
            <option value={""}>Select Gender</option>
            <option value={"Male"}>Male</option>
            <option value={"Female"}>Female</option>
          </MemberRegisterSelect>

          <MemberRegisterInput
            type={"text"}
            label={"Address"}
            register={register}
            error={errors}
            name={"address"}
            isRequired={false}
          />

          <MemberRegisterInput
            type={"date"}
            label={"Date Of Birth"}
            register={register}
            error={errors}
            name={"date_of_birth"}
            isRequired={false}
          />

          <MemberRegisterInput
            type={"text"}
            label={"National ID"}
            register={register}
            error={errors}
            name={"nid_number"}
            isRequired={false}
          />

          {/* Dynamic Height Input */}
          <MemberRegisterSelect
            type={"text"}
            label={"Height"}
            register={register}
            error={errors}
            name={"height"}
            isRequired={false}
          >
            <option value={""}>Select Height</option>
            {Array.from({ length: 5 }, (_, feetIndex) => {
              const feet = feetIndex + 3;
              return Array.from({ length: 12 }, (_, inchIndex) => {
                const inch = inchIndex;
                return (
                  <option
                    value={`${feet} feet ${inch}`}
                    key={`${feet}-${inch}`}
                  >
                    {`${feet} feet ${inch}`}
                  </option>
                );
              });
            })}
          </MemberRegisterSelect>

          <MemberRegisterInput
            type={"text"}
            label={"Weight"}
            register={register}
            error={errors}
            name={"weight"}
            isRequired={false}
          />

          <MemberRegisterSelect
            type={"text"}
            label={"Blood Group"}
            register={register}
            error={errors}
            name={"blood_group"}
            isRequired={false}
          >
            <option value={""}>Select Blood Group</option>
            {bloodGroups.map((item: any, index: number) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </MemberRegisterSelect>

          {/* Religion Input */}
          <MemberRegisterSelect
            type={"text"}
            label={"Religion"}
            register={register}
            error={errors}
            name={"religion"}
            isRequired={false}
          >
            <option value={""}>Select Religion</option>
            {religions.map((item: any, index: number) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </MemberRegisterSelect>

          {/* Marital Status Input */}
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
            <option value={"Don't say"}>Don't Say</option>
          </MemberRegisterSelect>

          <MemberRegisterInput
            type={"text"}
            label={"Profession"}
            register={register}
            error={errors}
            name={"profession"}
            isRequired={false}
          />

          {isActiveUserPage && (
            <MemberRegisterInput
              type={"text"}
              label={"Card Number"}
              register={register}
              error={errors}
              name={"card_no"}
              isRequired={false}
            />
          )}

          <MemberRegisterInput
            type={"text"}
            label={"Emergency Contact Number"}
            register={register}
            error={errors}
            name={"emergency_contact_number"}
            isRequired={false}
          />

          <MemberRegisterInput
            type={"text"}
            label={"Emergency Contact Name"}
            register={register}
            error={errors}
            name={"emergency_contact_name"}
            isRequired={false}
          />

          <MemberRegisterInput
            type={"text"}
            label={"Photo Url"}
            register={register}
            error={errors}
            name={"photourl"}
            isRequired={false}
          />
        </div>
        <div>
          <div className="flex items-center flex-col md:flex-row md:justify-between py-3 mt-2">
            <div className="w-[95%]">
              <imgUpload
                setImageUrl={setImageUrl}
                setPreviewImageUrl={setPreviewImageUrl}
                setValue={setValue}
              />
            </div>
            <div className="flex justify-end items-center gap-3 mt-9">
              <div className="flex justify-end">
                <div className="flex gap-2 cursor-pointer items-center bg-gray-700 text-white py-2 px-3 rounded-xl shadow hover:bg-gray-800 transition duration-300">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("cancel button clicked");
                      setIsShow(false);
                      reset();
                      setUserId("");
                    }}
                    className="font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex gap-2 cursor-pointer items-center bg-gray-700 text-white py-2 px-3 rounded-xl shadow hover:bg-gray-800 transition duration-300">
                  <button type="submit" className="font-semibold">
                    {isActiveUserPage ? "Active" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </article>
  );
}

export default EditMember;
