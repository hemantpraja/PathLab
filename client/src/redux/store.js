import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './services/authApi.service.js';
import { adminApi } from './services/adminApi.service.js';
import { labApi } from './services/labApi.service.js';
import adminSlice from './reducer/adminSlice.js';
import { combineReducers } from 'redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Import storage from redux-persist

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['admin'], // Ensure you whitelist the slices you want to persist
};

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [labApi.reducerPath]: labApi.reducer,
    admin: adminSlice,

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(authApi.middleware).concat(adminApi.middleware).concat(labApi.middleware),
});

export const persistor = persistStore(store);




// import { configureStore } from '@reduxjs/toolkit';
// import { authApi } from './services/authApi.service.js';
// import { adminApi } from './services/adminApi.service.js';
// import { labApi } from './services/labApi.service.js';
// import adminSlice from './reducer/adminSlice.js';
// import { combineReducers } from 'redux';
// import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // Import storage from redux-persist
// import Cookies from 'js-cookie';

// // Define the cookie name
// const COOKIE_NAME = 'admin';

// const customStorage = {
//     getItem: (key) => new Promise((resolve) => {
//         const cookie = Cookies.get(COOKIE_NAME);
//         if (cookie) {
//             resolve(storage.getItem(key));
//         } else {
//             resolve(null);
//         }
//     }),
//     setItem: (key, value) => new Promise((resolve) => {
//         const cookie = Cookies.get(COOKIE_NAME);
//         if (cookie) {
//             resolve(storage.setItem(key, value));
//         } else {
//             resolve(null);
//         }
//     }),
//     removeItem: (key) => new Promise((resolve) => {
//         const cookie = Cookies.get(COOKIE_NAME);
//         if (cookie) {
//             resolve(storage.removeItem(key));
//         } else {
//             resolve(null);
//         }
//     }),
// };

// const persistConfig = {
//     key: 'root',
//     storage: customStorage,
//     whitelist: ['auth'], // Ensure correct spelling
// };

// const rootReducer = combineReducers({
//     [authApi.reducerPath]: authApi.reducer,
//     [adminApi.reducerPath]: adminApi.reducer,
//     [labApi.reducerPath]: labApi.reducer,
//     admin: adminSlice,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: {
//                 ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//             },
//         }).concat(authApi.middleware).concat(adminApi.middleware).concat(labApi.middleware),
// });

// export const persistor = persistStore(store);


// // const INACTIVITY_LIMIT = 30 * 60 * 1000; // 1 minute
// // let inactivityTimer;

// // const resetInactivityTimer = () => {
// //     console.log("Activity detected, resetting timer.");
// //     clearTimeout(inactivityTimer);
// //     inactivityTimer = setTimeout(() => {
// //         console.log("Inactivity detected, purging state.");
// //         persistor.purge().then(() => {
// //             console.log("Persistor purged.");
// //         }).catch((error) => {
// //             console.error("Persistor purge error:", error);
// //         });
// //     }, INACTIVITY_LIMIT);
// // };

// // const setupInactivityTimer = () => {
// //     console.log("Setting up inactivity timer.");
// //     window.addEventListener("mousemove", resetInactivityTimer);
// //     window.addEventListener("keydown", resetInactivityTimer);
// //     window.addEventListener("click", resetInactivityTimer);
// //     window.addEventListener("scroll", resetInactivityTimer);
// // };

// // const handleTabClose = (event) => {
// //     console.log("Tab is being closed, purging state.");
// //     persistor.purge().then(() => {
// //         console.log("Persistor purged on tab close.");
// //     }).catch((error) => {
// //         console.error("Persistor purge error on tab close:", error);
// //     });
// // };

// // if (typeof window !== 'undefined') {
// //     setupInactivityTimer();
// //     resetInactivityTimer();
// //     window.addEventListener("beforeunload", handleTabClose);
// // }
