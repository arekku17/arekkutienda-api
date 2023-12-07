const roleSchema = require("../../models/Role");
const indexSchema = require("../../models/Indice");

const createRoles = async () => {
    try {
        const count = await roleSchema.estimatedDocumentCount()

        if (count > 0) return;

        const values = await Promise.all([
            new roleSchema({ name: "user" }).save(),
            new roleSchema({ name: "moderator" }).save(),
            new roleSchema({ name: "admin" }).save()
        ])

        console.log(values);
    } catch (error) {
        console.log(error);
    }
}


const createIndex = async () => {
    try {
        const count = await indexSchema.estimatedDocumentCount()

        if (count > 0) return;

        const values = await Promise.all([
            new indexSchema({ name: "PL", count: 0 }).save(),
            new indexSchema({ name: "SD", count: 0 }).save(),
            new indexSchema({ name: "LL", count: 0 }).save(),
            new indexSchema({ name: "PO", count: 0 }).save(),
            new indexSchema({ name: "PI", count: 0 }).save(),

        ])

        console.log(values);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createRoles, createIndex};