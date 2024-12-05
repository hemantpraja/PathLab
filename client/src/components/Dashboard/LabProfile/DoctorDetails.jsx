import React, { useMemo, useEffect, useState } from 'react'
import { MaterialReactTable } from "material-react-table";
import { FaEdit, FaPlus } from 'react-icons/fa';
import { ButtonComponent, InputField } from '../..';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { GoUpload } from 'react-icons/go';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaXmark } from 'react-icons/fa6';
import { useLabDocterDetailsMutation } from '../../../redux/services/labApi.service';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useGetDocterDetailsMutation, useDeleteDocterDetailsMutation } from '../../../redux/services/labApi.service';
import toast from 'react-hot-toast';


const DoctorDetails = () => {

    const admin = useSelector((state) => state.admin);
    const [open, setOpen] = React.useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [labDocterDetails] = useLabDocterDetailsMutation();
    const [getDocterDetails] = useGetDocterDetailsMutation();
    const [deleteDocterDetails] = useDeleteDocterDetailsMutation();
    const [docterData, setDocterData] = useState([]);
    const handleOpen = () => setOpen(!open);
    const [editDocter, setEditDocter] = useState({})
    const [previews, setPreviews] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    const submitDocterDetails = async (data) => {
        const formData = new FormData();
        if (editDocter?.id) {
            formData.append('id', admin.admin.id);
            formData.append('docterId', editDocter?.id);
            formData.append('docterName', data.docterName);
            formData.append('degree', data.degree);
            setIsLoading(true)
            if (data.signature && data.signature.length > 0) {
                formData.append("signature", data.signature[0]);
            }
            const response = await labDocterDetails(formData)
            if (response.data.success) {
                toast.success(response.data.message)
                fetchData();
                setIsLoading(false)
                handleOpen(null)
            }
        }
        else {
            formData.append('id', admin.admin.id);
            formData.append('docterName', data.docterName);
            formData.append('degree', data.degree);
            if (data.signature && data.signature.length > 0) {
                formData.append("signature", data.signature[0]);
            }
            const response = await labDocterDetails(formData)
            if (response.data.success) {
                toast.success(response.data.message)
                fetchData();
                handleOpen(null)

            }
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const targetName = event.target.name;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {

                setPreviews(reader.result);
            };
            reader.readAsDataURL(file);
            setValue(targetName, [file]);
        }
    };

    const deletDocterDetailsData = async (docterId, signature) => {
        try {
            // Access the nested value object
            if (signature) {
                const response = await deleteDocterDetails({ id: admin.admin.id, docterId: docterId, signature: '' });
                if (response.data.success) {
                    toast.success(response.data.message)
                    fetchData();
                    handleOpen(null)
                }
            }
            else {
                const response = await deleteDocterDetails({ id: admin.admin.id, docterId: docterId });
                if (response.data.success) {
                    toast.success(response.data.message)
                    fetchData();
                }

            }

        } catch (error) { }
    }

    const setEditDocterDetails = (id, docterName, degree, signature) => {
        if (id) {
            setEditDocter({ id: id, docterName: docterName, degree: degree, signature: signature || '' })
            setValue('docterName', editDocter?.docterName)
            setValue('degree', editDocter?.degree)
            setValue('signature', editDocter?.signature || '')
        }
        else {
            setEditDocter({})
            setValue('docterName', '')
            setValue('degree', '')
            setValue('signature', '')
        }
    }
    const fetchData = async () => {
        const response = await getDocterDetails({ id: admin.admin.id })
        if (response.data.success) {
            const DocterDetails = response.data.data.map((item, index) => (
                {
                    ...item,
                    sno: index + 1,
                    doctorname: item?.docterName,
                    action: (
                        <div className='flex'>
                            <ButtonComponent
                                onClick={() => { setEditDocterDetails(item?._id, item?.docterName, item?.degree, item?.signature); handleOpen("lg") }}
                                key={`action-${index}`}
                                title={<FaEdit className="text-xl flex items-center text-gray-700" />}
                                className="bg-transparent"
                            />
                            <ButtonComponent onClick={() => deletDocterDetailsData(item?._id)}
                                title={<><AiOutlineDelete /></>} className="bg-transparent text-xl flex items-center text-gray-700 " />
                        </div>

                    ),
                    degree: item?.degree,
                    signature: (<div>
                        <img
                            src={item?.signature}
                            className="w-20 h-auto"
                            alt="" />
                    </div>),

                }
            ));
            setDocterData(DocterDetails)

        }
    }
    useEffect(() => {
        fetchData();
    }, [admin.admin.id]);

    const columns = useMemo(
        () => [
            {
                accessorKey: "sno",
                header: "Sr. No.",
                size: 50
            },
            {
                accessorKey: "doctorname",
                header: "DorcotrName",
                size: 150
            },
            {
                accessorKey: "degree",
                header: "Degree",
                size: 150
            },
            {
                accessorKey: "signature",
                header: "Signature",
                size: 150
            },
            {
                accessorKey: "action",
                header: "Action",
                size: 50
            },
        ],
        []
    );

    return (
        <>
            <div className={`${docterData.length == 3 ? 'hidden' : ''} flex justify-end px-5 pb-3 `}>
                <ButtonComponent title={<><FaPlus />Add Doctor</>} className="mt-3 bg-btn-color  text-white text-sm font-normal flex gap-1 items-center h-8 py-0 hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500" onClick={() => { setEditDocterDetails(); handleOpen("lg") }} />
            </div>
            <div className='w-full px-2 md:px-5'>
                <MaterialReactTable
                    columns={columns}
                    data={docterData}
                    enableColumnActions={false}
                    enableDensityToggle={false}
                    enableFullScreenToggle={false}
                    enableColumnVisibility={false}
                    getRowId={(row) => row.sno}
                />
            </div>
            <div className="sm:w-48 md:fixed right-0 bottom-0 px-2 py-2">
                <ButtonComponent type="button" title="Preview Bill" className="mt-3 bg-transparent border text-btn-color border-btn-color py-0 h-8 text-sm flex items-center justify-center  hover:bg-border-500 hover:outline-none hover:ring-1 hover:ring-blue-500" />
                <ButtonComponent type="button" title="Preview Report" className="mt-3 bg-transparent border text-btn-color border-btn-color py-0 h-8 text-sm flex items-center justify-center  hover:bg-border-500 hover:outline-none hover:ring-1 hover:ring-blue-500" />
                <ButtonComponent type="submit" title="Save" className="mt-3 bg-btn-color text-white py-0 h-8 text-sm flex items-center justify-center  hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500" />
            </div>

            {/* Add doctor modal */}
            <Dialog
                open={open}
                handler={handleOpen}
                size="sm"
                className="rounded-none"
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
            >
                <DialogHeader className="flex justify-between py-2">
                    <div className="mb-0">
                        <p className="text-[18px] mb-0 text-gray-600">Add Doctor</p>
                    </div>
                    <div onClick={() => handleOpen(null)} >
                        <FaXmark className="mr-1 text-md hover:bg-gray-100 hover:ring-1 focus:animate-ping ring-gray-400 rounded text-gray-600 mb-0" />
                    </div>
                </DialogHeader>
                <hr />
                <DialogBody className='px-12 space-y-4'>
                    <form onSubmit={handleSubmit(submitDocterDetails)} encType="multipart/form-data" className='space-y-4'>
                        <div className="w-full">
                            <InputField
                                placeholder="Enter Doctor Name"
                                name="docterName"
                                labelclass="text-sm font-normal font-regular"
                                label={<><span className='text-red-600'>*</span> Doctor Name</>}
                                className="text-sm placeholder:text-sm font-regular font-normal"
                                isSearch={false}
                                defaultValue={editDocter?.docterName}
                                {...register("docterName", {
                                    required: "Doctor Name is required",
                                })}
                            />
                            {errors.docterName && <p className="text-red-500 h-1">{errors.docterName.message}</p>}
                        </div>
                        <div className="w-full flex flex-col ">
                            <label className='pb-1 text-sm font-normal font-regular' htmlFor="degree"><span className='text-red-600'>*</span> Degree</label>
                            <textarea name="degree" id="degree" placeholder='Enter Degree' rows={3} cols={12} className='border border-gray-300 p-1 text-sm font-regular font-normal '
                                defaultValue={editDocter?.degree}
                                {...register("degree", {
                                    required: "Doctor Name is required",
                                })}
                            ></textarea>
                            {errors.degree && <p className="text-red-500 h-1">{errors.degree.message}</p>}
                        </div>
                        <div className="w-full">
                            <p className='px-2 text-sm font-normal font-regular'>Signature</p>
                            <InputField
                                type="file"
                                label={<><GoUpload />Click To Upload</>}
                                id="signature"
                                mainstyle={`border px-2 flex justify-center items-center w-[55%] py-1`}
                                labelclass={`text-sm font-normal font-regular w-full flex items-center gap-2`}
                                outerClass="border-none hidden"
                                // defaultValue={previews}
                                name="signature"
                                isSearch={false}
                                {...register('signature')}
                                onChange={handleFileChange}
                            />
                            {errors.signature && <p className="text-red-500 h-1">{errors.signature.message}</p>}

                            <div className='p-3 border border-gray-300 flex justify-between items-center mt-2'>
                                <div>
                                    <img src={editDocter?.signature ? editDocter?.signature : previews ? previews : "https://imgs.search.brave.com/CRUSpuc4u8POMix8N7oOL-mlg3RT09aglntDK_GL_Mk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzM3LzU3Lzgx/LzM2MF9GXzEzNzU3/ODEwM191bEs5TWJE/OUlmS0FDeDlSWmU2/Ung3UEF5QkE5YU4y/Sy5qcGc"}
                                        className="w-20 h-auto"
                                        alt="" />
                                </div>
                                <div>
                                    <span className='text-btn-color text-sm font-normal font-regular'>Report Footer</span>
                                </div>
                                <div onClick={() => {
                                    deletDocterDetailsData(editDocter?.id, editDocter?.signature)
                                }}>
                                    <ButtonComponent type="button" title={<><AiOutlineDelete /></>} className="bg-transparent hover:bg-gray-50 hover:ring-1 focus:animate-ping ring-gray-400 rounded text-gray-600" />
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-end py-2'>
                            {
                                isLoading == false ?
                                    <ButtonComponent title={<><FaPlus />Add</>} className="w-32 text-white font-medium h-8 flex items-center justify-center hover:bg-blue-500 hover:outline-none hover:ring-1 focus:ring-offset-1 hover:ring-blue-500"
                                        type="submit"
                                    /> : <div role="status" className='flex justify-center py-4'>
                                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span class="sr-only">Loading...</span>
                                    </div>
                            }
                        </div>
                    </form>
                </DialogBody>
            </Dialog>

        </>
    )
}

export default DoctorDetails;