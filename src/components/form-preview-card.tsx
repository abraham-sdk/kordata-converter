import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Expand, FileText, Info } from "lucide-react";
import {
  getFieldTypeIconComponent,
  mapFormFieldType,
} from "@/lib/field-type-mapper";
import { FormTemplateDefinition } from "@/types";

interface FormPreviewCardProps {
  form?: FormTemplateDefinition;
}

export function FormPreviewCard({ form }: FormPreviewCardProps) {
  if (!form) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-primary" />
            <span>Form Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Upload a JSON form to see the preview
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formData = form.jsonContent;
  const totalFields =
    formData.pages?.reduce(
      (total: number, page) =>
        total +
        (page.sections || [])?.reduce(
          (acc, section) => acc + (section.fields?.length || 0),
          0
        ),
      0
    ) || 0;
  //   const lineItemsCount = formData.lineItems
  //     ? Object.keys(formData.lineItems).length
  //     : 0;
  const lineItemsCount = 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-primary" />
            <span>Form Preview</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" data-testid="badge-form-name">
              {formData.title || form.formName}
            </Badge>
            <Button variant="ghost" size="sm" data-testid="button-expand">
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div
              className="text-2xl font-bold text-primary"
              data-testid="text-pages-count"
            >
              {formData.pages?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Pages</div>
          </div>
          <div className="text-center">
            <div
              className="text-2xl font-bold text-primary"
              data-testid="text-fields-count"
            >
              {/* {formData?.pages?.sections?.length} */}0
            </div>
            <div className="text-sm text-muted-foreground">Sections</div>
          </div>
          <div className="text-center">
            <div
              className="text-2xl font-bold text-primary"
              data-testid="text-fields-count"
            >
              {totalFields}
            </div>
            <div className="text-sm text-muted-foreground">Fields</div>
          </div>
          <div className="text-center">
            <div
              className="text-2xl font-bold text-primary"
              data-testid="text-line-items-count"
            >
              {lineItemsCount}
            </div>
            <div className="text-sm text-muted-foreground">Line Items</div>
          </div>
        </div>

        {/* Form Pages */}
        <div className="space-y-3">
          {formData.pages?.map((page, pageIndex: number) => (
            <div key={pageIndex} className="border border-border rounded-lg">
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <h3
                      className="font-medium"
                      data-testid={`text-page-name-${pageIndex}`}
                    >
                      {page.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {page.sections?.length || 0} sections
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {page.sections?.map((section) =>
                  section.fields?.map((field, fieldIndex) => (
                    <div
                      key={fieldIndex}
                      className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        {(() => {
                          const IconComponent = getFieldTypeIconComponent(
                            field.fieldType
                          );
                          return (
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                          );
                        })()}
                        <span
                          className="text-sm"
                          data-testid={`text-field-name-${pageIndex}-${fieldIndex}`}
                        >
                          {field.title}
                        </span>
                        {field.displayWhen && (
                          <Info className="h-3 w-3 text-blue-500" />
                        )}
                        {field.required && (
                          <span className="text-red-500 text-xs">*</span>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        data-testid={`badge-field-type-${pageIndex}-${fieldIndex}`}
                      >
                        {mapFormFieldType(field.fieldType)}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Line Items */}
        {/* {formData.lineItems && Object.keys(formData.lineItems).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Line Items
            </h4>
            {Object.entries(formData.lineItems).map(
              ([lineItemName, lineItemData]: [string, any], index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-lg bg-accent/30"
                >
                  <div className="flex items-center justify-between p-4 bg-accent/50">
                    <div className="flex items-center space-x-3">
                      <List className="h-5 w-5 text-primary" />
                      <div>
                        <h3
                          className="font-medium"
                          data-testid={`text-line-item-name-${index}`}
                        >
                          {lineItemName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {lineItemData.fields?.length || 0} fields
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {lineItemData.fields?.map(
                      (field: any, fieldIndex: number) => (
                        <div
                          key={fieldIndex}
                          className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                        >
                          <div className="flex items-center space-x-3 pl-6">
                            {(() => {
                              const IconComponent = getFieldTypeIconComponent(
                                field.type
                              );
                              return (
                                <IconComponent className="h-4 w-4 text-muted-foreground" />
                              );
                            })()}
                            <span
                              className="text-sm"
                              data-testid={`text-line-item-field-${index}-${fieldIndex}`}
                            >
                              {field.name}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {mapFieldType(field.type)}
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
