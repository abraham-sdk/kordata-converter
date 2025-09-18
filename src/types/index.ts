export interface FormDefinition {
  id: string;
  fileName: string;
  formName: string | null;
  jsonContent: FormJSON;
  parseData: ExcelField[];
  uploadedAt: Date;
}

interface FormJSONField {
  default?: unknown;
  displayOnly?: boolean;
  editable?: boolean;
  hidden?: boolean;
  required?: boolean;

  displayWhen?: boolean;
  editableWhen?: boolean;
  requiredWhen?: boolean;

  description?: string;

  itemView?: string;
  items?: string[];

  fieldType: string;
  id: string;
  path?: string;
  title?: string;
  canAddItems?: boolean;
  canEditItems?: boolean;
  injectFromParent?: Record<string, string>;
  calculation?: {
    function?: string;
    variables?: Record<string, string>;
  };
}

export interface FormJSON {
  id: string;
  organization: string;
  title?: string;
  type?: string;
  entityType?: string;
  pages: {
    title?: string;
    sections?: {
      title?: string;
      fields?: FormJSONField[];
    }[];
  }[];
  createdAt?: string;
  createdBy?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ExcelField {
  formTitle: string;
  pageTitle: string;
  sectionTitle: string;
  fieldType: string;
  fieldName: string;
  description: string;
}
