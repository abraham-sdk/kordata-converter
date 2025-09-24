"use client";

// import { FileUploadCard } from "./file-upload-card";
// import { ConfigurationCard } from "./configuration-card";
// import { ExcelPreviewCard } from "./excel-preview-card";
import { useState } from "react";
import { ExcelConfig } from "@/lib/excel-generator";
import {
  FormTemplateExcelField,
  FormTemplateDefinition,
  FormFile,
  FormTemplateJSON,
  ViewTemplateDefinition,
  ViewTemplateExcelField,
  ViewTemplateJSON,
} from "@/types";
import {
  mapFormFieldType,
  stringifyViewColumnValueObject,
} from "@/lib/field-type-mapper";

import { Header } from "./layout/header";
import { Footer } from "./layout/footer";
import { FolderUploadCard } from "./folder-upload-card";
import { FormTemplateExcelPreviewCard } from "./form-template-excel-preview-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, FileText } from "lucide-react";
import { ViewTemplateExcelPreviewCard } from "./view-template-excel-preview-card";

export default function Converter() {
  const [forms, setForms] = useState<FormTemplateDefinition[]>([]);
  const [views, setViews] = useState<ViewTemplateDefinition[]>([]);
  // const [currentForm, setCurrentForm] = useState<FormDefinition | null>(null);
  //   const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [excelConfig] = useState<ExcelConfig>({
    includeConditionalFields: true,
    includeLineItems: true,
    includeValidationRules: false,
    includeDefaultValues: false,
    outputFormat: "xlsx",
    templateStyle: "standard",
  });

  const [resourceType, setResourceType] = useState<"forms" | "views">("forms");

  const mapViewToExcelFields = (
    json: ViewTemplateJSON
  ): ViewTemplateExcelField[] => {
    const excelFields: ViewTemplateExcelField[] = [];
    console.log("Mapping view to excel fields: ", json);
    json.columns?.forEach((column) => {
      excelFields.push({
        viewTitle: String(json.id).split("_")[1] || "None",
        columnTitle: column.title || "None",
        dataType: column.dataType || "Text",
        valueDefinition: stringifyViewColumnValueObject(column.value),
        description: "",
      });
    });

    return excelFields;
  };
  const mapFormToExcelFields = (
    json: FormTemplateJSON
  ): FormTemplateExcelField[] => {
    const excelFields: FormTemplateExcelField[] = [];
    const fieldsMap: Record<string, string> = {};
    json.pages?.forEach((page) => {
      page.sections?.forEach((section) => {
        section?.fields?.forEach((field) => {
          if (!fieldsMap[field.id] && field.title) {
            fieldsMap[field.id] = field.title;
          }

          let description = "";
          // if (field.description) {
          //   description += field.description;
          // }
          // if (field.calculation) {
          //   description += description
          //     ? ";"
          //     : "" +
          //       ("Function: " + field.calculation.function) +
          //       ("; Variables: " +
          //         JSON.stringify(field.calculation?.variables));
          // }
          // if (field.items && Array.isArray(field.items)) {
          //   console.log("Field items: ", field.items);
          //   description += description.length
          //     ? ";"
          //     : "" + "Options: " + field.items.join(", ");
          // }
          // if (field.default !== undefined) {
          //   console.log("Field default: ", field.default);
          //   description += description.length
          //     ? ";"
          //     : "" + "Default: " + JSON.stringify(field.default);
          // }

          if (field.autoUpdate) {
            description += description.length
              ? ";"
              : "" + "autoUpdate: " + JSON.stringify(field.autoUpdate);
          }

          if (field.editable !== undefined && field.editable === false) {
            description += description.length ? ";" : "" + "* Not Editable";
          }

          // if (field.required !== undefined && field.required === true) {
          //   description += description.length ? "; " : "" + "* Required";
          // }

          if (field.displayWhen) {
            description += description.length
              ? "; "
              : "" +
                "* Conditionally displayed *; displayWhen: " +
                JSON.stringify(field.displayWhen);
          }

          if (field.editableWhen) {
            description += description.length
              ? "; "
              : "" + "* Conditionally editable *";
            // "* Conditionally editable *; editableWhen: " +
            // JSON.stringify(field.editableWhen);
          }
          if (field.requiredWhen) {
            description += description.length
              ? "; "
              : "" + "* Conditionally required *";
            // "* Conditionally required *; requiredWhen: " +
            // JSON.stringify(field.requiredWhen);
          }

          // if (String(field.fieldType).includes("entitySelect")) {
          //   description += description.length
          //     ? "; "
          //     : "" + "(" + field.items?.join(",") + ")";
          // }

          // if (String(field.fieldType).includes("buttonBar")) {
          //   description += description ? "(" + field.items?.join(",") + ")";
          // }

          excelFields.push({
            formTitle: json.title || "None",
            pageTitle: page.title || "None",
            sectionTitle: section.title || "None",
            fieldType: mapFormFieldType(field.fieldType),
            fieldName: field.title || field.id,
            isRequired: field.required || false,
            description,
          });
        });
      });
    });

    return excelFields;
  };

  const addFormFromFile = (file: FormFile): number | null => {
    // Parse JSON content
    try {
      if (resourceType === "views") {
        const jsonContent = JSON.parse(file.fileContent) as ViewTemplateJSON;
        const mappedFields = mapViewToExcelFields(jsonContent);
        const view = {
          id: jsonContent.id,
          fileName: file.fileName,
          viewName: jsonContent.title?.title || null,
          jsonContent,
          parseData: mappedFields,
          uploadedAt: new Date(),
        };
        // setCurrentForm(form);
        setViews((views) => [...views, view]);
        return views.length + 1;
      }

      if (resourceType === "forms") {
        const jsonContent = JSON.parse(file.fileContent) as FormTemplateJSON;
        const mappedFields = mapFormToExcelFields(jsonContent);
        const form = {
          id: jsonContent.id,
          fileName: file.fileName,
          formName: jsonContent.title as string,
          jsonContent,
          parseData: mappedFields,
          uploadedAt: new Date(),
        };
        console.log("Form added: ", form);
        // setCurrentForm(form);
        setForms((forms) => [...forms, form]);
        return forms.length + 1;
      }

      console.error("Unknown resource type: ", resourceType);

      return null;
    } catch (err) {
      console.error("Parsing form definition: ", err);
      return null;
    }
    //
  };

  // const handleFormFileParse = (file: FormFile) => {
  //   addFormFromFile(file);
  // };

  const handleBatchFormFileParse = (files: FormFile[]) => {
    setForms(() => []);
    setViews(() => []);
    files.forEach((file) => addFormFromFile(file));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={resourceType}
          onValueChange={(value) => {
            setResourceType(value as "forms" | "views");
            setForms(() => []);
            setViews(() => []);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger
              value="forms"
              className="flex items-center space-x-2"
              data-testid="tab-forms"
            >
              <FileText className="h-4 w-4" />
              <span>Form Definitions</span>
            </TabsTrigger>
            <TabsTrigger
              value="views"
              className="flex items-center space-x-2"
              data-testid="tab-views"
            >
              <Table className="h-4 w-4" />
              <span>View Templates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel - Upload & Configuration */}
              <div className="lg:col-span-2 space-y-6">
                {/* <FileUploadCard onFormParsed={handleFormFileParse} /> */}
                <FolderUploadCard
                  fileType={resourceType}
                  onBatchParsed={handleBatchFormFileParse}
                />

                {/* <ConfigurationCard
              config={excelConfig}
              onConfigChange={setExcelConfig}
            /> */}
              </div>

              {/* Right Panel - Preview & Results */}
              <div className="lg:col-span-2 space-y-6">
                {/* <FormPreviewCard form={selectedForm} /> */}

                <FormTemplateExcelPreviewCard
                  forms={forms.map((f) => {
                    const orgNameEndIndex = String(f.fileName).indexOf("_");
                    const extIndex = String(f.fileName).indexOf(".");
                    const formTitle = String(f.fileName).slice(
                      orgNameEndIndex + 1,
                      extIndex
                    );

                    return {
                      rows: f.parseData,
                      title: formTitle || (f.formName as string),
                    };
                  })}
                  config={excelConfig}
                />
                {/* <ExcelPreviewCard
              parseData={currentForm?.parseData || null}
              config={excelConfig}
            /> */}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="views" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel - Upload & Configuration */}
              <div className="lg:col-span-2 space-y-6">
                {/* <FileUploadCard onFormParsed={handleFormFileParse} /> */}
                <FolderUploadCard
                  fileType={resourceType}
                  onBatchParsed={handleBatchFormFileParse}
                />

                {/* <ConfigurationCard
              config={excelConfig}
              onConfigChange={setExcelConfig}
            /> */}
              </div>

              {/* Right Panel - Preview & Results */}
              <div className="lg:col-span-2 space-y-6">
                {/* <FormPreviewCard form={selectedForm} /> */}

                <ViewTemplateExcelPreviewCard
                  views={views.map((f) => {
                    const orgNameEndIndex = String(f.fileName).indexOf("_");
                    const extIndex = String(f.fileName).indexOf(".");
                    const viewTitle = String(f.fileName).slice(
                      orgNameEndIndex + 1,
                      extIndex
                    );

                    return {
                      rows: f.parseData,
                      title: viewTitle || (f.viewName as string),
                    };
                  })}
                  config={excelConfig}
                />
                {/* <ExcelPreviewCard
              parseData={currentForm?.parseData || null}
              config={excelConfig}
            /> */}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
