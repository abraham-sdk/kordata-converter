"use client";

import { FileUploadCard } from "./file-upload-card";
// import { ConfigurationCard } from "./configuration-card";
import { ExcelPreviewCard } from "./excel-preview-card";
import { useState } from "react";
import { ExcelConfig } from "@/lib/excel-generator";
import { ExcelField, FormDefinition, FormJSON } from "@/types";
import { mapFieldType } from "@/lib/field-type-mapper";

import { Header } from "./layout/header";
import { Footer } from "./layout/footer";

export default function Converter() {
  const [forms, setForms] = useState<FormDefinition[]>([]);
  const [currentForm, setCurrentForm] = useState<FormDefinition | null>(null);
  //   const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [excelConfig] = useState<ExcelConfig>({
    includeConditionalFields: true,
    includeLineItems: true,
    includeValidationRules: false,
    includeDefaultValues: false,
    outputFormat: "xlsx",
    templateStyle: "standard",
  });

  const mapFormToExcelFields = (json: FormJSON): ExcelField[] => {
    const excelFields: ExcelField[] = [];
    json.pages?.forEach((page) => {
      page.sections?.forEach((section) => {
        section?.fields?.forEach((field) => {
          let description = "";
          if (field.description) {
            description += field.description;
          }
          //   if (field.calculation) {
          //     description += description ? ";" : "" + ("Function: " + field.calculation.function) + ("; Variables: " + JSON.stringify(field.calculation?.variables));
          //   }
          if (field.editable !== undefined && field.editable === false) {
            description += description ? ";" : "" + "* Not Editable";
          }

          if (field.displayWhen) {
            description += "* Conditionally displayed *";
          }

        //   if (String(field.fieldType).includes("entitySelect")) {
        //     description += "(" + field.items?.join(",") + ")";
        //   }
          if (String(field.fieldType).includes("buttonBar")) {
            description += "(" + field.items?.join(",") + ")";
          }

          excelFields.push({
            formTitle: json.title || "Form Title",
            pageTitle: page.title || "Default Page",
            sectionTitle: section.title || "Default Section",
            fieldType: mapFieldType(field.fieldType),
            fieldName: field.title || field.id,
            description,
          });
        });
      });
    });

    return excelFields;
  };

  const addFormFromFile = (
    fileName: string,
    fileContent: string
  ): number | null => {
    // Parse JSON content
    try {
      const jsonContent = JSON.parse(fileContent) as FormJSON;
      const mappedFields = mapFormToExcelFields(jsonContent);
      const form = {
        id: jsonContent.id,
        fileName,
        formName: jsonContent.title as string,
        jsonContent,
        parseData: mappedFields,
        uploadedAt: new Date(),
      };
      setCurrentForm(form);
      setForms((forms) => [...forms, form]);
      return forms.length + 1;
    } catch (err) {
      console.error("Parsing form definition: ", err);
      return null;
    }
    //
  };

  const handleFormFileUpload = (fileName: string, fileContent: string) => {
    addFormFromFile(fileName, fileContent);
    // const formId = addFormFromFile(fileName, fileContent);
    // setSelectedFormId(formId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload & Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <FileUploadCard
              //   onFormUploaded={(formId) => setSelectedFormId(formId)}
              onFormUploaded={handleFormFileUpload}
            />

            {/* <ConfigurationCard
              config={excelConfig}
              onConfigChange={setExcelConfig}
            /> */}
          </div>

          {/* Right Panel - Preview & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* <FormPreviewCard form={selectedForm} /> */}

            <ExcelPreviewCard
              parseData={currentForm?.parseData || null}
              config={excelConfig}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
