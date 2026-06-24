require("dotenv").config({ path: require("path").resolve(__dirname, "../../../.env") });
const bcrypt = require("bcrypt");
const { pool } = require("../../config/database");

async function seed() {
    const hash = await bcrypt.hash("Md@051080", 10);

    await pool.query(
        `
        UPDATE users
        SET password = $1
        WHERE email = $2
        `,
        [
            hash,
            "professormarciodutra@gmail.com"
        ]
    );

    console.log("Senha atualizada com sucesso!");
    process.exit();
}

seed();