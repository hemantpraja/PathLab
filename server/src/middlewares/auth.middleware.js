import jwt from 'jsonwebtoken';
import adminModel from '../models/admin.model.js';

export const authenticate = async (request, response, next) => {
    try {


        const secretKey = process.env.JWT_SECRET_KEY;
        if (request.headers.cookie) {
            const token = request.headers.cookie.split('=')[1];
            if (token) {
                jwt.verify(token, secretKey, (error, payload) => {
                    if (error) {
                        console.log('ERROR:  middleware > jwt middleware > authenticate > jwt.verify : ', error);
                        response.json({
                            status: false,
                            message: 'Token not verified.'
                        });
                    } else {

                        request.payload = payload;
                        next();
                    }
                });
            } else {
                response.json({
                    status: false,
                    message: 'Token not found.'
                });
            }
        }
        else {
            response.json({
                status: false,
                message: 'Token not found.'
            });
        }

    } catch (error) {
        console.log("ERROR : middleware > jwt middleware > authenticate > catch : ", error);
        response.json({
            success: false,
            message: error.message
        });
    }
}

export const authorize = async (request, response) => {
    try {

        if (request.payload.userEmail && request.payload.userId) {
            const loggedUser = await adminModel.findOne(
                { email: request.payload.email, "manageUser.email": request.payload.userEmail },
                { "manageUser.$": 1 } // Project only the matching manageUser element
            );

            if (loggedUser) {

                if (loggedUser.manageUser[0].loginStatus === true &&
                    loggedUser.manageUser[0].logoutStatus === false &&
                    loggedUser.manageUser[0].blockStatus === false) {

                    response.json({
                        success: true,
                        data: loggedUser,
                        message: 'Token verified successfully.'
                    });

                }

                else {
                    response.json({
                        status: false,
                        message: 'User have not permission to login.'
                    });
                }
            }

            else {

                response.json({
                    status: false,
                    message: 'User not found.'
                });
            }
        }

        else {

            const loggedAdmin = await adminModel.findOne(
                { email: request.payload.email }
            );
            if (loggedAdmin) {
                response.json({
                    success: true,
                    data: { _id: loggedAdmin._id, email: loggedAdmin.email },
                    message: 'Token verified successfully.'
                });
            }
            else {

                response.json({
                    status: false,
                    message: 'Admin not found.'
                });
            }

        }
    } catch (error) {
        console.log("ERROR : middleware > jwt middleware > authorize > catch : ", error);
        response.json({
            success: false,
            message: error.message
        });
    }
}