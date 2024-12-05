import Router from "express";
import {
        addPatient, addSampleCollector, addOrganisation, addAddress, getPatient,
        getAllData, getSampleCollector, getOrganisation, getAddress, getOnePatient,
        deleteOnePatient, editReport, addPatientByUser, addIssue, addNote, getSlugPatient
} from "../../controllers/lab/patient.controller.js";


const router = Router();

router.post("/addPatient", addPatient);
router.post("/addSampleCollector", addSampleCollector)
router.post("/addOrganisation", addOrganisation)
router.post("/addAddress", addAddress)
router.post("/getPatient", getPatient)
router.get("/getAllData", getAllData)
router.post("/getSampleCollector", getSampleCollector)
router.post("/getOrganisation", getOrganisation)
router.post("/getAddress", getAddress)
router.post("/getOnePatient", getOnePatient)
router.post("/deleteOnePatient", deleteOnePatient)
router.post("/editReport", editReport)
router.post("/addPatientByUser", addPatientByUser)
router.post("/addIssue", addIssue)
router.post("/addNote", addNote)
router.post("/getSlugPatient", getSlugPatient)



export default router;
