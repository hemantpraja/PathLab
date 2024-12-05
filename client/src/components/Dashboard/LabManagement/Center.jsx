import React from "react";
import { ButtonComponent, InputField } from "../../index";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import { DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAddCenterMutation } from "../../../redux/services/labApi.service";
import toast from "react-hot-toast";

const data = [
  {
    srno: "HIV VIRAL LOAD	",
    center_name: "HIV",
    location: "MOLECULAR TESTS",
    contact: "edta plasma",
    action: 0,
  },
  {
    srno: "HIV VIRAL LOAD	",
    center_name: "HIV",
    location: "MOLECULAR TESTS",
    contact: "edta plasma",
    action: 0,
  },
  {
    srno: "HIV VIRAL LOAD	",
    center_name: "HIV",
    location: "MOLECULAR TESTS",
    contact: "edta plasma",
    action: 0,
  },
  {
    srno: "HIV VIRAL LOAD	",
    center_name: "HIV",
    location: "MOLECULAR TESTS",
    contact: "edta plasma",
    action: 0,
  },
];

function Center() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [addCenter] = useAddCenterMutation();
  const admin = useSelector((state) => state.admin);
  const columns = useMemo(
    () => [
      {
        accessorKey: "srno", //access nested data with dot notation
        header: "Sr. No.",
        size: 150,
      },
      {
        accessorKey: "center_name",
        header: "Center Name",
        size: 150,
      },
      {
        accessorKey: "location", //normal accessorKey
        header: "Location",
        size: 200,
      },
      {
        accessorKey: "contact",
        header: "Contact",
        size: 150,
      },
      {
        accessorKey: "action",
        header: "Action",
        size: 150,
      },
    ],
    []
  );


  const onSubmit = async (data) => {
    const response = await addCenter({ ...data, id:admin.admin.id });

    if (response.data.success) {
      toast.success(response.data.message);
      handleOpen();
    }
  }


  return (
    <div className="bg-background px-3 py-1 ">

      {/* Row 1 */}
      <div className="flex justify-between items-center px-2 py-5">
        <div>
          <p className="font-normal">Center Details</p>
        </div>
        <div onClick={handleOpen}>
          <ButtonComponent
            title={
              <>
                <FaPlus className="text-white bg-btn-color" /> Add Center
              </>
            }
            className="text-white flex items-center"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="bg-white pt-2">
        <div className="flex justify-between items-center py-2 ">
          <div className="px-4">
            <p className="font-normal">Center Details</p>
          </div>
          <div className="pe-4">
            <ButtonComponent
              title={
                <>
                  <MdOutlineFileDownload className="text-white bg-btn-color" />{" "}
                  Excel
                </>
              }
              className="text-white flex items-center px-4"
            />
          </div>
        </div>

        <hr />
        <MaterialReactTable
          columns={columns}
          data={data}
          enableColumnActions={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableColumnVisibility={false}
        />
      </div>

      {/* Add center modal  */}
      {/* <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="flex justify-between">
          <div>
            <p className="text-md">Add Center</p>
          </div>
          <div onClick={() => handleOpen(null)}>
            <ButtonComponent
              title={<FaXmark />}
              className="text-black bg-transparent text-md font-medium hover:text-xl"
            />
          </div>
        </DialogHeader>
        <hr />
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>   <DialogBody className="px-5 text-sm font-medium space-y-5">
              <InputField placeholder="Center Name" label="Center Name" isSearch={false} {...register("centerName")} />
              <InputField placeholder="contact number" label="Contact Number" isSearch={false} {...register("centerPhone")} />
              <br />
              <label htmlFor="address" className="">Address</label>
              <textarea name="address" id="address" rows={5} className="border-2 border-gray-400 w-full" {...register("centerAddress")}></textarea>
          </DialogBody>
            <DialogFooter>
              <ButtonComponent type="submit" title="Add" className="text-white w-28 me-8 font-medium" />
            </DialogFooter>
          </form>
        </div>

      </Dialog> */}
    </div>
  );
}

export default Center;
