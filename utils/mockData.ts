// Mock data for development
export const getMockPatient = () => {
  return {
    resourceType: "Patient",
    id: "patient-1",
    active: true,
    name: [
      {
        use: "official",
        family: "Smith",
        given: ["John", "Jacob"],
      },
    ],
    telecom: [
      {
        system: "phone",
        value: "555-555-5555",
        use: "home",
      },
      {
        system: "email",
        value: "john.smith@example.com",
      },
    ],
    gender: "male",
    birthDate: "1990-01-01",
    address: [
      {
        use: "home",
        line: ["123 Main St"],
        city: "Anytown",
        state: "CA",
        postalCode: "12345",
        country: "USA",
      },
    ],
    maritalStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
          code: "M",
          display: "Married",
        },
      ],
      text: "Married",
    },
    photo: [
      {
        contentType: "image/jpeg",
        url: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
    ],
    contact: [
      {
        relationship: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v2-0131",
                code: "C",
                display: "Emergency Contact",
              },
            ],
          },
        ],
        name: {
          use: "official",
          family: "Smith",
          given: ["Jane"],
        },
        telecom: [
          {
            system: "phone",
            value: "555-555-5556",
            use: "mobile",
          },
        ],
        gender: "female",
      },
    ],
  };
};

export const getMockDocuments = () => {
  return [
    {
      resourceType: "DocumentReference",
      id: "doc-1",
      status: "current",
      docStatus: "final",
      type: {
        coding: [
          {
            system: "http://loinc.org",
            code: "34117-2",
            display: "History and physical note",
          },
        ],
        text: "Physical Examination",
      },
      category: [
        {
          coding: [
            {
              system: "http://loinc.org",
              code: "LP173421-1",
              display: "Report",
            },
          ],
        },
      ],
      subject: {
        reference: "Patient/patient-1",
      },
      date: "2023-06-15T10:30:00Z",
      content: [
        {
          attachment: {
            contentType: "application/pdf",
            url: "https://example.com/docs/physical-exam.pdf",
            title: "Annual Physical Examination Results",
            creation: "2023-06-15",
          },
        },
      ],
    },
    {
      resourceType: "DocumentReference",
      id: "doc-2",
      status: "current",
      docStatus: "final",
      type: {
        coding: [
          {
            system: "http://loinc.org",
            code: "51845-6",
            display: "Diagnostic imaging study",
          },
        ],
        text: "Chest X-Ray",
      },
      category: [
        {
          coding: [
            {
              system: "http://loinc.org",
              code: "LP173421-1",
              display: "Report",
            },
          ],
        },
      ],
      subject: {
        reference: "Patient/patient-1",
      },
      date: "2023-05-20T14:15:00Z",
      content: [
        {
          attachment: {
            contentType: "image/jpeg",
            url: "https://example.com/images/chest-xray.jpg",
            title: "Chest X-Ray Image",
            creation: "2023-05-20",
          },
        },
      ],
    },
    {
      resourceType: "DocumentReference",
      id: "doc-3",
      status: "current",
      docStatus: "final",
      type: {
        coding: [
          {
            system: "http://loinc.org",
            code: "11502-2",
            display: "Laboratory report",
          },
        ],
        text: "Blood Test Results",
      },
      category: [
        {
          coding: [
            {
              system: "http://loinc.org",
              code: "LP173421-1",
              display: "Report",
            },
          ],
        },
      ],
      subject: {
        reference: "Patient/patient-1",
      },
      date: "2023-07-05T09:45:00Z",
      content: [
        {
          attachment: {
            contentType: "application/pdf",
            url: "https://example.com/docs/blood-test.pdf",
            title: "Complete Blood Count Results",
            creation: "2023-07-05",
          },
        },
      ],
    },
  ];
};

export const getMockCheckIns = () => {
  return [
    {
      resourceType: "Observation",
      id: "obs-1",
      status: "final",
      category: [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "survey",
              display: "Survey",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "89204-2",
            display: "Patient Health Questionnaire-9 [PHQ-9]",
          },
        ],
        text: "Daily Check-in",
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: "2023-08-01T08:00:00Z",
      valueInteger: 4,
      component: [
        {
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "44250-9",
                display: "Mood score",
              },
            ],
            text: "Mood",
          },
          valueInteger: 3,
        },
        {
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "44254-1",
                display: "Energy level",
              },
            ],
            text: "Energy",
          },
          valueInteger: 4,
        },
      ],
    },
    {
      resourceType: "Observation",
      id: "obs-2",
      status: "final",
      category: [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "survey",
              display: "Survey",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "89204-2",
            display: "Patient Health Questionnaire-9 [PHQ-9]",
          },
        ],
        text: "Daily Check-in",
      },
      subject: {
        reference: "Patient/patient-1",
      },
      effectiveDateTime: "2023-08-02T08:15:00Z",
      valueInteger: 7,
      component: [
        {
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "44250-9",
                display: "Mood score",
              },
            ],
            text: "Mood",
          },
          valueInteger: 7,
        },
        {
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "44254-1",
                display: "Energy level",
              },
            ],
            text: "Energy",
          },
          valueInteger: 6,
        },
      ],
    },
  ];
};
