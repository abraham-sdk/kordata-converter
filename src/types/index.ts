export interface FormTemplateDefinition {
  id: string;
  fileName: string;
  formName: string | null;
  jsonContent: FormTemplateJSON;
  parseData: FormTemplateExcelField[];
  uploadedAt: Date;
}

export interface ViewTemplateDefinition {
  id: string;
  fileName: string;
  viewName: string | null;
  jsonContent: ViewTemplateJSON;
  parseData: ViewTemplateExcelField[];
  uploadedAt: Date;
}

export interface FormFile {
  id?: string;
  fileName: string;
  fileContent: string;
  uploadedAt?: Date | string;
}

export interface FormJSONField {
  default?: unknown;
  displayOnly?: boolean;
  editable?: boolean;
  hidden?: boolean;
  required?: boolean;

  displayWhen?: string;
  editableWhen?: string;
  requiredWhen?: string;

  description?: string;

  itemView?: string;
  items?: string[];

  // autoUpdate: {
  //   track?: string;
  //   path?: string;
  //   set?: any;
  //   when?: {
  //     fieldId?: string;
  //     qualifier?: string;
  //     target?: string
  //   };
  // };
  autoUpdate?: string;
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

export interface FormTemplateJSON {
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

export interface ViewColumn {
  title?: string;
  dataType?: string;
  value:
    | { fetch: string }
    | { count: string }
    | { loadAttachment: { from: string; name: string } };
}

export interface ViewTemplateJSON {
  id: string;
  organization: string;
  type?: string;
  title?: {
    dataType?: string;
    title?: string;
    value?: { fetch: string } | { count: string };
  };
  filters?: Record<string, { value: { fetch: string } | { count: string } }>;
  entityType?: string;
  columns: ViewColumn[];
  createdAt?: string;
  createdBy?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface FormTemplateExcelField {
  formTitle: string;
  pageTitle: string;
  sectionTitle: string;
  isRequired?: boolean;
  fieldType: string;
  fieldName: string;
  description: string;
}

export interface ViewTemplateExcelField {
  viewTitle: string;
  columnTitle: string;
  dataType: string;
  valueDefinition: string;
  description?: string;
}
