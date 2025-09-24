import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ExcelConfig, generateExcelFileForViewTemplates } from "@/lib/excel-generator";
import { ViewTemplateExcelField } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ViewTemplateExcelPreviewCardProps {
  views: { rows: ViewTemplateExcelField[]; title: string }[];
  config: ExcelConfig;
}

export function ViewTemplateExcelPreviewCard({
  views,
  config,
}: ViewTemplateExcelPreviewCardProps) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedView, setSelectedView] = useState(0);

  // Create a stable, serialized config key for React Query
  //   const configKey = useMemo(
  //     () =>
  //       JSON.stringify({
  //         includeConditionalFields: config.includeConditionalFields,
  //         includeLineItems: config.includeLineItems,
  //         includeValidationRules: config.includeValidationRules,
  //         includeDefaultValues: config.includeDefaultValues,
  //         templateStyle: config.templateStyle,
  //         outputFormat: config.outputFormat,
  //       }),
  //     [config]
  //   );

  const downloadData = () => {
    if (!views.length) throw new Error("No data to download");
    const blob = generateExcelFileForViewTemplates(views);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${parseData.title}-view-definition.${config.outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: `Excel file has been generated and download started.`,
    });
  };

  const copyToClipboard = async () => {
    const parseData = views[selectedView];
    if (!parseData) return;

    const csvContent = [
      [
        "View Name",
        "Column",
        "Value Definition",
        "Data Type",
        "Description / Options",
      ],
      ...parseData.rows.map((row: ViewTemplateExcelField) => [
        row.viewTitle,
        row.columnTitle,
        row.valueDefinition,
        row.dataType,
        row.description,
      ]),
    ]
      .map((row) => row.join("\t"))
      .join("\n");

    try {
      await navigator.clipboard.writeText(csvContent);
      toast({
        title: "Copied to clipboard",
        description: "Excel data has been copied as tab-separated values.",
      });
    } catch (error) {
      console.error("Filed to copy data to clipboard: ", error);
      toast({
        title: "Copy failed",
        description: "Failed to copy data to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (!views.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Table className="h-5 w-5 text-primary" />
            <span>Excel Output Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Table className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Upload and parse a view template to see the Excel preview
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  //   if (isLoading) {
  //     return (
  //       <Card>
  //         <CardHeader>
  //           <CardTitle className="flex items-center space-x-2">
  //             <Table className="h-5 w-5 text-primary" />
  //             <span>Excel Output Preview</span>
  //           </CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-center py-8">
  //             <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
  //             <p className="text-muted-foreground">
  //               Processing form definition...
  //             </p>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     );
  //   }

  if (!views.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Table className="h-5 w-5 text-primary" />
            <span>Excel Output Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Failed to parse view template definition
            </p>
            <Button
              variant="outline"
              className="mt-4"
              data-testid="button-retry-parse"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const parseData = views[selectedView];
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, parseData.rows.length);
  const currentRows = parseData.rows.slice(startIndex, endIndex);
  const totalPages = Math.ceil(parseData.rows.length / pageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Table className="h-5 w-5 text-primary" />
            <span>Excel Output Preview</span>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              onValueChange={(p) => setSelectedView(parseInt(p))}
              value={`${selectedView}`}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a view" />
              </SelectTrigger>
              <SelectContent>
                {views.map((view, index) => (
                  <SelectItem key={`view-sheet-${index}`} value={`${index}`}>
                    {view.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              data-testid="button-copy-data"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadData}
              disabled={!views.length}
              data-testid="button-download-excel"
            >
              <Download className="h-4 w-4 mr-1" />
              {/* {isLoading ? "Generating..." : "Download"} */}
              Download
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Excel Table Preview */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left p-3 font-medium">View</th>
                <th className="text-left p-3 font-medium">Column</th>
                <th className="text-left p-3 font-medium">Value</th>
                <th className="text-left p-3 font-medium">Data Type</th>
                <th className="text-left p-3 font-medium">
                  Description / Options
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentRows.map((row, index) => (
                <tr
                  key={startIndex + index}
                  className="hover:bg-muted/30"
                  data-testid={`row-excel-${startIndex + index}`}
                >
                  <td
                    className="p-3"
                    data-testid={`cell-view-name-${startIndex + index}`}
                  >
                    {row.viewTitle}
                  </td>
                  <td
                    className="p-3"
                    data-testid={`cell-column-name-${startIndex + index}`}
                  >
                    {row.columnTitle}
                  </td>
                  <td
                    className="p-3"
                    data-testid={`cell-value-definition-${startIndex + index}`}
                  >
                    {row.valueDefinition}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      data-testid={`badge-field-type-${startIndex + index}`}
                    >
                      {row.dataType}
                    </Badge>
                  </td>
                  <td
                    className="p-3 text-muted-foreground text-xs"
                    data-testid={`cell-description-${startIndex + index}`}
                  >
                    {row.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span data-testid="text-showing-range">
              {startIndex + 1}-{endIndex}
            </span>{" "}
            of{" "}
            <span data-testid="text-total-rows">{parseData.rows.length}</span>{" "}
            rows
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              data-testid="button-previous-page"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              data-testid="button-next-page"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
