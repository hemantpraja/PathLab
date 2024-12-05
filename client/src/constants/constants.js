import { AiOutlineTable, AiOutlineUserAdd } from "react-icons/ai";
import { FaRegListAlt } from "react-icons/fa";
import { IoSpeedometerOutline } from "react-icons/io5";
import { LuUser2 } from "react-icons/lu";
import { MdOutlineInventory2 } from "react-icons/md";
import { RiPlayList2Fill } from "react-icons/ri";
import { TbDeviceAnalytics } from "react-icons/tb";

const signInRole = [
  {
    title: "Admin",
    slug: "admin",
    active: true,
  },
  {
    title: "User",
    slug: "user",
    active: false,
  },
]

const landingNavlinks = [
  {
    title: "Home",
    slug: "home",
    active: true,
  },
  {
    title: "Features",
    slug: "features",
    active: false,
  },
  {
    title: "Pricing",
    slug: "pricing",
    active: false,
  },
  {
    title: "Contact",
    slug: "contact",
    active: false,
  },
]

const navlinks = [
  {
    title: "New Registration",
    slug: "home",
    icon: AiOutlineUserAdd,
    active: true,
    sublink: [],
    isLink: true,
  },
  {
    title: "Analysis",
    slug: "analysis",
    icon: IoSpeedometerOutline,
    active: false,
    sublink: [],
    isLink: true

  },
  {
    title: "Patient List",
    slug: "patientlist",
    icon: FaRegListAlt,
    active: false,
    sublink: [],
    isLink: true

  },
  {
    title: "Enter & Verify",
    slug: "report",
    icon: AiOutlineTable,
    active: false,
    sublink: [],
    isLink: true,

  },
  {
    title: "Financial Analysis",
    slug: "financeanalysis",
    icon: TbDeviceAnalytics,
    active: false,
    sublink: [],
    isLink: true

  },
  {
    title: "Tests",
    slug: "test",
    icon: RiPlayList2Fill,
    active: false,
    isLink: false,
    sublink: [
      {
        title: "Test List",
        slug: "list",
        active: false,
        isLink: true,

      },
      {
        title: "Packages",
        slug: "packages",
        active: false,
        isLink: true,
      },
      {
        title: "Outsource",
        slug: "outsource",
        active: false,
        isLink: true,
      },
    ]
  },
  {
    title: "Lab Management",
    slug: "lab",
    icon: RiPlayList2Fill,
    active: false,
    isLink: false,
    sublink: [
      {
        title: "Organisation List",
        slug: "organizations",
        active: false,
        isLink: true,
      },
      {
        title: "Manage Users",
        slug: "manageusers",
        active: false,
        isLink: true,
      },
      {
        title: "Center",
        slug: "center",
        active: false,
        isLink: true,
      },
    ]
  },
  {
    title: "Inventory",
    slug: "inventory",
    icon: MdOutlineInventory2,
    active: false,
    isLink: false,
    sublink: [
      {
        title: "Dashboard",
        slug: "dashboard",
        active: false,
        isLink: true,
      },
      {
        title: "Current Stock",
        slug: "stock",
        active: false,
        isLink: true,
      },
      {
        title: "Purchase Order",
        slug: "purchaseorder",
        active: false,
        isLink: true,
      },
    ]
  },
  {
    title: "Lab Profile",
    slug: "profile",
    icon: LuUser2,
    active: false,
    sublink: [],
    isLink: true
  },
]

// Top Navbar Lab list
const lablist = [
  {
    value: "Lab 1"
  },
  {
    value: "Lab 1"
  },
  {
    value: "Lab 1"
  },
  {
    value: "Lab 1"
  },
]

// Patient Registration Form

