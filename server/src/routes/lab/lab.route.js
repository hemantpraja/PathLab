import Router from 'express';

import {
    addTestList, addPackage, manageUser,
    addCenter, getTest, getOneTest, updateOneTest, getPackage, deletePackage,
    addFormula, deleteOneTest, manageUserLogin, analysisReportTest,
    analysisReportOrganisation, addDefaultTestList, getUserDetails,
    addTestMethod, getTestMethod, addComment, addTestListFile, addDefaultTestMethod,addDefaultTestOption,getTestOption,
    labReportDetails, labBillDetails, labDocterDetails, deleteLabReportDetails, getDocterDetails, deleteDocterDetails
} from '../../controllers/lab/admin.controller.js';
import { upload } from '../../middlewares/upload.middleware.js';

const router = Router();

router.post('/addTestList', addTestList);
router.post('/addPackage', addPackage);
// router.post('/addOutsource', addOutsource);
router.post('/manageUser', manageUser);
router.post('/addCenter', addCenter);
router.post('/getTest', getTest);
router.post('/getPackage', getPackage);
router.post('/getOneTest', getOneTest);
router.post('/updateOneTest', updateOneTest);
router.post('/deletePackage', deletePackage);
router.post('/addFormula', addFormula);
router.post('/deleteOneTest', deleteOneTest);
router.post('/manageUserLogin', manageUserLogin);
router.post('/analysisReportTest', analysisReportTest);
router.post('/analysisReportOrganisation', analysisReportOrganisation);
router.post('/addDefaultTestList', addDefaultTestList);
router.post('/getUserDetails', getUserDetails);
router.post('/addTestMethod', addTestMethod);
router.post('/getTestMethod', getTestMethod);
router.post('/addComment', addComment);


router.post("/addTestListFile", upload.single('file'), addTestListFile);
router.post('/addDefaultTestMethod', addDefaultTestMethod);
router.post('/addDefaultTestOption', addDefaultTestOption);
router.post('/getTestOption', getTestOption);
router.post("/labBillDetails", upload.fields([
    {
        name: "signature",
        maxCount: 1,

    },
]),
    labBillDetails);

router.post("/labDocterDetails", upload.fields([
    {
        name: "signature",
        maxCount: 1,

    },
]),
    labDocterDetails);

router.post("/labReportDetails", upload.fields([
    {
        name: "reportheader",
        maxCount: 1,

    },
    {
        name: "reportfooter",
        maxCount: 1,
    }
]),
    labReportDetails);

router.post("/deleteLabReportDetails", deleteLabReportDetails)
router.post('/getDocterDetails', getDocterDetails)
router.post('/deleteDocterDetails', deleteDocterDetails)




export default router;