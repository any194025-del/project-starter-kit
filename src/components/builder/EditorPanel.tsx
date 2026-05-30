// Editor panel: tabbed schema-driven editor.
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetaEditor } from "./MetaEditor";
import { SectionManager } from "./SectionManager";
import { SectionSettingsForm } from "./SectionSettingsForm";
import { ThemePanel } from "./ThemePanel";
import { TemplateSwitcher } from "./TemplateSwitcher";
import { PresetGallery } from "./PresetGallery";

export function EditorPanel() {
  return (
    <Tabs defaultValue="content" className="flex h-full flex-col">
      <TabsList className="grid grid-cols-3 rounded-none border-b border-border/40 bg-background/60">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="theme">Theme</TabsTrigger>
        <TabsTrigger value="template">Template</TabsTrigger>
      </TabsList>

      <div className="flex-1 overflow-auto p-4">
        <TabsContent value="content" className="m-0 space-y-6">
          <MetaEditor />
          <div className="h-px bg-border/40" />
          <SectionManager />
          <div className="h-px bg-border/40" />
          <SectionSettingsForm />
        </TabsContent>

        <TabsContent value="theme" className="m-0">
          <ThemePanel />
        </TabsContent>

        <TabsContent value="template" className="m-0 space-y-6">
          <TemplateSwitcher />
          <div className="h-px bg-border/40" />
          <PresetGallery />
        </TabsContent>
      </div>
    </Tabs>
  );
}
