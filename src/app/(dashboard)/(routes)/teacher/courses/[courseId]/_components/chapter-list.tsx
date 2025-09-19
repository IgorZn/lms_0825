'use client';

import { Chapter } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { Grip, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChapterListProps {
  items: Chapter[];
  onReorder: (updateData: Chapter[]) => void;
  onEdit: (id: string) => void;
}

function ChapterList({ onEdit, onReorder, items }: ChapterListProps) {
  console.log('ChapterList >> items', items);
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setChapters(items);
    }
  }, [items]);

  if (!isMounted) {
    return null;
  }

  const reorder = async (list: Chapter[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    onReorder(result);

    return result;
  };

  const onDragEnd = async (result: DropResult) => {
    const items: Chapter[] = await reorder(chapters, result.source.index, result.destination.index);
    setChapters(items);
    return items;
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={'chapters'}>
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {chapters.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className={cn(
                        'border-md mb-4 flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-200 text-sm text-slate-700',
                        item.isPublished && 'border-sky-200 bg-sky-100 text-sky-700',
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div
                        className={cn(
                          'rounded-l-md border-r border-r-slate-200 px-2 py-3 transition hover:bg-slate-300',
                          item.isPublished && 'border-r-sky-200 hover:bg-sky-200',
                        )}
                        {...provided.dragHandleProps}
                      >
                        <Grip size={24} />
                      </div>
                      {item.title}
                      <div className={'ml-auto flex items-center gap-x-2 pr-2'}>
                        {item.isFree && <Badge>Free</Badge>}
                        <Badge className={cn('bg-slate-500', item.isPublished && 'bg-sky-700')}>
                          {item.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                        <Pencil
                          onClick={() => onEdit(item.id)}
                          size={24}
                          className={'h-4 w-4 cursor-pointer transition hover:opacity-75'}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default ChapterList;