// const SearchDate = [
//   {
//     value: new Date()
//   },
//   {
//     value: new Date(new Date().setDate(new Date().getDate() - 7))
//   },
//   {
//     value: new Date(new Date().setDate(new Date().getDate() - 30))
//   },
// ];

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const SearchDate = [
  {
    value: formatDate(new Date()),
    label: 'Today'  // Optional label for better display in SelectBox
  },
  {
    value: formatDate(new Date(new Date().setDate(new Date().getDate() - 7))),
    label: '7 Days Ago'  // Optional label for better display in SelectBox
  },
  {
    value: formatDate(new Date(new Date().setDate(new Date().getDate() - 30))),
    label: '30 Days Ago'  // Optional label for better display in SelectBox
  },
];

const designation = [
  {
    value: "MR."
  },
  {
    value: "MRS."
  },
  {
    value: "MS."
  },
  {
    value: "MASTER."
  },
  {
    value: "MISS."
  },
  {
    value: "SMT."
  },
  {
    value: "DR."
  },
  {
    value: "KUMAR."
  },
]

const agetype = [
  {
    value: "Year"
  },
  {
    value: "Month"
  },
  {
    value: "Day"
  },
]

const labTestDepartments = [
  { value: "Radiology" },
  { value: "Biochemistry" },
  { value: "Hematology" },
  { value: "Microbiology" },
  { value: "Pathology" },
  { value: "Molecular Diagnostics" },
  { value: "Cytology" },
  { value: "Immunology" },
  { value: "Serology" },
  { value: "Genetics" },
  { value: "Endocrinology" },
  { value: "Toxicology" },
  { value: "Virology" },
  { value: "Parasitology" },
  { value: "Clinical Chemistry" },
  { value: "Nuclear Medicine" },
  { value: "Transfusion Medicine" },
  { value: "Anatomical Pathology" },
  { value: "Clinical Pathology" },
  { value: "Infectious Disease" }
];

const LabProfile = [
  {
    title: "Lab Details",
    slug: "labdetails",
    active: true,
  },
  {
    title: "Report Details",
    slug: "reportdetails",
    active: false,
  },
  {
    title: "Bill Details",
    slug: "billdetails",
    active: false,
  },
  {
    title: "Doctor Details",
    slug: "doctordetails",
    active: false,
  },
]

const outsourcetype = [
  {
    title: "Test Wise",
    slug: "testwise",
    active: true,
  },
  {
    title: "lab Wise",
    slug: "labwise",
    active: false,
  },
]

const financeAnalysisLinks = [
  {
    title: "Billing Wise",
    slug: "billingwise",
    active: true,
  },
  {
    title: "Referral Wise",
    slug: "referralwise",
    active: false,
  },
]

const searchBy = [
  {
    value: "Tests"
  },
  {
    value: "Packages"
  }]

const payementMethod = [
  {
    value: "Cash",
    id: "cash",
    active: true
  },
  {
    value: "UPI",
    id: "upi",
    active: false
  },
  {
    value: "Card",
    id: "card",
    active: false
  }
]

const gender = [
  { value: "Male" },
  { value: "Female" },
  { value: "Others" },
]

const labTestTypes = [
  { value: "PSU" },
  { value: "Semen" },
  { value: "Blood" },
  { value: "Urine" },
  { value: "Stool" },
  { value: "Saliva" },
  { value: "Biopsy" },
  { value: "Swab" },
  { value: "Sputum" },
  { value: "CSF (Cerebrospinal Fluid)" },
  { value: "Synovial Fluid" },
  { value: "Pleural Fluid" },
  { value: "Pericardial Fluid" },
  { value: "Peritoneal Fluid" },
  { value: "Hair" },
  { value: "Nail" },
  { value: "Tissue" },
  { value: "Bone Marrow" },
  { value: "Vaginal Secretion" },
  { value: "Wound Exudate" }
];

const role = [
  { value: "all" },
  { value: "reception" },
  { value: "technician" },
  { value: "doctor" },
]

const testFieldType = [
  { value: "single field" },
  { value: "multiple field" },
  { value: "text" },
]

const testField = [
  { value: "numeric" },
  { value: "text" },
  { value: "numeric unbound" },
  { value: "multiple ranges" },
  { value: "custom" },
]

