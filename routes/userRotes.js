import express from 'express'
import { isRequiredAuth } from '../middleware/authMiddlewares.js'
import { createPatientsController, patientsController, getPatientByIdController, updatePatientByIdController, deletePatientByIdController } from '../controllers/patientController.js'

const router = express.Router()

/* router.get('/patients', isRequiredAuth, (req, res) => {
    res.send({message: 'get all pations'})
}) */

router.post('/patients', isRequiredAuth, createPatientsController)
router.get('/patients', isRequiredAuth, patientsController)
router.get('/patients/:id', isRequiredAuth, getPatientByIdController)
router.put('/patients/:id', isRequiredAuth, updatePatientByIdController)
router.delete('/patients/:id', isRequiredAuth, deletePatientByIdController)

export default router
