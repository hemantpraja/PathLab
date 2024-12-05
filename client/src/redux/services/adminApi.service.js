import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1/patient" }),
    tagTypes: ["Admin"],
    endpoints: (builder) => ({
        getPatient: builder.mutation({
            query: (body) => ({
                url: "/getPatient",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),
        addPatient: builder.mutation({
            query: (body) => ({
                url: "/addPatient",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),
        deleteOnePatient: builder.mutation({
            query: (body) => ({
                url: "/deleteOnePatient",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),

        addSampleCollector: builder.mutation({
            query: (body) => ({
                url: "/addSampleCollector",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),

        addOrganisation: builder.mutation({
            query: (body) => ({
                url: "/addOrganisation",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),

        addAddress: builder.mutation({
            query: (body) => ({
                url: "/addAddress",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),

        getAddress: builder.mutation({
            query: (body) => ({
                url: "/getAddress",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),

        approvePatient: builder.mutation({
            query: (body) => ({
                url: "/approvePatient",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),

        getSampleCollector: builder.mutation({
            query: (body) => ({
                url: "/getSampleCollector",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),

        getOrganisation: builder.mutation({
            query: (body) => ({
                url: "/getOrganisation",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),

        getOnePatient: builder.mutation({
            query: (body) => ({
                url: '/getOnePatient',
                method: 'POST',
                body,
            })
        }),

        editReport: builder.mutation({
            query: (body) => ({
                url: '/editReport',
                method: 'POST',
                body,
            })
        }),

        addPatientByUser: builder.mutation({
            query: (body) => ({
                url: '/addPatientByUser',
                method: 'POST',
                body,
            })
        }),

        addIssue: builder.mutation({
            query: (body) => ({
                url: '/addIssue',
                method: 'POST',
                body,
            })
        }),

        addNote: builder.mutation({
            query: (body) => ({
                url: '/addNote',
                method: 'POST',
                body,
            })
        }),

        getSlugPatient: builder.mutation({
            query: (body) => ({
                url: '/getSlugPatient',
                method: 'POST',
                body,
            })
        }),

    }),

});



export const { useAddPatientMutation, useAddSampleCollectorMutation, useAddOrganisationMutation,
    useAddAddressMutation, useApprovePatientMutation, useGetPatientMutation, useGetSampleCollectorMutation,
    useGetOrganisationMutation, useGetAddressMutation, useGetOnePatientMutation, useDeleteOnePatientMutation,
    useEditReportMutation, useAddPatientByUserMutation, useAddIssueMutation, useAddNoteMutation,useGetSlugPatientMutation } = adminApi;