const numericUnboundType = [
  { value: "less than equal" },
  { value: "less than" },
  { value: "greater than equal" },
  { value: "greater than" },
  { value: "equal to" },

]

//  Formula Operator
const formulaOperator = [
  { value: "+" },
  { value: "-" },
  { value: "*" },
  { value: "/" },
  { value: "%" },
]


// prefix contact number of all Country
const contact = [
  {
    value: "+7 840",
    name: "Abkhazia"
  },
  {
    value: "+93",
    name: "Afghanistan"
  },
  {
    value: "+355",
    name: "Albania"
  },
  {
    value: "+213",
    name: "Algeria"
  },
  {
    value: "+1 684",
    name: "American Samoa"
  },
  {
    value: "+376",
    name: "Andorra"
  },
  {
    value: "+244",
    name: "Angola"
  },
  {
    value: "+1 264",
    name: "Anguilla"
  },
  {
    value: "+1 268",
    name: "Antigua and Barbuda"
  },
  {
    value: "+54",
    name: "Argentina"
  },
  {
    value: "+374",
    name: "Armenia"
  },
  {
    value: "+297",
    name: "Aruba"
  },
  {
    value: "+247",
    name: "Ascension"
  },
  {
    value: "+61",
    name: "Australia"
  },
  {
    value: "+672",
    name: "Australian External Territories"
  },
  {
    value: "+43",
    name: "Austria"
  },
  {
    value: "+994",
    name: "Azerbaijan"
  },
  {
    value: "+1 242",
    name: "Bahamas"
  },
  {
    value: "+973",
    name: "Bahrain"
  },
  {
    value: "+880",
    name: "Bangladesh"
  },
  {
    value: "+1 246",
    name: "Barbados"
  },
  {
    value: "+1 268",
    name: "Barbuda"
  },
  {
    value: "+375",
    name: "Belarus"
  },
  {
    value: "+32",
    name: "Belgium"
  },
  {
    value: "+501",
    name: "Belize"
  },
  {
    value: "+229",
    name: "Benin"
  },
  {
    value: "+1 441",
    name: "Bermuda"
  },
  {
    value: "+975",
    name: "Bhutan"
  },
  {
    value: "+591",
    name: "Bolivia"
  },
  {
    value: "+387",
    name: "Bosnia and Herzegovina"
  },
  {
    value: "+267",
    name: "Botswana"
  },
  {
    value: "+55",
    name: "Brazil"
  },
  {
    value: "+246",
    name: "British Indian Ocean Territory"
  },
  {
    value: "+1 284",
    name: "British Virgin Islands"
  },
  {
    value: "+673",
    name: "Brunei"
  },
  {
    value: "+359",
    name: "Bulgaria"
  },
  {
    value: "+226",
    name: "Burkina Faso"
  },
  {
    value: "+257",
    name: "Burundi"
  },
  {
    value: "+855",
    name: "Cambodia"
  },
  {
    value: "+237",
    name: "Cameroon"
  },
  {
    value: "+1",
    name: "Canada"
  },
  {
    value: "+238",
    name: "Cape Verde"
  },
  {
    value: "+ 345",
    name: "Cayman Islands"
  },
  {
    value: "+236",
    name: "Central African Republic"
  },
  {
    value: "+235",
    name: "Chad"
  },
  {
    value: "+56",
    name: "Chile"
  },
  {
    value: "+86",
    name: "China"
  },
  {
    value: "+61",
    name: "Christmas Island"
  },
  {
    value: "+61",
    name: "Cocos-Keeling Islands"
  },
  {
    value: "+57",
    name: "Colombia"
  },
  {
    value: "+269",
    name: "Comoros"
  },
  {
    value: "+242",
    name: "Congo"
  },
  {
    value: "+243",
    name: "Congo, Dem. Rep. of (Zaire)"
  },
  {
    value: "+682",
    name: "Cook Islands"
  },
  {
    value: "+506",
    name: "Costa Rica"
  },
  {
    value: "+385",
    name: "Croatia"
  },
  {
    value: "+53",
    name: "Cuba"
  },
  {
    value: "+599",
    name: "Curacao"
  },
  {
    value: "+537",
    name: "Cyprus"
  },
  {
    value: "+420",
    name: "Czech Republic"
  },
  {
    value: "+45",
    name: "Denmark"
  },
  {
    value: "+246",
    name: "Diego Garcia"
  },
  {
    value: "+253",
    name: "Djibouti"
  },
  {
    value: "+1 767",
    name: "Dominica"
  },
  {
    value: "+1 809",
    name: "Dominican Republic"
  },
  {
    value: "+670",
    name: "East Timor"
  },
  {
    value: "+56",
    name: "Easter Island"
  },
  {
    value: "+593",
    name: "Ecuador"
  },
  {
    value: "+20",
    name: "Egypt"
  },
  {
    value: "+503",
    name: "El Salvador"
  },
  {
    value: "+240",
    name: "Equatorial Guinea"
  },
  {
    value: "+291",
    name: "Eritrea"
  },
  {
    value: "+372",
    name: "Estonia"
  },
  {
    value: "+251",
    name: "Ethiopia"
  },
  {
    value: "+500",
    name: "Falkland Islands"
  },
  {
    value: "+298",
    name: "Faroe Islands"
  },
  {
    value: "+679",
    name: "Fiji"
  },
  {
    value: "+358",
    name: "Finland"
  },
  {
    value: "+33",
    name: "France"
  },
  {
    value: "+596",
    name: "French Antilles"
  },
  {
    value: "+594",
    name: "French Guiana"
  },
  {
    value: "+689",
    name: "French Polynesia"
  },
  {
    value: "+241",
    name: "Gabon"
  },
  {
    value: "+220",
    name: "Gambia"
  },
  {
    value: "+995",
    name: "Georgia"
  },
  {
    value: "+49",
    name: "Germany"
  },
  {
    value: "+233",
    name: "Ghana"
  },
  {
    value: "+350",
    name: "Gibraltar"
  },
  {
    value: "+30",
    name: "Greece"
  },
  {
    value: "+299",
    name: "Greenland"
  },
  {
    value: "+1 473",
    name: "Grenada"
  },
  {
    value: "+590",
    name: "Guadeloupe"
  },
  {
    value: "+1 671",
    name: "Guam"
  },
  {
    value: "+502",
    name: "Guatemala"
  },
  {
    value: "+224",
    name: "Guinea"
  },
  {
    value: "+245",
    name: "Guinea-Bissau"
  },
  {
    value: "+595",
    name: "Guyana"
  },
  {
    value: "+509",
    name: "Haiti"
  },
  {
    value: "+504",
    name: "Honduras"
  },
  {
    value: "+852",
    name: "Hong Kong SAR China"
  },
  {
    value: "+36",
    name: "Hungary"
  },
  {
    value: "+354",
    name: "Iceland"
  },
  {
    value: "+91",
    name: "India"
  },
  {
    value: "+62",
    name: "Indonesia"
  },
  {
    value: "+98",
    name: "Iran"
  },
  {
    value: "+964",
    name: "Iraq"
  },
  {
    value: "+353",
    name: "Ireland"
  },
  {
    value: "+972",
    name: "Israel"
  },
  {
    value: "+39",
    name: "Italy"
  },
  {
    value: "+225",
    name: "Ivory Coast"
  },
  {
    value: "+1 876",
    name: "Jamaica"
  },
  {
    value: "+81",
    name: "Japan"
  },
  {
    value: "+962",
    name: "Jordan"
  },
  {
    value: "+7 7",
    name: "Kazakhstan"
  },
  {
    value: "+254",
    name: "Kenya"
  },
  {
    value: "+686",
    name: "Kiribati"
  },
  {
    value: "+965",
    name: "Kuwait"
  },
  {
    value: "+996",
    name: "Kyrgyzstan"
  },
  {
    value: "+856",
    name: "Laos"
  },
  {
    value: "+371",
    name: "Latvia"
  },
  {
    value: "+961",
    name: "Lebanon"
  },
  {
    value: "+266",
    name: "Lesotho"
  },
  {
    value: "+231",
    name: "Liberia"
  },
  {
    value: "+218",
    name: "Libya"
  },
  {
    value: "+423",
    name: "Liechtenstein"
  },
  {
    value: "+370",
    name: "Lithuania"
  },
  {
    value: "+352",
    name: "Luxembourg"
  },
  {
    value: "+853",
    name: "Macau SAR China"
  },
  {
    value: "+389",
    name: "Macedonia"
  },
  {
    value: "+261",
    name: "Madagascar"
  },
  {
    value: "+265",
    name: "Malawi"
  },
  {
    value: "+60",
    name: "Malaysia"
  },
  {
    value: "+960",
    name: "Maldives"
  },
  {
    value: "+223",
    name: "Mali"
  },
  {
    value: "+356",
    name: "Malta"
  },
  {
    value: "+692",
    name: "Marshall Islands"
  },
  {
    value: "+596",
    name: "Martinique"
  },
  {
    value: "+222",
    name: "Mauritania"
  },
  {
    value: "+230",
    name: "Mauritius"
  },
  {
    value: "+262",
    name: "Mayotte"
  },
  {
    value: "+52",
    name: "Mexico"
  },
  {
    value: "+691",
    name: "Micronesia"
  },
  {
    value: "+1 808",
    name: "Midway Island"
  },
  {
    value: "+373",
    name: "Moldova"
  },
  {
    value: "+377",
    name: "Monaco"
  },
  {
    value: "+976",
    name: "Mongolia"
  },
  {
    value: "+382",
    name: "Montenegro"
  },
  {
    value: "+1664",
    name: "Montserrat"
  },
  {
    value: "+212",
    name: "Morocco"
  },
  {
    value: "+95",
    name: "Myanmar"
  },
  {
    value: "+264",
    name: "Namibia"
  },
  {
    value: "+674",
    name: "Nauru"
  },
  {
    value: "+977",
    name: "Nepal"
  },
  {
    value: "+31",
    name: "Netherlands"
  },
  {
    value: "+599",
    name: "Netherlands Antilles"
  },
  {
    value: "+1 869",
    name: "Nevis"
  },
  {
    value: "+687",
    name: "New Caledonia"
  },
  {
    value: "+64",
    name: "New Zealand"
  },
  {
    value: "+505",
    name: "Nicaragua"
  },
  {
    value: "+227",
    name: "Niger"
  },
  {
    value: "+234",
    name: "Nigeria"
  },
  {
    value: "+683",
    name: "Niue"
  },
  {
    value: "+672",
    name: "Norfolk Island"
  },
  {
    value: "+850",
    name: "North Korea"
  },
  {
    value: "+1 670",
    name: "Northern Mariana Islands"
  },
  {
    value: "+47",
    name: "Norway"
  },
  {
    value: "+968",
    name: "Oman"
  },
  {
    value: "+92",
    name: "Pakistan"
  },
  {
    value: "+680",
    name: "Palau"
  },
  {
    value: "+970",
    name: "Palestinian Territory"
  },
  {
    value: "+507",
    name: "Panama"
  },
  {
    value: "+675",
    name: "Papua New Guinea"
  },
  {
    value: "+595",
    name: "Paraguay"
  },
  {
    value: "+51",
    name: "Peru"
  },
  {
    value: "+63",
    name: "Philippines"
  },
  {
    value: "+48",
    name: "Poland"
  },
  {
    value: "+351",
    name: "Portugal"
  },
  {
    value: "+1 787",
    name: "Puerto Rico"
  },
  {
    value: "+974",
    name: "Qatar"
  },
  {
    value: "+262",
    name: "Reunion"
  },
  {
    value: "+40",
    name: "Romania"
  },
  {
    value: "+7",
    name: "Russia"
  },
  {
    value: "+250",
    name: "Rwanda"
  },
  {
    value: "+685",
    name: "Samoa"
  },
  {
    value: "+378",
    name: "San Marino"
  },
  {
    value: "+966",
    name: "Saudi Arabia"
  },
  {
    value: "+221",
    name: "Senegal"
  },
  {
    value: "+381",
    name: "Serbia"
  },
  {
    value: "+248",
    name: "Seychelles"
  },
  {
    value: "+232",
    name: "Sierra Leone"
  },
  {
    value: "+65",
    name: "Singapore"
  },
  {
    value: "+421",
    name: "Slovakia"
  },
  {
    value: "+386",
    name: "Slovenia"
  },
  {
    value: "+677",
    name: "Solomon Islands"
  },
  {
    value: "+27",
    name: "South Africa"
  },
  {
    value: "+500",
    name: "South Georgia and the South Sandwich Islands"
  },
  {
    value: "+82",
    name: "South Korea"
  },
  {
    value: "+34",
    name: "Spain"
  },
  {
    value: "+94",
    name: "Sri Lanka"
  },
  {
    value: "+249",
    name: "Sudan"
  },
  {
    value: "+597",
    name: "Suriname"
  },
  {
    value: "+268",
    name: "Swaziland"
  },
  {
    value: "+46",
    name: "Sweden"
  },
  {
    value: "+41",
    name: "Switzerland"
  },
  {
    value: "+963",
    name: "Syria"
  },
  {
    value: "+886",
    name: "Taiwan"
  },
  {
    value: "+992",
    name: "Tajikistan"
  },
  {
    value: "+255",
    name: "Tanzania"
  },
  {
    value: "+66",
    name: "Thailand"
  },
  {
    value: "+670",
    name: "Timor Leste"
  },
  {
    value: "+228",
    name: "Togo"
  },
  {
    value: "+690",
    name: "Tokelau"
  },
  {
    value: "+676",
    name: "Tonga"
  },
  {
    value: "+1 868",
    name: "Trinidad and Tobago"
  },
  {
    value: "+216",
    name: "Tunisia"
  },
  {
    value: "+90",
    name: "Turkey"
  },
  {
    value: "+993",
    name: "Turkmenistan"
  },
  {
    value: "+1 649",
    name: "Turks and Caicos Islands"
  },
  {
    value: "+688",
    name: "Tuvalu"
  },
  {
    value: "+1 340",
    name: "U.S. Virgin Islands"
  },
  {
    value: "+256",
    name: "Uganda"
  },
  {
    value: "+380",
    name: "Ukraine"
  },
  {
    value: "+971",
    name: "United Arab Emirates"
  },
  {
    value: "+44",
    name: "United Kingdom"
  },
  {
    value: "+1",
    name: "United States"
  },
  {
    value: "+598",
    name: "Uruguay"
  },
  {
    value: "+998",
    name: "Uzbekistan"
  },
  {
    value: "+678",
    name: "Vanuatu"
  },
  {
    value: "+58",
    name: "Venezuela"
  },
  {
    value: "+84",
    name: "Vietnam"
  },
  {
    value: "+1 808",
    name: "Wake Island"
  },
  {
    value: "+681",
    name: "Wallis and Futuna"
  },
  {
    value: "+967",
    name: "Yemen"
  },
  {
    value: "+260",
    name: "Zambia"
  },
  {
    value: "+255",
    name: "Zanzibar"
  },
  {
    value: "+263",
    name: "Zimbabwe"
  }
]

export {
  LabProfile, agetype, contact, designation, gender, labTestDepartments, labTestTypes, lablist, navlinks, numericUnboundType, outsourcetype, role, testField, testFieldType, financeAnalysisLinks,
  signInRole, landingNavlinks, formulaOperator, searchBy, payementMethod, SearchDate
};
