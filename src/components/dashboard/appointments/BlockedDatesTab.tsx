import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ban, Plus, X } from 'lucide-react';
import type { BlockedSlot } from './types';

interface BlockedDatesTabProps {
  blockedSlots: BlockedSlot[];
  onBlockDate: (body: Record<string, any>) => void;
  onUnblockDate: (blockId: string) => void;
}

export function BlockedDatesTab({ blockedSlots, onBlockDate, onUnblockDate }: BlockedDatesTabProps) {
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');
  const [newBlockType, setNewBlockType] = useState('full_day');
  const [newBlockStartTime, setNewBlockStartTime] = useState('');
  const [newBlockEndTime, setNewBlockEndTime] = useState('');

  const handleBlock = () => {
    if (!newBlockDate) return;
    const body: Record<string, any> = { blocked_date: newBlockDate, reason: newBlockReason || null, block_type: newBlockType };
    if (newBlockType === 'time_range') { body.block_start_time = newBlockStartTime; body.block_end_time = newBlockEndTime; }
    onBlockDate(body);
    setNewBlockDate(''); setNewBlockReason(''); setNewBlockType('full_day');
    setNewBlockStartTime(''); setNewBlockEndTime('');
  };

  const blockTypeBadge = (type: string) => {
    switch (type) {
      case 'vacation': return <Badge variant="secondary">Tatil</Badge>;
      case 'time_range': return <Badge variant="outline">Saat Aralığı</Badge>;
      default: return <Badge variant="destructive">Tam Gün</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="w-5 h-5" /> Tarih Kapat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tarih</Label>
              <Input type="date" value={newBlockDate} onChange={(e) => setNewBlockDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Kapatma Tipi</Label>
              <Select value={newBlockType} onValueChange={setNewBlockType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_day">Tam Gün</SelectItem>
                  <SelectItem value="time_range">Saat Aralığı</SelectItem>
                  <SelectItem value="vacation">Tatil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {newBlockType === 'time_range' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Başlangıç Saati</Label>
                <Input type="time" value={newBlockStartTime} onChange={(e) => setNewBlockStartTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Bitiş Saati</Label>
                <Input type="time" value={newBlockEndTime} onChange={(e) => setNewBlockEndTime(e.target.value)} />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label>Sebep (opsiyonel)</Label>
            <Input placeholder="Örn: Yıllık izin" value={newBlockReason} onChange={(e) => setNewBlockReason(e.target.value)} />
          </div>
          <Button onClick={handleBlock} disabled={!newBlockDate} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-1" /> Tarihi Kapat
          </Button>
        </CardContent>
      </Card>

      {blockedSlots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kapalı Tarihler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blockedSlots.map(slot => (
                <div key={slot.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    {blockTypeBadge(slot.block_type)}
                    <span className="font-medium">{new Date(slot.blocked_date).toLocaleDateString('tr-TR')}</span>
                    {slot.block_type === 'time_range' && slot.block_start_time && slot.block_end_time && (
                      <span className="text-sm text-muted-foreground">{slot.block_start_time} - {slot.block_end_time}</span>
                    )}
                    {slot.reason && <span className="text-sm text-muted-foreground">({slot.reason})</span>}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => onUnblockDate(slot.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
