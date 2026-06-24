const getAllDoctors = `
  SELECT * FROM doctors ORDER BY id DESC;
`;

const getDoctorById = `
  SELECT * FROM doctors WHERE id = $1;
`;

const createDoctor = `
  INSERT INTO doctors (name, crm, specialty)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

const updateDoctor = `
  UPDATE doctors
  SET name = $1, crm = $2, specialty = $3
  WHERE id = $4
  RETURNING *;
`;

const deleteDoctor = `
  DELETE FROM doctors WHERE id = $1;
`;

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};