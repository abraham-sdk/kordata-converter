import Image from "next/image";
import { Button } from "../ui/button";
import { HelpCircle } from "lucide-react";

export function Header() {
  {
    /* Header */
  }
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-lg flex items-center justify-center">
              {/* <FolderOutput className="text-primary-foreground text-lg" /> */}
              <Image
                src={
                  "https://kordata.com/wp-content/uploads/2017/06/Primary-Horzizontal-300x71.png"
                }
                width={150}
                height={40}
                className="bg-white"
                alt="Kordata Logo"
              />
            </div>
            <div className="border-l pl-2">
              <h1 className="text-lg font-semibold text-foreground">
                Form Converter
              </h1>
              <p className="text-xs text-muted-foreground">
                Convert JSON form definitions to Excel format
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" data-testid="button-help">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
