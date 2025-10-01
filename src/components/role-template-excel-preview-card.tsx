import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ExcelConfig,
  generateExcelFileForRoleTemplates,
} from "@/lib/excel-generator";
import { RoleTemplateExcelField } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface RoleTemplateExcelPreviewCardProps {
  roles: { rows: RoleTemplateExcelField[]; title: string }[];
  config: ExcelConfig;
}

export function RoleTemplateExcelPreviewCard({
  roles,
  config,
}: RoleTemplateExcelPreviewCardProps) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedRole, setSelectedRole] = useState(0);

  const downloadData = () => {
    if (!roles.length) throw new Error("No data to download");
    const blob = generateExcelFileForRoleTemplates(roles);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${parseData.title}-role-definition.${config.outputFormat}`;
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
    const parseData = roles[selectedRole];
    if (!parseData) return;

    const csvContent = [
      ["Role", "Wed Modules", "Mobile Modules"],
      ...parseData.rows.map((row: RoleTemplateExcelField) => [
        row.roleTitle,
        row.webModules,
        row.mobileModules,
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

  if (!roles.length) {
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
              Upload and parse a role template to see the Excel preview
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

  if (!roles.length) {
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
              Failed to parse role template definition
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

  const parseData = roles[selectedRole];
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
              onValueChange={(p) => setSelectedRole(parseInt(p))}
              value={`${selectedRole}`}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a view" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role, index) => (
                  <SelectItem key={`role-sheet-${index}`} value={`${index}`}>
                    {role.title}
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
              disabled={!roles.length}
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
                <th className="text-left p-3 font-medium">Role</th>
                <th className="text-left p-3 font-medium">Web Modules</th>
                <th className="text-left p-3 font-medium">Mobile Modules</th>
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
                    data-testid={`cell-role-name-${startIndex + index}`}
                  >
                    {row.roleTitle}
                  </td>
                  <td
                    className="p-3 text-muted-foreground text-xs"
                    data-testid={`cell-web-modules-${startIndex + index}`}
                  >
                    {row.webModules.length > 0 && row.webModules}
                  </td>
                  <td
                    className="p-3 text-muted-foreground text-xs"
                    data-testid={`cell-mobile-modules-${startIndex + index}`}
                  >
                    {row.mobileModules.length > 0 && row.mobileModules}
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
