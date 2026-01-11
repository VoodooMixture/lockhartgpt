import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoogleSheetEmbedProps {
    sheetId: string;
    title?: string;
}

export function GoogleSheetEmbed({ sheetId, title }: GoogleSheetEmbedProps) {
    // Construct embed URL (preview mode is cleaner than edit)
    // /preview?rm=minimal removes some UI chrome
    const embedUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/preview?rm=demo`;
    const openUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/view`;

    return (
        <div className="flex flex-col h-full w-full bg-background">
            <div className="h-10 flex items-center justify-between px-4 border-b border-border/40 bg-muted/20">
                <span className="text-xs font-medium text-muted-foreground">
                    {title || "Google Sheet Preview"}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1.5 text-blue-500 hover:text-blue-400"
                    onClick={() => window.open(openUrl, '_blank')}
                >
                    Open in Sheets <ExternalLink className="h-3 w-3" />
                </Button>
            </div>
            <div className="flex-1 relative bg-white">
                {/* Sheets look better on white usually, or we can use generic iframe */}
                <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full border-none"
                    title={title || "Google Sheet"}
                    allowFullScreen
                />
            </div>
        </div>
    );
}
