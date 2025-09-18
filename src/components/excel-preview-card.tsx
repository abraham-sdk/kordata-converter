import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ExcelConfig, generateExcelFile } from "@/lib/excel-generator";
import { ExcelField } from "@/types";

interface ExcelPreviewCardProps {
  parseData: ExcelField[] | null;
  config: ExcelConfig;
}

export function ExcelPreviewCard({ parseData, config }: ExcelPreviewCardProps) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
    if (!parseData) throw new Error("No data to download");
    const blob = generateExcelFile(parseData, config);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `form-definition.${config.outputFormat}`;
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
    if (!parseData) return;

    const csvContent = [
      [
        "Form Name",
        "Page",
        "Section",
        "Field Name",
        "Field Type",
        "Description / Options",
      ],
      ...parseData.map((row: ExcelField) => [
        row.formTitle,
        row.pageTitle,
        row.sectionTitle,
        row.fieldName,
        row.fieldType,
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

  if (!parseData) {
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
              Upload and parse a form to see the Excel preview
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

  if (!parseData) {
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
              Failed to parse form definition
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

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, parseData.length);
  const currentRows = parseData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(parseData.length / pageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Table className="h-5 w-5 text-primary" />
            <span>Excel Output Preview</span>
          </div>
          <div className="flex items-center space-x-2">
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
              disabled={!parseData}
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
                <th className="text-left p-3 font-medium">Form Name</th>
                <th className="text-left p-3 font-medium">Page</th>
                <th className="text-left p-3 font-medium">Section</th>
                <th className="text-left p-3 font-medium">Field Name</th>
                <th className="text-left p-3 font-medium">Field Type</th>
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
                    data-testid={`cell-form-name-${startIndex + index}`}
                  >
                    {row.formTitle}
                  </td>
                  <td
                    className="p-3"
                    data-testid={`cell-page-${startIndex + index}`}
                  >
                    {row.pageTitle}
                  </td>
                  <td
                    className="p-3"
                    data-testid={`cell-page-${startIndex + index}`}
                  >
                    {row.sectionTitle}
                  </td>
                  <td
                    className="p-3"
                    data-testid={`cell-field-name-${startIndex + index}`}
                  >
                    {row.fieldName}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      data-testid={`badge-field-type-${startIndex + index}`}
                    >
                      {row.fieldType}
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
            of <span data-testid="text-total-rows">{parseData.length}</span>{" "}
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
