import slugify from 'slugify';
import axios from 'axios';

const generateSlug = async (LabName, id, baseNumber = 4000) => {
    // Generate the slug prefix
    console.log("LabName:", LabName);
    const slugPrefix = slugify(LabName, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: true,
    }).substring(0, 2);

    let isUnique = false; // Start with false as we are looking for a unique slug
    let currentNumber = baseNumber;
    let finalSlug = '';

    while (!isUnique) {
        finalSlug = `${slugPrefix}${currentNumber}`;
        console.log("Checking slug:", finalSlug);

        try {
            const response = await axios.post("/api/v1/patient/getSlugPatient", { id, patientId: finalSlug });

            if (!response?.data?.data[0]?._id) {
                isUnique = true;
            } else {
                currentNumber += 1;
            }
        } catch (error) {
            console.error('Error checking slug:', error);
            break; // Exit the loop on error
        }
    }

    return finalSlug;
};

export default generateSlug;
