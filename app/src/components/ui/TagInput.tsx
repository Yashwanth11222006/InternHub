'use client';

import React, { useState, KeyboardEvent } from 'react';

interface TagInputProps {
    label?: string;
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export default function TagInput({ label, tags, onChange, placeholder = 'Type and press Enter...' }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!tags.includes(inputValue.trim())) {
                onChange([...tags, inputValue.trim()]);
            }
            setInputValue('');
        }
        if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    const removeTag = (indexToRemove: number) => {
        onChange(tags.filter((_, i) => i !== indexToRemove));
    };

    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-sm font-medium text-foreground">{label}</label>}
            <div className="flex flex-wrap gap-2 p-2.5 rounded-[var(--radius)] border border-input-border bg-white focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-colors">
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-light text-primary text-xs font-medium"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(i)}
                            className="hover:text-primary-hover ml-0.5 cursor-pointer"
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                        if (inputValue.trim()) {
                            if (!tags.includes(inputValue.trim())) {
                                onChange([...tags, inputValue.trim()]);
                            }
                            setInputValue('');
                        }
                    }}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[120px] text-sm outline-none bg-transparent placeholder:text-muted-foreground"
                />
            </div>
        </div>
    );
}
