import React from 'react';

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={`px-4 py-2 rounded border text-sm disabled:opacity-50 ${props.className ?? ""}`}
        />
    );
};