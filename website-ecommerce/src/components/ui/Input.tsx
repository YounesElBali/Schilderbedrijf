import React from 'react';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input 
            {...props} 
            className={`p-2 border rounded w-full ${props.className ?? ""}`} 
        />
    );
};