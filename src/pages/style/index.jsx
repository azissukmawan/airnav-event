import React, { useState } from "react";
import { Button } from "../../components/button";
import { ArrowRight } from "lucide-react";
import { InputText } from "../../components/form/InputText";
import { InputNumber } from "../../components/form/InputNumber";
import { TextArea } from "../../components/form/TextArea";
import SearchBar from "../../components/form/SearchBar";
import { Dropdown } from "../../components/form/Dropdown";
import { MultiSelect } from "../../components/form/MultiSelect";
import { Checkbox } from "../../components/form/Checkbox";
import { RadioGroup } from "../../components/form/Radiogroup";
import InputDate from "../../components/form/InputDate";
import InputTime from "../../components/form/InputTime";
import FileUpload from "../../components/form/FileUpload";

export default function Style() {
  const [selected, setSelected] = useState("react");
  const [deadline, setDeadline] = useState(null);
  const [time, setTime] = useState(null);
  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);

  const options = [
    { label: "React JS", value: "react" },
    { label: "Vue JS", value: "vue" },
    { label: "Angular", value: "angular" },
  ];

  const skills = [
    { label: "HTML", value: "html" },
    { label: "CSS", value: "css" },
    { label: "JavaScript", value: "js" },
    { label: "React", value: "react" },
    { label: "Laravel", value: "laravel" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Design System</h2>

      {/* Buttons */}
      <div className="space-y-4">
        {/* Primary */}
        <div className="flex gap-3 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="primary" iconLeft={<ArrowRight />}>
            With Left Icon
          </Button>
          <Button variant="primary" iconRight={<ArrowRight />}>
            With Right Icon
          </Button>
        </div>

        {/* Secondary */}
        <div className="flex gap-3 flex-wrap">
          <Button variant="secondary">Secondary</Button>
          <Button variant="secondary" iconRight={<ArrowRight />}>
            Next
          </Button>
        </div>

        {/* Third */}
        <div className="flex gap-3 flex-wrap">
          <Button variant="third">Third</Button>
          <Button variant="third" iconRight={<ArrowRight />}>
            Next
          </Button>
        </div>

        {/* Outline */}
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline">Outline</Button>
          <Button variant="outline" iconLeft={<ArrowRight />}>
            Back
          </Button>
        </div>

        {/* White */}
        <div className="flex gap-3 flex-wrap">
          <Button variant="white">White</Button>
          <Button variant="white" iconLeft={<ArrowRight />}>
            Back
          </Button>
        </div>
      </div>

      {/* Form Inputs */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Form Components</h3>
        <InputText id="Email" name="Email" placeholder="doctor@gmail.com" />
        <InputNumber
          id="Number"
          name="No WhatsApp"
          placeholder="Enter your number"
        />
        <TextArea
          id="Deskripsi"
          name="Deskripsi"
          placeholder="Tuliskan Deskripsi"
          row={4}
        />
        <SearchBar />
      </div>

      {/* Dropdown */}
      <h2 className="text-xl font-semibold mt-10">Dropdown</h2>
      <div className="flex flex-wrap gap-3">
        <Dropdown
          label="Pilih Jurusan"
          variant="primary"
          options={options}
          onSelect={(o) => console.log("Selected:", o)}
        />
        <Dropdown
          label="Pilih Jurusan (Outline)"
          variant="outline"
          options={options}
          onSelect={(o) => console.log("Selected:", o)}
        />
        <Dropdown
          label="Cari Jurusan"
          type="search"
          variant="white"
          options={options}
          onSelect={(o) => console.log("Selected:", o)}
        />
      </div>

      {/* Multiselect */}
      <h2 className="text-xl font-semibold mt-10">Multiselect</h2>
      <div className="flex flex-col gap-6">
        <MultiSelect
          label="Select Skills"
          options={skills}
          variant="primary"
          onChange={(values) => console.log("Selected:", values)}
        />
        <MultiSelect label="Frameworks" options={skills} variant="outline" />
      </div>

      {/* Checkbox */}
      <h2 className="text-xl font-semibold mt-10">Checkbox</h2>
      <Checkbox
        options={skills.slice(0, 3)}
        selected={["html"]}
        onChange={(values) => console.log("Checked:", values)}
      />

      {/* Radio Group */}
      <h2 className="text-xl font-semibold mt-10">Radio Group</h2>
      <RadioGroup
        options={options}
        selected={selected}
        onChange={setSelected}
      />

      {/* Date Picker */}
      <h2 className="text-xl font-semibold mt-10">Date Picker</h2>
      <InputDate 
        label="Deadline Pendaftaran" 
        selected={deadline} 
        onChange={(date) => setDeadline(date)} 
      />

      {/* InputTime */}
      <h2 className="text-xl font-semibold mt-10">Waktu Mulai</h2>
      <InputTime 
        label="Waktu Mulai" 
        selected={time} 
        onChange={(date) => setTime(date)} 
      />

      {/* Upload Image */}
      <h2 className="text-xl font-semibold mt-10">File Upload</h2>
      <FileUpload 
        label="Upload Foto" 
        accept="image/*"
        onChange={(file) => setImage(file)}
        maxSize={5}
      />

      {/* Upload PDF/Document */}
      <FileUpload 
        label="Upload Dokumen" 
        accept=".pdf,.doc,.docx"
        onChange={(file) => setDocument(file)}
        maxSize={10}
        showPreview={false}
      />

      {/* Upload Any File */}
      <FileUpload 
        label="Upload File" 
        accept="*"
        onChange={(file) => console.log(file)}
      />
    </div>
  );
}