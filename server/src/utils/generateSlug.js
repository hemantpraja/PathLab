// Description of file: This is a javascript file that generates slugs for the database.
import slugify from 'slugify';
const generateSlug = (name, admin) => {
    let newname = slugify(name, {
        replacement: '-',
        remove: undefined,
        lowerCase: true,
        strict: true,
    }).substring(0, 4);
    let newadmin = slugify(admin, {
        replacement: '-',
        remove: undefined,
        lowerCase: true,
        strict: true,
    }).substring(0, 4);
    let date = Date.now();
    const slug = `${newname}-${newadmin}-${date}`
    return slug;
} 

export default  generateSlug;