'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  RangeSelection,
  COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import {
  HeadingNode,
  $createHeadingNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import { $wrapNodes } from '@lexical/selection';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bold,
  Italic,
  Underline,
  Code,
  Link2,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Minus,
  ChevronDown,
} from 'lucide-react';

const supportedBlockTypes = new Set([
  'paragraph',
  'heading1',
  'heading2',
  'heading3',
  'quote',
  'code',
  'ul',
  'ol',
]);

export function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [fontSize, setFontSize] = useState('15');
  const [blockType, setBlockType] = useState('paragraph');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsCode(selection.hasFormat('code'));
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  const handleFormat = (format: 'bold' | 'italic' | 'underline' | 'code') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const handleAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
  };

  return (
    <div
      ref={toolbarRef}
      className="flex flex-wrap items-center gap-1 p-3 bg-background border-b border-border rounded-t-lg"
    >
      {/* Undo/Redo */}
      <div className="flex gap-1 border-r border-border pr-2 mr-2">
        <Button
          onClick={() => editor.undo()}
          disabled={!canUndo}
          size="sm"
          variant="outline"
          title="Undo"
        >
          ↶
        </Button>
        <Button
          onClick={() => editor.redo()}
          disabled={!canRedo}
          size="sm"
          variant="outline"
          title="Redo"
        >
          ↷
        </Button>
      </div>

      {/* Block Type Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="gap-2">
            <Type size={16} />
            Normal
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setBlockType('paragraph')}>
            Paragraph
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBlockType('heading1')}>
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBlockType('heading2')}>
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBlockType('heading3')}>
            Heading 3
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBlockType('quote')}>
            Quote
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBlockType('code')}>
            Code Block
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="gap-2">
            Arial
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Arial</DropdownMenuItem>
          <DropdownMenuItem>Courier New</DropdownMenuItem>
          <DropdownMenuItem>Georgia</DropdownMenuItem>
          <DropdownMenuItem>Times New Roman</DropdownMenuItem>
          <DropdownMenuItem>Verdana</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font Size */}
      <div className="flex items-center gap-1 border-r border-border pr-2 mr-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setFontSize(String(Math.max(12, parseInt(fontSize) - 1)))}
        >
          <Minus size={16} />
        </Button>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="w-12 h-9 px-2 py-1 border border-border rounded text-center text-sm"
          min="8"
          max="72"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => setFontSize(String(Math.min(72, parseInt(fontSize) + 1)))}
        >
          <Plus size={16} />
        </Button>
      </div>

      {/* Text Formatting */}
      <Button
        onClick={() => handleFormat('bold')}
        variant={isBold ? 'default' : 'outline'}
        size="sm"
        title="Bold"
      >
        <Bold size={16} />
      </Button>
      <Button
        onClick={() => handleFormat('italic')}
        variant={isItalic ? 'default' : 'outline'}
        size="sm"
        title="Italic"
      >
        <Italic size={16} />
      </Button>
      <Button
        onClick={() => handleFormat('underline')}
        variant={isUnderline ? 'default' : 'outline'}
        size="sm"
        title="Underline"
      >
        <Underline size={16} />
      </Button>
      <Button
        onClick={() => handleFormat('code')}
        variant={isCode ? 'default' : 'outline'}
        size="sm"
        title="Code"
      >
        <Code size={16} />
      </Button>

      {/* Alignment */}
      <div className="flex gap-1 border-r border-border pr-2 mr-2">
        <Button
          onClick={() => handleAlign('left')}
          variant="outline"
          size="sm"
          title="Align Left"
        >
          <AlignLeft size={16} />
        </Button>
        <Button
          onClick={() => handleAlign('center')}
          variant="outline"
          size="sm"
          title="Align Center"
        >
          <AlignCenter size={16} />
        </Button>
        <Button
          onClick={() => handleAlign('right')}
          variant="outline"
          size="sm"
          title="Align Right"
        >
          <AlignRight size={16} />
        </Button>
      </div>

      {/* Link */}
      <Button variant="outline" size="sm" title="Insert Link">
        <Link2 size={16} />
      </Button>
    </div>
  );
}
