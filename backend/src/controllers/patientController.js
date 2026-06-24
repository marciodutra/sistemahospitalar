let patients = [];
let nextId = 1;

// LISTAR TODOS
exports.getAllPatients = (req, res) => {
  return res.json(patients);
};

// BUSCAR POR ID
exports.getPatientById = (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));

  if (!patient) {
    return res.status(404).json({ error: "Paciente não encontrado" });
  }

  return res.json(patient);
};

// CRIAR
exports.createPatient = (req, res) => {
  const { name, cpf } = req.body;

  if (!name || !cpf) {
    return res.status(400).json({ error: "Nome e CPF são obrigatórios" });
  }

  const newPatient = {
    id: nextId++,
    name,
    cpf
  };

  patients.push(newPatient);

  return res.status(201).json(newPatient);
};

// ATUALIZAR
exports.updatePatient = (req, res) => {
  const id = parseInt(req.params.id);

  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return res.status(404).json({ error: "Paciente não encontrado" });
  }

  const { name, cpf } = req.body;

  patient.name = name;
  patient.cpf = cpf;

  return res.json(patient);
};

// DELETAR
exports.deletePatient = (req, res) => {
  const id = parseInt(req.params.id);

  patients = patients.filter(p => p.id !== id);

  return res.json({ message: "Paciente removido com sucesso" });
};