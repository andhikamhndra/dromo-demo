import React, { useState } from "react";
import "./styles.css";

import DromoUploader from "dromo-uploader-react";

export default function App() {
  const [results, setResults] = useState("");

  const fields = [
    // required field
    {
      label: "First Name",
      key: "firstName",
      validators: [{ validate: "required" }]
    },
    {
      label: "Last Name",
      key: "lastName",
      validators: [{ validate: "required" }]
    },
    // unique
    {
      label: "Email",
      key: "email",
      validators: [
        { validate: "required" },
        { validate: "regex_match", regex: "^\\S+@\\S+\\.\\S+$" }
      ]
    },
    {
      label: "Phone Number",
      key: "phoneNumber",
      validators: [
        {
          validate: "regex_match",
          regex: "^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$"
        }
      ]
    },
    {
      label: "Country",
      key: "country"
    },
    {
      label: "Zip Code",
      key: "zipCode"
    },
    {
      label: "Customer Since",
      key: "customerSince",
      alternateMatches: ["Date Activated"]
    },
    // options
    {
      label: "Deal Stage",
      key: "dealStage",
      type: "select",
      selectOptions: [
        { label: "Cold", value: "cold" },
        { label: "Engaged", value: "engaged" },
        { label: "Warm", value: "warm" },
        { label: "Lead", value: "lead" },
        { label: "Lost", value: "lost" }
      ],
      validators: [{ validate: "required" }]
    }
  ];

  const settings = {
    importIdentifier: "Leads",
    displayEncoding: true,
    allowInvalidSubmit: true,
    backendSync: true,
    manualInputDisabled: false,
    manualInputOnly: false,
    allowCustomFields: true,
    maxRecords: null,
    developmentMode: true
  };

  const user = {
    id: "1",
    name: "Jane Doe",
    email: "jane@dromo.io",
    companyId: "Dromo",
    companyName: "12345"
  };

  const rowHooks = [
    (record) => {
      const newRecord = record;

      if (
        newRecord.row.country.value === "usa" ||
        newRecord.row.country.value === "united states"
      ) {
        newRecord.row.country.value = "United States";
      }

      if (
        newRecord.row.country.value === "United States" &&
        newRecord.row.zipCode.value &&
        newRecord.row.zipCode.value.toString().length < 5
      ) {
        newRecord.row.zipCode.value = newRecord.row.zipCode.value
          .toString()
          .padStart(5, "0");
        newRecord.row.zipCode.info = [
          {
            message: "Added 0's to the front of the zip code",
            level: "info"
          }
        ];
      }

      if (newRecord.row.customerSince.value) {
        const newDate = new Date(newRecord.row.customerSince.value);
        newRecord.row.customerSince.value =
          newDate.getMonth() +
          1 +
          "/" +
          newDate.getDate() +
          "/" +
          newDate.getFullYear();
      }

      return newRecord;
    }
  ];

  return (
    <div>
      <div>
        <DromoUploader
          licenseKey="e3971f36-2528-4849-a057-96a961ddd0a1"
          style={{ padding: 15, border: 0 }}
          settings={settings}
          fields={fields}
          user={user}
          rowHooks={rowHooks}
          onResults={(data) => setResults(JSON.stringify(data, null, 2))}
        >
          Launch Dromo
        </DromoUploader>
      </div>
      <div className="download">
        <a
          href="dromo_sales_demo.csv"
          target="_blank"
          rel="noopener noreferrer"
        >
          {">> Download a sample csv file here <<"}
        </a>
      </div>
      <textarea readOnly id="response" value={results} />
    </div>
  );
}
