import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { ExcelConfig } from "@/lib/excel-generator";

interface ConfigurationCardProps {
  config: ExcelConfig;
  onConfigChange: (config: ExcelConfig) => void;
}

export function ConfigurationCard({ config, onConfigChange }: ConfigurationCardProps) {
  const updateConfig = (updates: Partial<ExcelConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-primary" />
          <span>Export Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Include Options */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Include in Export</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="conditionalFields"
                checked={config.includeConditionalFields}
                onCheckedChange={(checked) => 
                  updateConfig({ includeConditionalFields: !!checked })
                }
                data-testid="checkbox-conditional-fields"
              />
              <Label htmlFor="conditionalFields" className="text-sm">Conditional Fields</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lineItems"
                checked={config.includeLineItems}
                onCheckedChange={(checked) => 
                  updateConfig({ includeLineItems: !!checked })
                }
                data-testid="checkbox-line-items"
              />
              <Label htmlFor="lineItems" className="text-sm">Line Items</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="validationRules"
                checked={config.includeValidationRules}
                onCheckedChange={(checked) => 
                  updateConfig({ includeValidationRules: !!checked })
                }
                data-testid="checkbox-validation-rules"
              />
              <Label htmlFor="validationRules" className="text-sm">Field Validation Rules</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="defaultValues"
                checked={config.includeDefaultValues}
                onCheckedChange={(checked) => 
                  updateConfig({ includeDefaultValues: !!checked })
                }
                data-testid="checkbox-default-values"
              />
              <Label htmlFor="defaultValues" className="text-sm">Default Values</Label>
            </div>
          </div>
        </div>

        {/* Output Format */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Output Format</Label>
          <Select
            value={config.outputFormat}
            onValueChange={(value: "xlsx" | "csv") => updateConfig({ outputFormat: value })}
          >
            <SelectTrigger data-testid="select-output-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
              <SelectItem value="csv">CSV (.csv)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Template Style */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Template Style</Label>
          <Select
            value={config.templateStyle}
            onValueChange={(value: "standard" | "detailed" | "client_review") => 
              updateConfig({ templateStyle: value })
            }
          >
            <SelectTrigger data-testid="select-template-style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Format</SelectItem>
              <SelectItem value="detailed">Detailed Format</SelectItem>
              <SelectItem value="client_review">Client Review Format</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
