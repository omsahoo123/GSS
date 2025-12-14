
export const allPatients = [
  {
    id: 'pat-1',
    name: 'Aarav Sharma',
    age: 34,
    lastVisit: '2024-07-15',
    type: 'Remote',
    avatarId: 'avatar-patient',
    history: {
      consultations: [
        { date: '2024-07-15', note: 'Patient reported mild headaches. Discussed potential causes and recommended lifestyle changes.' },
        { date: '2024-05-02', note: 'Routine follow-up. Blood pressure normal.' },
      ],
      labReports: [
        { id: 'lab-1', name: 'Lipid Profile', date: '2024-05-01', fileName: 'lab_lipid_pat1_20240501.pdf' },
      ],
    },
  },
  {
    id: 'pat-2',
    name: 'Sunita Devi',
    age: 45,
    lastVisit: '2024-07-10',
    type: 'In-Clinic',
    avatarId: 'doctor-1',
    history: {
      consultations: [
        { date: '2024-07-10', note: 'Annual physical exam. All vitals are stable. Discussed diet and exercise.' },
        { date: '2024-01-20', note: 'Complained of seasonal allergies. Prescribed antihistamines.' },
      ],
      labReports: [
        { id: 'lab-2', name: 'Complete Blood Count (CBC)', date: '2024-07-10', fileName: 'lab_cbc_pat2_20240710.pdf' },
        { id: 'lab-3', name: 'Thyroid Panel', date: '2024-07-10', fileName: 'lab_thyroid_pat2_20240710.pdf' },
      ],
    },
  },
  {
    id: 'pat-3',
    name: 'Rohan Verma',
    age: 28,
    lastVisit: '2024-06-20',
    type: 'Remote',
    avatarId: 'doctor-2',
    history: {
      consultations: [
        { date: '2024-06-20', note: 'Follow-up on medication for anxiety. Patient reports improvement.' },
      ],
      labReports: [],
    },
  },
  {
    id: 'pat-4',
    name: 'Neha Gupta',
    age: 52,
    lastVisit: '2024-07-01',
    type: 'In-Clinic',
    avatarId: 'doctor-1',
    history: {
      consultations: [
        { date: '2024-07-01', note: 'Patient presented with a persistent cough. Prescribed medication and recommended rest.' },
      ],
      labReports: [],
    },
  },
  {
    id: 'pat-5',
    name: 'Amit Kumar',
    age: 60,
    lastVisit: '2024-05-12',
    type: 'In-Clinic',
    avatarId: 'avatar-patient',
    history: {
      consultations: [
         { date: '2024-05-12', note: 'Routine check-up for diabetes management. Adjusted medication dosage.' },
      ],
      labReports: [
        { id: 'lab-4', name: 'HbA1c Test', date: '2024-05-12', fileName: 'lab_hba1c_pat5_20240512.pdf' },
      ],
    },
  },
];
