import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Plus, Trash2, GripVertical, FileText, Lock } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import type { FormField } from './types';
import { FIELD_TYPES } from './types';

interface FormFieldsTabProps {
  formFields: FormField[];
  consentText: string;
  consentRequired: boolean;
  onSave: (fields: FormField[], consentText: string, consentRequired: boolean) => void;
}

export function FormFieldsTab({ formFields: initialFields, consentText: initialConsent, consentRequired: initialConsentReq, onSave }: FormFieldsTabProps) {
  const [formFields, setFormFields] = useState<FormField[]>(initialFields);
  const [changed, setChanged] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [consentText, setConsentText] = useState(initialConsent);
  const [consentRequired, setConsentRequired] = useState(initialConsentReq);

  const addFormField = () => {
    if (!newFieldLabel.trim()) return;
    const id = newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 30) + '_' + Date.now().toString(36);
    const newField: FormField = {
      id, type: newFieldType, label: newFieldLabel.trim(),
      required: newFieldRequired, system: false, order: formFields.length,
      placeholder: newFieldPlaceholder || undefined,
      options: newFieldType === 'select' ? newFieldOptions.split(',').map(o => o.trim()).filter(Boolean) : undefined,
    };
    setFormFields(prev => [...prev, newField]);
    setNewFieldLabel(''); setNewFieldType('text'); setNewFieldRequired(false);
    setNewFieldPlaceholder(''); setNewFieldOptions('');
    setChanged(true);
  };

  const removeFormField = (id: string) => {
    setFormFields(prev => prev.filter(f => f.id !== id));
    setChanged(true);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(formFields);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setFormFields(items.map((f, i) => ({ ...f, order: i })));
    setChanged(true);
  };

  const handleSave = () => {
    onSave(formFields, consentText, consentRequired);
    setChanged(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Form Alanları
            </CardTitle>
            {changed && (
              <Button onClick={handleSave} size="sm">
                <Check className="w-4 h-4 mr-1" /> Kaydet
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="form-fields">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                  {formFields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card">
                          <div {...provided.dragHandleProps} className="cursor-grab"><GripVertical className="w-4 h-4 text-muted-foreground" /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{field.label}</span>
                              <Badge variant="outline" className="text-xs">{FIELD_TYPES.find(t => t.value === field.type)?.label || field.type}</Badge>
                              {field.required && <Badge variant="secondary" className="text-xs">Zorunlu</Badge>}
                              {field.system && <Badge variant="default" className="text-xs"><Lock className="w-3 h-3 mr-1" /> Sistem</Badge>}
                            </div>
                            {field.placeholder && <p className="text-xs text-muted-foreground mt-0.5">{field.placeholder}</p>}
                          </div>
                          {!field.system && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFormField(field.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="border-t border-border pt-4 space-y-3">
            <h4 className="text-sm font-medium">Yeni Alan Ekle</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Etiket</Label>
                <Input placeholder="Örn: Şirket Adı" value={newFieldLabel} onChange={(e) => setNewFieldLabel(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tip</Label>
                <Select value={newFieldType} onValueChange={setNewFieldType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{FIELD_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Placeholder (opsiyonel)</Label>
              <Input placeholder="Yer tutucu metin" value={newFieldPlaceholder} onChange={(e) => setNewFieldPlaceholder(e.target.value)} />
            </div>
            {newFieldType === 'select' && (
              <div className="space-y-1">
                <Label className="text-xs">Seçenekler (virgülle ayırın)</Label>
                <Input placeholder="Seçenek 1, Seçenek 2" value={newFieldOptions} onChange={(e) => setNewFieldOptions(e.target.value)} />
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="new-field-required" checked={newFieldRequired} onCheckedChange={(v) => setNewFieldRequired(!!v)} />
                <Label htmlFor="new-field-required" className="text-sm">Zorunlu</Label>
              </div>
              <Button onClick={addFormField} disabled={!newFieldLabel.trim()} size="sm">
                <Plus className="w-4 h-4 mr-1" /> Ekle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Gizlilik Onayı</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Gizlilik onayı zorunlu</Label>
            <Switch checked={consentRequired} onCheckedChange={(v) => { setConsentRequired(v); setChanged(true); }} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Onay Metni</Label>
            <Textarea placeholder="Kişisel verilerimin işlenmesini kabul ediyorum." value={consentText} onChange={(e) => { setConsentText(e.target.value); setChanged(true); }} rows={2} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
