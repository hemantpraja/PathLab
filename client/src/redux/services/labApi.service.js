import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const labApi = createApi({
    reducerPath: 'labApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/lab' }),
    tagTypes: ['Lab'],
    endpoints: (builder) => ({
        addTestList: builder.mutation({
            query: (body) => ({
                url: '/addTestList',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        addPackage: builder.mutation({
            query: (body) => ({
                url: '/addPackage',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        manageUser: builder.mutation({
            query: (body) => ({
                url: '/manageUser',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        getTest: builder.mutation({
            query: (body) => ({
                url: '/getTest',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        getOneTest: builder.mutation({
            query: (body) => ({
                url: '/getOneTest',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        updateOneTest: builder.mutation({
            query: (body) => ({
                url: '/updateOneTest',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        getPackage: builder.mutation({
            query: (body) => ({
                url: '/getPackage',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        deletePackage: builder.mutation({
            query: (body) => ({
                url: '/deletePackage',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        addFormula: builder.mutation({
            query: (body) => ({
                url: '/addFormula',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        deleteOneTest: builder.mutation({
            query: (body) => ({
                url: '/deleteOneTest',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        manageUserLogin: builder.mutation({
            query: (body) => ({
                url: '/manageUserLogin',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        addCenter: builder.mutation({
            query: (body) => ({
                url: '/addCenter',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        analysisReportTest: builder.mutation({
            query: (body) => ({
                url: '/analysisReportTest',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        analysisReportOrganisation: builder.mutation({
            query: (body) => ({
                url: '/analysisReportOrganisation',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        addDefaultTestList: builder.mutation({
            query: (body) => ({
                url: '/addDefaultTestList',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        getUserDetails: builder.mutation({
            query: (body) => ({
                url: '/getUserDetails',
                method: 'POST',
                body,
            })
        }),

        addTestMethod: builder.mutation({
            query: (body) => ({
                url: '/addTestMethod',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        getTestMethod: builder.mutation({
            query: (body) => ({
                url: '/getTestMethod',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        addComment: builder.mutation({
            query: (body) => ({
                url: '/addComment',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        addTestListFile: builder.mutation({
            query: (body) => ({
                url: '/addTestListFile',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        labReportDetails: builder.mutation({
            query: (body) => ({
                url: '/labReportDetails',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        labBillDetails: builder.mutation({
            query: (body) => ({
                url: '/labBillDetails',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        labDocterDetails: builder.mutation({
            query: (body) => ({
                url: '/labDocterDetails',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        deleteLabReportDetails: builder.mutation({
            query: (body) => ({
                url: '/deleteLabReportDetails',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        getDocterDetails: builder.mutation({
            query: (body) => ({
                url: '/getDocterDetails',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        deleteDocterDetails: builder.mutation({
            query: (body) => ({
                url: '/deleteDocterDetails',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        addDefaultTestMethod: builder.mutation({
            query: (body) => ({
                url: '/addDefaultTestMethod',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        addDefaultTestOption: builder.mutation({
            query: (body) => ({
                url: '/addDefaultTestOption',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

        getTestOption: builder.mutation({
            query: (body) => ({
                url: '/getTestOption',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lab'],
        }),

    }),
});


export const { useAddTestListMutation, useManageUserMutation, useGetTestMutation, useGetOneTestMutation,
    useAddPackageMutation, useGetPackageMutation, useUpdateOneTestMutation, useDeletePackageMutation,
    useAddFormulaMutation, useDeleteOneTestMutation, useManageUserLoginMutation,
    useAddCenterMutation, useAnalysisReportTestMutation, useAnalysisReportOrganisationMutation,
    useAddDefaultTestListMutation, useGetUserDetailsMutation, useAddTestMethodMutation, useGetTestMethodMutation,
    useAddCommentMutation, useAddTestListFileMutation, useAddDefaultTestOptionMutation, useGetTestOptionMutation,
    useLabReportDetailsMutation, useLabBillDetailsMutation, useLabDocterDetailsMutation, useDeleteLabReportDetailsMutation,
    useGetDocterDetailsMutation, useDeleteDocterDetailsMutation, useAddDefaultTestMethodMutation
} = labApi;