import express from "express";
import adminRouter from "./routes/auth/auth.route.js";
import patientRouter from "./routes/lab/patient.route.js";
import TestRoueter from "./routes/lab/lab.route.js";
import inventoryRouter from "./routes/lab/inventory.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/v1/auth", adminRouter);
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/lab", TestRoueter);
app.use("/api/v1/inventory", inventoryRouter);

export { app };