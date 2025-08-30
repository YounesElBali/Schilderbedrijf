import React from 'react';

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select 
            {...props} 
            className={`p-2 border rounded ${props.className ?? ""}`} 
        />        
    );
};