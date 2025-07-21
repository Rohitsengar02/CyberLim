
"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ALL_ICONS, Icon, type IconName } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface IconPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconName: IconName) => void;
  currentIcon: IconName;
}

export function IconPickerDialog({ isOpen, onClose, onSelect, currentIcon }: IconPickerDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = ALL_ICONS.filter(iconName =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-secondary/50 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle>Select an Icon</DialogTitle>
          <DialogDescription>
            Browse and search for an icon that best represents your feature.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-input/50 border-border"
          />
        </div>
        <ScrollArea className="h-96 border border-border rounded-lg p-2 bg-background/30">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {filteredIcons.map(iconName => (
              <Button
                key={iconName}
                variant="ghost"
                onClick={() => onSelect(iconName)}
                className={cn(
                  "h-20 flex flex-col items-center justify-center gap-2",
                  iconName === currentIcon && "bg-accent text-accent-foreground"
                )}
              >
                <Icon name={iconName} className="w-6 h-6" />
                <span className="text-xs truncate w-full text-center">{iconName}</span>
              </Button>
            ))}
             {filteredIcons.length === 0 && (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                    No icons found for "{searchTerm}"
                </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
