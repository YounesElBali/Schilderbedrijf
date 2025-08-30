"use client";
import { Input } from "@/components/ui/Input";

export function FilePicker(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <Input 
            type="file" accept="image/*" 
            {...props} 
        />
    );
};