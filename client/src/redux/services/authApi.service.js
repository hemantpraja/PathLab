import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1/auth" }),
    endpoints: (builder) => ({
        adminSignup: builder.mutation({
            query: (body) => ({
                url: "/adminSignup",

                method: "POST",
                body
            })
        }),

        updateAdminProfile: builder.mutation({
            query: (body) => ({
                url: "/updateAdminProfile",
                method: "POST",
                body
            })
        }),

        adminSignin: builder.mutation({
            query: (body) => ({
                url: "/adminSignin",
                method: "POST",
                body

            })
        }),


        getAdminDetails: builder.mutation({
            query: (body) => ({
                url: "/getAdminDetails",
                method: "POST",
                body
            })
        }),

        verifyEmail: builder.mutation({
            query: (body) => ({
                url: "/verifyEmail",
                method: "POST",
                body
            })
        }),

        resendOTP: builder.mutation({
            query: (body) => ({
                url: "/resendOTP",
                method: "POST",
                body
            })
        }),

        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST"
            })
        }),
        
        verifyToken: builder.mutation({
            query: (admin) => ({
                url: '/',
                method: 'GET',
                admin,
            }),
        })
    })
});


export const { useAdminSignupMutation, useAdminSigninMutation, useVerifyEmailMutation, useResendOTPMutation,
    useLogoutMutation, useGetAdminDetailsMutation, useUpdateAdminProfileMutation,
    useVerifyTokenMutation } = authApi;



