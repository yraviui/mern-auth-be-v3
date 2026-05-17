import PatientModel from "../models/patients.js"

export const createPatientsController = async (req, res) => {

    const { name, age, purpose_of_visit, email, phone } = req.body;

    if (!name) return res.status(400).send({ message: 'Name is required' });
    if (!age) return res.status(400).send({ message: 'Age is required' });
    if (!purpose_of_visit) return res.status(400).send({ message: 'Purpose of visit is required' });

    try {

        const newPatient = await PatientModel.create({
            name,
            age,
            purpose_of_visit,
            email,
            phone,
            createdBy: req.user._id   // ✅ FIX HERE
        });

        return res.status(201).send({
            success: true,
            message: 'Patient created successfully',
            patient: newPatient
        });

    } catch (error) {

        return res.status(500).send({
            success: false,
            message: 'Server error for Patient create',
            error: error.message
        });

    }
};

export const patientsController = async (req, res) => {

    try {

        const patients = await PatientModel.find({ createdBy: req.user._id });

        return res.status(200).send({
            success: true,
            message: 'Patients retrieved successfully',
            patients
        });

    } catch (error) {

        return res.status(500).send({
            success: false,
            message: 'Server error for patients retrieve',
            error: error.message
        });

    }
};

export const getPatientByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await PatientModel.findById({ _id:  id})
        if(!patient) return res.status(404).send({ success: false, message: 'Patient not found!'})
        res.status(200).send({ success: true, message: 'Patient retrieved successfully', patient })
    } catch (error) {
        res.status(500).send({ success: false, message: 'Server error for patient retrive', error: error.message });
    }
}

export const updatePatientByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, purpose_of_visit, email, phone } = req.body

        if(!name) return res.status(400).send({ message: 'Name is required' })
        if(!age) return res.status(400).send({ message: 'Age is required' })
        if(!purpose_of_visit) return res.status(400).send({ message: 'Purpose of visit is required' })

        const patientObj = { name: req.body.name , age: req.body.age , purpose_of_visit: req.body.purpose_of_visit , email: req.body.email , phone: req.body.phone  }
        
        const updatePatient = await PatientModel.findByIdAndUpdate(id, patientObj, {new: true}) 

        res.status(200).send({ success: true, message: 'Patient updated successfully', updatePatient })
    } catch (error) {
        res.status(500).send({ success: false, message: 'Server error for Patient updated', error: error.message });
    }
}

export const deletePatientByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletePatient = await PatientModel.findByIdAndDelete({ _id:  id})
        if(!deletePatient) return res.status(404).send({ success: false, message: 'Patient not found!'})
        res.status(200).send({ success: true, message: 'Patient deleted successfully', deletedPatient: deletePatient })
    } catch (error) {
        res.status(500).send({ success: false, message: 'Server error for Patient delete', error: error.message });
    }
}